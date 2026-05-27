-- ============================================
-- ESCOLA CASTELO DO SABER - DATABASE SCHEMA
-- ============================================

-- Unidades escolares (Matriz / Filial)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Turmas (configurável pelo admin)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  shift TEXT NOT NULL CHECK (shift IN ('Matutino', 'Vespertino', 'Integral')),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Alunos
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date DATE,
  cpf TEXT,
  rg TEXT,
  birth_certificate_number TEXT,
  gender TEXT CHECK (gender IN ('Masculino', 'Feminino', 'Outro')),
  birthplace TEXT,
  previous_school TEXT,
  enrollment_type TEXT CHECK (enrollment_type IS NULL OR enrollment_type IN ('Particular', 'Integral', 'Fundamental', 'Projeto')),
  uses_transport BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Pendente', 'Inativo', 'Transferido')),
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Responsáveis
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  cpf TEXT,
  birth_date DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vínculo Aluno <-> Responsável (N:N)
CREATE TABLE student_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  UNIQUE(student_id, guardian_id)
);

-- Disciplinas
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notas / Boletins
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  unit INTEGER NOT NULL CHECK (unit BETWEEN 1 AND 4),
  score NUMERIC(4,1),
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id, unit, year)
);

-- Frequência
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  present BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Mensalidades / Financeiro
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  reference_month INTEGER NOT NULL CHECK (reference_month BETWEEN 1 AND 12),
  reference_year INTEGER NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('Pix', 'Dinheiro', 'Cartão')),
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pago', 'Pendente', 'Atrasado')),
  paid_at TIMESTAMPTZ,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, reference_month, reference_year)
);

-- Documentos gerados
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'Histórico Escolar',
    'Atestado de Matrícula',
    'Atestado de Pagamento',
    'Atestado de Quitação de Débito',
    'Atestado de Frequência'
  )),
  status TEXT NOT NULL DEFAULT 'Emitido' CHECK (status IN ('Emitido', 'Pendente')),
  file_path TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Matrículas (registro histórico)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Cancelada', 'Transferida')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Relatórios trimestrais (boletim descritivo por aluno/trimestre)
CREATE TABLE quarterly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  year INTEGER NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  status_academico TEXT,
  status_frequencia TEXT,
  status_comportamento TEXT,
  status_social TEXT,
  status_autonomia TEXT,
  status_geral TEXT,
  sintese TEXT,
  pontos_fortes TEXT,
  aspectos_desenvolver TEXT,
  encaminhamentos TEXT,
  observations TEXT,
  professor_name TEXT,
  filled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, quarter, year)
);

-- Tokens para preenchimento do relatório pelo professor (acesso sem login)
-- Leitura é feita server-side via SUPABASE_SERVICE_ROLE_KEY na rota
-- /api/relatorio/[token]. Nenhuma policy pública: anon key não lê esta tabela.
CREATE TABLE report_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  year INTEGER NOT NULL,
  used BOOLEAN DEFAULT false,
  report_id UUID REFERENCES quarterly_reports(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, quarter, year)
);

-- Rate limit counters (uma linha por chave "bucket:identifier").
-- Toda escrita passa pela função SQL rate_limit_hit() chamada via service role.
-- RLS habilitada e SEM policies — anon/authenticated não leem nem escrevem.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_unit ON students(unit_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_year ON grades(year);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_documents_student ON documents(student_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_year ON enrollments(year);
CREATE INDEX idx_classes_unit ON classes(unit_id);
CREATE INDEX idx_classes_year ON classes(year);
CREATE INDEX idx_quarterly_reports_student ON quarterly_reports(student_id);
CREATE INDEX idx_quarterly_reports_year_quarter ON quarterly_reports(year, quarter);
CREATE INDEX idx_report_tokens_token ON report_tokens(token);
CREATE INDEX idx_report_tokens_student ON report_tokens(student_id);
CREATE INDEX idx_report_tokens_expires_at ON report_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);

-- ============================================
-- RLS (Row Level Security) - Admin only
-- ============================================
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users have full access (admin-only system)
CREATE POLICY "Full access for authenticated users" ON units FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON classes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON students FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON guardians FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON student_guardians FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON subjects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON grades FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON attendance FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON payments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON documents FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON enrollments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON quarterly_reports FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Full access for authenticated users" ON report_tokens FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA
-- ============================================

-- Unidades
INSERT INTO units (name, address) VALUES
  ('Matriz', 'Boa Vista do Lobato'),
  ('Filial', 'Alto do Cabrito');

-- Disciplinas padrão
INSERT INTO subjects (name, sort_order) VALUES
  ('Português', 1),
  ('Matemática', 2),
  ('Ciências', 3),
  ('História', 4),
  ('Geografia', 5),
  ('Ed. Física', 6),
  ('Artes', 7),
  ('Inglês', 8);

-- ============================================
-- TRIGGER: updated_at automático
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
