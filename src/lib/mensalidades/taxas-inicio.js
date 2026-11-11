// Pagamentos de início do ano letivo (fora das mensalidades), um por item
// por aluno/ano em enrollment_fees. Sem linha no banco = Pendente pelo valor
// padrão; a linha nasce quando a secretaria marca Pago/Dispensado ou muda o valor.

export const STATUS_TAXA = ["Pendente", "Pago", "Dispensado"];

export const TAXAS_INICIO = [
  { key: "uniforme", label: "Uniforme", valor: { Infantil: 150, Fundamental: 150 } },
  { key: "material", label: "Taxa de material", valor: { Infantil: 200, Fundamental: 200 } },
  { key: "experiencia", label: "Pacote experiência", valor: { Infantil: 250, Fundamental: 250 } },
  { key: "livro_matricula", label: "Livro + matrícula (janeiro)", valor: { Infantil: 250, Fundamental: 350 } },
];

// "Grupo 01–05" é Educação Infantil; "1º–5º Ano" é Fundamental. O tipo de
// matrícula não serve: em 2027 não existe tipo "Fundamental".
export function nivelDaTurma(grade) {
  if (!grade) return null;
  if (/grupo\s*\d/i.test(grade)) return "Infantil";
  if (/\d\s*[ºo°]\s*ano/i.test(grade) || /fundamental/i.test(grade)) return "Fundamental";
  return null;
}

// Sem turma não dá pra saber o nível: o livro fica sem valor sugerido
// em vez de chutar um dos dois.
export function valorPadrao(key, nivel) {
  const taxa = TAXAS_INICIO.find((t) => t.key === key);
  if (!taxa) return null;
  if (nivel) return taxa.valor[nivel];
  return taxa.valor.Infantil === taxa.valor.Fundamental ? taxa.valor.Infantil : null;
}

export function montarLinhas(matriculas, registros) {
  const porAluno = new Map();
  for (const r of registros) {
    if (!porAluno.has(r.student_id)) porAluno.set(r.student_id, {});
    porAluno.get(r.student_id)[r.item] = r;
  }

  return matriculas
    .filter((m) => m.students)
    .map((m) => {
      const nivel = nivelDaTurma(m.classes?.grade);
      const salvos = porAluno.get(m.student_id) || {};
      const itens = {};
      for (const t of TAXAS_INICIO) {
        const r = salvos[t.key];
        itens[t.key] = r
          ? { ...r, amount: r.amount === null ? null : Number(r.amount) }
          : { item: t.key, status: "Pendente", amount: valorPadrao(t.key, nivel) };
      }
      const pendente = Object.values(itens)
        .filter((i) => i.status === "Pendente")
        .reduce((total, i) => total + (i.amount || 0), 0);
      return {
        studentId: m.student_id,
        name: m.students.name,
        classId: m.class_id,
        turma: m.classes ? `${m.classes.grade} - ${m.classes.name}` : "Sem turma",
        tipo: m.enrollment_type,
        nivel,
        itens,
        pendente,
        temPendencia: Object.values(itens).some((i) => i.status === "Pendente"),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function totaisPorItem(linhas) {
  return TAXAS_INICIO.map((t) => {
    const itens = linhas.map((l) => l.itens[t.key]);
    const pagos = itens.filter((i) => i.status === "Pago");
    const pendentes = itens.filter((i) => i.status === "Pendente");
    return {
      key: t.key,
      label: t.label,
      pagos: pagos.length,
      recebido: pagos.reduce((s, i) => s + (i.amount || 0), 0),
      pendentes: pendentes.length,
      aReceber: pendentes.reduce((s, i) => s + (i.amount || 0), 0),
    };
  });
}
