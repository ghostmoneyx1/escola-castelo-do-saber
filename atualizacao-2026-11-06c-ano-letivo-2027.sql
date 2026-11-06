-- ============================================================
-- ATUALIZAÇÃO: abertura do ano letivo 2027
-- Escola Castelo do Saber
-- Gerado em: 06/11/2026
--
-- Só acrescenta: nenhum dado de 2026 é alterado ou apagado.
-- 1. Tipo de matrícula passa a ser guardado por ano (na matrícula).
-- 2. Alunos de 2026 sem matrícula registrada ganham a matrícula 2026
--    (com a turma e o tipo que já têm), pra 2026 ficar completo.
-- 3. As turmas de 2026 são copiadas, vazias, para 2027.
-- 4. Novos tipos de matrícula de 2027: Projeto, Infantil,
--    Jornada Ampliada, Jornada Regular. Os de 2026 continuam válidos
--    nos registros antigos.
--
-- INSTRUÇÕES: cole no SQL Editor do Supabase e execute. Idempotente.
-- ============================================================

-- Tipos aceitos (2026 + 2027).
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_enrollment_type_check;
ALTER TABLE students ADD CONSTRAINT students_enrollment_type_check CHECK (
  enrollment_type IS NULL OR enrollment_type IN (
    'Particular', 'Integral', 'Fundamental', 'Projeto',
    'Infantil', 'Jornada Ampliada', 'Jornada Regular'
  )
);

-- 1. Tipo por ano.
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS enrollment_type TEXT;
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_enrollment_type_check;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_enrollment_type_check CHECK (
  enrollment_type IS NULL OR enrollment_type IN (
    'Particular', 'Integral', 'Fundamental', 'Projeto',
    'Infantil', 'Jornada Ampliada', 'Jornada Regular'
  )
);

UPDATE enrollments e
SET enrollment_type = s.enrollment_type
FROM students s
WHERE s.id = e.student_id AND e.year = 2026 AND e.enrollment_type IS NULL;

-- 2. Matrícula 2026 pra quem está numa turma e nunca teve matrícula registrada.
INSERT INTO enrollments (student_id, class_id, year, enrollment_date, status, enrollment_type)
SELECT s.id, s.class_id, 2026, COALESCE(s.created_at::date, '2026-01-01'),
       CASE WHEN s.status = 'Transferido' THEN 'Transferida' ELSE 'Ativa' END,
       s.enrollment_type
FROM students s
WHERE s.class_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.id);

-- Uma matrícula ativa por aluno por ano.
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_one_active_per_year_idx
  ON enrollments (student_id, year) WHERE status = 'Ativa';

-- 3. Turmas de 2027 = cópia vazia das de 2026.
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT c.name, c.grade, c.shift, c.unit_id, 2027, true
FROM classes c
WHERE c.year = 2026 AND c.is_active
  AND NOT EXISTS (
    SELECT 1 FROM classes n
    WHERE n.year = 2027 AND n.unit_id = c.unit_id AND n.name = c.name
      AND n.grade = c.grade AND n.shift = c.shift
  );

ANALYZE enrollments;
ANALYZE classes;
