-- ============================================================
-- Enrollment types: Particular / Integral / Fundamental / Projeto
-- ============================================================
-- Antes: CHECK aceitava ('Particular', 'Bolsista') no schema, mas o app
-- já usava 'Projeto' e 'Fundamental' em vários lugares (drift entre
-- DB constraint, constants.js e UI hardcoded).
-- Agora: única fonte = lista de 4 tipos pedida pelo cliente.
-- Backfill: alunos cadastrados como 'Bolsista' viram 'Projeto'.

ALTER TABLE students DROP CONSTRAINT IF EXISTS students_enrollment_type_check;

UPDATE students
SET enrollment_type = 'Projeto'
WHERE enrollment_type = 'Bolsista';

ALTER TABLE students
ADD CONSTRAINT students_enrollment_type_check
  CHECK (enrollment_type IS NULL OR enrollment_type IN ('Particular', 'Integral', 'Fundamental', 'Projeto'));
