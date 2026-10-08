-- Modulo Contratos / Parcelas
-- Execute no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS contracts (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     uuid        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year           int         NOT NULL,
  monthly_amount numeric(10,2) NOT NULL,
  due_day        int         NOT NULL CHECK (due_day BETWEEN 1 AND 28),
  status         text        NOT NULL DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Fechado')),
  observations   text,
  created_at     timestamptz DEFAULT now(),
  UNIQUE (student_id, year)
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access on contracts"
  ON contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS installments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid        NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  student_id  uuid        NOT NULL REFERENCES students(id),
  month       int         NOT NULL CHECK (month BETWEEN 1 AND 12),
  year        int         NOT NULL,
  due_date    date        NOT NULL,
  amount      numeric(10,2) NOT NULL,
  status      text        NOT NULL DEFAULT 'A vencer' CHECK (status IN ('Pago', 'A vencer')),
  paid_at     timestamptz,
  observations text,
  -- Integração InfinitePay (ver atualizacao-2026-10-07-infinitepay.sql)
  payment_link        text,
  payment_link_source text CHECK (payment_link_source IN ('api', 'manual')),
  link_generated_at   timestamptz,
  infinitepay_slug    text,
  transaction_nsu     text,
  paid_amount         numeric(10,2),
  payment_method      text CHECK (payment_method IN ('Pix', 'Dinheiro', 'Cartão')),
  receipt_url         text,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (contract_id, month)
);

CREATE UNIQUE INDEX IF NOT EXISTS installments_transaction_nsu_key
  ON installments (transaction_nsu) WHERE transaction_nsu IS NOT NULL;
CREATE INDEX IF NOT EXISTS installments_year_status_idx ON installments (year, status);

ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access on installments"
  ON installments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Log do webhook da InfinitePay (tudo que chega, inclusive o ignorado)
CREATE TABLE IF NOT EXISTS payment_events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_id  uuid        REFERENCES installments(id) ON DELETE SET NULL,
  source          text        NOT NULL DEFAULT 'infinitepay_webhook',
  order_nsu       text,
  transaction_nsu text,
  result          text        NOT NULL,
  verified        boolean     NOT NULL DEFAULT false,
  payload         jsonb       NOT NULL,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_events_created_at_idx ON payment_events (created_at DESC);

ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read on payment_events"
  ON payment_events FOR SELECT TO authenticated USING (true);
