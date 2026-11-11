export const APP_NAME = "EscolarApp";
export const SCHOOL_NAME = "Escola Castelo do Saber";
// Razão social — obrigatória nos documentos oficiais (histórico, atestados).
export const SCHOOL_LEGAL_NAME = "Instituto de Educação e Cidadania Castelo do Saber";

export const SHIFTS = ["Matutino", "Vespertino", "Integral"];

// Ano letivo que as telas abrem por padrão (Dashboard, Alunos, Turmas,
// Matrículas). Trocar uma vez por ano, quando abrir as matrículas do próximo.
export const ANO_LETIVO_ATUAL = 2027;
export const ANOS_LETIVOS = [2027, 2026];

// Tipos de matrícula mudaram em 2027 (pedido da escola). Os de 2026 continuam
// valendo nos registros de 2026; formulários de 2027 só oferecem os novos.
export const ENROLLMENT_TYPES_2026 = ["Particular", "Integral", "Fundamental", "Projeto"];
export const ENROLLMENT_TYPES_2027 = ["Projeto", "Infantil", "Jornada Ampliada", "Jornada Regular"];

/** Todos os tipos que existem no banco (filtros e relatórios). */
export const ENROLLMENT_TYPES = [...ENROLLMENT_TYPES_2027, ...ENROLLMENT_TYPES_2026.filter(t => !ENROLLMENT_TYPES_2027.includes(t))];

/** Tipos oferecidos numa matrícula daquele ano letivo. */
export function tiposDeMatricula(ano) {
  return Number(ano) >= 2027 ? ENROLLMENT_TYPES_2027 : ENROLLMENT_TYPES_2026;
}

/** Ano letivo a partir de `?ano=` (padrão: ANO_LETIVO_ATUAL). */
export function anoLetivo(valor) {
  const n = Number(valor);
  return ANOS_LETIVOS.includes(n) ? n : ANO_LETIVO_ATUAL;
}

// Cores semânticas pra badge/filtro. Mantém alinhado com DESIGN_SYSTEM.md
// (bg-color/50, text-color-700, sem ring/gradient).
export const ENROLLMENT_TYPE_STYLES = {
  Particular:  "bg-blue-50 text-blue-700",
  Integral:    "bg-emerald-50 text-emerald-700",
  Fundamental: "bg-violet-50 text-violet-700",
  Projeto:     "bg-amber-50 text-amber-700",
  Infantil:    "bg-rose-50 text-rose-700",
  "Jornada Ampliada": "bg-cyan-50 text-cyan-700",
  "Jornada Regular":  "bg-indigo-50 text-indigo-700",
};

// Cores hex pra Recharts (mesma paleta acima, tons -600/-700).
export const ENROLLMENT_TYPE_COLORS = {
  Particular:  "#2563eb",
  Integral:    "#059669",
  Fundamental: "#7c3aed",
  Projeto:     "#d97706",
  Infantil:    "#e11d48",
  "Jornada Ampliada": "#0891b2",
  "Jornada Regular":  "#4f46e5",
};

export const STUDENT_STATUSES = ["Ativo", "Pendente", "Inativo", "Transferido"];

export const PAYMENT_METHODS = ["Pix", "Dinheiro", "Cartão"];

export const PAYMENT_STATUSES = ["Pago", "Pendente", "Atrasado"];

export const DOCUMENT_TYPES = [
  "Histórico Escolar",
  "Atestado de Matrícula",
  "Atestado de Transferência",
  "Atestado de Pagamento",
  "Atestado de Quitação de Débito",
  "Atestado de Frequência",
  "Atestado de Comparecimento",
];

export const GENDERS = ["Masculino", "Feminino", "Outro"];

export const RELATIONSHIPS = ["Pai", "Mãe", "Responsável", "Avô", "Avó", "Tio", "Tia", "Outro"];

export const UNIT_LABELS = {
  1: "I Unidade",
  2: "II Unidade",
  3: "III Unidade",
  4: "IV Unidade",
};

export const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const EMPLOYEE_ROLES = [
  "Professor",
  "Auxiliar de Ensino",
  "Coordenador Pedagógico",
  "Secretária",
  "Auxiliar Administrativo",
  "Auxiliar de Serviços Gerais",
  "Porteiro",
  "Outro",
];
