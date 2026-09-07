-- 2026-09-06 — Atestado de Transferência como tipo de documento emitido
-- documents.type tem CHECK fechado; sem isto o PDF baixa mas o registro não salva.

ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_type_check;

ALTER TABLE documents ADD CONSTRAINT documents_type_check CHECK (type IN (
  'Histórico Escolar',
  'Atestado de Matrícula',
  'Atestado de Transferência',
  'Atestado de Pagamento',
  'Atestado de Quitação de Débito',
  'Atestado de Frequência'
));
