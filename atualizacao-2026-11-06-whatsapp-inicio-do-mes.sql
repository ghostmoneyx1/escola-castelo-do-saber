-- ============================================================
-- ATUALIZAÇÃO: aviso de início de mês (M1) na cobrança por WhatsApp
-- Escola Castelo do Saber
-- Gerado em: 06/11/2026
--
-- INSTRUÇÕES:
-- 1. Cole este script no SQL Editor do Supabase e execute.
-- 2. Rode antes de 01/12/2026: é o primeiro dia com aviso M1, e sem
--    isto o cron falha ao gravar.
-- Idempotente: pode rodar mais de uma vez sem estragar nada.
-- ============================================================

-- Cadência passa a ser: dia 1 do mês (M1), véspera (D-1), dia (D0) e
-- 3 dias de atraso (D+3).
ALTER TABLE whatsapp_messages DROP CONSTRAINT IF EXISTS whatsapp_messages_stage_check;
ALTER TABLE whatsapp_messages
  ADD CONSTRAINT whatsapp_messages_stage_check CHECK (stage IN ('M1', 'D-1', 'D0', 'D+3'));
