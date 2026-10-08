# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint (next lint, config: eslint-config-next)
```

No test suite exists. The project is **JavaScript** (jsx/js + `jsconfig.json`), not TypeScript — there is no `tsc` step.

Path alias: `@/*` → `./src/*`.

### Database & seed
- Schema lives in `supabase/schema.sql`. The repo has **no `supabase/migrations/` directory** — schema changes are applied via loose SQL files in the project root (`atualizacao-*.sql`, `migracao-*.sql`, `colaboradores-schema.sql`, `contratos-schema.sql`, `generate*.sql`, `update_enrollments.sql`, `importacao-pe-na-escola.sql`). When changing schema, add a new dated `.sql` file at root *and* update `supabase/schema.sql` so a fresh provision still works.
- Seed scripts: `seed.sql` (idempotent SQL seed) and `seed.mjs` (Node script using anon key — guarded by a count check so it won't double-insert). Both end with `ANALYZE` on all tables; **always re-run ANALYZE after bulk inserts** so `pg_class.reltuples` stays accurate (Supabase MCP `list_tables` reads from this and will otherwise report 0).
- Other root `.mjs` scripts (`parser.mjs`, `parse_fundamental.mjs`, `check_headers.mjs`, `execute_fund.mjs`, `test-app.mjs`) are one-off importers/parsers for the two `*.xlsx` files in root (real enrollment data — treat as sensitive).

## Architecture

**Stack:** Next.js 14.2.35 (App Router) · Supabase (DB + Auth via `@supabase/ssr`) · Tailwind v4 · shadcn/ui · `@react-pdf/renderer` · `recharts` · `xlsx` · `@anthropic-ai/sdk`. Deployed on Vercel.

### Supabase client matrix — pick the right one

| File | When to use | Notes |
|---|---|---|
| `src/lib/supabase/client.js` | Client Components (browser) | Anon key, RLS-bound |
| `src/lib/supabase/server.js` | Server Components, Route Handlers, Server Actions | Reads session from cookies via `next/headers` |
| `src/lib/supabase/middleware.js` + `src/middleware.js` | Edge auth gate | Refreshes session, redirects unauthenticated traffic to `/login` and authenticated traffic away from `/login`. Matcher excludes static assets. |
| `src/lib/supabase/admin.js` | **Server-only**, RLS bypass | Uses `SUPABASE_SERVICE_ROLE_KEY`. Never import from a Client Component. Use only when an action must transcend RLS (e.g. token-based public report routes). |

### RLS posture — important caveat

`supabase/schema.sql:179-189` applies a uniform policy on every table:
```sql
CREATE POLICY "Full access for authenticated users" ON <table> FOR ALL USING (auth.role() = 'authenticated');
```

This is **a session gate, not multi-tenant isolation.** Any logged-in user can read/write every row across all `units`. Treat the database as single-tenant in code, and do not introduce a feature that assumes per-unit isolation without first adding real `unit_id`-scoped policies. The `units` table exists in the schema, but enforcement is application-side only.

### Routes layout

```
src/app/
  (auth)/login/            # public auth UI, route group
  auth/signout/            # POST → clears session
  dashboard/               # protected admin area (middleware-enforced)
    alunos/ boletins/ colaboradores/ configuracoes/
    contratos/ documentos/ ferramentas/ financeiro/ frequencia/
    matriculas/ relatorios/ relatorios-trimestrais/ turmas/
  chamada/[classId]/       # attendance entry UI
  relatorio/[token]/       # PUBLIC report viewer — gated by token, not session
  mensalidades/            # PUBLIC tuition lookup for guardians (no session)
  api/
    chamada/[classId]/     # GET roster for class
    chamada/submit/        # POST attendance batch
    mensalidades/consulta/ # POST {nome, tel} → pending months + payment links
    infinitepay/links/     # POST gera links de pagamento (auth); GET ?teste=1 link de R$1
    infinitepay/webhook/   # POST notificação da InfinitePay (token na query + payment_check)
    cron/links/            # GET diário (vercel.json, 12:00 UTC) gera link pra parcela sem link da API
    relatorio/gerar-token/ # mints opaque token for parent access
    relatorio/submit/      # save quarterly report
```

The **token-gated public route** (`/relatorio/[token]` + `/api/relatorio/gerar-token`) is the only non-authenticated surface besides `/login` and `/mensalidades`. Tokens live in the `report_tokens` table. Any change here is a security-sensitive change — preserve token entropy, revocation, and expiry semantics.

### Cobrança, mensalidades e InfinitePay

A fonte de verdade das mensalidades é o banco: `contracts` (um por aluno/ano,
`monthly_amount`, `due_day`) e `installments` (12 parcelas, `status` só
`Pago`/`A vencer`; "atrasada" é calculada pelo `due_date`). A planilha de
cobrança do Google foi importada uma vez (`importacao-cobranca-2026.sql`) e
não é mais lida.

**Links de pagamento.** Cada parcela em aberto ganha um link do Checkout
Integrado da InfinitePay (`src/lib/infinitepay/client.js`). A API não tem
token: identifica a conta pelo `handle` (`INFINITEPAY_HANDLE`, a InfiniteTag
sem `$`). O `order_nsu` do link é o **id da parcela** — é assim que o webhook
diz qual parcela foi paga. Links nascem em `contratos/novo` (logo após as
parcelas), no botão "Gerar links" do contrato e no painel de cobrança em
lotes de 40 (`POST /api/infinitepay/links`). "Sem link" ali significa sem
link **da API**: link colado da planilha (`payment_link_source = manual`) paga,
mas não chama o webhook, então entra na fila e é substituído. Um cron diário
(`/api/cron/links`, protegido por `CRON_SECRET`, 45 s de orçamento por rodada)
faz a mesma varredura sem ninguém clicar; a lógica compartilhada está em
`src/lib/infinitepay/links.js`. `GET /api/infinitepay/links`
cria um link de R$ 1 só pra testar o caminho até o webhook.

**Webhook** (`/api/infinitepay/webhook?t=<INFINITEPAY_WEBHOOK_TOKEN>`): a
InfinitePay não assina a notificação, então (1) a URL carrega um token nosso
e (2) a parcela só vira `Pago` depois de `payment_check` confirmar `paid` e
valor ≥ parcela. Tudo que chega vira linha em `payment_events`, inclusive o
ignorado — é o rastro quando "paguei e não baixou". Responder 400 faz a
InfinitePay reenviar; 200 encerra. Lógica em `src/lib/infinitepay/webhook.js`
(testada com Supabase fake). Usa `createAdminClient()` porque não há sessão.
`APP_URL` define a base do webhook/redirect; sem ela, em preview da Vercel o
link apontaria pra URL protegida.

**Consulta pública (`/mensalidades`).** O responsável digita nome da criança +
4 últimos dígitos do telefone de qualquer responsável vinculado, ou abre o
link direto `/mensalidades?a=<codigo>`. `codigo` = 12 hex de
`HMAC-SHA256(MENSALIDADES_LINK_SECRET, student.id)`. **Rotar o segredo
invalida todo link já enviado.** `/api/mensalidades/consulta` é rate-limited
(20 hits / 5 min por IP), lê com service role e devolve só `paraResponsavel`
(sem telefone, código ou ids). As consultas vivem em
`src/lib/mensalidades/consultas.js` e recebem o client do Supabase de quem
chama; os helpers puros (situação, WhatsApp, código) em `parcelas.js`.

**Secretaria.** `/dashboard/cobranca` (Server Component → `obterCobranca()`)
lista contratos abertos do ano, totais, e o botão **"Cobrar"** que abre
`wa.me` com a mensagem de `src/lib/mensalidades/whatsapp.js`. Telefone de
10 dígitos ganha o `9` e a flag `telefoneSuspeito`. A ficha do aluno renderiza
`<SituacaoFinanceira studentId={...} />` (`/api/mensalidades/aluno?id=`).
Dinheiro em espécie continua sendo baixado à mão no Financeiro/contrato.

### Components

- `src/components/ui/*` — shadcn/ui primitives (jsx). Edit cautiously; many pages depend on these.
- `src/components/layout/*` — `sidebar.js`, `topbar.js`, `sidebar-context.js`. The sidebar is **dark slate (`#0f172a`)** with gold accent — see DESIGN_SYSTEM.md.
- `src/components/shared/*` — `page-header.js`, `empty-state.js`, `status-badge.js`. Reuse these instead of recreating headers/empty states per page.
- **Busca dentro de um `Select`.** Passe `<SelectSearch>` pela prop `header` do
  `SelectContent` — nunca coloque um `<Input>` entre os `SelectItem`. O `List` do
  Base UI é uma composite que trata typeahead e setas, então um input ali dentro
  recebe as teclas como navegação e a lista pula em vez de filtrar. Com `header`
  o campo fica fora da `List` e o popup passa a ancorar pela borda
  (`alignItemWithTrigger` desligado), senão o cabeçalho sai da tela.

### PDFs

`src/lib/pdf/*` renders quarterly reports and attestations using `@react-pdf/renderer`. These are server-rendered and streamed by the report routes. Keep PDF components out of Client Component trees.

- **Razão social nos documentos.** Header, footer e histórico usam `SCHOOL_LEGAL_NAME` ("Instituto de Educação e Cidadania Castelo do Saber"), exigência da secretaria após a mudança de razão social. `SCHOOL_NAME` ("Escola Castelo do Saber") continua sendo o nome fantasia da UI.
- **Unidade → CNPJ/endereço.** `units.name` no banco é "Boa Vista do Lobato" (matriz, CNPJ 0001-58) e "Alto do Cabrito" (filial, CNPJ 0002-39). `isFilialUnit()` em `header.js` detecta a filial por regex (`filial|cabrito`) — não compare com "Filial"/"Matriz".
- **Histórico Escolar** cabe em uma folha A4 por exigência da escola. Lista fixa de 6 matérias em `historico-data.js` (com aliases para casar com `subjects.name`), nota = média anual das unidades na coluna da série atual, CH em branco. Os traços do bloco "Certificado" (série e ano letivo) ficam vazios de propósito: a secretaria preenche à mão.
- **Tipos de documento** vivem em dois lugares: `DOCUMENT_TYPES` (constants.js) e o CHECK de `documents.type` no schema. Novo tipo exige os dois + um `case` em `generate.js`.
- Os arquivos do PDF são `.js` com JSX; o vitest só transforma `.jsx`. Para renderizar um PDF fora do Next (preview), use um config temporário com plugin `transformWithOxc(code, id, { lang: "jsx" })` para `src/**/*.js`.

## Design system — enforced

`DESIGN_SYSTEM.md` is **not aspirational**, it lists concrete tokens and an explicit anti-pattern list. Notable hard rules:

- Fonts: DM Sans for headings (`font-heading`), Inter for body. Never `font-bold` on body — use `font-medium`/`font-semibold`.
- Cards: white, 12px radius, 1px border, near-invisible shadow. **No `shadow-lg`, no `border-l-4` color stripes, no `ring-1`, no gradient backgrounds.**
- Buttons: solid `--primary` (`#1e40af`), 10px radius, 40px height. **No gradients, no `scale` transforms, no colored shadows.**
- Use CSS variables / tokens, not hardcoded hex (`#ecf5fb` style is banned).
- Tables: header `bg-muted`, 11px uppercase semibold, `px-5 py-3.5` cells.

When generating UI, consult `DESIGN_SYSTEM.md` and avoid the listed anti-patterns rather than producing generic shadcn defaults.

## Environment variables

Required in any environment that runs the app:

- `NEXT_PUBLIC_SUPABASE_URL` — used by all four Supabase clients
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used by client/server/middleware clients
- `SUPABASE_SERVICE_ROLE_KEY` — required only by `src/lib/supabase/admin.js` (token route, rate limiting, anything that bypasses RLS)
- `MENSALIDADES_LINK_SECRET` — server-only HMAC key for the per-student direct links. Changing it invalidates every `/mensalidades?a=…` link already handed out.
- `INFINITEPAY_HANDLE` — InfiniteTag da escola sem `$` (`castelodosaber`). Identifica a conta na API do Checkout; sem ela nenhum link é gerado.
- `INFINITEPAY_WEBHOOK_TOKEN` — segredo que vai na query string da URL de webhook cadastrada em cada link. Rotar exige regerar os links.
- `CRON_SECRET` — a Vercel manda `Authorization: Bearer <CRON_SECRET>` nas chamadas de cron; sem a variável o `/api/cron/links` responde 401 e nada é gerado automaticamente.
- `APP_URL` — base pública (`https://…`) usada no `webhook_url`/`redirect_url` dos links. Opcional em produção (cai em `VERCEL_PROJECT_PRODUCTION_URL`).

The middleware degrades gracefully if env vars are missing (lets the request through unauthenticated), so missing env in dev shows as "no auth gate" rather than an explicit error — verify env when auth behaves unexpectedly.

## Server/Client Component split (RSC pattern)

When converting `/dashboard/*` list pages from full Client Components to
the Server Component pattern, follow what `dashboard/alunos` and
`dashboard/turmas` already do:

- **`page.js` is a Server Component.** It calls
  `await createClient()` from `@/lib/supabase/server`, fetches the
  initial data (and any aggregates that don't need interactivity), and
  returns a sibling `<FeatureClient initialX={...} />`. Add
  `export const dynamic = "force-dynamic"` so the cookies-aware Supabase
  client doesn't get accidentally cached.
- **The sibling `feature-client.jsx`** (`"use client"`) receives the
  prefetched data as a prop, owns all state (filters, search, dialogs),
  filters in memory when the dataset is small, and triggers
  `router.refresh()` inside `useTransition` after mutations so the
  Server Component re-fetches.
- **Mutations** (delete/insert/update) keep using the browser Supabase
  client for now. Move to API routes only if a mutation needs to
  bypass RLS or run server-only logic.
- **Charts (Recharts) and forms** stay in the Client Component — they
  rely on hooks and event handlers.
- **Forms-only pages** (`alunos/novo`, `contratos/novo`, etc.) and
  pages whose entire UI is a single interactive widget
  (`chamada/[classId]`) stay as full Client Components; there's no
  initial data to prefetch.

Pages still on the old pattern (full `"use client"` with `useEffect`
data fetch) — convert in this priority order: `dashboard/page.js`,
`boletins`, `financeiro`, `frequencia`, `documentos`, `matriculas`,
`relatorios`, `relatorios-trimestrais`, `contratos`, `colaboradores`,
`colaboradores/pagamentos`, and detail pages under `/[id]`.

## UI text language

Code (identifiers, routes, table names) is English. User-facing strings (page titles, labels, dashboards) are Portuguese (pt-BR). Maintain that split — do not translate identifiers into Portuguese, do not leave English text in views.
