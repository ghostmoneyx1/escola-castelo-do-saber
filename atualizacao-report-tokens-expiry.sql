-- ============================================================
-- SECURITY FIX: report_tokens — remove policy pública + expiry
-- ============================================================
-- Espelho da migration supabase/migrations/20260526000001_secure_report_tokens.sql
-- mantido no root pra seguir o padrão de SQL files dated do projeto.
--
-- Problema: policy "Public read by token" usava USING (true), permitindo
-- que qualquer cliente com a anon key listasse TODOS os tokens (e fizesse
-- JOIN com nome do aluno). Esta migração:
--   1. Remove a policy permissiva
--   2. Adiciona coluna expires_at (default 30 dias)
--   3. Backfill: tokens antigos recebem expiry retroativa
--
-- Após esta migração, NENHUMA leitura de report_tokens funciona com a anon
-- key. Toda leitura por token DEVE passar pela API route
-- /api/relatorio/[token] que usa SUPABASE_SERVICE_ROLE_KEY.

DROP POLICY IF EXISTS "Public read by token" ON report_tokens;

ALTER TABLE report_tokens
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

UPDATE report_tokens
SET expires_at = created_at + INTERVAL '30 days'
WHERE expires_at IS NULL;

ALTER TABLE report_tokens
  ALTER COLUMN expires_at SET DEFAULT (now() + INTERVAL '30 days'),
  ALTER COLUMN expires_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_report_tokens_expires_at
  ON report_tokens(expires_at);

ANALYZE report_tokens;

-- Verificação:
-- SELECT policyname FROM pg_policies WHERE tablename = 'report_tokens';
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'report_tokens' AND column_name = 'expires_at';
