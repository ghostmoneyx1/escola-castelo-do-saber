-- ============================================================
-- SEED — Escola Castelo do Saber
-- Cole este script no SQL Editor do Supabase e execute
-- https://supabase.com/dashboard → SQL Editor → New query
-- ============================================================

-- Limpa dados existentes (ordem inversa de dependência)
TRUNCATE TABLE attendance, documents, grades, payments, enrollments,
              student_guardians, guardians, students, classes, subjects, units
CASCADE;

-- ─── UNITS ───────────────────────────────────────────────────
INSERT INTO units (id, name, address) VALUES
  ('bb000000-0000-0000-0000-000000000001', 'Unidade Central',    'Rua das Pitangueiras, 245 — Pituba, Salvador'),
  ('bb000000-0000-0000-0000-000000000002', 'Unidade Cajazeiras', 'Av. Luís Viana Filho, 1820 — Cajazeiras, Salvador');

-- ─── SUBJECTS ────────────────────────────────────────────────
INSERT INTO subjects (id, name, sort_order, is_active) VALUES
  ('dd000000-0000-0000-0000-000000000001', 'Português',       1,  true),
  ('dd000000-0000-0000-0000-000000000002', 'Matemática',      2,  true),
  ('dd000000-0000-0000-0000-000000000003', 'Ciências',        3,  true),
  ('dd000000-0000-0000-0000-000000000004', 'História',        4,  true),
  ('dd000000-0000-0000-0000-000000000005', 'Geografia',       5,  true),
  ('dd000000-0000-0000-0000-000000000006', 'Educação Física', 6,  true),
  ('dd000000-0000-0000-0000-000000000007', 'Arte',            7,  true),
  ('dd000000-0000-0000-0000-000000000008', 'Inglês',          8,  true),
  ('dd000000-0000-0000-0000-000000000009', 'Física',          9,  true),
  ('dd000000-0000-0000-0000-000000000010', 'Biologia',        10, true);

-- ─── CLASSES ─────────────────────────────────────────────────
INSERT INTO classes (id, name, grade, shift, unit_id, year, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Jardim A',  'Educação Infantil', 'Matutino',   'bb000000-0000-0000-0000-000000000001', 2026, true),
  ('c1000000-0000-0000-0000-000000000002', 'Jardim B',  'Educação Infantil', 'Vespertino', 'bb000000-0000-0000-0000-000000000002', 2026, true),
  ('c1000000-0000-0000-0000-000000000003', '1º Ano A',  '1º Ano EF',         'Matutino',   'bb000000-0000-0000-0000-000000000001', 2026, true),
  ('c1000000-0000-0000-0000-000000000004', '1º Ano B',  '1º Ano EF',         'Vespertino', 'bb000000-0000-0000-0000-000000000002', 2026, true),
  ('c1000000-0000-0000-0000-000000000005', '3º Ano A',  '3º Ano EF',         'Matutino',   'bb000000-0000-0000-0000-000000000001', 2026, true),
  ('c1000000-0000-0000-0000-000000000006', '5º Ano A',  '5º Ano EF',         'Integral',   'bb000000-0000-0000-0000-000000000002', 2026, true),
  ('c1000000-0000-0000-0000-000000000007', '7º Ano A',  '7º Ano EF',         'Matutino',   'bb000000-0000-0000-0000-000000000001', 2026, true),
  ('c1000000-0000-0000-0000-000000000008', '9º Ano A',  '9º Ano EF',         'Vespertino', 'bb000000-0000-0000-0000-000000000002', 2026, true),
  ('c1000000-0000-0000-0000-000000000009', '1º EM A',   '1º Ano EM',         'Matutino',   'bb000000-0000-0000-0000-000000000001', 2026, true),
  ('c1000000-0000-0000-0000-000000000010', '2º EM A',   '2º Ano EM',         'Vespertino', 'bb000000-0000-0000-0000-000000000002', 2026, true);

-- ─── STUDENTS (35 alunos) ────────────────────────────────────
INSERT INTO students (id, name, cpf, birth_date, gender, birthplace, status, enrollment_type, uses_transport, class_id, unit_id, previous_school, observations) VALUES
  ('a1000000-0000-0000-0000-000000000001','Ana Beatriz Santos Silva',    '312.456.789-01','2015-03-12','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000003','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000002','Carlos Eduardo Oliveira',     '423.567.890-12','2014-07-22','Masculino', 'Feira de Santana',    'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000005','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000003','Mariana Souza Ferreira',      '534.678.901-23','2016-11-05','Feminino',  'Salvador',            'Ativo',       'Bolsista',  'false','c1000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000004','João Pedro Costa Lima',       '645.789.012-34','2013-09-18','Masculino', 'Camaçari',            'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000007','bb000000-0000-0000-0000-000000000001', 'Escola Municipal Castro Alves', null),
  ('a1000000-0000-0000-0000-000000000005','Larissa Almeida Nascimento',  '756.890.123-45','2017-01-30','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000002','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000006','Rafael Torres Pereira',       '867.901.234-56','2012-05-14','Masculino', 'Lauro de Freitas',    'Ativo',       'Bolsista',  'true', 'c1000000-0000-0000-0000-000000000008','bb000000-0000-0000-0000-000000000002', 'Colégio Estadual Bahia', null),
  ('a1000000-0000-0000-0000-000000000007','Isabela Cardoso Rocha',       '978.012.345-67','2015-08-27','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000003','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000008','Gabriel Mendes Barbosa',      '089.123.456-78','2011-04-03','Masculino', 'Itabuna',             'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000009','bb000000-0000-0000-0000-000000000001', null, 'Aluno com necessidades de acompanhamento pedagógico especial.'),
  ('a1000000-0000-0000-0000-000000000009','Letícia Nunes Carvalho',      '191.234.567-89','2016-06-19','Feminino',  'Salvador',            'Ativo',       'Bolsista',  'false','c1000000-0000-0000-0000-000000000004','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000010','Pedro Henrique Araujo',       '202.345.678-90','2014-12-08','Masculino', 'Salvador',            'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000006','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000011','Sophia Martins Vieira',       '313.456.789-01','2015-02-25','Feminino',  'Feira de Santana',    'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000005','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000012','Lucas Fernandes Gomes',       '424.567.890-12','2013-10-16','Masculino', 'Salvador',            'Ativo',       'Bolsista',  'true', 'c1000000-0000-0000-0000-000000000007','bb000000-0000-0000-0000-000000000001', 'CEJA Salvador', null),
  ('a1000000-0000-0000-0000-000000000013','Valentina Moura Ribeiro',     '535.678.901-23','2016-04-07','Feminino',  'Camaçari',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000002','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000014','Mateus Correia Lopes',        '646.789.012-34','2012-08-11','Masculino', 'Salvador',            'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000009','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000015','Beatriz Pinto Teixeira',      '757.890.123-45','2017-03-22','Feminino',  'Lauro de Freitas',    'Ativo',       'Bolsista',  'false','c1000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000016','Felipe Azevedo Castro',       '868.901.234-56','2014-11-29','Masculino', 'Salvador',            'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000006','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000017','Amanda Ramos Monteiro',       '979.012.345-67','2015-07-14','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000003','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000018','Thiago Cunha Borges',         '080.123.456-78','2011-01-05','Masculino', 'Feira de Santana',    'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000010','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000019','Camila Rodrigues Faria',      '191.234.567-89','2016-09-18','Feminino',  'Salvador',            'Ativo',       'Bolsista',  'false','c1000000-0000-0000-0000-000000000004','bb000000-0000-0000-0000-000000000002', null, 'Aluno com necessidades de acompanhamento pedagógico especial.'),
  ('a1000000-0000-0000-0000-000000000020','Bruno Moreira Andrade',       '202.345.678-90','2013-05-30','Masculino', 'Camaçari',            'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000008','bb000000-0000-0000-0000-000000000002', 'Escola Municipal Castro Alves', null),
  ('a1000000-0000-0000-0000-000000000021','Juliana Alves Magalhães',     '313.456.789-01','2014-02-14','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000005','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000022','Daniel Coelho Guimarães',     '424.567.890-12','2012-06-03','Masculino', 'Itabuna',             'Ativo',       'Bolsista',  'true', 'c1000000-0000-0000-0000-000000000009','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000023','Fernanda Lima Cavalcanti',    '535.678.901-23','2015-10-17','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000007','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000024','Victor Hugo Reis Sousa',      '646.789.012-34','2016-12-25','Masculino', 'Lauro de Freitas',    'Ativo',       'Particular','true', 'c1000000-0000-0000-0000-000000000002','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000025','Natalia Barros Freitas',      '757.890.123-45','2013-04-08','Feminino',  'Salvador',            'Ativo',       'Bolsista',  'false','c1000000-0000-0000-0000-000000000006','bb000000-0000-0000-0000-000000000002', 'Colégio Estadual Bahia', null),
  -- Pendentes
  ('a1000000-0000-0000-0000-000000000026','Leonardo Pinheiro Duarte',    '868.901.234-56','2014-08-20','Masculino', 'Salvador',            'Pendente',    'Particular','true', 'c1000000-0000-0000-0000-000000000003','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000027','Gabrielle Santana Cruz',      '979.012.345-67','2015-11-11','Feminino',  'Feira de Santana',    'Pendente',    'Particular','false','c1000000-0000-0000-0000-000000000010','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000028','Eduardo Batista Tavares',     '080.123.456-78','2016-01-17','Masculino', 'Salvador',            'Pendente',    'Bolsista',  'true', 'c1000000-0000-0000-0000-000000000004','bb000000-0000-0000-0000-000000000002', null, null),
  -- Inativos
  ('a1000000-0000-0000-0000-000000000029','Priscila Melo Queiroz',       '191.234.567-89','2013-07-06','Feminino',  'Camaçari',            'Inativo',     'Particular','false','c1000000-0000-0000-0000-000000000005','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000030','Renato Dias Nogueira',        '202.345.678-90','2012-03-28','Masculino', 'Salvador',            'Inativo',     'Particular','true', 'c1000000-0000-0000-0000-000000000007','bb000000-0000-0000-0000-000000000001', null, null),
  -- Transferidos
  ('a1000000-0000-0000-0000-000000000031','Giovanna Fonseca Carneiro',   '313.456.789-01','2014-09-15','Feminino',  'Salvador',            'Transferido', 'Particular','false','c1000000-0000-0000-0000-000000000008','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000032','Alexandre Costa Macedo',      '424.567.890-12','2011-05-02','Masculino', 'Lauro de Freitas',    'Transferido', 'Bolsista',  'true', 'c1000000-0000-0000-0000-000000000009','bb000000-0000-0000-0000-000000000001', null, null),
  ('a1000000-0000-0000-0000-000000000033','Thais Oliveira Sampaio',      '535.678.901-23','2015-06-23','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000010','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000034','Henrique Cardoso Fontes',     '646.789.012-34','2012-10-09','Masculino', 'Feira de Santana',    'Ativo',       'Bolsista',  'true', 'c1000000-0000-0000-0000-000000000006','bb000000-0000-0000-0000-000000000002', null, null),
  ('a1000000-0000-0000-0000-000000000035','Bianca Ferreira Muniz',       '757.890.123-45','2016-02-14','Feminino',  'Salvador',            'Ativo',       'Particular','false','c1000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000001', null, null);

-- ─── GUARDIANS ───────────────────────────────────────────────
INSERT INTO guardians (id, name, relationship, cpf, phone, email, address) VALUES
  ('ee000000-0000-0000-0000-000000000001','Maria Santos Silva',      'Mãe', '111.222.333-01','(71) 98541-3201','maria.silva@gmail.com',     'Rua das Acácias, 78 — Pituba'),
  ('ee000000-0000-0000-0000-000000000002','José Oliveira',           'Pai', '222.333.444-02','(71) 98652-4312','jose.oliveira@gmail.com',   'Av. Tancredo Neves, 340 — Caminho das Árvores'),
  ('ee000000-0000-0000-0000-000000000003','Sandra Ferreira',         'Mãe', '333.444.555-03','(71) 98763-5423','sandra.ferreira@gmail.com', 'Rua Pará, 12 — Barra'),
  ('ee000000-0000-0000-0000-000000000004','Paulo Lima',              'Pai', '444.555.666-04','(71) 98874-6534','paulo.lima@gmail.com',       'Travessa São João, 55 — Cajazeiras'),
  ('ee000000-0000-0000-0000-000000000005','Cláudia Nascimento',      'Mãe', '555.666.777-05','(71) 98985-7645','claudia.nasc@gmail.com',    'Rua Silveira Martins, 202 — Cabula'),
  ('ee000000-0000-0000-0000-000000000006','Marcos Pereira',          'Pai', '666.777.888-06','(71) 99096-8756','marcos.pereira@gmail.com',  'Rua das Acácias, 78 — Pituba'),
  ('ee000000-0000-0000-0000-000000000007','Ana Rocha',               'Mãe', '777.888.999-07','(71) 99107-9867','ana.rocha@gmail.com',        'Av. Tancredo Neves, 340 — Caminho das Árvores'),
  ('ee000000-0000-0000-0000-000000000008','Roberto Barbosa',         'Pai', '888.999.000-08','(71) 99218-0978','roberto.barbosa@gmail.com', 'Rua Pará, 12 — Barra'),
  ('ee000000-0000-0000-0000-000000000009','Fernanda Carvalho',       'Mãe', '999.000.111-09','(71) 99329-1089','fernanda.carv@gmail.com',   'Travessa São João, 55 — Cajazeiras'),
  ('ee000000-0000-0000-0000-000000000010','André Araujo',            'Pai', '000.111.222-10','(71) 99430-2190','andre.araujo@gmail.com',    'Rua Silveira Martins, 202 — Cabula'),
  ('ee000000-0000-0000-0000-000000000011','Patrícia Vieira',         'Mãe', '111.222.333-11','(71) 99541-3201','patricia.vieira@gmail.com', 'Rua das Acácias, 78 — Pituba'),
  ('ee000000-0000-0000-0000-000000000012','Carlos Gomes',            'Pai', '222.333.444-12','(71) 99652-4312','carlos.gomes@gmail.com',    'Av. Tancredo Neves, 340 — Caminho das Árvores'),
  ('ee000000-0000-0000-0000-000000000013','Luciana Ribeiro',         'Mãe', '333.444.555-13','(71) 99763-5423','luciana.rib@gmail.com',     'Rua Pará, 12 — Barra'),
  ('ee000000-0000-0000-0000-000000000014','João Lopes',              'Pai', '444.555.666-14','(71) 99874-6534','joao.lopes@gmail.com',      'Travessa São João, 55 — Cajazeiras'),
  ('ee000000-0000-0000-0000-000000000015','Sandra Teixeira',         'Mãe', '555.666.777-15','(71) 99985-7645','sandra.teix@gmail.com',     'Rua Silveira Martins, 202 — Cabula');

-- ─── STUDENT_GUARDIANS ───────────────────────────────────────
INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES
  ('a1000000-0000-0000-0000-000000000001','ee000000-0000-0000-0000-000000000001', true),
  ('a1000000-0000-0000-0000-000000000002','ee000000-0000-0000-0000-000000000002', true),
  ('a1000000-0000-0000-0000-000000000003','ee000000-0000-0000-0000-000000000003', true),
  ('a1000000-0000-0000-0000-000000000004','ee000000-0000-0000-0000-000000000004', true),
  ('a1000000-0000-0000-0000-000000000005','ee000000-0000-0000-0000-000000000005', true),
  ('a1000000-0000-0000-0000-000000000006','ee000000-0000-0000-0000-000000000006', true),
  ('a1000000-0000-0000-0000-000000000007','ee000000-0000-0000-0000-000000000007', true),
  ('a1000000-0000-0000-0000-000000000008','ee000000-0000-0000-0000-000000000008', true),
  ('a1000000-0000-0000-0000-000000000009','ee000000-0000-0000-0000-000000000009', true),
  ('a1000000-0000-0000-0000-000000000010','ee000000-0000-0000-0000-000000000010', true),
  ('a1000000-0000-0000-0000-000000000011','ee000000-0000-0000-0000-000000000011', true),
  ('a1000000-0000-0000-0000-000000000012','ee000000-0000-0000-0000-000000000012', true),
  ('a1000000-0000-0000-0000-000000000013','ee000000-0000-0000-0000-000000000013', true),
  ('a1000000-0000-0000-0000-000000000014','ee000000-0000-0000-0000-000000000014', true),
  ('a1000000-0000-0000-0000-000000000015','ee000000-0000-0000-0000-000000000015', true);

-- ─── ENROLLMENTS ─────────────────────────────────────────────
INSERT INTO enrollments (student_id, class_id, year, status, enrollment_date) VALUES
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000003',2026,'Ativa',     '2026-01-15'),
  ('a1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000005',2026,'Ativa',     '2026-01-10'),
  ('a1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000001',2026,'Ativa',     '2026-01-20'),
  ('a1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000007',2026,'Ativa',     '2026-01-08'),
  ('a1000000-0000-0000-0000-000000000005','c1000000-0000-0000-0000-000000000002',2026,'Ativa',     '2026-01-22'),
  ('a1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000008',2026,'Ativa',     '2026-01-12'),
  ('a1000000-0000-0000-0000-000000000007','c1000000-0000-0000-0000-000000000003',2026,'Ativa',     '2026-01-18'),
  ('a1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000009',2026,'Ativa',     '2026-01-07'),
  ('a1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-000000000004',2026,'Ativa',     '2026-01-25'),
  ('a1000000-0000-0000-0000-000000000010','c1000000-0000-0000-0000-000000000006',2026,'Ativa',     '2026-01-11'),
  ('a1000000-0000-0000-0000-000000000011','c1000000-0000-0000-0000-000000000005',2026,'Ativa',     '2026-01-14'),
  ('a1000000-0000-0000-0000-000000000012','c1000000-0000-0000-0000-000000000007',2026,'Ativa',     '2026-01-09'),
  ('a1000000-0000-0000-0000-000000000013','c1000000-0000-0000-0000-000000000002',2026,'Ativa',     '2026-01-21'),
  ('a1000000-0000-0000-0000-000000000014','c1000000-0000-0000-0000-000000000009',2026,'Ativa',     '2026-01-13'),
  ('a1000000-0000-0000-0000-000000000015','c1000000-0000-0000-0000-000000000001',2026,'Ativa',     '2026-01-19'),
  ('a1000000-0000-0000-0000-000000000016','c1000000-0000-0000-0000-000000000006',2026,'Ativa',     '2026-01-16'),
  ('a1000000-0000-0000-0000-000000000017','c1000000-0000-0000-0000-000000000003',2026,'Ativa',     '2026-01-23'),
  ('a1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000010',2026,'Ativa',     '2026-01-06'),
  ('a1000000-0000-0000-0000-000000000019','c1000000-0000-0000-0000-000000000004',2026,'Ativa',     '2026-01-24'),
  ('a1000000-0000-0000-0000-000000000020','c1000000-0000-0000-0000-000000000008',2026,'Ativa',     '2026-01-17'),
  ('a1000000-0000-0000-0000-000000000021','c1000000-0000-0000-0000-000000000005',2026,'Ativa',     '2026-02-03'),
  ('a1000000-0000-0000-0000-000000000022','c1000000-0000-0000-0000-000000000009',2026,'Ativa',     '2026-02-05'),
  ('a1000000-0000-0000-0000-000000000023','c1000000-0000-0000-0000-000000000007',2026,'Ativa',     '2026-02-07'),
  ('a1000000-0000-0000-0000-000000000024','c1000000-0000-0000-0000-000000000002',2026,'Ativa',     '2026-02-10'),
  ('a1000000-0000-0000-0000-000000000025','c1000000-0000-0000-0000-000000000006',2026,'Ativa',     '2026-02-12'),
  ('a1000000-0000-0000-0000-000000000026','c1000000-0000-0000-0000-000000000003',2026,'Ativa',     '2026-02-14'),
  ('a1000000-0000-0000-0000-000000000027','c1000000-0000-0000-0000-000000000010',2026,'Ativa',     '2026-02-18'),
  ('a1000000-0000-0000-0000-000000000028','c1000000-0000-0000-0000-000000000004',2026,'Ativa',     '2026-02-20'),
  ('a1000000-0000-0000-0000-000000000029','c1000000-0000-0000-0000-000000000005',2026,'Cancelada', '2026-01-05'),
  ('a1000000-0000-0000-0000-000000000030','c1000000-0000-0000-0000-000000000007',2026,'Cancelada', '2026-01-05'),
  ('a1000000-0000-0000-0000-000000000031','c1000000-0000-0000-0000-000000000008',2026,'Transferida','2026-02-01'),
  ('a1000000-0000-0000-0000-000000000032','c1000000-0000-0000-0000-000000000009',2026,'Transferida','2026-02-01'),
  ('a1000000-0000-0000-0000-000000000033','c1000000-0000-0000-0000-000000000010',2026,'Ativa',     '2026-02-22'),
  ('a1000000-0000-0000-0000-000000000034','c1000000-0000-0000-0000-000000000006',2026,'Ativa',     '2026-02-24'),
  ('a1000000-0000-0000-0000-000000000035','c1000000-0000-0000-0000-000000000001',2026,'Ativa',     '2026-02-26');

-- ─── GRADES (Notas — 2 Unidades lançadas) ───────────────────
INSERT INTO grades (student_id, subject_id, unit, score, year)
SELECT
  s.id,
  sub.id,
  u.unit_num,
  ROUND((RANDOM() * 4 + 6)::numeric, 1) AS score,  -- notas entre 6.0 e 10.0
  2026
FROM
  (SELECT id FROM students WHERE status = 'Ativo') s
  CROSS JOIN (SELECT id FROM subjects WHERE sort_order <= 8) sub
  CROSS JOIN (SELECT 1 AS unit_num UNION SELECT 2) u;

-- Alguns alunos com notas baixas para testar reprovação
UPDATE grades SET score = ROUND((RANDOM() * 3 + 3)::numeric, 1)
WHERE student_id IN (
  'a1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000012',
  'a1000000-0000-0000-0000-000000000019'
)
AND unit = 2;

-- ─── PAYMENTS ────────────────────────────────────────────────
INSERT INTO payments (student_id, reference_month, reference_year, amount, payment_method, status, due_date, paid_at)
SELECT
  s.id,
  m.month,
  2026,
  CASE s.enrollment_type
    WHEN 'Bolsista'   THEN 120.00
    WHEN 'Particular' THEN 650.00
  END,
  CASE
    WHEN m.month = 1 THEN 'Pix'
    WHEN m.month = 2 AND s.status = 'Ativo' THEN (ARRAY['Pix','Dinheiro','Cartão'])[FLOOR(RANDOM()*3+1)::int]
    ELSE NULL
  END,
  CASE
    WHEN s.status IN ('Inativo','Transferido') AND m.month >= 2 THEN 'Atrasado'
    WHEN m.month = 1 THEN 'Pago'
    WHEN m.month = 2 THEN (ARRAY['Pago','Pago','Pendente'])[FLOOR(RANDOM()*3+1)::int]
    WHEN m.month = 3 THEN (ARRAY['Pendente','Atrasado','Pago'])[FLOOR(RANDOM()*3+1)::int]
    ELSE 'Pendente'
  END,
  make_date(2026, m.month, 10),
  CASE
    WHEN m.month = 1 THEN make_date(2026, 1, FLOOR(RANDOM()*10+5)::int)::timestamptz
    WHEN m.month = 2 AND RANDOM() > 0.3 THEN make_date(2026, 2, FLOOR(RANDOM()*15+3)::int)::timestamptz
    ELSE NULL
  END
FROM students s
CROSS JOIN (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3) m;

-- ─── ATTENDANCE (Março 2026 — dias letivos) ──────────────────
INSERT INTO attendance (student_id, class_id, date, present)
SELECT
  s.id,
  s.class_id,
  d.dia,
  CASE WHEN RANDOM() > 0.12 THEN true ELSE false END
FROM
  (SELECT id, class_id FROM students WHERE status = 'Ativo') s
  CROSS JOIN (
    SELECT generate_series::date AS dia
    FROM generate_series('2026-03-02'::date, '2026-03-28'::date, '1 day'::interval)
    WHERE EXTRACT(DOW FROM generate_series) NOT IN (0,6)
  ) d;

-- ─── DOCUMENTS ───────────────────────────────────────────────
INSERT INTO documents (student_id, type, status, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000001','Atestado de Matrícula',  'Emitido','2026-02-10 09:15:00'),
  ('a1000000-0000-0000-0000-000000000001','Atestado de Frequência', 'Emitido','2026-03-05 14:30:00'),
  ('a1000000-0000-0000-0000-000000000002','Atestado de Matrícula',  'Emitido','2026-01-20 10:00:00'),
  ('a1000000-0000-0000-0000-000000000003','Histórico Escolar',      'Emitido','2026-02-15 11:20:00'),
  ('a1000000-0000-0000-0000-000000000004','Atestado de Matrícula',  'Emitido','2026-01-25 08:45:00'),
  ('a1000000-0000-0000-0000-000000000004','Atestado de Pagamento',  'Emitido','2026-03-10 15:00:00'),
  ('a1000000-0000-0000-0000-000000000005','Atestado de Matrícula',  'Emitido','2026-02-05 09:00:00'),
  ('a1000000-0000-0000-0000-000000000006','Atestado de Frequência', 'Emitido','2026-03-01 16:00:00'),
  ('a1000000-0000-0000-0000-000000000007','Histórico Escolar',      'Emitido','2026-02-20 13:30:00'),
  ('a1000000-0000-0000-0000-000000000008','Atestado de Matrícula',  'Emitido','2026-01-18 10:45:00'),
  ('a1000000-0000-0000-0000-000000000009','Atestado de Pagamento',  'Emitido','2026-03-08 09:30:00'),
  ('a1000000-0000-0000-0000-000000000010','Atestado de Matrícula',  'Emitido','2026-02-01 11:00:00'),
  ('a1000000-0000-0000-0000-000000000011','Atestado de Frequência', 'Emitido','2026-03-15 14:15:00'),
  ('a1000000-0000-0000-0000-000000000012','Histórico Escolar',      'Emitido','2026-02-28 10:00:00'),
  ('a1000000-0000-0000-0000-000000000015','Atestado de Matrícula',  'Emitido','2026-02-12 09:00:00');

-- ─── ANALYZE ─────────────────────────────────────────────────
-- Atualiza estatísticas do planner pós-insert em lote.
-- Sem isso, pg_class.reltuples fica 0 até autovacuum disparar
-- (threshold só bate em tabelas grandes), e ferramentas como
-- Supabase MCP `list_tables` reportam contagem zerada.
ANALYZE units, subjects, classes, students, guardians, student_guardians,
        enrollments, grades, attendance, payments, installments,
        quarterly_reports, report_tokens, documents, contracts,
        employees, employee_payments;

-- ─── VERIFICAÇÃO ─────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM units)           AS unidades,
  (SELECT COUNT(*) FROM subjects)        AS disciplinas,
  (SELECT COUNT(*) FROM classes)         AS turmas,
  (SELECT COUNT(*) FROM students)        AS alunos,
  (SELECT COUNT(*) FROM guardians)       AS responsaveis,
  (SELECT COUNT(*) FROM enrollments)     AS matriculas,
  (SELECT COUNT(*) FROM grades)          AS notas,
  (SELECT COUNT(*) FROM payments)        AS pagamentos,
  (SELECT COUNT(*) FROM attendance)      AS frequencias,
  (SELECT COUNT(*) FROM documents)       AS documentos;
