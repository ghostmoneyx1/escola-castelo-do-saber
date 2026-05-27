// ── Boletim Infantil — Sistema de Semáforo ────────────────────────────────────
// Avaliação semestral para alunos da Educação Infantil (Grupos 01–05).

export const NIVEIS = [
  { value: "verde",    label: "Excelente Desenvolvimento", short: "Excelente",         hex: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { value: "amarelo",  label: "Em Desenvolvimento",        short: "Em Desenvolvimento", hex: "#ca8a04", bg: "#fefce8", border: "#fde68a" },
  { value: "vermelho", label: "Necessita Maior Atenção",   short: "Necessita Atenção",  hex: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
];

export const NIVEL_MAP = NIVEIS.reduce((acc, n) => { acc[n.value] = n; return acc; }, {});

export const AREAS = [
  {
    id: "portugues",
    label: "Português",
    emoji: "📖",
    items: [
      { id: "port_1", label: "Participa das atividades de linguagem oral" },
      { id: "port_2", label: "Demonstra interesse por histórias e livros" },
      { id: "port_3", label: "Reconhece letras e símbolos trabalhados" },
    ],
  },
  {
    id: "matematica",
    label: "Matemática",
    emoji: "🔢",
    items: [
      { id: "mat_1", label: "Reconhece números trabalhados em sala" },
      { id: "mat_2", label: "Participa de atividades matemáticas" },
      { id: "mat_3", label: "Demonstra noções de quantidade e comparação" },
    ],
  },
  {
    id: "educacao_fisica",
    label: "Educação Física",
    emoji: "⚽",
    items: [
      { id: "edfis_1", label: "Participa das atividades corporais" },
      { id: "edfis_2", label: "Demonstra coordenação motora adequada" },
      { id: "edfis_3", label: "Respeita os colegas durante as brincadeiras" },
    ],
  },
  {
    id: "natureza_sociedade",
    label: "Natureza e Sociedade",
    emoji: "🌱",
    items: [
      { id: "nat_1", label: "Demonstra curiosidade sobre o ambiente" },
      { id: "nat_2", label: "Participa das atividades coletivas" },
      { id: "nat_3", label: "Desenvolve hábitos de cuidado e organização" },
    ],
  },
  {
    id: "capoeira",
    label: "Capoeira",
    emoji: "🥁",
    items: [
      { id: "capo_1", label: "Participa das rodas e atividades" },
      { id: "capo_2", label: "Demonstra coordenação nos movimentos" },
      { id: "capo_3", label: "Interage de forma positiva com os colegas" },
    ],
  },
  {
    id: "socioemocional",
    label: "Desenvolvimento Socioemocional",
    emoji: "🌟",
    items: [
      { id: "socio_1", label: "Demonstra autonomia nas atividades" },
      { id: "socio_2", label: "Compartilha materiais e brinquedos" },
      { id: "socio_3", label: "Respeita combinados da turma" },
      { id: "socio_4", label: "Expressa emoções de forma adequada" },
      { id: "socio_5", label: "Interage positivamente com colegas" },
    ],
  },
];

export const SEMESTER_LABELS = {
  1: "1º Semestre",
  2: "2º Semestre",
};

export function isInfantil(grade) {
  if (!grade) return false;
  return /grupo\s*\d/i.test(grade);
}

export function getAllCriteriaIds() {
  return AREAS.flatMap(area => area.items.map(item => item.id));
}
