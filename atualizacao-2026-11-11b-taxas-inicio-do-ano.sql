-- 11/11/2026 — Checagem dos pagamentos de início do ano letivo
-- Valores padrão: uniforme 150, material 200, pacote experiência 250,
-- livro + matrícula 350 (Fundamental) / 250 (Infantil).

-- ============================================================
-- Pagamentos de início do ano letivo (uniforme, material, pacote
-- experiência, livro + matrícula). Checagem manual da secretaria, fora das
-- mensalidades: sem link e sem aviso de WhatsApp. Sem linha = Pendente pelo
-- valor padrão (src/lib/mensalidades/taxas-inicio.js).
-- ============================================================
CREATE TABLE IF NOT EXISTS enrollment_fees (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year           INTEGER NOT NULL,
  item           TEXT NOT NULL CHECK (item IN ('uniforme', 'material', 'experiencia', 'livro_matricula')),
  status         TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Pago', 'Dispensado')),
  amount         NUMERIC(10,2),
  paid_at        DATE,
  payment_method TEXT CHECK (payment_method IN ('Pix', 'Dinheiro', 'Cartão')),
  observations   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, year, item)
);

CREATE INDEX IF NOT EXISTS enrollment_fees_year_idx ON enrollment_fees (year);

DROP TRIGGER IF EXISTS enrollment_fees_updated_at ON enrollment_fees;
CREATE TRIGGER enrollment_fees_updated_at BEFORE UPDATE ON enrollment_fees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE enrollment_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Full access for authenticated users" ON enrollment_fees;
CREATE POLICY "Full access for authenticated users" ON enrollment_fees
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ANALYZE enrollment_fees;
