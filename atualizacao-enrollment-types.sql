-- ============================================================
-- Enrollment types: Particular / Integral / Fundamental / Projeto
-- ============================================================
-- Espelho da migration supabase/migrations/20260526000004_enrollment_types.sql
-- mantido no root pra seguir o padrão dated do projeto.

ALTER TABLE students DROP CONSTRAINT IF EXISTS students_enrollment_type_check;

UPDATE students
SET enrollment_type = 'Projeto'
WHERE enrollment_type = 'Bolsista';

ALTER TABLE students
ADD CONSTRAINT students_enrollment_type_check
  CHECK (enrollment_type IS NULL OR enrollment_type IN ('Particular', 'Integral', 'Fundamental', 'Projeto'));
