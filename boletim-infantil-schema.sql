-- ============================================
-- BOLETIM INFANTIL — SISTEMA DE SEMÁFORO
-- ============================================
-- Avaliação semestral para alunos da Educação Infantil (Grupos 01–05).
-- Cada critério recebe uma cor: verde / amarelo / vermelho.

CREATE TABLE IF NOT EXISTS infantil_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 2),
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, semester, year)
);

CREATE INDEX IF NOT EXISTS idx_infantil_eval_student ON infantil_evaluations(student_id);
CREATE INDEX IF NOT EXISTS idx_infantil_eval_year_semester ON infantil_evaluations(year, semester);

ALTER TABLE infantil_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Full access for authenticated users" ON infantil_evaluations;
CREATE POLICY "Full access for authenticated users"
  ON infantil_evaluations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION trigger_set_timestamp_infantil()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_infantil_eval ON infantil_evaluations;
CREATE TRIGGER set_timestamp_infantil_eval
BEFORE UPDATE ON infantil_evaluations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp_infantil();

ANALYZE infantil_evaluations;
