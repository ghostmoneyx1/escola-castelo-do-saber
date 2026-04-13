
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
   -- Class: 4º Ano Ensino Fundamental | Matutino | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('4º Ano Ensino Fundamental', '4º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 2º Ano Ensino Fundamental | Matutino | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('2º Ano Ensino Fundamental', '2º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 3º Ano Ensino Fundamental | Matutino | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('3º Ano Ensino Fundamental', '3º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 4º Ano Ensino Fundamental | Matutino | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('4º Ano Ensino Fundamental', '4º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 1º Ano Ensino Fundamental | Matutino | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('1º Ano Ensino Fundamental', '1º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 3º Ano Ensino Fundamental | Matutino | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('3º Ano Ensino Fundamental', '3º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 1º Ano Ensino Fundamental | Matutino | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('1º Ano Ensino Fundamental', '1º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 5º Ano Ensino Fundamental | Matutino | Alto do Cabrito
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '5º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('5º Ano Ensino Fundamental', '5º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 2º Ano Ensino Fundamental | Matutino | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('2º Ano Ensino Fundamental', '2º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;
   -- Class: 5º Ano Ensino Fundamental | Matutino | Boa Vista do Lobato
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '5º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026) THEN
       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('5º Ano Ensino Fundamental', '5º Ano Ensino Fundamental', 'Matutino', v_unit_id, 2026);
   END IF;

   -- Student: Ludmilla Silva Valadares
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Suzana Lemos da Silva' AND phone = '71986113167';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Suzana Lemos da Silva', '71986113167', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ludmilla Silva Valadares') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ludmilla Silva Valadares', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Samuel da Fonseca Queiroz
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Adailton de Araújo Souza/ Rebeca Fonseca' AND phone = '71984291115';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Adailton de Araújo Souza/ Rebeca Fonseca', '71984291115', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Samuel da Fonseca Queiroz') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Samuel da Fonseca Queiroz', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Yan Emanuel Mascarenhas Adorno
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Erica Mascarenhas' AND phone = '71993019523';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Erica Mascarenhas', '71993019523', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Yan Emanuel Mascarenhas Adorno') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Yan Emanuel Mascarenhas Adorno', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Rebeca São Leão
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Milena São Leão' AND phone = '71986282967';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Milena São Leão', '71986282967', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Rebeca São Leão') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Rebeca São Leão', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Júlia de Oliveira Sales
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jamile de Oliveira' AND phone = '71981613723';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Jamile de Oliveira', '71981613723', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Júlia de Oliveira Sales') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Júlia de Oliveira Sales', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Mathias da Hora Cerqueira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Tamires Santos da Hora' AND phone = '71982595336';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Tamires Santos da Hora', '71982595336', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Mathias da Hora Cerqueira') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Mathias da Hora Cerqueira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Samir Gael Menezes Miranda
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Naiara Nascimento' AND phone = '71993363876';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Naiara Nascimento', '71993363876', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Samir Gael Menezes Miranda') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Samir Gael Menezes Miranda', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: ana luiza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Gislaine Novais Brito' AND phone = '71987506912';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Gislaine Novais Brito', '71987506912', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'ana luiza') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('ana luiza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Rayanne Meneses
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Dayane Aparecida Meneses dos Santos' AND phone = '71993587897';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Dayane Aparecida Meneses dos Santos', '71993587897', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Rayanne Meneses') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Rayanne Meneses', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Rute Pereira Barreto Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Regina Maria Pereira Puridade da Silva' AND phone = '71987831252';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Regina Maria Pereira Puridade da Silva', '71987831252', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Rute Pereira Barreto Silva') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Rute Pereira Barreto Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Apolo
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Geisa Brito' AND phone = '71991372737';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Geisa Brito', '71991372737', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Apolo') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Apolo', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Miguel Mota
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Quiliana Maria Santos da Silva' AND phone = '71987995914';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Quiliana Maria Santos da Silva', '71987995914', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Miguel Mota') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Miguel Mota', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Arthur Fortunato
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Cristiane Fortunato' AND phone = '71982402636';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Cristiane Fortunato', '71982402636', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Arthur Fortunato') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Arthur Fortunato', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Samuel
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Janderson' AND phone = '71981443551';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Janderson', '71981443551', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Samuel') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Samuel', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Ester Santos de São Bernardo
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Patricia Santos de São Bernardo' AND phone = '71987068732';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Patricia Santos de São Bernardo', '71987068732', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ester Santos de São Bernardo') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ester Santos de São Bernardo', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Yasmin Simas
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Glaucia Simas' AND phone = '71985561607';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Glaucia Simas', '71985561607', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Yasmin Simas') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Yasmin Simas', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Analu Mota Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Laise Laerte Mota Souza' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Laise Laerte Mota Souza', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '5º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Analu Mota Souza') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Analu Mota Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Stephany Maria Santos Matos da Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Rosimeire Motta Santos' AND phone = '71984356592';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Rosimeire Motta Santos', '71984356592', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '5º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Stephany Maria Santos Matos da Silva') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Stephany Maria Santos Matos da Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Arthur Vale Nascimento
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Camila Vale Moura' AND phone = '71984706149';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Camila Vale Moura', '71984706149', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Arthur Vale Nascimento') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Arthur Vale Nascimento', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Ana Júlia de Melo Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Amanda da Silva Batista' AND phone = '71986461483';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Amanda da Silva Batista', '71986461483', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ana Júlia de Melo Silva') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Júlia de Melo Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Maria Eloá
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Lany' AND phone = '71997150916';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Lany', '71997150916', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Maria Eloá') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Eloá', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Pérola Sophia de Jesus Alexandre de Souza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Fernando Alexandre de Souza' AND phone = '71991443734';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Fernando Alexandre de Souza', '71991443734', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Pérola Sophia de Jesus Alexandre de Souza') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Pérola Sophia de Jesus Alexandre de Souza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Agatha
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Viviane' AND phone = '71989091128';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Viviane', '71989091128', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Agatha') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Agatha', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Ana Luiza dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Alexandra da Cruz dos Santos' AND phone = '41997813660';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Alexandra da Cruz dos Santos', '41997813660', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ana Luiza dos Santos') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Luiza dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Benjamim de Santana Adolfo
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Denise Santos de Santos' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Denise Santos de Santos', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Benjamim de Santana Adolfo') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Benjamim de Santana Adolfo', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Giovanna Conceição da Silva Soeiro
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Joseane Conceição da Silva' AND phone = '71982631877';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Joseane Conceição da Silva', '71982631877', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Giovanna Conceição da Silva Soeiro') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Giovanna Conceição da Silva Soeiro', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Gabryel de Jesus Fernandes
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Crislane Barbosa Fernandes' AND phone = '71987439224';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Crislane Barbosa Fernandes', '71987439224', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Gabryel de Jesus Fernandes') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Gabryel de Jesus Fernandes', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Laura Brito
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Miranildes Lopes dos Santos' AND phone = '71992086060';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Miranildes Lopes dos Santos', '71992086060', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Laura Brito') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Laura Brito', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Miguel
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Sarah' AND phone = '71984430418';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Sarah', '71984430418', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Miguel') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Miguel', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Pedro Santana Silva
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Nathalia da Silva de Santana' AND phone = '71983526005';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Nathalia da Silva de Santana', '71983526005', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Pedro Santana Silva') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Pedro Santana Silva', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Maria Vitória Silva dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Marli Jesus da Silva' AND phone = '71992125042';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Marli Jesus da Silva', '71992125042', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Maria Vitória Silva dos Santos') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Vitória Silva dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: João Miguel Garcia Costa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Fabiane Garcia' AND phone = '71987747540';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Fabiane Garcia', '71987747540', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'João Miguel Garcia Costa') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('João Miguel Garcia Costa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Anthony Gabriel Oliveira Carvalho
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Juliana Oliveira Ferreira Santos' AND phone = '71991218772';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Juliana Oliveira Ferreira Santos', '71991218772', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Anthony Gabriel Oliveira Carvalho') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Anthony Gabriel Oliveira Carvalho', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Marina Laert Costa Sena
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Kelly Laert Costa Machado' AND phone = '71992162597';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Kelly Laert Costa Machado', '71992162597', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Marina Laert Costa Sena') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Marina Laert Costa Sena', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Emanuelly Moura dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Caroline Vale Moura' AND phone = '71981415457';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Caroline Vale Moura', '71981415457', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Emanuelly Moura dos Santos') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Emanuelly Moura dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Julia Maira
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Margarete' AND phone = '71992295333';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Margarete', '71992295333', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Julia Maira') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Julia Maira', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Enzo Gabriel Bonfim Dos Santos
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Edileuza' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Edileuza', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Enzo Gabriel Bonfim Dos Santos') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Enzo Gabriel Bonfim Dos Santos', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Mickael
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Gabriela' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Gabriela', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Mickael') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Mickael', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Julia Maira Anunciação Menezes
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Margarete Anunciação Menezes' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Margarete Anunciação Menezes', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Julia Maira Anunciação Menezes') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Julia Maira Anunciação Menezes', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Heitor Soares Custodio
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Eli Carvalho Soares' AND phone = '71981607753';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Eli Carvalho Soares', '71981607753', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Heitor Soares Custodio') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Heitor Soares Custodio', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Ana Luiza
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Daisy Batista Costa de Assis' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Daisy Batista Costa de Assis', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ana Luiza') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Luiza', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Pedro Sousa Fortunato
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Jaqueline Maria de Sousa' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Jaqueline Maria de Sousa', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Pedro Sousa Fortunato') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Pedro Sousa Fortunato', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Laura Britto
   SELECT id INTO v_guardian_id FROM guardians WHERE name = '' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Laura Britto') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Laura Britto', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Laura Fraga
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Leidiane Fraga' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Leidiane Fraga', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Laura Fraga') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Laura Fraga', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Joao Miguel
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Muriele' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Muriele', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '5º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Joao Miguel') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Joao Miguel', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Maria Eduarda Reis
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Adrielle Mato Reis' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Adrielle Mato Reis', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Maria Eduarda Reis') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Maria Eduarda Reis', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Thayla
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Rebeca' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Rebeca', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Thayla') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Thayla', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Agatha
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Laraguaraci' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Laraguaraci', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Agatha') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Agatha', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Yasmin Pinheiro
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Brenna Pinheiro' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Brenna Pinheiro', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Yasmin Pinheiro') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Yasmin Pinheiro', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Ana Beatriz Bahia
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ana Paula Bahia Conceição' AND phone = '7198846-4616';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Ana Paula Bahia Conceição', '7198846-4616', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '4º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ana Beatriz Bahia') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Beatriz Bahia', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Noelia Vitoria Santos de Jesus
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Ivoniles conceição dos santos' AND phone = '71988797389';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Ivoniles conceição dos santos', '71988797389', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Noelia Vitoria Santos de Jesus') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Noelia Vitoria Santos de Jesus', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Raquel Santos Goncalves
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Debora Mota dos Santos Goncalves' AND phone = '71986021114';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Debora Mota dos Santos Goncalves', '71986021114', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Raquel Santos Goncalves') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Raquel Santos Goncalves', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Ana Julia Bacelar
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Adriana Bacelar Barbosa' AND phone = '71981999963';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Adriana Bacelar Barbosa', '71981999963', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ana Julia Bacelar') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ana Julia Bacelar', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Ademir santos Ferreira Miranda
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Elenir Santos Gomes' AND phone = '71985570361';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Elenir Santos Gomes', '71985570361', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Ademir santos Ferreira Miranda') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Ademir santos Ferreira Miranda', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Heloisa
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Heina' AND phone = '71993314709';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Heina', '71993314709', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '1º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Heloisa') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Heloisa', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Israel dos Santos Queiroz
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Marta' AND phone = '';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Marta', '', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Boa Vista do Lobato';
   SELECT id INTO v_class_id FROM classes WHERE grade = '5º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Israel dos Santos Queiroz') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Israel dos Santos Queiroz', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Lunna Victoria
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Islane Tielle Reis Araujo' AND phone = '71982609309';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Islane Tielle Reis Araujo', '71982609309', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '3º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Lunna Victoria') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Lunna Victoria', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;

   -- Student: Rafaela
   SELECT id INTO v_guardian_id FROM guardians WHERE name = 'Selma' AND phone = '71992745049';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('Selma', '71992745049', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = 'Alto do Cabrito';
   SELECT id INTO v_class_id FROM classes WHERE grade = '2º Ano Ensino Fundamental' AND shift = 'Matutino' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = 'Rafaela') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('Rafaela', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;
END $$;
