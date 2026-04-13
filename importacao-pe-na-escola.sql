-- ============================================================
-- IMPORTAÇÃO: Projeto Pé na Escola 2026
-- Escola Castelo do Saber
-- Gerado em: 13/04/2026
--
-- INSTRUÇÕES:
-- 1. Cole este script no SQL Editor do Supabase
-- 2. Execute e verifique o resultado
-- ============================================================

-- PASSO 1: Remover alunos do Projeto Pé na Escola
-- (apenas alunos cujas turmas são do tipo Grupo 01-05)
-- Responsáveis órfãos também serão removidos em cascata

DELETE FROM student_guardians
WHERE student_id IN (
  SELECT s.id FROM students s
  JOIN classes c ON s.class_id = c.id
  WHERE c.grade LIKE 'Grupo%'
);

DELETE FROM enrollments
WHERE student_id IN (
  SELECT s.id FROM students s
  JOIN classes c ON s.class_id = c.id
  WHERE c.grade LIKE 'Grupo%'
);

DELETE FROM students
WHERE class_id IN (
  SELECT id FROM classes WHERE grade LIKE 'Grupo%'
);

DELETE FROM classes WHERE grade LIKE 'Grupo%';

-- PASSO 2: Garantir que as unidades existem
INSERT INTO units (name, address)
SELECT 'Alto do Cabrito', 'Alto do Cabrito'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Alto do Cabrito');

INSERT INTO units (name, address)
SELECT 'Boa Vista do Lobato', 'Boa Vista do Lobato'
WHERE NOT EXISTS (SELECT 1 FROM units WHERE name = 'Boa Vista do Lobato');

-- PASSO 3: Criar as turmas do Projeto Pé na Escola

INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 03 - Integral', 'Grupo 03', 'Integral',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 03'
  AND shift = 'Integral'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 04 - Vespertino', 'Grupo 04', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 04'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 02 - Integral', 'Grupo 02', 'Integral',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 02'
  AND shift = 'Integral'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 02 - Vespertino', 'Grupo 02', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 02'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 05 - Vespertino', 'Grupo 05', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 05'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 02 - Integral', 'Grupo 02', 'Integral',
       (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 02'
  AND shift = 'Integral'
  AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 03 - Vespertino', 'Grupo 03', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 03'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 02 - Vespertino', 'Grupo 02', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 02'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 03 - Integral', 'Grupo 03', 'Integral',
       (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 03'
  AND shift = 'Integral'
  AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 03 - Vespertino', 'Grupo 03', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 03'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 04 - Integral', 'Grupo 04', 'Integral',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 04'
  AND shift = 'Integral'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 04 - Vespertino', 'Grupo 04', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 04'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 05 - Vespertino', 'Grupo 05', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 05'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  AND year = 2026
);
INSERT INTO classes (name, grade, shift, unit_id, year, is_active)
SELECT 'Grupo 01 - Vespertino', 'Grupo 01', 'Vespertino',
       (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1),
       2026, true
WHERE NOT EXISTS (
  SELECT 1 FROM classes
  WHERE grade = 'Grupo 01'
  AND shift = 'Vespertino'
  AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  AND year = 2026
);

-- PASSO 4: Inserir alunos e responsáveis

DO $$
DECLARE
  s_0 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ravi souza dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_0;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Maiara Pinto dos Santos', 'Responsável', '71992968208')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_0, g_id, true);
END $$;

DO $$
DECLARE
  s_1 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Gael Alves de Oliveira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_1;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Mayara Alves Pires', 'Responsável', '71983197670')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_1, g_id, true);
END $$;

DO $$
DECLARE
  s_2 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Alicia Silva Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_2;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Lais Virgens Santos', 'Responsável', '71983846727')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_2, g_id, true);
END $$;

DO $$
DECLARE
  s_3 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Laura Oliveira da Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_3;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Daiane Medeiros de Oliveira Lima', 'Responsável', '71982636120')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_3, g_id, true);
END $$;

DO $$
DECLARE
  s_4 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Saymon Figueiredo Ribeiro Reis',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_4;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Sicleide Figueiredo Barauna', 'Responsável', '71987280403')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_4, g_id, true);
END $$;

DO $$
DECLARE
  s_5 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ravi Bastos Cerqueira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_5;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Raiane Bastos da Silva', 'Responsável', '71992150036')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_5, g_id, true);
END $$;

DO $$
DECLARE
  s_6 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Louise Santa Barbara',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_6;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jaine Santa Barbara Brito', 'Responsável', '71991730938')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_6, g_id, true);
END $$;

DO $$
DECLARE
  s_7 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Alan Magalhães Andrade',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_7;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Rafaela Magalhães Ferreira', 'Responsável', '71992445059')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_7, g_id, true);
END $$;

DO $$
DECLARE
  s_8 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ana Laura Magalhães Andrade',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_8;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Rafaela Magalhães Ferreira', 'Responsável', '71992445059')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_8, g_id, true);
END $$;

DO $$
DECLARE
  s_9 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Melinda Sophia Ricarte Sena',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_9;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Camila Ricarte Souza', 'Responsável', '71994107383')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_9, g_id, true);
END $$;

DO $$
DECLARE
  s_10 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ingrid Maria Santos Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_10;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ananda Oliveira Santana', 'Responsável', '71987304172')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_10, g_id, true);
END $$;

DO $$
DECLARE
  s_11 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Théo Benjamin Dias Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_11;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Shauana  Nogueira dos Santos', 'Responsável', '71993588781')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_11, g_id, true);
END $$;

DO $$
DECLARE
  s_12 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Emanuelly dos Reis Chagas',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_12;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Itana Cristine dos Reis Chagas', 'Responsável', '71987550814719870138')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_12, g_id, true);
END $$;

DO $$
DECLARE
  s_13 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Isis Fonseca de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_13;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Wanessa Fonseca Santos Barros', 'Responsável', '75983232595')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_13, g_id, true);
END $$;

DO $$
DECLARE
  s_14 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Zoe Cecilia Silva Sales',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_14;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Juliana Silva dos Santos', 'Responsável', '71989539214')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_14, g_id, true);
END $$;

DO $$
DECLARE
  s_15 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Lunna Lisboa dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_15;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ludmila Vitória Santos Silva', 'Responsável', '71982272819')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_15, g_id, true);
END $$;

DO $$
DECLARE
  s_16 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Anthony Pereira Rodrigues',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_16;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Tais Carolina Pereira Rodrigues', 'Responsável', '71992635171')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_16, g_id, true);
END $$;

DO $$
DECLARE
  s_17 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'kahyle Nascimento da Natividade de França',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_17;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Carine Nascimento da Natividade de França', 'Responsável', '71982329536')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_17, g_id, true);
END $$;

DO $$
DECLARE
  s_18 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Lucca Araujo Barros',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_18;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Evancarla Araujo Barros', 'Responsável', '71987017681')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_18, g_id, true);
END $$;

DO $$
DECLARE
  s_19 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ellen Araujo Barros',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_19;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Evancarla Araujo Barros', 'Responsável', '71987017681')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_19, g_id, true);
END $$;

DO $$
DECLARE
  s_20 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ryan Oliveira Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_20;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Joseane Santos Oliveira', 'Responsável', '71981076358')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_20, g_id, true);
END $$;

DO $$
DECLARE
  s_21 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Enzo de Jesus dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_21;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Suzele Cruz de Jesus', 'Responsável', '71985195395')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_21, g_id, true);
END $$;

DO $$
DECLARE
  s_22 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Lorenzo Matteo da Conceição Morais',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_22;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Barbara Viviane da Conceição Santos', 'Responsável', '71984360045')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_22, g_id, true);
END $$;

DO $$
DECLARE
  s_23 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Jonh Caleb de Jesus Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_23;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Micaele de Jesus Lima', 'Responsável', '71982852398')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_23, g_id, true);
END $$;

DO $$
DECLARE
  s_24 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Enzo Gabriell Nascimento Barbosa',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_24;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Vivien Figueiredo Barbosa', 'Responsável', '71985093193')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_24, g_id, true);
END $$;

DO $$
DECLARE
  s_25 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Anthony Almeida Martins de Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_25;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Lorena Julia Almeida Oliveira', 'Responsável', '71984354963')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_25, g_id, true);
END $$;

DO $$
DECLARE
  s_26 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maria Luiza Santana Barbosa',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_26;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jeane Miranda Santana', 'Responsável', '7186049718')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_26, g_id, true);
END $$;

DO $$
DECLARE
  s_27 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Liz Eloá Conceição Cardoso',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_27;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ednelia Simão da Conceição', 'Responsável', '71996414585')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_27, g_id, true);
END $$;

DO $$
DECLARE
  s_28 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ravi Costa Goncalves Azevedo',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_28;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Taise Costa Goncalves', 'Responsável', '71987470915')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_28, g_id, true);
END $$;

DO $$
DECLARE
  s_29 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Melissa Carvalho Sá',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_29;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Andressa Carvalho Sá', 'Responsável', '71991120239')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_29, g_id, true);
END $$;

DO $$
DECLARE
  s_30 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'yarin Carvalho Sá',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_30;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Andressa Carvalho Sá', 'Responsável', '71991120239')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_30, g_id, true);
END $$;

DO $$
DECLARE
  s_31 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Mirela Conceição dos Santos de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_31;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ana Conceição Santos', 'Responsável', '71982485792')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_31, g_id, true);
END $$;

DO $$
DECLARE
  s_32 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Yohan Alves Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_32;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Quize Maiara Alves Oliveira', 'Responsável', '71985204060')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_32, g_id, true);
END $$;

DO $$
DECLARE
  s_33 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Eloá Alves Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_33;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Quize Maiara Alves Oliveira', 'Responsável', '71985204060')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_33, g_id, true);
END $$;

DO $$
DECLARE
  s_34 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Heloísa Matos Lopes',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_34;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Renata Bastos de Matos', 'Responsável', '71987695266')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_34, g_id, true);
END $$;

DO $$
DECLARE
  s_35 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Biannca Lopes Meneses dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_35;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Dayane Aparecida Meneses dos Santos', 'Responsável', '71993587897')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_35, g_id, true);
END $$;

DO $$
DECLARE
  s_36 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Enzo Gabriel Evangelista oliveira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_36;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('keise Evelyn de Oliveira Menzes Santana', 'Responsável', '71985053982')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_36, g_id, true);
END $$;

DO $$
DECLARE
  s_37 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Sarah Anjos Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_37;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Danielle Anjos de Souza', 'Responsável', '71993121071')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_37, g_id, true);
END $$;

DO $$
DECLARE
  s_38 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Jhonathas Pereira da Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_38;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Andresa Lima dos Santos Pereira', 'Responsável', '71992006972')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_38, g_id, true);
END $$;

DO $$
DECLARE
  s_39 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Yasmin Souza Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_39;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Cleber Santos de Santana', 'Responsável', '71983539338')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_39, g_id, true);
END $$;

DO $$
DECLARE
  s_40 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maria Khadijah Bonfim Barros',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_40;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Janaina Bonfim de Santana', 'Responsável', '71981687673')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_40, g_id, true);
END $$;

DO $$
DECLARE
  s_41 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Cecilia Almeida Pinho',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_41;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Bruna de Jesus Santos', 'Responsável', '71983995231')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_41, g_id, true);
END $$;

DO $$
DECLARE
  s_42 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ademar santos Ferreira Miranda',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_42;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Elenir Santos Gomes', 'Responsável', '71985570361')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_42, g_id, true);
END $$;

DO $$
DECLARE
  s_43 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Alicia Victória Gomes Santiago',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_43;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Maria Carolina Gomes de Souza', 'Responsável', '71996251838')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_43, g_id, true);
END $$;

DO $$
DECLARE
  s_44 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Bernardo Sales Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_44;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Daniele Santos de Oliveira', 'Responsável', '71987529713')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_44, g_id, true);
END $$;

DO $$
DECLARE
  s_45 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Thácio Teles Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_45;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Adriana Santana Teles', 'Responsável', '71983542356')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_45, g_id, true);
END $$;

DO $$
DECLARE
  s_46 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Luis Nonato Carvalho Braga',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_46;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Luane Carvalho dos Santos', 'Responsável', '71982102900')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_46, g_id, true);
END $$;

DO $$
DECLARE
  s_47 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Heitor Matos Estrela Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_47;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jessica Alexandra Matos Estrela', 'Responsável', '71993387383')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_47, g_id, true);
END $$;

DO $$
DECLARE
  s_48 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Rafiki Junior Conceição dos Santos de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_48;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ana Conceição Santos', 'Responsável', '71982485792')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_48, g_id, true);
END $$;

DO $$
DECLARE
  s_49 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Layla Medeiros de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_49;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Leila dos Santos Medeiros', 'Responsável', '71991715939')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_49, g_id, true);
END $$;

DO $$
DECLARE
  s_50 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Fernanda Valentina Silva Costa',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_50;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ana Cleide dos Santos', 'Responsável', '71999992546')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_50, g_id, true);
END $$;

DO $$
DECLARE
  s_51 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maria Liz Evangelista de Oliveira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_51;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('keise Evelyn de Oliveira Menzes Santana', 'Responsável', '71985053982')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_51, g_id, true);
END $$;

DO $$
DECLARE
  s_52 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Larah Sophia Dias Nascimento',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_52;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Catia Dias Santos', 'Responsável', '71989060540')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_52, g_id, true);
END $$;

DO $$
DECLARE
  s_53 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Heitor Santos Garcia',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_53;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ingrid Santos Souza', 'Responsável', '71986467714')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_53, g_id, true);
END $$;

DO $$
DECLARE
  s_54 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Eloísa Castro Coutinho',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_54;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Quercia Castro dos Santos Sousa', 'Responsável', '71987987911')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_54, g_id, true);
END $$;

DO $$
DECLARE
  s_55 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Liz Kethellyn Santos da Paixão',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_55;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Keyla Santos Teles de Santana', 'Responsável', '71982322588')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_55, g_id, true);
END $$;

DO $$
DECLARE
  s_56 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Cecilia Santana de Oliveira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_56;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jéssica Pereira Oliveira', 'Responsável', '71996374874')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_56, g_id, true);
END $$;

DO $$
DECLARE
  s_57 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Micael Souza dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_57;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Suelem de Brito Souza', 'Responsável', '71986807696')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_57, g_id, true);
END $$;

DO $$
DECLARE
  s_58 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Liz Brandão Alves',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_58;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jucideise Brandão Gomes', 'Responsável', '71982657586')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_58, g_id, true);
END $$;

DO $$
DECLARE
  s_59 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maria Alice de Jesus Santos Barbosa',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_59;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Andresa de Jesus Santos Barbosa', 'Responsável', '71988665595')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_59, g_id, true);
END $$;

DO $$
DECLARE
  s_60 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maria Clara Souza Santos Moraes',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_60;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Alene Souza Santos', 'Responsável', '71997084696')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_60, g_id, true);
END $$;

DO $$
DECLARE
  s_61 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Rhavi do Amor Divino Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_61;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Cheila Maria do Amor Divino Conceição', 'Responsável', '71988688660')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_61, g_id, true);
END $$;

DO $$
DECLARE
  s_62 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Valentina da Paixão Sacramento',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_62;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Michele Santos do Sacramento', 'Responsável', '71987620483')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_62, g_id, true);
END $$;

DO $$
DECLARE
  s_63 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Kaleb Brandão Vilela',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_63;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Flávia Brandão de Souza', 'Responsável', '71988826887')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_63, g_id, true);
END $$;

DO $$
DECLARE
  s_64 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Pedro Arthur Faustino Santana Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_64;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Camila Faustino de Britto Santos', 'Responsável', '71991484640')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_64, g_id, true);
END $$;

DO $$
DECLARE
  s_65 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Matteo Santos Serra',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_65;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Natalie Santos Conceição Pereira', 'Responsável', '71991842388')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_65, g_id, true);
END $$;

DO $$
DECLARE
  s_66 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ruan Filipe Marcos Bomfim de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_66;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Gessica Marcos de Melo', 'Responsável', '71992656719')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_66, g_id, true);
END $$;

DO $$
DECLARE
  s_67 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Arthur Ravi Silva Lobão dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_67;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Maria Jose Silva dos Santos', 'Responsável', '71986623016')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_67, g_id, true);
END $$;

DO $$
DECLARE
  s_68 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Esther Santos Ferreira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_68;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Daiane Gonçalves dos Santos Teixeira', 'Responsável', '71991712967')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_68, g_id, true);
END $$;

DO $$
DECLARE
  s_69 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Vicente Estrela Melo Coelho Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_69;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Alana Melo dos Santos Santiago', 'Responsável', '71981828906')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_69, g_id, true);
END $$;

DO $$
DECLARE
  s_70 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ravi Barbosa da Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_70;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Poliana Barbosa Gomes dos Santos', 'Responsável', '7183159993')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_70, g_id, true);
END $$;

DO $$
DECLARE
  s_71 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Samuel Junior de Jesus brito',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_71;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Maria Eduarda Brito dos Santos', 'Responsável', '71981367825')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_71, g_id, true);
END $$;

DO $$
DECLARE
  s_72 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Raysllan Yauseff Costa Cardoso',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_72;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Thais da Costa Rocha', 'Responsável', '71982330137')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_72, g_id, true);
END $$;

DO $$
DECLARE
  s_73 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Miriã Fernandes Ramos Sales',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_73;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Renildes Fernandes Ramos Sales', 'Responsável', '71984852205')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_73, g_id, true);
END $$;

DO $$
DECLARE
  s_74 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Arthur Ferreira Boaventura',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_74;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Naiara Ferreira de Jesus', 'Responsável', '71992936159')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_74, g_id, true);
END $$;

DO $$
DECLARE
  s_75 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Heitor Silva Neri dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_75;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jessiclea Silva Neri dos Santos', 'Responsável', '71986980739')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_75, g_id, true);
END $$;

DO $$
DECLARE
  s_76 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maya Liz dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_76;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Mariana dos Santos', 'Responsável', '71983566853')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_76, g_id, true);
END $$;

DO $$
DECLARE
  s_77 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'João Lucas da Silva Barbosa',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_77;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Sheila da Silva Nascimento', 'Responsável', '71992521781')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_77, g_id, true);
END $$;

DO $$
DECLARE
  s_78 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ysis Nascimento Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_78;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Eliete Nascimento Silva', 'Responsável', '71986404474')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_78, g_id, true);
END $$;

DO $$
DECLARE
  s_79 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Laura Angelita Cardoso Brito',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_79;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Joice Cardoso', 'Responsável', '71992503925')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_79, g_id, true);
END $$;

DO $$
DECLARE
  s_80 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Valentina Costa de Assis',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_80;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Suelem Santos Costa Assis', 'Responsável', '71981193290')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_80, g_id, true);
END $$;

DO $$
DECLARE
  s_81 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ravi dos Santos Reis',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_81;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Adriele dos Santos Matos Reis', 'Responsável', '71984320555')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_81, g_id, true);
END $$;

DO $$
DECLARE
  s_82 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Otavio Amor Divino dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_82;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Geisa Rocha dos Santos', 'Responsável', '71983833817')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_82, g_id, true);
END $$;

DO $$
DECLARE
  s_83 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Julia dos Anjos Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_83;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Vanessa dos Anjos Ferreira de Jesus Santana', 'Responsável', '71988113262')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_83, g_id, true);
END $$;

DO $$
DECLARE
  s_84 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Samuel Matos Brito',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_84;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Tatiane dos Santos Matos', 'Responsável', '71987218435')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_84, g_id, true);
END $$;

DO $$
DECLARE
  s_85 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Levy Matos Brito',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_85;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Tatiane dos Santos Matos', 'Responsável', '71987218435')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_85, g_id, true);
END $$;

DO $$
DECLARE
  s_86 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Adryan Lucca Pereira dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_86;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Alessandra Pereira de Souza Lima', 'Responsável', '71981786118')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_86, g_id, true);
END $$;

DO $$
DECLARE
  s_87 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Nathan Santos Queiroz',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_87;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Heloisa Maria dos Santos Dias', 'Responsável', '71993006808')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_87, g_id, true);
END $$;

DO $$
DECLARE
  s_88 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Nichole Santos Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_88;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Patricia Santos celestino de Santana', 'Responsável', '71991988552')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_88, g_id, true);
END $$;

DO $$
DECLARE
  s_89 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Pietro Santos de Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_89;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Patricia da Silva Santos', 'Responsável', '71991334463')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_89, g_id, true);
END $$;

DO $$
DECLARE
  s_90 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ana Vitória Gomes de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_90;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Rebeca Gomes de Jesus', 'Responsável', '71987800104')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_90, g_id, true);
END $$;

DO $$
DECLARE
  s_91 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Samily Vitoria de Santana Nunes Costa',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_91;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Tamiles de Santana Santos', 'Responsável', '71984340969')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_91, g_id, true);
END $$;

DO $$
DECLARE
  s_92 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Dominick Almeida Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_92;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ludmila Almeida Silva', 'Responsável', '71991107044')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_92, g_id, true);
END $$;

DO $$
DECLARE
  s_93 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ravy Luiz Silva Matos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_93;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Rita Cristiane Silva de Jesus', 'Responsável', '71992898506')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_93, g_id, true);
END $$;

DO $$
DECLARE
  s_94 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Lavinia Silva Valadares',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_94;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Suzana Lemos da Silva', 'Responsável', '71986113167')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_94, g_id, true);
END $$;

DO $$
DECLARE
  s_95 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Anthony Pietro Costa Cruz',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_95;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Milena Correia Costa', 'Responsável', '71992187891')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_95, g_id, true);
END $$;

DO $$
DECLARE
  s_96 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maria Aurora Machado Carvalho',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_96;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Yasmin Machado de Carvalho', 'Responsável', '71987603749')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_96, g_id, true);
END $$;

DO $$
DECLARE
  s_97 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Laura Meneses de Jesus Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_97;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Viviane Meneses de Jesus', 'Responsável', '71989091128')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_97, g_id, true);
END $$;

DO $$
DECLARE
  s_98 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Théo da Hora Ferreira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_98;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Angela Texeira Ferreira da Silva', 'Responsável', '71985077998')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_98, g_id, true);
END $$;

DO $$
DECLARE
  s_99 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Valentina Costa de Assis',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_99;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Suelem Santos Costa Assis', 'Responsável', '71981193290')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_99, g_id, true);
END $$;

DO $$
DECLARE
  s_100 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Gael Francisco Ferreira Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_100;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jucimila Ferreira Santos', 'Responsável', '71985077998')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_100, g_id, true);
END $$;

DO $$
DECLARE
  s_101 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Pedro de Souza Freitas',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_101;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Lara de Souza Guedes da Silva', 'Responsável', '71991079146')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_101, g_id, true);
END $$;

DO $$
DECLARE
  s_102 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Luara Menezes Miranda',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_102;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Naiara Nascimento Menezes', 'Responsável', '71993363876')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_102, g_id, true);
END $$;

DO $$
DECLARE
  s_103 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Elisa Souza Santos Fernandes',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_103;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jeane Cristina Santos Fernandes', 'Responsável', '71993051160')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_103, g_id, true);
END $$;

DO $$
DECLARE
  s_104 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Alice Oliveira dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_104;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Maria Alice Santos Oliveira', 'Responsável', '71991912806')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_104, g_id, true);
END $$;

DO $$
DECLARE
  s_105 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Laura Regina Oliveira dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_105;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Lorena Oliveira Giliberti', 'Responsável', '71987215052')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_105, g_id, true);
END $$;

DO $$
DECLARE
  s_106 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Mariana Oliveira Brandão',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_106;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Agnes Olivera dos Santos', 'Responsável', '71992326821')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_106, g_id, true);
END $$;

DO $$
DECLARE
  s_107 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Joaquim Jesus de Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_107;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Erica Jesus Silva Souza', 'Responsável', '71982481313')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_107, g_id, true);
END $$;

DO $$
DECLARE
  s_108 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ana Sofia das Dores Amarante',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_108;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ana Cristina das Dores Santos', 'Responsável', '71982552531')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_108, g_id, true);
END $$;

DO $$
DECLARE
  s_109 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Lunna Valentina Santos Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_109;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Reinaldo Santos Santana', 'Responsável', '71984411211')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_109, g_id, true);
END $$;

DO $$
DECLARE
  s_110 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Pedro Lucas Santos Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_110;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Reinaldo Santos Santana', 'Responsável', '71984411211')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_110, g_id, true);
END $$;

DO $$
DECLARE
  s_111 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'João Gabriel Santos Santana',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_111;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Reinaldo Santos Santana', 'Responsável', '71984411211')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_111, g_id, true);
END $$;

DO $$
DECLARE
  s_112 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Evelyn Maria Oliveira Pires',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_112;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Vanessa Barbosa de Oliveira', 'Responsável', '71992226664')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_112, g_id, true);
END $$;

DO $$
DECLARE
  s_113 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Heloah Carvalho Silva',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Integral'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_113;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Jamile Carvalho de Oliveira', 'Responsável', '71983017592')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_113, g_id, true);
END $$;

DO $$
DECLARE
  s_114 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Noah Bernardo Ramos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_114;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ana Beatriz Silva Ramos', 'Responsável', '71992450454')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_114, g_id, true);
END $$;

DO $$
DECLARE
  s_115 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maysa Silva Dias',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_115;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Sara Souza Silva', 'Responsável', '71993475113')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_115, g_id, true);
END $$;

DO $$
DECLARE
  s_116 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Heitor Boaventura Bacelar Ba',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_116;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Elisia Santos Boaventura', 'Responsável', '71992122168')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_116, g_id, true);
END $$;

DO $$
DECLARE
  s_117 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Eloá Boaventura dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_117;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Estefanny Boaventura Bacelar Barbosa', 'Responsável', '71991838832')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_117, g_id, true);
END $$;

DO $$
DECLARE
  s_118 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ayla Kamile Ferreira dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_118;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Andreza Ferreira da Cruz', 'Responsável', '71992283020')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_118, g_id, true);
END $$;

DO $$
DECLARE
  s_119 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maria Heloyse Goes de Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_119;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Daniela Nascimento Goes', 'Responsável', '71993690833')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_119, g_id, true);
END $$;

DO $$
DECLARE
  s_120 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ana Cecilia da Silva Moreira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_120;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Anissa Caline Santos da Silva', 'Responsável', '71997051849')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_120, g_id, true);
END $$;

DO $$
DECLARE
  s_121 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ayla Jasmim da Silva Moreira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_121;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Anissa Caline Santos da Silva', 'Responsável', '71997051849')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_121, g_id, true);
END $$;

DO $$
DECLARE
  s_122 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Mariê Maia Oliveira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_122;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Carla Brandão Maia', 'Responsável', '71986939753')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_122, g_id, true);
END $$;

DO $$
DECLARE
  s_123 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Maysa Silva Dias',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_123;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Sara Souza Silva', 'Responsável', '7193475113')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_123, g_id, true);
END $$;

DO $$
DECLARE
  s_124 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ayla Pinho Alves',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_124;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Tais Santos Pinho', 'Responsável', '71983488199')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_124, g_id, true);
END $$;

DO $$
DECLARE
  s_125 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Benicio Souza de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 01' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_125;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Relve Souza Jesus', 'Responsável', '71991985761')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_125, g_id, true);
END $$;

DO $$
DECLARE
  s_126 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Davi Apollo Flor Paixão',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_126;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Joana Laura Flor de Lima', 'Responsável', '71981994017')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_126, g_id, true);
END $$;

DO $$
DECLARE
  s_127 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Ingride Silva dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_127;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Marli Jesus da Silva', 'Responsável', '71991860100')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_127, g_id, true);
END $$;

DO $$
DECLARE
  s_128 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Lunna Vitória Conceição Souza',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_128;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Gabriele da Conceição Barbosa', 'Responsável', '71988178985')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_128, g_id, true);
END $$;

DO $$
DECLARE
  s_129 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Lunna Santana dos Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Integral'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_129;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Rosilma de Jesus Santana', 'Responsável', '71985244428')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_129, g_id, true);
END $$;

DO $$
DECLARE
  s_130 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Enzo Gabriel Costa de Assis',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_130;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Daisy Bartista Costa de Assis', 'Responsável', '71993382310')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_130, g_id, true);
END $$;

DO $$
DECLARE
  s_131 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Cecilia de Souza Vieira Santos',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 05' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_131;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship)
  VALUES ('Ivete Luana de Souza Vieira', 'Responsável')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_131, g_id, true);
END $$;

DO $$
DECLARE
  s_132 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Noah Gabriel dos Santos de Oliveira',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_132;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Adriane dos Santos Cunha', 'Responsável', '71988932429')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_132, g_id, true);
END $$;

DO $$
DECLARE
  s_133 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Iam Santana Damasceno',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Boa Vista do Lobato' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1)
  )
  RETURNING id INTO s_133;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Ingridy Santana Pereira dos Santos', 'Responsável', '71991818084')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_133, g_id, true);
END $$;

DO $$
DECLARE
  s_134 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Yasser Leonel de Jesus Couto',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 04' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_134;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Nathalia de Lima Couto', 'Responsável', '71991637344')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_134, g_id, true);
END $$;

DO $$
DECLARE
  s_135 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Gustavo da Conceição Lima',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_135;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Fabiana da Conceição da Silva Lima', 'Responsável', '71983008134')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_135, g_id, true);
END $$;

DO $$
DECLARE
  s_136 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'MARIA LUIZA SOUZA DOS SANTOS RIBEIRO',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 02' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_136;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('QUERCIA SOUZA DOS SANTOS', 'Responsável', '71991405868')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_136, g_id, true);
END $$;

DO $$
DECLARE
  s_137 UUID;
  g_id UUID;
BEGIN
  -- Inserir aluno
  INSERT INTO students (name, status, enrollment_type, class_id, unit_id)
  VALUES (
    'Rosely Santos de Jesus',
    'Ativo',
    'Particular',
    (SELECT c.id FROM classes c
     JOIN units u ON c.unit_id = u.id
     WHERE c.grade = 'Grupo 03' AND c.shift = 'Vespertino'
     AND u.name = 'Alto do Cabrito' AND c.year = 2026 LIMIT 1),
    (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1)
  )
  RETURNING id INTO s_137;
  -- Inserir responsável
  INSERT INTO guardians (name, relationship, phone)
  VALUES ('Juliana Costa dos Santos', 'Responsável', '71992928110')
  RETURNING id INTO g_id;
  -- Vincular
  INSERT INTO student_guardians (student_id, guardian_id, is_primary)
  VALUES (s_137, g_id, true);
END $$;

-- FIM DO SCRIPT
-- Verifique: SELECT COUNT(*) FROM students s JOIN classes c ON s.class_id = c.id WHERE c.grade LIKE 'Grupo%';
