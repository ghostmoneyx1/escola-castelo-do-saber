// ── Escala de respostas ───────────────────────────────────────────────────────
export const RESPOSTAS = [
  { value: "sempre",        label: "Sempre",        points: 4, color: "bg-emerald-500 text-white border-emerald-500" },
  { value: "frequentemente",label: "Frequentemente", points: 3, color: "bg-blue-500 text-white border-blue-500" },
  { value: "as_vezes",      label: "Às Vezes",       points: 2, color: "bg-amber-400 text-white border-amber-400" },
  { value: "raramente",     label: "Raramente",      points: 1, color: "bg-orange-500 text-white border-orange-500" },
  { value: "nao_observado", label: "Não Observado",  points: null, color: "bg-slate-400 text-white border-slate-400" },
];

export const RESPOSTA_LABELS = {
  sempre:         { label: "Sempre",         bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  frequentemente: { label: "Frequentemente", bg: "bg-blue-50 border-blue-200",       text: "text-blue-700" },
  as_vezes:       { label: "Às Vezes",       bg: "bg-amber-50 border-amber-200",     text: "text-amber-700" },
  raramente:      { label: "Raramente",      bg: "bg-orange-50 border-orange-200",   text: "text-orange-700" },
  nao_observado:  { label: "Não Observado",  bg: "bg-slate-50 border-slate-200",     text: "text-slate-500" },
};

// ── Checklist completo (30 perguntas, 5 categorias) ───────────────────────────
export const CHECKLIST = [
  {
    id: "academico",
    label: "Aprendizagem e Evolução Acadêmica",
    emoji: "📘",
    color: "blue",
    items: [
      { id: "acad_1", label: "Comparando ao semestre anterior, demonstra maior compreensão dos conteúdos trabalhados?" },
      { id: "acad_2", label: "Apresenta evolução na realização das atividades com autonomia?" },
      { id: "acad_3", label: "Demonstra avanço na interpretação de enunciados e resolução de tarefas?" },
      { id: "acad_4", label: "Comparando ao relatório anterior, mostra maior interesse pelas aulas?" },
      { id: "acad_5", label: "Evoluiu na organização e capricho das atividades escolares?" },
      { id: "acad_6", label: "Demonstra mais segurança ao aplicar conhecimentos em novas situações?" },
    ],
  },
  {
    id: "autonomia",
    label: "Evolução no Processo de Aprendizagem",
    emoji: "📈",
    color: "teal",
    items: [
      { id: "auto_1", label: "Comparando ao semestre anterior, apresentou progresso significativo na aprendizagem?" },
      { id: "auto_2", label: "Demonstra maior participação nas atividades pedagógicas?" },
      { id: "auto_3", label: "Evoluiu na capacidade de manter atenção e concentração durante as aulas?" },
      { id: "auto_4", label: "Apresenta maior facilidade em acompanhar a rotina escolar?" },
      { id: "auto_5", label: "Demonstra evolução na realização das tarefas dentro do prazo?" },
      { id: "auto_6", label: "Comparando ao relatório anterior, apresenta maior comprometimento acadêmico?" },
    ],
  },
  {
    id: "frequencia",
    label: "Frequência, Compromisso e Responsabilidade",
    emoji: "⏰",
    color: "purple",
    items: [
      { id: "freq_1", label: "Comparando ao semestre anterior, melhorou sua frequência escolar?" },
      { id: "freq_2", label: "Demonstra maior pontualidade no início das atividades?" },
      { id: "freq_3", label: "Evoluiu na responsabilidade com materiais e tarefas escolares?" },
      { id: "freq_4", label: "Mantém maior regularidade na entrega das atividades propostas?" },
      { id: "freq_5", label: "Demonstra mais compromisso em recuperar conteúdos pendentes?" },
      { id: "freq_6", label: "Comparando ao relatório anterior, apresenta mais constância na rotina escolar?" },
    ],
  },
  {
    id: "comportamento",
    label: "Comportamento e Desenvolvimento Emocional",
    emoji: "⚖️",
    color: "orange",
    items: [
      { id: "comp_1", label: "Comparando ao semestre anterior, demonstra melhora no comportamento em sala?" },
      { id: "comp_2", label: "Evoluiu no respeito às regras e combinados da escola?" },
      { id: "comp_3", label: "Demonstra maior equilíbrio emocional diante de desafios e frustrações?" },
      { id: "comp_4", label: "Apresenta evolução na aceitação de orientações e correções?" },
      { id: "comp_5", label: "Comparando ao relatório anterior, demonstra mais autocontrole nas interações?" },
      { id: "comp_6", label: "Evoluiu na postura e convivência durante as aulas?" },
    ],
  },
  {
    id: "social",
    label: "Desenvolvimento Social e Relacionamento",
    emoji: "🤝",
    color: "green",
    items: [
      { id: "soc_1", label: "Comparando ao semestre anterior, melhorou a convivência com colegas?" },
      { id: "soc_2", label: "Demonstra maior colaboração em atividades em grupo?" },
      { id: "soc_3", label: "Evoluiu na capacidade de resolver conflitos de forma respeitosa?" },
      { id: "soc_4", label: "Demonstra mais empatia e respeito às diferenças?" },
      { id: "soc_5", label: "Comparando ao relatório anterior, participa de forma mais positiva da turma?" },
      { id: "soc_6", label: "Apresenta evolução na comunicação com colegas e professores?" },
    ],
  },
];

export const COLOR_STYLES = {
  blue:   { header: "bg-blue-50 border-blue-100",     icon: "text-blue-600",   title: "text-blue-800",   ring: "ring-blue-200" },
  purple: { header: "bg-violet-50 border-violet-100", icon: "text-violet-600", title: "text-violet-800", ring: "ring-violet-200" },
  orange: { header: "bg-orange-50 border-orange-100", icon: "text-orange-600", title: "text-orange-800", ring: "ring-orange-200" },
  green:  { header: "bg-emerald-50 border-emerald-100", icon: "text-emerald-600", title: "text-emerald-800", ring: "ring-emerald-200" },
  teal:   { header: "bg-teal-50 border-teal-100",     icon: "text-teal-600",   title: "text-teal-800",   ring: "ring-teal-200" },
};

export const QUARTER_LABELS = {
  1: "1º Semestre", 2: "2º Semestre",
};

// ── Cálculo de status por categoria ──────────────────────────────────────────
export function calcStatus(categoryId, responses) {
  const cat = CHECKLIST.find(c => c.id === categoryId);
  if (!cat) return null;
  const observed = cat.items.filter(item => responses[item.id] && responses[item.id] !== "nao_observado");
  if (observed.length === 0) return null;
  const maxPoints = observed.length * 4;
  const scored = observed.reduce((acc, item) => {
    const resp = RESPOSTAS.find(r => r.value === responses[item.id]);
    return acc + (resp?.points ?? 0);
  }, 0);
  const pct = (scored / maxPoints) * 100;
  if (pct >= 70) return "verde";
  if (pct >= 40) return "amarelo";
  return "vermelho";
}

export function calcOverall(responses) {
  const statuses = CHECKLIST.map(cat => calcStatus(cat.id, responses)).filter(Boolean);
  if (statuses.length === 0) return null;
  const counts = { verde: 0, amarelo: 0, vermelho: 0 };
  statuses.forEach(s => counts[s]++);
  if (counts.vermelho >= 2) return "vermelho";
  if (counts.vermelho >= 1 || counts.amarelo >= 2) return "amarelo";
  if (counts.verde === statuses.length) return "verde";
  return "amarelo";
}

export const STATUS_MAP = {
  verde:    { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Bom desempenho" },
  amarelo:  { dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",       label: "Atenção necessária" },
  vermelho: { dot: "bg-red-500",     badge: "bg-red-50 text-red-700 border-red-200",             label: "Intervenção urgente" },
};
