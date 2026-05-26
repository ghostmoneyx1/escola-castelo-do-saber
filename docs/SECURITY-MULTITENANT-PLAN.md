# Plano — Isolamento multi-tenant via RLS por `unit_id`

> **Status:** não aplicado. Requer coordenação manual antes de migrar.
> **Razão:** aplicar as policies sem antes preencher `unit_id` no JWT de
> todo usuário existente trava o app — ninguém consegue ler nem escrever
> nada porque a policy não casa.

## Contexto

Hoje, `supabase/schema.sql:179-189` aplica em todas as 11 tabelas principais
a mesma policy:

```sql
CREATE POLICY "Full access for authenticated users" ON <tabela>
  FOR ALL USING (auth.role() = 'authenticated');
```

Isso é um **gate de sessão**, não isolamento. Qualquer usuário logado
(professor, secretária, coordenação) lê e escreve dados de **todas as
unidades**: matrículas, notas, pagamentos, contratos, frequências,
documentos, etc.

A tabela `units` existe no schema, e `students`/`classes` têm `unit_id`,
mas nenhuma policy filtra por isso e nenhuma query no app aplica
`.eq('unit_id', ...)` consistentemente.

## Modelo proposto

Cada usuário Supabase Auth recebe `app_metadata.unit_id` (UUID da unidade
a que pertence). Ou `app_metadata.unit_ids` (array) se um usuário pode
acessar várias unidades (matriz + filial).

Policies leem do JWT:

```sql
-- Helper SQL function pra evitar repetir o cast
CREATE OR REPLACE FUNCTION auth.user_unit_ids() RETURNS uuid[]
LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    ARRAY(
      SELECT jsonb_array_elements_text(auth.jwt() -> 'app_metadata' -> 'unit_ids')::uuid
    ),
    ARRAY[]::uuid[]
  )
$$;

-- Exemplo students
DROP POLICY "Full access for authenticated users" ON students;
CREATE POLICY "Users access own units" ON students FOR ALL
  USING (unit_id = ANY (auth.user_unit_ids()))
  WITH CHECK (unit_id = ANY (auth.user_unit_ids()));
```

Tabelas sem `unit_id` direto (`grades`, `attendance`, `payments`,
`installments`, `enrollments`, `quarterly_reports`, `report_tokens`,
`documents`, `contracts`, `student_guardians`, `employee_payments`)
herdam o filtro via JOIN com `students`/`classes`/`employees`:

```sql
CREATE POLICY "Grades follow student unit" ON grades FOR ALL
  USING (EXISTS (
    SELECT 1 FROM students s
    WHERE s.id = grades.student_id
    AND s.unit_id = ANY (auth.user_unit_ids())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM students s
    WHERE s.id = grades.student_id
    AND s.unit_id = ANY (auth.user_unit_ids())
  ));
```

## Ordem obrigatória de execução

Não inverter — cada passo pressupõe o anterior.

1. **Auditoria de dados** — confirmar que toda linha em `students`,
   `classes`, `employees` tem `unit_id NOT NULL`. Backfill manual de
   qualquer linha órfã.
   ```sql
   SELECT 'students' AS t, count(*) FROM students WHERE unit_id IS NULL
   UNION ALL SELECT 'classes', count(*) FROM classes WHERE unit_id IS NULL
   UNION ALL SELECT 'employees', count(*) FROM employees WHERE unit_id IS NULL;
   ```

2. **Mapear usuários ↔ unidades** — planilha externa (não tem hoje no
   schema). Decidir quem é matriz-only, filial-only, ambos.

3. **Atualizar `app_metadata` de cada usuário** via Admin API:
   ```ts
   await supabaseAdmin.auth.admin.updateUserById(userId, {
     app_metadata: { unit_ids: ["<uuid1>", "<uuid2>"] }
   })
   ```
   Importante: `app_metadata` (não `user_metadata`) porque só admin escreve.

4. **Forçar refresh dos tokens existentes** — usuários precisam
   re-logar pro JWT carregar o novo claim. Alternativa: bumpar
   `aal`/sessões, mas o caminho simples é avisar e expirar.

5. **Aplicar a migração de policies** — criar
   `supabase/migrations/YYYYMMDDhhmmss_rls_multitenant.sql` com:
   - função `auth.user_unit_ids()`
   - drop das 11 policies "Full access for authenticated users"
   - criação das novas 11 policies (`unit_id = ANY` + via JOIN)

6. **Auditoria de queries no app** — grep por `from("students"` /
   `from("classes"` etc.; garantir que nenhuma depende implícita de ver
   "todas as unidades" (relatórios consolidados precisam de uma rota
   admin separada).

7. **Teste em staging** com dois usuários de unidades diferentes antes
   de aplicar em produção. Caso suspeito principal: relatórios
   trimestrais e dashboards de financeiro.

## Riscos por passo

| Passo | Risco | Mitigação |
|---|---|---|
| 1 | Backfill errado vincula aluno à unidade errada | Conferir com a coordenação ANTES |
| 3 | Esquecer um usuário ativo → ele perde acesso total | Listar todos antes, scriptado |
| 4 | Sessões antigas continuam funcionando até expirarem | Invalidar sessões via dashboard |
| 5 | Migração aplicada antes do passo 3 → app trava | Coordenar janela; ter rollback pronto |
| 6 | Página admin (matriz) deixa de funcionar | Criar role `super_admin` que ignora filtro |

## Rollback

Manter ao lado da migração o script reverso:

```sql
DROP POLICY "Users access own units" ON students;
CREATE POLICY "Full access for authenticated users" ON students FOR ALL
  USING (auth.role() = 'authenticated');
-- ...repetir para cada tabela
```

Aplicar em emergência se múltiplos usuários ficarem trancados.

## Quando aplicar

Quando você tiver:

- [ ] Lista validada de usuário ↔ unidade(s)
- [ ] Janela de manutenção combinada
- [ ] Backup completo do projeto Supabase
- [ ] Plano de comunicação aos usuários (re-login)

Sem esses, **não aplique**. Mantém a vulnerabilidade conhecida
documentada (este arquivo) e fixa quando a base estiver pronta.
