-- Modulo Colaboradores
-- Execute no SQL Editor do Supabase

-- Tabela de colaboradores
CREATE TABLE IF NOT EXISTS employees (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  cpf          text,
  role         text        NOT NULL DEFAULT 'Professor',
  base_salary  numeric(10,2) NOT NULL DEFAULT 0,
  unit_id      uuid        REFERENCES units(id),
  status       text        NOT NULL DEFAULT 'Ativo'
                           CHECK (status IN ('Ativo', 'Inativo')),
  observations text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access on employees"
  ON employees FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Tabela de pagamentos mensais dos colaboradores
CREATE TABLE IF NOT EXISTS employee_payments (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id      uuid        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  reference_month  int         NOT NULL CHECK (reference_month BETWEEN 1 AND 12),
  reference_year   int         NOT NULL,
  base_salary      numeric(10,2) NOT NULL DEFAULT 0,
  bonuses          numeric(10,2) NOT NULL DEFAULT 0,   -- gratificações / extras
  deductions       numeric(10,2) NOT NULL DEFAULT 0,   -- descontos / faltas
  net_amount       numeric(10,2) NOT NULL DEFAULT 0,   -- calculado: base + bônus - descontos
  payment_method   text,                               -- Pix, Dinheiro, Cartão
  paid_at          timestamptz,
  observations     text,
  created_at       timestamptz DEFAULT now(),
  UNIQUE (employee_id, reference_month, reference_year)
);

ALTER TABLE employee_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access on employee_payments"
  ON employee_payments FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
