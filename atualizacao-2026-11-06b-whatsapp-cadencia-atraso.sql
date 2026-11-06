-- ============================================================
-- ATUALIZAÇÃO: cadência M1 / D0 / D+1 / D+2 / D+3 na cobrança por WhatsApp
-- Escola Castelo do Saber
-- Gerado em: 06/11/2026 (aprovada pela escola no mesmo dia)
--
-- INSTRUÇÕES: cole no SQL Editor do Supabase e execute. Idempotente.
-- 'D-1' continua aceito: há linhas antigas (simulado) com ele.
-- ============================================================

ALTER TABLE whatsapp_messages DROP CONSTRAINT IF EXISTS whatsapp_messages_stage_check;
ALTER TABLE whatsapp_messages
  ADD CONSTRAINT whatsapp_messages_stage_check
  CHECK (stage IN ('M1', 'D-1', 'D0', 'D+1', 'D+2', 'D+3'));
