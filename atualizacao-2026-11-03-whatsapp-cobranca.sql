-- ============================================================
-- ATUALIZAÇÃO: Cobrança automática por WhatsApp (OpenWA)
-- Escola Castelo do Saber
-- Gerado em: 03/11/2026
--
-- INSTRUÇÕES:
-- 1. Cole este script no SQL Editor do Supabase e execute.
-- Idempotente: pode rodar mais de uma vez sem estragar nada.
-- ============================================================

-- Uma linha por aviso de cobrança (parcela × estágio D-1 / D0 / D+3).
-- O cron grava antes de mandar pro OpenWA: é o que impede o mesmo aviso
-- de sair duas vezes e o rastro quando um pai diz "não recebi".
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_id UUID NOT NULL REFERENCES installments(id) ON DELETE CASCADE,
  student_id     UUID REFERENCES students(id) ON DELETE SET NULL,
  stage          TEXT NOT NULL CHECK (stage IN ('D-1', 'D0', 'D+3')),
  phone          TEXT,
  body           TEXT NOT NULL,
  -- simulado: interruptor desligado, só registra o que sairia
  -- na_fila:  entregue ao OpenWA, aguardando o lote terminar
  -- pulado:   sem telefone confiável, não sai
  status         TEXT NOT NULL CHECK (status IN ('simulado', 'na_fila', 'enviado', 'falhou', 'pulado')),
  error          TEXT,
  batch_id       TEXT,
  batch_index    INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at        TIMESTAMPTZ
);

-- Simulação e falha não contam: ligar o envio ou rodar de novo depois de
-- uma queda não pode esbarrar num aviso que nunca chegou ao pai.
CREATE UNIQUE INDEX IF NOT EXISTS whatsapp_messages_once_idx
  ON whatsapp_messages (installment_id, stage)
  WHERE status IN ('na_fila', 'enviado', 'pulado');

CREATE INDEX IF NOT EXISTS whatsapp_messages_student_idx
  ON whatsapp_messages (student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS whatsapp_messages_batch_idx
  ON whatsapp_messages (batch_id) WHERE status = 'na_fila';

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Só leitura pra quem está logado. Quem escreve é o cron, com service role.
DROP POLICY IF EXISTS "Authenticated read on whatsapp_messages" ON whatsapp_messages;
CREATE POLICY "Authenticated read on whatsapp_messages"
  ON whatsapp_messages FOR SELECT TO authenticated USING (true);

ANALYZE whatsapp_messages;
