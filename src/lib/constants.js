export const APP_NAME = "EscolarApp";
export const SCHOOL_NAME = "Escola Castelo do Saber";

export const SHIFTS = ["Matutino", "Vespertino", "Integral"];

export const ENROLLMENT_TYPES = ["Particular", "Integral", "Fundamental", "Projeto"];

// Cores semânticas pra badge/filtro. Mantém alinhado com DESIGN_SYSTEM.md
// (bg-color/50, text-color-700, sem ring/gradient).
export const ENROLLMENT_TYPE_STYLES = {
  Particular:  "bg-blue-50 text-blue-700",
  Integral:    "bg-emerald-50 text-emerald-700",
  Fundamental: "bg-violet-50 text-violet-700",
  Projeto:     "bg-amber-50 text-amber-700",
};

// Cores hex pra Recharts (mesma paleta acima, tons -600/-700).
export const ENROLLMENT_TYPE_COLORS = {
  Particular:  "#2563eb",
  Integral:    "#059669",
  Fundamental: "#7c3aed",
  Projeto:     "#d97706",
};

export const STUDENT_STATUSES = ["Ativo", "Pendente", "Inativo", "Transferido"];

export const PAYMENT_METHODS = ["Pix", "Dinheiro", "Cartão"];

export const PAYMENT_STATUSES = ["Pago", "Pendente", "Atrasado"];

export const DOCUMENT_TYPES = [
  "Histórico Escolar",
  "Atestado de Matrícula",
  "Atestado de Pagamento",
  "Atestado de Quitação de Débito",
  "Atestado de Frequência",
];

export const GENDERS = ["Masculino", "Feminino", "Outro"];

export const RELATIONSHIPS = ["Pai", "Mãe", "Avô", "Avó", "Tio", "Tia", "Outro"];

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
