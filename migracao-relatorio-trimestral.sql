-- ============================================================
-- MIGRAÇÃO: Novo sistema de relatórios trimestrais
-- Escola Castelo do Saber
-- ============================================================

-- 1. Adicionar novas colunas na tabela quarterly_reports
ALTER TABLE quarterly_reports
  ADD COLUMN IF NOT EXISTS status_autonomia TEXT,
  ADD COLUMN IF NOT EXISTS sintese TEXT,
  ADD COLUMN IF NOT EXISTS pontos_fortes TEXT,
  ADD COLUMN IF NOT EXISTS aspectos_desenvolver TEXT,
  ADD COLUMN IF NOT EXISTS encaminhamentos TEXT,
  ADD COLUMN IF NOT EXISTS professor_name TEXT,
  ADD COLUMN IF NOT EXISTS filled_at TIMESTAMPTZ;

-- 2. Criar tabela de tokens para links do professor
CREATE TABLE IF NOT EXISTS report_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  year INTEGER NOT NULL,
  used BOOLEAN DEFAULT false,
  report_id UUID REFERENCES quarterly_reports(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, quarter, year)
);

-- 3. RLS
ALTER TABLE report_tokens ENABLE ROW LEVEL SECURITY;

-- Acesso autenticado (admin)
CREATE POLICY "Full access for authenticated users" ON report_tokens
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Acesso público para leitura por token (professor sem login)
CREATE POLICY "Public read by token" ON report_tokens
  FOR SELECT USING (true);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_report_tokens_token ON report_tokens(token);
CREATE INDEX IF NOT EXISTS idx_report_tokens_student ON report_tokens(student_id);
