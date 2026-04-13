
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_shift_check;
ALTER TABLE classes ADD CONSTRAINT classes_shift_check CHECK (shift = ANY (ARRAY['Matutino'::text, 'Vespertino'::text, 'Integral'::text, 'Parcial'::text]));

DO $$
DECLARE
    v_unit_id UUID;
    v_class_id UUID;
    v_student_id UUID;
    v_guardian_id UUID;
BEGIN
   -- Unit: Alto do Cabrito
   IF NOT EXISTS (SELECT 1 FROM units WHERE name = 'Alto do Cabrito') THEN
       INSERT INTO units (name) VALUES ('Alto do Cabrito');
   END IF;
   -- Unit: Boa Vista do Lobato
   IF NOT EXISTS (SELECT 1 FROM units WHERE name = 'Boa Vista do Lobato') THEN
       INSERT INTO units (name) VALUES ('Boa Vista do Lobato');
   END IF;
   -- Class: Grupo 03 | Integral | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 03', 'Grupo 03', 'Integral', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 04 | Parcial | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 04', 'Grupo 04', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 02 | Integral | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 02', 'Grupo 02', 'Integral', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 02 | Parcial | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 02', 'Grupo 02', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 05 | Parcial | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 05', 'Grupo 05', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 02 | Integral | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 02', 'Grupo 02', 'Integral', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 03 | Parcial | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 03', 'Grupo 03', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 02 | Parcial | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 02', 'Grupo 02', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 03 | Integral | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 03', 'Grupo 03', 'Integral', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 03 | Parcial | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 03', 'Grupo 03', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 04 | Integral | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 04' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 04', 'Grupo 04', 'Integral', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 04 | Parcial | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 04', 'Grupo 04', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Class: Grupo 05 | Parcial | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('Grupo 05', 'Grupo 05', 'Parcial', v_unit_id, 2026);
   END IF;
   -- Student: Ravi souza dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Maiara Pinto dos Santos' AND phone = '71992968208';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Maiara Pinto dos Santos', '71992968208') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ravi souza dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Gael Alves de Oliveira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Mayara Alves Pires' AND phone = '71983197670';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Mayara Alves Pires', '71983197670') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Gael Alves de Oliveira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Alicia Silva Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Lais Virgens Santos' AND phone = '71983846727';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Lais Virgens Santos', '71983846727') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Alicia Silva Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Laura Oliveira da Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Daiane Medeiros de Oliveira Lima' AND phone = '71982636120';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Daiane Medeiros de Oliveira Lima', '71982636120') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Laura Oliveira da Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Saymon Figueiredo Ribeiro Reis
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Sicleide Figueiredo Barauna' AND phone = '71987280403';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Sicleide Figueiredo Barauna', '71987280403') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Saymon Figueiredo Ribeiro Reis', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ravi Bastos Cerqueira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Raiane Bastos da Silva' AND phone = '71992150036';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Raiane Bastos da Silva', '71992150036') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ravi Bastos Cerqueira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Louise Santa Barbara
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jaine Santa Barbara Brito' AND phone = '71991730938';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jaine Santa Barbara Brito', '71991730938') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Louise Santa Barbara', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Helena Oliveira Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Telma Duarde Oliveira' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Telma Duarde Oliveira', '') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Helena Oliveira Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Alan Magalhães Andrade
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Rafaela Magalhães Ferreira' AND phone = '71992445059';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Rafaela Magalhães Ferreira', '71992445059') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Alan Magalhães Andrade', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ana Laura Magalhães Andrade
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Rafaela Magalhães Ferreira' AND phone = '71992445059';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Rafaela Magalhães Ferreira', '71992445059') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Laura Magalhães Andrade', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Melinda Sophia Ricarte Sena
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Camila Ricarte Souza' AND phone = '71994107383';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Camila Ricarte Souza', '71994107383') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Melinda Sophia Ricarte Sena', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ingrid Maria Santos Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ananda Oliveira Santana' AND phone = '71987304172';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ananda Oliveira Santana', '71987304172') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ingrid Maria Santos Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Théo Benjamin Dias Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Shauana  Nogueira dos Santos' AND phone = '71993588781';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Shauana  Nogueira dos Santos', '71993588781') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Théo Benjamin Dias Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Emanuelly dos Reis Chagas
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Itana Cristine dos Reis Chagas' AND phone = '71987550814 / 71987013825';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Itana Cristine dos Reis Chagas', '71987550814 / 71987013825') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Emanuelly dos Reis Chagas', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Isis Fonseca de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Wanessa Fonseca Santos Barros' AND phone = '75983232595';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Wanessa Fonseca Santos Barros', '75983232595') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Isis Fonseca de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Zoe Cecilia Silva Sales
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Juliana Silva dos Santos' AND phone = '71989539214';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Juliana Silva dos Santos', '71989539214') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Zoe Cecilia Silva Sales', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Lunna Lisboa dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ludmila Vitória Santos Silva' AND phone = '71982272819';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ludmila Vitória Santos Silva', '71982272819') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Lunna Lisboa dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Anthony Pereira Rodrigues
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Tais Carolina Pereira Rodrigues' AND phone = '71992635171';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Tais Carolina Pereira Rodrigues', '71992635171') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Anthony Pereira Rodrigues', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: kahyle Nascimento da Natividade de França
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Carine Nascimento da Natividade de França' AND phone = '71982329536';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Carine Nascimento da Natividade de França', '71982329536') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('kahyle Nascimento da Natividade de França', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Lucca Araujo Barros
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Evancarla Araujo Barros' AND phone = '71987017681';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Evancarla Araujo Barros', '71987017681') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Lucca Araujo Barros', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ellen Araujo Barros
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Evancarla Araujo Barros' AND phone = '71987017681';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Evancarla Araujo Barros', '71987017681') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ellen Araujo Barros', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ryan Oliveira Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Joseane Santos Oliveira' AND phone = '71981076358';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Joseane Santos Oliveira', '71981076358') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ryan Oliveira Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Enzo de Jesus dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Suzele Cruz de Jesus' AND phone = '71985195395';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Suzele Cruz de Jesus', '71985195395') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Enzo de Jesus dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Lorenzo Matteo da Conceição Morais
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Barbara Viviane da Conceição Santos' AND phone = '71984360045';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Barbara Viviane da Conceição Santos', '71984360045') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Lorenzo Matteo da Conceição Morais', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Jonh Caleb de Jesus Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Micaele de Jesus Lima' AND phone = '71982852398';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Micaele de Jesus Lima', '71982852398') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Jonh Caleb de Jesus Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Enzo Gabriell Nascimento Barbosa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Vivien Figueiredo Barbosa' AND phone = '71985093193';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Vivien Figueiredo Barbosa', '71985093193') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Enzo Gabriell Nascimento Barbosa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Anthony Almeida Martins de Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Lorena Julia Almeida Oliveira' AND phone = '71984354963';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Lorena Julia Almeida Oliveira', '71984354963') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Anthony Almeida Martins de Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Luiza Santana Barbosa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jeane Miranda Santana' AND phone = '71981112402';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jeane Miranda Santana', '71981112402') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Luiza Santana Barbosa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Liz Eloá Conceição Cardoso
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ednelia Simão da Conceição' AND phone = '71996414585';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ednelia Simão da Conceição', '71996414585') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Liz Eloá Conceição Cardoso', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ravi Costa Goncalves Azevedo
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Taise Costa Goncalves' AND phone = '71987470915';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Taise Costa Goncalves', '71987470915') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ravi Costa Goncalves Azevedo', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Melissa Carvalho Sá
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Andressa Carvalho Sá' AND phone = '71991120239';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Andressa Carvalho Sá', '71991120239') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Melissa Carvalho Sá', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: yarin Carvalho Sá
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Andressa Carvalho Sá' AND phone = '71991120239';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Andressa Carvalho Sá', '71991120239') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('yarin Carvalho Sá', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Mirela Conceição dos Santos de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ana Conceição Santos' AND phone = '71982485792';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ana Conceição Santos', '71982485792') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Mirela Conceição dos Santos de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Yohan Alves Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Quize Maiara Alves Oliveira' AND phone = '71985204060';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Quize Maiara Alves Oliveira', '71985204060') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Yohan Alves Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Eloá Alves Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Quize Maiara Alves Oliveira' AND phone = '71985204060';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Quize Maiara Alves Oliveira', '71985204060') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Eloá Alves Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Heloísa Matos Lopes
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Renata Bastos de Matos' AND phone = '71987695266';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Renata Bastos de Matos', '71987695266') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Heloísa Matos Lopes', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Biannca Lopes Meneses dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Dayane Aparecida Meneses dos Santos' AND phone = '71993587897';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Dayane Aparecida Meneses dos Santos', '71993587897') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Biannca Lopes Meneses dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Enzo Gabriel Evangelista oliveira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'keise Evelyn de Oliveira Menzes Santana' AND phone = '71985053982';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('keise Evelyn de Oliveira Menzes Santana', '71985053982') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Enzo Gabriel Evangelista oliveira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Sarah Anjos Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Danielle Anjos de Souza' AND phone = '71993121071';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Danielle Anjos de Souza', '71993121071') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Sarah Anjos Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Jhonathas Pereira da Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Andresa Lima dos Santos Pereira' AND phone = '71992006972';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Andresa Lima dos Santos Pereira', '71992006972') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Jhonathas Pereira da Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Yasmin Souza Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Cleber Santos de Santana' AND phone = '71983539338';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Cleber Santos de Santana', '71983539338') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Yasmin Souza Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Khadijah Bonfim Barros
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Janaina Bonfim de Santana' AND phone = '71981687673';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Janaina Bonfim de Santana', '71981687673') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Khadijah Bonfim Barros', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Cecilia Almeida Pinho
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Bruna de Jesus Santos' AND phone = '71983995231';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Bruna de Jesus Santos', '71983995231') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Cecilia Almeida Pinho', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ademar santos Ferreira Miranda
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Elenir Santos Gomes' AND phone = '71985570361';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Elenir Santos Gomes', '71985570361') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ademar santos Ferreira Miranda', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Alicia Victória Gomes Santiago
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Maria Carolina Gomes de Souza' AND phone = '71996251838';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Maria Carolina Gomes de Souza', '71996251838') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Alicia Victória Gomes Santiago', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Bernardo Sales Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Daniele Santos de Oliveira' AND phone = '71987529713';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Daniele Santos de Oliveira', '71987529713') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Bernardo Sales Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Thácio Teles Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Adriana Santana Teles' AND phone = '71983542356';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Adriana Santana Teles', '71983542356') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Thácio Teles Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Luis Nonato Carvalho Braga
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Luane Carvalho dos Santos' AND phone = '71982102900';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Luane Carvalho dos Santos', '71982102900') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Luis Nonato Carvalho Braga', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Heitor Matos Estrela Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jessica Alexandra Matos Estrela' AND phone = '71993387383';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jessica Alexandra Matos Estrela', '71993387383') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Heitor Matos Estrela Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Rafiki Junior Conceição dos Santos de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ana Conceição Santos' AND phone = '71982485792';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ana Conceição Santos', '71982485792') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Rafiki Junior Conceição dos Santos de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Layla Medeiros de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Leila dos Santos Medeiros' AND phone = '71991715939';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Leila dos Santos Medeiros', '71991715939') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Layla Medeiros de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Fernanda Valentina Silva Costa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ana Cleide dos Santos' AND phone = '71999992546';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ana Cleide dos Santos', '71999992546') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Fernanda Valentina Silva Costa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Liz Evangelista de Oliveira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'keise Evelyn de Oliveira Menzes Santana' AND phone = '71985053982';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('keise Evelyn de Oliveira Menzes Santana', '71985053982') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Liz Evangelista de Oliveira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Larah Sophia Dias Nascimento
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Catia Dias Santos' AND phone = '71989060540';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Catia Dias Santos', '71989060540') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Larah Sophia Dias Nascimento', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Heitor Santos Garcia
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ingrid Santos Souza' AND phone = '71986467714';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ingrid Santos Souza', '71986467714') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Heitor Santos Garcia', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Eloísa Castro Coutinho
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Quercia Castro dos Santos Sousa' AND phone = '71987987911';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Quercia Castro dos Santos Sousa', '71987987911') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Eloísa Castro Coutinho', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Liz Kethellyn Santos da Paixão
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Keyla Santos Teles de Santana' AND phone = '71982322588';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Keyla Santos Teles de Santana', '71982322588') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Liz Kethellyn Santos da Paixão', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Cecilia Santana de Oliveira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jéssica Pereira Oliveira' AND phone = '71996374874';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jéssica Pereira Oliveira', '71996374874') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Cecilia Santana de Oliveira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Micael Souza dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Suelem de Brito Souza' AND phone = '71986807696';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Suelem de Brito Souza', '71986807696') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Micael Souza dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Liz Brandão Alves
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jucideise Brandão Gomes' AND phone = '71982657586';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jucideise Brandão Gomes', '71982657586') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Liz Brandão Alves', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Alice de Jesus Santos Barbosa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Andresa de Jesus Santos Barbosa' AND phone = '71988665595';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Andresa de Jesus Santos Barbosa', '71988665595') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Alice de Jesus Santos Barbosa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Clara Souza Santos Moraes
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Alene Souza Santos' AND phone = '71997084696';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Alene Souza Santos', '71997084696') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Clara Souza Santos Moraes', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Rhavi do Amor Divino Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Cheila Maria do Amor Divino Conceição' AND phone = '71988688660';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Cheila Maria do Amor Divino Conceição', '71988688660') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Rhavi do Amor Divino Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Valentina da Paixão Sacramento
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Michele Santos do Sacramento' AND phone = '71 98762-0483';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Michele Santos do Sacramento', '71 98762-0483') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Valentina da Paixão Sacramento', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Kaleb Brandão Vilela
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Flávia Brandão de Souza' AND phone = '71988826887';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Flávia Brandão de Souza', '71988826887') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Kaleb Brandão Vilela', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Manuella Ramos de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Tais de Jesus Bispo' AND phone = '71993439724';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Tais de Jesus Bispo', '71993439724') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Manuella Ramos de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Pedro Arthur Faustino Santana Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Camila Faustino de Britto Santos' AND phone = '71991484640';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Camila Faustino de Britto Santos', '71991484640') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Pedro Arthur Faustino Santana Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Matteo Santos Serra
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Natalie Santos Conceição Pereira' AND phone = '71991842388';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Natalie Santos Conceição Pereira', '71991842388') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Matteo Santos Serra', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ruan Filipe Marcos Bomfim de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Gessica Marcos de Melo' AND phone = '71992656719';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Gessica Marcos de Melo', '71992656719') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ruan Filipe Marcos Bomfim de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Arthur Ravi Silva Lobão dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Maria Jose Silva dos Santos' AND phone = '71986623016';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Maria Jose Silva dos Santos', '71986623016') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Arthur Ravi Silva Lobão dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Esther Santos Ferreira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Daiane Gonçalves dos Santos Teixeira' AND phone = '71991712967';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Daiane Gonçalves dos Santos Teixeira', '71991712967') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Esther Santos Ferreira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Vicente Estrela Melo Coelho Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Alana Melo dos Santos Santiago' AND phone = '71981828906';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Alana Melo dos Santos Santiago', '71981828906') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Vicente Estrela Melo Coelho Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ravi Barbosa da Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Poliana Barbosa Gomes dos Santos' AND phone = '7198315999';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Poliana Barbosa Gomes dos Santos', '7198315999') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ravi Barbosa da Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Karollaine de Jesus Bulcão Alves
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Daniele de Jesus dos Santos' AND phone = '71986367881';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Daniele de Jesus dos Santos', '71986367881') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Karollaine de Jesus Bulcão Alves', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Heloisa Pereira Santos Araujo
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Pamela Suelem Pereira dos Santos' AND phone = '71987987911';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Pamela Suelem Pereira dos Santos', '71987987911') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Heloisa Pereira Santos Araujo', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Samuel Junior de Jesus brito
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Maria Eduarda Silva' AND phone = '71981367825';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Maria Eduarda Silva', '71981367825') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Samuel Junior de Jesus brito', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Raysllan Yauseff Costa Cardoso
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Thais da Costa Rocha' AND phone = '71982330137';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Thais da Costa Rocha', '71982330137') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Raysllan Yauseff Costa Cardoso', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Miriã Fernandes Ramos Sales
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Renildes Fernandes Ramos Sales' AND phone = '71984852205';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Renildes Fernandes Ramos Sales', '71984852205') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Miriã Fernandes Ramos Sales', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Arthur Ferreira Boaventura
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Naiara Ferreira de Jesus' AND phone = '71992936159';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Naiara Ferreira de Jesus', '71992936159') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Arthur Ferreira Boaventura', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Heitor Silva Neri dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jessiclea Silva Neri dos Santos' AND phone = '71986980739';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jessiclea Silva Neri dos Santos', '71986980739') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Heitor Silva Neri dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maya Lis dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Mariana dos Santos' AND phone = '71983566853';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Mariana dos Santos', '71983566853') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maya Lis dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: João Lucas da Silva Barbosa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Sheila da Silva Nascimento' AND phone = '71992521781';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Sheila da Silva Nascimento', '71992521781') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('João Lucas da Silva Barbosa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ysis Nascimento Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Eliete Nascimento Silva' AND phone = '71986404474';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Eliete Nascimento Silva', '71986404474') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ysis Nascimento Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Laura Angelita Cardoso Brito
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Joice Cardoso' AND phone = '71992503925';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Joice Cardoso', '71992503925') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Laura Angelita Cardoso Brito', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Valentina Costa de Assis
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Suelem Santos Costa Assis' AND phone = '71981193290';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Suelem Santos Costa Assis', '71981193290') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Valentina Costa de Assis', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ravi dos Santos Reis
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Adriele dos Santos Matos Reis' AND phone = '71984320555';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Adriele dos Santos Matos Reis', '71984320555') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ravi dos Santos Reis', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Otavio Amor Divino dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Geisa Rocha dos Santos' AND phone = '71983833817';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Geisa Rocha dos Santos', '71983833817') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Otavio Amor Divino dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Julia dos Anjos Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Vanessa dos Anjos Ferreira de Jesus Santana' AND phone = '71988113262';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Vanessa dos Anjos Ferreira de Jesus Santana', '71988113262') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Julia dos Anjos Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Samuel Matos Brito
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Tatiane dos Santos Matos' AND phone = '71987218435';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Tatiane dos Santos Matos', '71987218435') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Samuel Matos Brito', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Levy Matos Brito
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Tatiane dos Santos Matos' AND phone = '71987218435';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Tatiane dos Santos Matos', '71987218435') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Levy Matos Brito', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Adryan Lucca Pereira dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Alessandra Pereira de Souza Lima' AND phone = '71981786118';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Alessandra Pereira de Souza Lima', '71981786118') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Adryan Lucca Pereira dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Nathan Santos Queiroz
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Heloisa Maria dos Santos Dias' AND phone = '71993006808';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Heloisa Maria dos Santos Dias', '71993006808') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Nathan Santos Queiroz', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Nichole Santos Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Patricia Santos celestino de Santana' AND phone = '71991988552';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Patricia Santos celestino de Santana', '71991988552') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Nichole Santos Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Dayse Ketleen Carvalho Oliveira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Deise Carvalho Silva Santos' AND phone = '71999452367';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Deise Carvalho Silva Santos', '71999452367') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Dayse Ketleen Carvalho Oliveira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Julia Mirelly Lemos Queiroz
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Cintia Santana Lemos' AND phone = '71981120139';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Cintia Santana Lemos', '71981120139') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Julia Mirelly Lemos Queiroz', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Pietro Santos de Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Patricia da Silva Santos' AND phone = '71991334463';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Patricia da Silva Santos', '71991334463') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Pietro Santos de Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ana Vitória Gomes de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Rebeca Gomes de Jesus' AND phone = '71987800104';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Rebeca Gomes de Jesus', '71987800104') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Vitória Gomes de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Samily Vitoria de Santana Nunes Costa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Tamiles de Santana Santos' AND phone = '71984340969';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Tamiles de Santana Santos', '71984340969') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Samily Vitoria de Santana Nunes Costa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Dominick Almeida Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ludmila Almeida Silva' AND phone = '71991107044';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ludmila Almeida Silva', '71991107044') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Dominick Almeida Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ravy Luiz Silva Matos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Rita Cristiane Silva de Jesus' AND phone = '71992898506';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Rita Cristiane Silva de Jesus', '71992898506') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ravy Luiz Silva Matos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Lavinia Silva Valadares
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Suzana Lemos da Silva' AND phone = '71986113167';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Suzana Lemos da Silva', '71986113167') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Lavinia Silva Valadares', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Anthony Pietro Costa Cruz
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Milena Correia Costa' AND phone = '71992187891';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Milena Correia Costa', '71992187891') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Anthony Pietro Costa Cruz', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Aurora Machado Carvalho
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Yasmin Machado de Carvalho' AND phone = '71987603749';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Yasmin Machado de Carvalho', '71987603749') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Aurora Machado Carvalho', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Laura Meneses de Jesus Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Viviane Meneses de Jesus' AND phone = '71989091128';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Viviane Meneses de Jesus', '71989091128') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Laura Meneses de Jesus Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Théo da Hora Ferreira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Angela Texeira Ferreira da Silva' AND phone = '71985077998';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Angela Texeira Ferreira da Silva', '71985077998') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Théo da Hora Ferreira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Vaentina Costa de Assis
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Suelem Santos Costa Assis' AND phone = '71981193290';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Suelem Santos Costa Assis', '71981193290') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Vaentina Costa de Assis', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Gael Francisco Ferreira Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jucimila Ferreira Santos' AND phone = '71985077998';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jucimila Ferreira Santos', '71985077998') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Gael Francisco Ferreira Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Pedro de Souza Freitas
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Lara de Souza Guedes da Silva' AND phone = '71991079146';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Lara de Souza Guedes da Silva', '71991079146') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Pedro de Souza Freitas', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Luara Menezes Miranda
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Naiara Nascimento Menezes' AND phone = '71993363876';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Naiara Nascimento Menezes', '71993363876') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Luara Menezes Miranda', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Luna Ferreira Guedes
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Laila Maria Ferreira' AND phone = '71987910753';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Laila Maria Ferreira', '71987910753') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Luna Ferreira Guedes', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Elisa Souza Santos Fernandes
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jeane Cristina Santos Fernandes' AND phone = '71 993051160';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jeane Cristina Santos Fernandes', '71 993051160') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Elisa Souza Santos Fernandes', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Alice Oliveira dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Maria Alice Santos Oliveira' AND phone = '71991912806';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Maria Alice Santos Oliveira', '71991912806') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Alice Oliveira dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Laura Regina Oliveira dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Lorena Oliveira Giliberti' AND phone = '71987215052';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Lorena Oliveira Giliberti', '71987215052') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Laura Regina Oliveira dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Mariana Oliveira Brandão
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Agnes Olivera dos Santos' AND phone = '71992326821';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Agnes Olivera dos Santos', '71992326821') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Mariana Oliveira Brandão', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Joaquim Jesus de Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Erica Jesus Silva Souza' AND phone = '71982481313';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Erica Jesus Silva Souza', '71982481313') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Joaquim Jesus de Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ana Sofia das Dores Amarante
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ana Cristina das Dores Santos' AND phone = '71982552531';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ana Cristina das Dores Santos', '71982552531') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Sofia das Dores Amarante', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Lunna Valentina Santos Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Reinaldo Santos Santana' AND phone = '71984411211';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Reinaldo Santos Santana', '71984411211') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Lunna Valentina Santos Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Pedro Lucas Santos Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Reinaldo Santos Santana' AND phone = '71984411211';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Reinaldo Santos Santana', '71984411211') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Pedro Lucas Santos Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: João Gabriel Santos Santana
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Reinaldo Santos Santana' AND phone = '71984411211';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Reinaldo Santos Santana', '71984411211') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('João Gabriel Santos Santana', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Evelyn Maria Oliveira Pires
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Vanessa Barbosa de Oliveira' AND phone = '71992226664';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Vanessa Barbosa de Oliveira', '71992226664') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Evelyn Maria Oliveira Pires', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Heloah Carvalho Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jamile Carvalho de Oliveira' AND phone = '71983017592';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Jamile Carvalho de Oliveira', '71983017592') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Heloah Carvalho Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Jorge Antonio Santos de Oliveira Neto
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Elisangela Lima de Jesus' AND phone = '71987925191';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Elisangela Lima de Jesus', '71987925191') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Jorge Antonio Santos de Oliveira Neto', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Noah Bernardo Ramos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ana Beatriz Silva Ramos' AND phone = '71992450454';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ana Beatriz Silva Ramos', '71992450454') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Noah Bernardo Ramos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maysa Silva Dias
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Sara Souza Silva' AND phone = '71993475113';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Sara Souza Silva', '71993475113') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maysa Silva Dias', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Heitor Boaventura Bacelar Ba
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Elisia Santos Boaventura' AND phone = '71992122168';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Elisia Santos Boaventura', '71992122168') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Heitor Boaventura Bacelar Ba', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Eloá Boaventura dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Estefanny Boaventura Bacelar Barbosa' AND phone = '71991838832';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Estefanny Boaventura Bacelar Barbosa', '71991838832') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Eloá Boaventura dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ana Kamile Ferreira Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Andreza Ferreira da Cruz' AND phone = '71992283020';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Andreza Ferreira da Cruz', '71992283020') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Kamile Ferreira Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Heloyse Goes de Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Daniela Nascimento Goes' AND phone = '71993690833';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Daniela Nascimento Goes', '71993690833') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Heloyse Goes de Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ana Cecilia da Silva Moreira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Anissa Caline Santos da Silva' AND phone = '71997051849';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Anissa Caline Santos da Silva', '71997051849') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Cecilia da Silva Moreira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ayla Jasmim da Silva Moreira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Anissa Caline Santos da Silva' AND phone = '71997051849';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Anissa Caline Santos da Silva', '71997051849') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ayla Jasmim da Silva Moreira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Mariê Maia Oliveira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Carla Brandão Maia' AND phone = '71986939753';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Carla Brandão Maia', '71986939753') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Mariê Maia Oliveira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Maria Clara Silva Dias
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Sara Souza Silva' AND phone = '71997084696';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Sara Souza Silva', '71997084696') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Clara Silva Dias', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Valentina Santos Paixão
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Anaquele Santos' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Anaquele Santos', '') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Valentina Santos Paixão', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ayla Pinho Alves
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Tais Santos Pinho' AND phone = '71983488199';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Tais Santos Pinho', '71983488199') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ayla Pinho Alves', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Benicio Souza de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Relve Souza Jesus' AND phone = '71991985761';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Relve Souza Jesus', '71991985761') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Benicio Souza de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Davi Apollo Flor Paixão
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Joana Laura Flor de Lima' AND phone = '71981994017';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Joana Laura Flor de Lima', '71981994017') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Davi Apollo Flor Paixão', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ingride Silva dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Marli Jesus da Silva' AND phone = '71991860100';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Marli Jesus da Silva', '71991860100') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ingride Silva dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Lunna Vitória Conceição Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Gabriele da Conceição Barbosa' AND phone = '71988178985';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Gabriele da Conceição Barbosa', '71988178985') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Lunna Vitória Conceição Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Lunna Santana dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Rosilma de Jesus Santana' AND phone = '71985244428';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Rosilma de Jesus Santana', '71985244428') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Integral' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Lunna Santana dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Enzo Gabriel Costa de Assis
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Daisy Bartista Costa de Assis' AND phone = '71993382310';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Daisy Bartista Costa de Assis', '71993382310') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Enzo Gabriel Costa de Assis', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Cecilia de Souza Vieira Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ivete Luana de Souza Vieira' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ivete Luana de Souza Vieira', '') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 05' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Cecilia de Souza Vieira Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Noah Gabriel dos Santos de Oliveira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Adriane dos Santos Cunha' AND phone = '71988932429';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Adriane dos Santos Cunha', '71988932429') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Noah Gabriel dos Santos de Oliveira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Iam Santana Damasceno
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ingridy Santana Pereira dos Santos' AND phone = '71991818084';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Ingridy Santana Pereira dos Santos', '71991818084') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Iam Santana Damasceno', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Yasser Leonel de Jesus Couto
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Nathalia de Lima Couto' AND phone = '71 991637344';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Nathalia de Lima Couto', '71 991637344') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 04' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Yasser Leonel de Jesus Couto', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Gustavo da Conceição Lima
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Fabiana da Conceição da Silva Lima' AND phone = '71983008134';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Fabiana da Conceição da Silva Lima', '71983008134') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Gustavo da Conceição Lima', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ayla Kamile Ferreira dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'ANDREZA FERREIRA DA CRUZ' AND phone = '71999376892';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('ANDREZA FERREIRA DA CRUZ', '71999376892') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ayla Kamile Ferreira dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Ana Loara Nascimento dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Cleonildes Rodrigues de Carvalho' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Cleonildes Rodrigues de Carvalho', '') RETURNING id INTO v_guardian_id;
   END IF;
   v_class_id := NULL;
   v_unit_id := NULL;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Loara Nascimento dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: MARIA LUIZA SOUZA DOS SANTOS RIBEIRO
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'QUERCIA SOUZA DOS SANTOS' AND phone = '71 99140-5868';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('QUERCIA SOUZA DOS SANTOS', '71 99140-5868') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 02' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('MARIA LUIZA SOUZA DOS SANTOS RIBEIRO', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

   -- Student: Rosely Santos de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Juliana Costa dos Santos' AND phone = '71992928110';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone) VALUES ('Juliana Costa dos Santos', '71992928110') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = 'Grupo 03' AND shift = 'Parcial' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   INSERT INTO students (name, class_id, unit_id) VALUES ('Rosely Santos de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
   IF v_guardian_id IS NOT NULL THEN
       INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
   END IF;
   IF v_class_id IS NOT NULL THEN
       INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
   END IF;

END $$;
