-- CORREÇÃO MANUAL: alunos com grafia diferente

-- Ana Sofia das Dores Amarante → Ana Sofia das Dores Amarante
UPDATE students SET cpf = '037.483.165-34', birth_date = '2024-03-28' WHERE LOWER(TRIM(name)) = LOWER('Ana Sofia das Dores Amarante') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '858.928.735-10', birth_date = '1988-03-08', phone = '71982552531' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Ana Sofia das Dores Amarante') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Ayla Pinho Alves → AYLA PINHO ALVES
UPDATE students SET cpf = '132.838.745-30', birth_date = '2023-07-10' WHERE LOWER(TRIM(name)) = LOWER('Ayla Pinho Alves') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '068.822.435-06', birth_date = '1997-05-05', phone = '71983488199' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Ayla Pinho Alves') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Ellen Araujo Barros → ELLEN ARAUJO BARROS
UPDATE students SET cpf = '132.024.115-86', birth_date = '2023-04-07' WHERE LOWER(TRIM(name)) = LOWER('Ellen Araujo Barros') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '029.179.195-66', birth_date = '1986-08-14', phone = '71987017681' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Ellen Araujo Barros') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Enzo Gabriel Evangelista oliveira → Enzo Gabriell Nascimento Barbosa
UPDATE students SET cpf = '132.322.225-10', birth_date = '2023-05-10' WHERE LOWER(TRIM(name)) = LOWER('Enzo Gabriel Evangelista oliveira') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '023.510.825-16', birth_date = '1985-03-29', phone = '7185093193' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Enzo Gabriel Evangelista oliveira') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Gustavo da Conceição Lima → Gustavo da conceicao Lima
UPDATE students SET cpf = '132.174.255-02', birth_date = '2023-04-25' WHERE LOWER(TRIM(name)) = LOWER('Gustavo da Conceição Lima') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '032.608.575-08', birth_date = '1985-10-10', phone = '7183008134' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Gustavo da Conceição Lima') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- kahyle Nascimento da Natividade de França → Kahyle Nascimento da Natividade França
UPDATE students SET cpf = '131.970.235-01', birth_date = '2023-04-03' WHERE LOWER(TRIM(name)) = LOWER('kahyle Nascimento da Natividade de França') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '053.548.065-26', birth_date = '1992-04-29', phone = '7182329536' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('kahyle Nascimento da Natividade de França') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Louise Santa Barbara → Louise Santa Barbara Muniz Ferreira
UPDATE students SET cpf = '008.021.235-20', birth_date = '2023-10-17' WHERE LOWER(TRIM(name)) = LOWER('Louise Santa Barbara') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '052.697.535-02', birth_date = '1992-09-24', phone = '7191730938' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Louise Santa Barbara') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Lucca Araujo Barros → Lucca Araujo Barros
UPDATE students SET cpf = '132.024.225-10', birth_date = '2023-04-07' WHERE LOWER(TRIM(name)) = LOWER('Lucca Araujo Barros') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '029.179.195-66', birth_date = '1986-08-14', phone = '71987017681' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Lucca Araujo Barros') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Melinda Sophia Ricarte Sena → Melinda Sophia Ricarte Sena
UPDATE students SET cpf = '014.253.235-53', birth_date = '2023-11-22' WHERE LOWER(TRIM(name)) = LOWER('Melinda Sophia Ricarte Sena') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '862.214.525-52', birth_date = '1996-09-13', phone = '7194107383' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Melinda Sophia Ricarte Sena') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Ravi Costa Goncalves Azevedo → Ravi Costa Gonçalves Azevedo
UPDATE students SET cpf = '132.170.025-39', birth_date = '2023-04-19' WHERE LOWER(TRIM(name)) = LOWER('Ravi Costa Goncalves Azevedo') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '070.542.855-90', birth_date = '1990-07-13', phone = '7187470915' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Ravi Costa Goncalves Azevedo') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Alicia Victória Gomes Santiago → ALICIA VICTORIA GOMES SANTIAGO
UPDATE students SET cpf = '130.548.615-38', birth_date = '2022-11-15' WHERE LOWER(TRIM(name)) = LOWER('Alicia Victória Gomes Santiago') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '865.572.745-89', birth_date = '2002-04-29', phone = '7196251838' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Alicia Victória Gomes Santiago') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Rafiki Junior Conceição dos Santos de Jesus → RAFIKI JUNIOR CONCEIÇÃO SANTOS DE JESUS
UPDATE students SET cpf = '129.459.245-95', birth_date = '2022-06-24' WHERE LOWER(TRIM(name)) = LOWER('Rafiki Junior Conceição dos Santos de Jesus') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '859.465.265-88', birth_date = '1993-07-25', phone = '7182485792' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Rafiki Junior Conceição dos Santos de Jesus') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Thácio Teles Santos → THACIO TELES SANTOS
UPDATE students SET cpf = '128.674.505-51', birth_date = '2022-04-23' WHERE LOWER(TRIM(name)) = LOWER('Thácio Teles Santos') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '026.655.945-01', birth_date = '1988-04-23', phone = '7183542356' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Thácio Teles Santos') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Arthur Ferreira Boaventura → ARTHUR FERREIRA BOAVENTURA
UPDATE students SET cpf = '125.030.575-60', birth_date = '2021-07-08' WHERE LOWER(TRIM(name)) = LOWER('Arthur Ferreira Boaventura') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '052.948.245-23', birth_date = '1990-08-05', phone = '7192936159' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Arthur Ferreira Boaventura') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Eloá Alves Souza → ELOA ALVES SOUZA
UPDATE students SET cpf = '124.381.025-43', birth_date = '2021-05-13' WHERE LOWER(TRIM(name)) = LOWER('Eloá Alves Souza') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '054.961.085-51', birth_date = '1992-05-03', phone = '71985204060' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Eloá Alves Souza') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- João Lucas da Silva Barbosa → JOAO LUCAS DA SILVA BARBOSA
UPDATE students SET cpf = '127.603.105-07', birth_date = '2022-01-29' WHERE LOWER(TRIM(name)) = LOWER('João Lucas da Silva Barbosa') AND unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1);
UPDATE guardians SET cpf = '067.140.435-03', birth_date = '1998-09-12', phone = '7192521781' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('João Lucas da Silva Barbosa') AND s.unit_id = (SELECT id FROM units WHERE name = 'Alto do Cabrito' LIMIT 1));

-- Ayla Kamile Ferreira dos Santos → Ayla Kamile Ferreira dos Santos
UPDATE students SET cpf = '015.318.405-15', birth_date = '2023-12-05' WHERE LOWER(TRIM(name)) = LOWER('Ayla Kamile Ferreira dos Santos') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '060.172.345-79', birth_date = '1993-05-13', phone = '7199376892' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Ayla Kamile Ferreira dos Santos') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Eloá Boaventura dos Santos → ELOA BOAVENTURA DOS SANTOS
UPDATE students SET cpf = '132.933.285-71', birth_date = '2023-07-14' WHERE LOWER(TRIM(name)) = LOWER('Eloá Boaventura dos Santos') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '869.450.775-78', birth_date = '2005-10-31', phone = '71991838832' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Eloá Boaventura dos Santos') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Heloísa Matos Lopes → Heloisa Matos Lopes
UPDATE students SET cpf = '132.700.615-44', birth_date = '2023-06-23' WHERE LOWER(TRIM(name)) = LOWER('Heloísa Matos Lopes') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '030.289.065-38', birth_date = '1988-05-18', phone = '7187695266' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Heloísa Matos Lopes') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Iam Santana Damasceno → IAM SANTANA DAMACENO
UPDATE students SET cpf = '000.311.275-68', birth_date = '2023-09-13' WHERE LOWER(TRIM(name)) = LOWER('Iam Santana Damasceno') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '857.914.615-18', birth_date = '1997-10-06', phone = '71991818084' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Iam Santana Damasceno') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Laura Regina Oliveira dos Santos → LAURA REGINA OLIVEIRA DOS SANTOA
UPDATE students SET cpf = '132.684.465-23', birth_date = '2023-06-16' WHERE LOWER(TRIM(name)) = LOWER('Laura Regina Oliveira dos Santos') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '014.734.915-09', birth_date = '1985-12-31', phone = '71987215052' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Laura Regina Oliveira dos Santos') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Liz Kethellyn Santos da Paixão → LIZ KETHELLYN SANTOS DA PAIXAO
UPDATE students SET cpf = '025.538.995-72', birth_date = '2024-01-20' WHERE LOWER(TRIM(name)) = LOWER('Liz Kethellyn Santos da Paixão') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '862.298.525-35', birth_date = '2005-07-08', phone = '7182322588' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Liz Kethellyn Santos da Paixão') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Maria Aurora Machado Carvalho → MARIA AURORA MACHADO DE CARVALHO
UPDATE students SET cpf = '045.963.825-49', birth_date = '2023-12-16' WHERE LOWER(TRIM(name)) = LOWER('Maria Aurora Machado Carvalho') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '862.747.935-69', birth_date = '2002-06-07', phone = '71987603749' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Maria Aurora Machado Carvalho') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Noah Bernardo Ramos → Noah Bernardo Ramos dos Santos Brito
UPDATE students SET cpf = '003.655.814-34', birth_date = '2024-03-22' WHERE LOWER(TRIM(name)) = LOWER('Noah Bernardo Ramos') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '097.647.405-02', birth_date = '2003-11-18' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Noah Bernardo Ramos') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Joaquim Jesus de Souza → JOAQUIM  JESUS DE SOUZA
UPDATE students SET cpf = '130.741.965-80', birth_date = '2022-12-02' WHERE LOWER(TRIM(name)) = LOWER('Joaquim Jesus de Souza') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '089.970.285-61', birth_date = '2001-12-26', phone = '71982481313' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Joaquim Jesus de Souza') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Kaleb Brandão Vilela → KALEB BRANDAO VILELA
UPDATE students SET cpf = '130.116.405-48', birth_date = '2022-09-22' WHERE LOWER(TRIM(name)) = LOWER('Kaleb Brandão Vilela') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '034.897.705-01', birth_date = '1986-10-11', phone = '71988826887' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Kaleb Brandão Vilela') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Lunna Vitória Conceição Souza → LUNNA VITORIA CONCEICAO SOUZA
UPDATE students SET cpf = '130.760.835-38', birth_date = '2022-12-06' WHERE LOWER(TRIM(name)) = LOWER('Lunna Vitória Conceição Souza') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '085.420.555-19', birth_date = '2005-08-11', phone = '71988178985' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Lunna Vitória Conceição Souza') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Maria Clara Souza Santos Moraes → MARIA CLARA SOUZA SANTOS MORAIS
UPDATE students SET cpf = '130.070.315-67', birth_date = '2022-09-15' WHERE LOWER(TRIM(name)) = LOWER('Maria Clara Souza Santos Moraes') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '035.689.485-16', birth_date = '1990-04-07', phone = '7197084696' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Maria Clara Souza Santos Moraes') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

-- Pedro Arthur Faustino Santana Santos → Pedro Arthur Faustino Santana Santos
UPDATE students SET cpf = '130.864.925-89', birth_date = '2022-12-20' WHERE LOWER(TRIM(name)) = LOWER('Pedro Arthur Faustino Santana Santos') AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);
UPDATE guardians SET cpf = '063.218.095-19', birth_date = '1998-02-18', phone = '7191484640' WHERE id IN (SELECT sg.guardian_id FROM student_guardians sg JOIN students s ON sg.student_id = s.id WHERE LOWER(TRIM(s.name)) = LOWER('Pedro Arthur Faustino Santana Santos') AND s.unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1));

SELECT COUNT(*) as total, COUNT(cpf) as com_cpf, COUNT(birth_date) as com_nascimento FROM students s JOIN classes c ON s.class_id = c.id WHERE c.grade LIKE 'Grupo%';
-- Heitor Boaventura (nome diferente na planilha)
UPDATE students SET cpf = '128.838.355-00', birth_date = '2022-05-07'
WHERE LOWER(TRIM(name)) = LOWER('Heitor Boaventura Bacelar Ba')
AND unit_id = (SELECT id FROM units WHERE name = 'Boa Vista do Lobato' LIMIT 1);

-- Verificação
SELECT COUNT(*) as total, COUNT(cpf) as com_cpf, COUNT(birth_date) as com_nascimento FROM students s JOIN classes c ON s.class_id = c.id WHERE c.grade LIKE 'Grupo%';
