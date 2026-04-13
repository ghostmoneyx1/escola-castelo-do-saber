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

// ── Checklist completo (31 perguntas, 5 categorias) ───────────────────────────
export const CHECKLIST = [
  {
    id: "academico",
    label: "Desempenho Acadêmico",
    emoji: "📚",
    color: "blue",
    items: [
      { id: "acad_1", label: "Demonstra compreensão consistente dos conteúdos trabalhados?" },
      { id: "acad_2", label: "Apresenta evolução no processo de aprendizagem ao longo do trimestre?" },
      { id: "acad_3", label: "Consegue interpretar enunciados e realizar atividades com autonomia?" },
      { id: "acad_4", label: "Aplica os conhecimentos adquiridos em novas situações?" },
      { id: "acad_5", label: "Demonstra organização e capricho na execução das tarefas escolares?" },
      { id: "acad_6", label: "Participa ativamente das atividades propostas em sala?" },
    ],
  },
  {
    id: "frequencia",
    label: "Frequência e Pontualidade",
    emoji: "⏰",
    color: "purple",
    items: [
      { id: "freq_1", label: "Mantém frequência regular e assídua nas aulas?" },
      { id: "freq_2", label: "Chega pontualmente para o início das atividades escolares?" },
      { id: "freq_3", label: "Justifica ausências de forma adequada quando necessário?" },
      { id: "freq_4", label: "Demonstra responsabilidade na reposição de conteúdos perdidos?" },
      { id: "freq_5", label: "Evita atrasos recorrentes ou saídas antecipadas?" },
      { id: "freq_6", label: "Mantém constância na presença ao longo de todo o trimestre?" },
    ],
  },
  {
    id: "comportamento",
    label: "Comportamento e Disciplina",
    emoji: "⚖️",
    color: "orange",
    items: [
      { id: "comp_1", label: "Respeita as normas e combinados estabelecidos pela escola?" },
      { id: "comp_2", label: "Mantém comportamento adequado durante as aulas?" },
      { id: "comp_3", label: "Demonstra respeito pelos professores e colegas?" },
      { id: "comp_4", label: "Aceita orientações e correções de forma positiva?" },
      { id: "comp_5", label: "Consegue controlar impulsos e manter postura equilibrada?" },
      { id: "comp_6", label: "Evita atitudes que prejudicam o ambiente de aprendizagem?" },
    ],
  },
  {
    id: "social",
    label: "Desenvolvimento Social",
    emoji: "🤝",
    color: "green",
    items: [
      { id: "soc_1", label: "Relaciona-se de forma respeitosa com os colegas?" },
      { id: "soc_2", label: "Participa de atividades em grupo de maneira colaborativa?" },
      { id: "soc_3", label: "Demonstra empatia e respeito às diferenças?" },
      { id: "soc_4", label: "Consegue resolver conflitos de forma adequada ou com mediação?" },
      { id: "soc_5", label: "Contribui para um ambiente positivo na sala de aula?" },
      { id: "soc_6", label: "Demonstra habilidades de comunicação com colegas e professores?" },
    ],
  },
  {
    id: "autonomia",
    label: "Autonomia e Engajamento",
    emoji: "🌱",
    color: "teal",
    items: [
      { id: "auto_1", label: "Demonstra interesse pelas atividades propostas?" },
      { id: "auto_2", label: "Participa espontaneamente das aulas e discussões?" },
      { id: "auto_3", label: "Assume responsabilidade pelo próprio aprendizado?" },
      { id: "auto_4", label: "Busca ajuda quando encontra dificuldades?" },
      { id: "auto_5", label: "Demonstra iniciativa na realização de tarefas?" },
      { id: "auto_6", label: "Mantém foco e persistência diante de desafios?" },
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
  1: "1º Trimestre", 2: "2º Trimestre", 3: "3º Trimestre", 4: "4º Trimestre",
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
