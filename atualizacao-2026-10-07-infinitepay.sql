-- ============================================================
-- ATUALIZAÇÃO: Integração InfinitePay (links de pagamento + webhook)
-- Escola Castelo do Saber
-- Gerado em: 07/10/2026
--
-- INSTRUÇÕES:
-- 1. Cole este script no SQL Editor do Supabase e execute.
-- 2. Depois rode importacao-cobranca-2026.sql (traz os dados da planilha).
-- Idempotente: pode rodar mais de uma vez sem estragar nada.
-- ============================================================

-- Parcela passa a carregar o link de pagamento e o que a InfinitePay
-- devolve quando o responsável paga.
ALTER TABLE installments
  ADD COLUMN IF NOT EXISTS payment_link        TEXT,
  ADD COLUMN IF NOT EXISTS payment_link_source TEXT CHECK (payment_link_source IN ('api', 'manual')),
  ADD COLUMN IF NOT EXISTS link_generated_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS infinitepay_slug    TEXT,
  ADD COLUMN IF NOT EXISTS transaction_nsu     TEXT,
  ADD COLUMN IF NOT EXISTS paid_amount         NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS payment_method      TEXT CHECK (payment_method IN ('Pix', 'Dinheiro', 'Cartão')),
  ADD COLUMN IF NOT EXISTS receipt_url         TEXT;

-- Uma transação da InfinitePay só pode quitar uma parcela.
CREATE UNIQUE INDEX IF NOT EXISTS installments_transaction_nsu_key
  ON installments (transaction_nsu)
  WHERE transaction_nsu IS NOT NULL;

CREATE INDEX IF NOT EXISTS installments_year_status_idx
  ON installments (year, status);

-- Log de tudo que o webhook recebe, inclusive o que foi ignorado.
-- Serve pra auditar um pagamento que "não caiu" sem depender do log da Vercel.
CREATE TABLE IF NOT EXISTS payment_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_id UUID REFERENCES installments(id) ON DELETE SET NULL,
  source         TEXT NOT NULL DEFAULT 'infinitepay_webhook',
  order_nsu      TEXT,
  transaction_nsu TEXT,
  result         TEXT NOT NULL,
  verified       BOOLEAN NOT NULL DEFAULT false,
  payload        JSONB NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_events_created_at_idx
  ON payment_events (created_at DESC);

ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Só leitura pra quem está logado. Quem escreve é o webhook, com service role.
DROP POLICY IF EXISTS "Authenticated read on payment_events" ON payment_events;
CREATE POLICY "Authenticated read on payment_events"
  ON payment_events FOR SELECT TO authenticated USING (true);

ANALYZE installments;
ANALYZE payment_events;
