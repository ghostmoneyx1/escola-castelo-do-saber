-- ============================================================
-- ATUALIZAÇÃO: "Pagar tudo" — um link da InfinitePay com várias mensalidades
-- Escola Castelo do Saber
-- Gerado em: 04/11/2026
--
-- INSTRUÇÕES:
-- 1. Cole este script no SQL Editor do Supabase e execute.
-- Idempotente: pode rodar mais de uma vez sem estragar nada.
-- ============================================================

-- Um link agrupado = um checkout com várias parcelas do mesmo aluno.
-- O order_nsu enviado à InfinitePay é "grupo-<id>": é assim que o webhook
-- sabe que precisa baixar todas as parcelas de installment_ids.
CREATE TABLE IF NOT EXISTS payment_groups (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  installment_ids  UUID[] NOT NULL,
  amount           NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  payment_link     TEXT,
  -- aberto: link criado, aguardando pagamento
  -- pago:   webhook confirmou e baixou as parcelas
  status           TEXT NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'pago')),
  transaction_nsu  TEXT,
  paid_amount      NUMERIC(10, 2),
  -- Parcelas do grupo que já estavam pagas quando o grupo foi pago:
  -- pagamento em duplicidade, a secretaria devolve.
  duplicate_ids    UUID[] NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS payment_groups_student_idx
  ON payment_groups (student_id, created_at DESC);

ALTER TABLE payment_groups ENABLE ROW LEVEL SECURITY;

-- Só leitura pra quem está logado. Quem escreve é o servidor, com service role.
DROP POLICY IF EXISTS "Authenticated read on payment_groups" ON payment_groups;
CREATE POLICY "Authenticated read on payment_groups"
  ON payment_groups FOR SELECT TO authenticated USING (true);

ANALYZE payment_groups;
