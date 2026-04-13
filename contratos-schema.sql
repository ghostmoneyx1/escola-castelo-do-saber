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
  created_at  timestamptz DEFAULT now(),
  UNIQUE (contract_id, month)
);

ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access on installments"
  ON installments FOR ALL TO authenticated USING (true) WITH CHECK (true);
