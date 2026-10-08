-- ============================================================
-- IMPORTAÇÃO: planilha "SISTEMA DE COBRANÇA" 2026 → contracts / installments
-- Escola Castelo do Saber
-- Gerado em: 07/10/2026 a partir da planilha publicada (53 linhas)
--
-- INSTRUÇÕES:
-- 1. Rode antes atualizacao-2026-10-07-infinitepay.sql.
-- 2. Cole este script no SQL Editor do Supabase e execute UMA vez.
--    (rodar de novo não duplica, mas sobrescreve status com o da planilha)
--
-- REGRAS:
-- - A planilha manda: valor da mensalidade e situação de cada mês.
-- - PAGO           → parcela Pago (data real desconhecida: usa o vencimento)
-- - link https://  → parcela em aberto com o link antigo (payment_link_source = manual)
-- - DEVE / À VENCER→ parcela em aberto sem link; o sistema decide atraso pelo vencimento
-- - célula vazia   → mês não cobrado. Antes do 1º mês cobrado, a parcela é apagada
--                    (aluno entrou no meio do ano). No meio do ano, fica como está.
-- - Dia de vencimento: 10 (a planilha não tem essa informação).
--
-- NÃO IMPORTADOS (decidir com a secretaria):
--   linha "Enzo Santana" (resp. Janaina Binfim Santana, tel 7191131434) — não casa com nenhum aluno
--
-- MÊS EM BRANCO NO MEIO DO ANO (conferir se foi cobrado):
--   Pedro Santana Silva: PPPPPVV_VVVV
--   Maria Vitória Silva dos Santos: PPPPPPP_VVVV
--   Heloisa Silveira Vieira: PPPPPPP_VVVV
--   Ana Luiza dos Santos: PPPPPPP_VVVV
--   Ademir santos Ferreira Miranda: PPPPPPP_VVVV
-- ============================================================

BEGIN;

CREATE TEMP TABLE planilha (
  linha          int PRIMARY KEY,
  aluno_planilha text NOT NULL,
  nome_sistema   text,
  responsavel    text,
  telefone       text,
  valor          numeric(10,2) NOT NULL,
  meses          jsonb NOT NULL,
  observacao     text
) ON COMMIT DROP;

INSERT INTO planilha (linha, aluno_planilha, nome_sistema, responsavel, telefone, valor, meses, observacao) VALUES
(1, 'Samir Gael e Luara Miranda', 'Samir Gael Menezes Miranda', 'Naiara Nascimento', '71993363876', 450.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/AgCeHagtgI"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/bIF5MGhOyP"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/qzsWltglci"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/3VhUIIgifT"}}'::jsonb, 'Valor da planilha cobre os dois irmãos (Samir e Luara Menezes Miranda) numa linha só'),
(2, 'Henrique Brito', 'Henrique Brito', 'Gislaine Novais Brito', '71987506912', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"pago"},"10":{"t":"avencer"},"11":{"t":"avencer"},"12":{"t":"avencer"}}'::jsonb, NULL),
(3, 'Apolo Santos Silva', 'Apolo Santos Silva', 'Rosane', '7183445644', 250.00, '{"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/42lvPrCQ8e"},"9":{"t":"avencer"},"10":{"t":"avencer"},"11":{"t":"avencer"},"12":{"t":"avencer"}}'::jsonb, NULL),
(4, 'Miguel Mota', 'Miguel Santos Mota', 'Quiliana Maria Santos da Silva', '71987995914', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/japXbdQhOU"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/KM9cxb9SZ4"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/6mI4XnfnVr"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/FbvrozkrzT"}}'::jsonb, NULL),
(5, 'Ester Santos de São Bernardo', 'Ester Santos de São Bernardo', 'Patricia Santos de São Bernardo', '71987068732', 280.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ZMpEGrlr7S"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/qN2JklIuGH"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/46xcAuZJKB"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/tx14mfWVI6"}}'::jsonb, NULL),
(6, 'Arthur Vale Nascimento', 'Arthur Vale Nascimento', 'Camila Vale Moura', '71984706149', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/nM8dxyBZSH"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/3GY7F805Si"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/VYvEoNGAkX"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/hikl6tYn2y"}}'::jsonb, NULL),
(7, 'Benjamim de Santana Adolfo', 'Benjamim de Santana Adolfo', 'Denise Santos de Santos', '7191748715', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/JjqIOv7CGK"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/buxrUF4DFb"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/5PltzG5zFc"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/S9UVug6ZR1"}}'::jsonb, NULL),
(8, 'Giovanna Conceição da Silva Soeiro', 'Giovanna Conceição da Silva soeiro', 'Joseane Conceição da Silva', '71982631877', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/jpAEo3DnPD"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/PLdQeEmRCd"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Q00Gs4VwFS"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/jFsEZ9uDUk"}}'::jsonb, NULL),
(9, 'Laura Lopes', 'Ana Laura Lopes dos Santos', 'Miranildes Lopes dos Santos', '71992086060', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/YUvZ4nlWG6/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/pgWuAGElHL/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/L12WLvFy9B/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/pNCCWl0bTg/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/cUji0NGYbe/"}}'::jsonb, NULL),
(10, 'Pedro Santana Silva', 'Pedro Santana Silva', 'Nathalia da Silva de Santana', '71983526005', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"deve"},"7":{"t":"deve"},"9":{"t":"avencer"},"10":{"t":"avencer"},"11":{"t":"avencer"},"12":{"t":"avencer"}}'::jsonb, NULL),
(11, 'Maria Vitória Silva dos Santos', 'Maria Vitória Silva dos Santos', 'Marli Jesus da Silva', '71992125042', 200.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"9":{"t":"avencer"},"10":{"t":"avencer"},"11":{"t":"avencer"},"12":{"t":"avencer"}}'::jsonb, NULL),
(12, 'Anthony Gabriel Oliveira Carvalho', 'Anthony Gabriel Oliveira Carvalho', 'Juliana Oliveira Ferreira Santos', '71991218772', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"pago"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/4U0edPEkGk/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/hVkxIyvM8h/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/FNKQbv3tUC/"}}'::jsonb, NULL),
(13, 'Marina Laert Costa Sena', 'Marina Laert Costa Sena', 'Kelly Laert Costa Machado', '71992162597', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/kM2bFD6i1O/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/PLQ8DGl4jN/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Bp3ZtqpV6c/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/oGNNY6XFfW/"}}'::jsonb, NULL),
(14, 'Enzo Gabriel Bonfim Dos Santos', 'Enzo Gabriel Bonfim Dos Santos', 'Joselito', '71984393084', 300.00, '{"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/5T3OkIrp9B/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Yd9u3NZ7bq/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Yd9u3NZ7bq/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/wX0AlKwmVI/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/nDb6m65WEL/"}}'::jsonb, NULL),
(15, 'Heitor Soares Custodio', 'Heitor Soares Custodio', 'Eli Carvalho Soares', '71981607753', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/nc73Dn8RGg/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/nNUBe9qLqU/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/dcensKNNSd/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/jBdidiL5GI/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/g6TeAQI6Es/"}}'::jsonb, NULL),
(16, 'Pedro Sousa Fortunato', 'Pedro Sousa Fortunato', 'Jaqueline Maria de Sousa', '71992908635', 800.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/jUFE3voAlY"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/IRanbCbzTT"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/PJovNfQ7ne"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/G9tuq3KLJw"}}'::jsonb, NULL),
(17, 'Laura Britto', 'Laura Britto Ramos de Jesus', 'Ananias Britto Ramos dos Santos', '7192160387', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/FJ9DXSwUYW/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/O97OseAkZH/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ePq162lBUj/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/f211ja3VEX/"}}'::jsonb, NULL),
(18, 'Yasmin Pinheiro', 'Yasmin Pinheiro', 'Brenna Pinheiro', '7183033407', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/VexVKwsjaP/"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/C7OwN0453o/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/hcru0oNGOV/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/1WzzE4pNaL/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/FZTclX1rdt/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/rx0h3iqWZq/"}}'::jsonb, NULL),
(19, 'Noelia Vitoria Santos de Jesus', 'Noelia Vitoria Santos de Jesus', 'Ivoniles conceição dos santos', '71988797389', 280.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/IkUkwYq06v/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/f8J60gq1Ju/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/PeBnMeGpaE/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/sEAGBxEyHR/"}}'::jsonb, NULL),
(20, 'Heloisa Silveira Vieira', 'Heloisa Silveira Vieira', 'Heina', '71993314709', 250.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"9":{"t":"avencer"},"10":{"t":"avencer"},"11":{"t":"avencer"},"12":{"t":"avencer"}}'::jsonb, NULL),
(21, 'Samuel da Fonseca Queiroz', 'Samuel da Fonseca Queiroz', 'Adailton de Araújo Souza/ Rebeca Fonseca', '4784746758', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/oCgmvNa9sg/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/fAuW3Rd0Cb/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/1uhFn29rQU/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/QmvqBS9CJC/"}}'::jsonb, NULL),
(22, 'Rute Pereira Barreto Silva', 'Rute Pereira Barreto Silva', 'Regina Maria Pereira Puridade da Silva', '71987831252', 280.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/f89DOsc1cV/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/SFrSPKg2yv/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/NaRN6Jrojg/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/RsIrWoUulW/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/BoWKBMbmjF/"}}'::jsonb, NULL),
(23, 'Ana Luiza dos Santos', 'Ana Luiza dos Santos', 'Alexandra da Cruz dos Santos', '41997813660', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"9":{"t":"avencer"},"10":{"t":"avencer"},"11":{"t":"avencer"},"12":{"t":"avencer"}}'::jsonb, NULL),
(24, 'Mickael Martins Oliveira', 'Mickael martins oliveira', 'Gabriela', '7186979133', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Gkgal1ICTR/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/gS3jkAGmU9/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/NCLH88QszI/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/uAAMhtL1bu/"}}'::jsonb, NULL),
(25, 'Laura Fraga', 'Laura Fraga de Paula', 'Leidiane Fraga', '7193258261', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/yLhgYDbiRs/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/O8UDGtXDqZ/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/4u1yzqHMLz/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/wzrgiTunrY/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/9YgFWECJdM/"}}'::jsonb, NULL),
(26, 'Agatha', 'Agatha Tatiane de Jesus da Silva Nascimento', 'Laraguaraci', '7186676762', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/6qIrpd6g9x/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/rgh03EWosk/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/8VMVdouwrE/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/P7uWgodEkp/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/byV1eHrSbR/"}}'::jsonb, NULL),
(27, 'Raquel Santos Goncalves', 'Raquel Santos Goncalves', 'Debora Mota dos Santos Goncalves', '71986021114', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/jQ8YdEuTVS/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/qz6gEHaopp/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/4FMNMNIq6a/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ei7LmUlFj1/"}}'::jsonb, NULL),
(28, 'Ana Julia Bacelar', 'Ana Julia Bacelar', 'Adriana Bacelar Barbosa', '71981999963', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/AVES0ev4bF/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/BlS4BXDN32/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/37XNED3LGW/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/JaRuSOFa3f/"}}'::jsonb, NULL),
(29, 'Ademir santos Ferreira Miranda', 'Ademir santos Ferreira Miranda', 'Elenir Santos Gomes', '71985570361', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"9":{"t":"avencer"},"10":{"t":"avencer"},"11":{"t":"avencer"},"12":{"t":"avencer"}}'::jsonb, NULL),
(30, 'Rafaela Santos Romana', 'Rafaela Santos Romana', 'Selma', '71992745049', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/j9U4eJC9h2/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/qj4kh407PF/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/KCdQ8Xmzf7/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/C0lWf4OkB0/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/tO0mSybr9G/"}}'::jsonb, NULL),
(31, 'Júlia de Oliveira Sales', 'Júlia de Oliveira Sales', 'Jamile de Oliveira', '71981613723', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"pago"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/2KHL7Nb0Hi/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/SQV78fOe9A/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/NjhHhIuzvq"}}'::jsonb, NULL),
(32, 'Rayanne Meneses', 'Rayanne Cerqueira Meneses dos Santos', 'Dayane Aparecida Meneses dos Santos', '71993587897', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"pago"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/N0VSg9qMpW"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/p2lTGxU16B"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/f7UoPBGsEx"}}'::jsonb, NULL),
(33, 'Arthur Fortunato', 'Arthur Fortunato  Bastos', 'Cristiane Fortunato', '71982402636', 700.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/pu9qjV5Lio/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/vuZd5SYC6b/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/vmcjVLpbO3/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/iNloBPMDzr/"}}'::jsonb, NULL),
(34, 'Samuel Santana de Jesus', 'Samuel Santana de Jesus', 'Janderson', '71981443551', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/l8WKyZNjeq"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/E9HTOUHBcM"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/wJldOY9KTB"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/m1nr3TjV31/"}}'::jsonb, NULL),
(35, 'Pérola Sophia de Jesus Alexandre de Souza', 'Pérola Sophia de Jesus Alexandre de Souza', 'Fernando Alexandre de Souza', '71991443734', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/CPXETxXAdq/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/nd20tefdIi/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/2vZO8AO8dw/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/qPxZKCEWdx/"}}'::jsonb, NULL),
(36, 'Agatha', 'Aghatta Meneses de Jesus Santana', 'Viviane', '71989091128', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/rAqBfYm9cC/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/KcplH45POD/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/NPnfEhJEpX/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/q9dVXKSkUx/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/KpuPKS6kUY/"}}'::jsonb, NULL),
(37, 'Emanuelly Moura dos Santos', 'Emanuelly Moura dos Santos', 'Caroline Vale Moura', '71981415457', 360.00, '{"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/bptDMJEO9P"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/LalQiPQnNM"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/4g41xbk3f6"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/CKtGM43bnK"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ltQL91gmmu"}}'::jsonb, NULL),
(38, 'Lunna Victoria', 'Lunna Victoria Reis Sales', 'Islane Tielle Reis Araujo', '71982609309', 330.00, '{"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/QHB8YvTIDh/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/V1Cb8RpNCw/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/mNwmmGC4yY/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/cySjtUTyzq/"}}'::jsonb, NULL),
(39, 'Ludmilla Silva Valadares', 'Ludmilla Silva Valadares', 'Suzana Lemos da Silva', '7184243312', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/pGjqHOVztM"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/pb2wdtm86K"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/kIXIZTNkfW"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/rCMOeifRSc"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/xaNJ9XQJz4"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/C7Fk6K5fk0"}}'::jsonb, NULL),
(40, 'Yan Emanuel Mascarenhas Adorno', 'Yan Emanuel Mascarenhas Adorno', 'Erica Mascarenhas', '71993019523', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/wa39NEkOZL"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/7PauL8WtBn"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/TBGAqwXsB2"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/6iGeYCkAM0"}}'::jsonb, NULL),
(41, 'Rebeca São Leão', 'Rebeca Menezes São Leão', 'Milena São Leão', '2224', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/9IkJnZwkZ0/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/DZH0jVN0mY/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/9muqIV4ngR/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/6rK8WuH1mY/"}}'::jsonb, NULL),
(42, 'Mathias da Hora Cerqueira', 'Mathias da Hora Cerqueira', 'Tamires Santos da Hora', '71982595336', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/obqA5uyZKv"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/1Q6ldIIL7s"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/OkoIZJHmzI"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ezvY45z9Xh"}}'::jsonb, NULL),
(43, 'Yasmin Simas', 'Yasmin Simas de Lima', 'Glaucia Simas', '71985561607', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/E9dCMdNTyK"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/nuuazyxSWl"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/q95i78Vpjo"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/WWE6ap8PGe"}}'::jsonb, NULL),
(44, 'Maria Eloá', 'Maria Eloá Souza santos', 'Lany', '71997150916', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ZVSa8jnzSP"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/VQoiQ1UQEL"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/wAz4pXmOzM"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/yo27SMHx4h"}}'::jsonb, NULL),
(45, 'Julia Maira Anunciação Menezes', 'Julia Maira Anunciação Menezes', 'Margarete Anunciação Menezes', '71992295333', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/QPGRXpAcpM"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/xco9keKeSr"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Chk4mkeRBh"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/0wk5fO1t2j"}}'::jsonb, NULL),
(46, 'Enzo Santana', NULL, 'Janaina Binfim Santana', '7191131434', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"pago"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/dzCEsNasVs/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/xeJckJg6ee/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/xeJckJg6ee/"}}'::jsonb, NULL),
(47, 'Ana Luiza Costa de Assis', 'Ana Luiza Costa de Assis', 'Daisy Batista Costa de Assis', '7193382310', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/LOHClWiNJj/"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/FNwjpBuBUD/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/O3BjtC950Z/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/JkZygo7sfo/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/yvJOSjOeHW/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/9CeD9plJlG/"}}'::jsonb, NULL),
(48, 'Ana Beatriz Bahia', 'Ana Beatriz Bahia dos Anjos', 'Ana Paula Bahia Conceição', '71988464616', 330.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/j8nseoSNv4/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Kn63ZdCK15/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/GZPPVzPCid/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/f4uQZRKQe8/"}}'::jsonb, NULL),
(49, 'Stephany Maria Santos Matos da Silva', 'Stephany Maria Santos Matos da Silva', 'Rosimeire Motta Santos', '71984356592', 350.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Cm2sm60ZJu/"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/QQajj2dxmf/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/J0MoKHOqom/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/jN511spbCr/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/QxclUUtfJR/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/QHba3SsUpY"}}'::jsonb, NULL),
(50, 'Joao Miguel', 'Joao Miguel Soares Brito', 'Muriele', '7192143246', 350.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/hWE0KOGdw4/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ltbtYMTWy0/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/iRRtNrBR6Z/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Cr33jkdAoN/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/oFENXz51s4/"}}'::jsonb, NULL),
(51, 'Israel dos Santos Queiroz', 'Israel dos Santos Queiroz', 'Marta', '71987159363', 350.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/zgSqqayWAD/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/ZljZj20EbK/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/hadp4l4Pw3/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/rhirRJiYtf/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/WeP8KOpafX/"}}'::jsonb, NULL),
(52, 'MARIA AURORA MACHADO DE CARVALHO', 'Maria Aurora Machado Carvalho', 'yasmin Machado', '7187603749', 150.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/yF9h3QhSAu/"},"9":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/vI1aZPwRDN/"},"10":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/oDibwYrmCX/"},"11":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/FhuraRorOT/"},"12":{"t":"link","link":"https://invoice.infinitepay.io/castelodosaber/Pn8aZgesLM/"}}'::jsonb, NULL),
(53, 'Izabella ferreira de matos', 'Izabella  ferreira de matos', 'JAQUELINE ALVES DE MATOS FERREIRA', '71992914825', 300.00, '{"1":{"t":"pago"},"2":{"t":"pago"},"3":{"t":"pago"},"4":{"t":"pago"},"5":{"t":"pago"},"6":{"t":"pago"},"7":{"t":"pago"},"8":{"t":"pago"},"9":{"t":"pago"}}'::jsonb, NULL);

-- PASSO 1: aluno que só existe na planilha
INSERT INTO students (name, status)
SELECT 'Henrique Brito', 'Ativo'
WHERE NOT EXISTS (SELECT 1 FROM students WHERE name = 'Henrique Brito');

WITH novo AS (
  INSERT INTO guardians (name, relationship, phone)
  SELECT 'Gislaine Novais Brito', 'Responsável', '71987506912'
  WHERE NOT EXISTS (SELECT 1 FROM guardians WHERE name = 'Gislaine Novais Brito')
  RETURNING id
)
INSERT INTO student_guardians (student_id, guardian_id, is_primary)
SELECT s.id, novo.id, true
FROM novo, students s
WHERE s.name = 'Henrique Brito';

-- PASSO 2: nome incompleto no cadastro (a planilha tem o nome inteiro)
UPDATE students SET name = 'Rafaela Santos Romana' WHERE name = 'Rafaela';

-- PASSO 3: cada linha precisa casar com exatamente um aluno
DO $$
DECLARE problema text;
BEGIN
  SELECT string_agg(p.nome_sistema, ', ') INTO problema
  FROM planilha p
  WHERE p.nome_sistema IS NOT NULL
    AND (SELECT count(*) FROM students s WHERE s.name = p.nome_sistema) <> 1;
  IF problema IS NOT NULL THEN
    RAISE EXCEPTION 'Nome não casa com exatamente um aluno: %', problema;
  END IF;
END $$;

-- PASSO 4: contratos 2026 (valor da planilha manda; contrato reaberto)
INSERT INTO contracts (student_id, year, monthly_amount, due_day, status, observations)
SELECT s.id, 2026, p.valor, 10, 'Aberto',
       concat_ws(' · ', 'Importado da planilha de cobrança em 07/10/2026', p.observacao)
FROM planilha p
JOIN students s ON s.name = p.nome_sistema
ON CONFLICT (student_id, year) DO UPDATE
  SET monthly_amount = EXCLUDED.monthly_amount,
      status = 'Aberto',
      observations = CASE
        WHEN contracts.observations LIKE '%Importado da planilha%' THEN contracts.observations
        ELSE concat_ws(' · ', contracts.observations, EXCLUDED.observations)
      END;

-- PASSO 5: parcelas dos meses que a planilha cobra
INSERT INTO installments
  (contract_id, student_id, month, year, due_date, amount, status, paid_at,
   payment_link, payment_link_source, observations)
SELECT c.id, s.id, m.mes::int, 2026, make_date(2026, m.mes::int, 10), p.valor,
       CASE WHEN m.info->>'t' = 'pago' THEN 'Pago' ELSE 'A vencer' END,
       CASE WHEN m.info->>'t' = 'pago' THEN make_date(2026, m.mes::int, 10)::timestamptz END,
       m.info->>'link',
       CASE WHEN m.info->>'link' IS NOT NULL THEN 'manual' END,
       CASE WHEN m.info->>'t' = 'pago' THEN 'Pago conforme planilha (data real desconhecida)' END
FROM planilha p
JOIN students s ON s.name = p.nome_sistema
JOIN contracts c ON c.student_id = s.id AND c.year = 2026
CROSS JOIN LATERAL jsonb_each(p.meses) AS m(mes, info)
ON CONFLICT (contract_id, month) DO UPDATE
  SET amount = EXCLUDED.amount,
      -- parcela baixada pelo webhook nunca volta pra aberta
      status = CASE
        WHEN installments.status = 'Pago' AND installments.transaction_nsu IS NOT NULL THEN 'Pago'
        ELSE EXCLUDED.status
      END,
      paid_at = CASE
        WHEN installments.transaction_nsu IS NOT NULL THEN installments.paid_at
        WHEN EXCLUDED.status = 'Pago' THEN COALESCE(installments.paid_at, EXCLUDED.paid_at)
        ELSE NULL
      END,
      -- link gerado pela API tem prioridade sobre o colado na planilha
      payment_link = COALESCE(installments.payment_link, EXCLUDED.payment_link),
      payment_link_source = CASE
        WHEN installments.payment_link IS NOT NULL THEN installments.payment_link_source
        WHEN EXCLUDED.payment_link IS NOT NULL THEN 'manual'
      END,
      observations = CASE
        WHEN EXCLUDED.status = 'Pago' AND installments.status <> 'Pago' THEN EXCLUDED.observations
        ELSE installments.observations
      END;

-- PASSO 6: aluno que entrou no meio do ano → apaga parcelas anteriores ao 1º mês cobrado
DELETE FROM installments i
USING planilha p, students s, contracts c
WHERE s.name = p.nome_sistema
  AND c.student_id = s.id AND c.year = 2026
  AND i.contract_id = c.id
  AND i.status <> 'Pago'
  AND i.transaction_nsu IS NULL
  AND i.month < (SELECT min(k::int) FROM jsonb_object_keys(p.meses) k);

ANALYZE students;
ANALYZE guardians;
ANALYZE student_guardians;
ANALYZE contracts;
ANALYZE installments;

COMMIT;

-- Conferência
SELECT
  (SELECT count(*) FROM contracts WHERE year = 2026 AND status = 'Aberto') AS contratos_abertos_2026,
  (SELECT count(*) FROM installments WHERE year = 2026) AS parcelas_2026,
  (SELECT count(*) FROM installments WHERE year = 2026 AND status = 'Pago') AS pagas,
  (SELECT count(*) FROM installments WHERE year = 2026 AND status <> 'Pago' AND payment_link IS NOT NULL) AS abertas_com_link,
  (SELECT count(*) FROM installments WHERE year = 2026 AND status <> 'Pago' AND payment_link IS NULL) AS abertas_sem_link;
