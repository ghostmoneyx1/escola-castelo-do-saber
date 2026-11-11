-- 11/11/2026 — Atestado de Comparecimento (pedido da Jessica)
-- Novo tipo de documento + coluna com os dados digitados na emissão
-- (quem compareceu, data, horário, motivo), pra baixar o mesmo PDF depois.

ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_type_check;
ALTER TABLE documents ADD CONSTRAINT documents_type_check CHECK (type IN (
  'Histórico Escolar',
  'Atestado de Matrícula',
  'Atestado de Transferência',
  'Atestado de Pagamento',
  'Atestado de Quitação de Débito',
  'Atestado de Frequência',
  'Atestado de Comparecimento'
));

ALTER TABLE documents ADD COLUMN IF NOT EXISTS details JSONB;
