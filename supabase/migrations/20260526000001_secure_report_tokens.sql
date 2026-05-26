-- ============================================================
-- SECURITY FIX: report_tokens — remover policy pública e adicionar expiry
-- ============================================================
-- Problema: a policy "Public read by token" usava USING (true), o que
-- permitia que qualquer cliente com a anon key listasse TODOS os tokens
-- (incluindo nome do aluno via JOIN). Migração:
--   1. Remove a policy permissiva
--   2. Adiciona coluna expires_at (default 7 dias)
--   3. Backfill: tokens novos a partir de agora têm expiry; tokens antigos
--      ficam com expiry retroativa de 30 dias após created_at (já expirados
--      se forem mais antigos que isso).
-- Após esta migração, NENHUMA leitura de report_tokens funciona com a anon
-- key. Toda leitura por token DEVE passar pela API route
-- /api/relatorio/[token] que usa SUPABASE_SERVICE_ROLE_KEY.

DROP POLICY IF EXISTS "Public read by token" ON report_tokens;

ALTER TABLE report_tokens
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Backfill: tokens existentes expiram 30 dias após criação
UPDATE report_tokens
SET expires_at = created_at + INTERVAL '30 days'
WHERE expires_at IS NULL;

-- Default pra inserts futuros: 30 dias a partir de agora
ALTER TABLE report_tokens
  ALTER COLUMN expires_at SET DEFAULT (now() + INTERVAL '30 days'),
  ALTER COLUMN expires_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_report_tokens_expires_at
  ON report_tokens(expires_at);

ANALYZE report_tokens;
