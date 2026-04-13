-- Atualizar alunos da Educação Infantil para Projeto
UPDATE students
SET enrollment_type = 'Projeto'
FROM classes
WHERE students.class_id = classes.id
AND classes.grade LIKE 'Grupo %';

-- Garantir que alunos do Ensino Fundamental continuem como Particular
UPDATE students
SET enrollment_type = 'Particular'
FROM classes
WHERE students.class_id = classes.id
AND (classes.grade LIKE '%Ano' OR classes.grade LIKE '%ANO');
