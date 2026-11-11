// LDB art. 24, VI: aprovação exige frequência mínima de 75% das horas letivas.
export const FREQUENCIA_MINIMA = 75;

// Percentual com uma casa decimal; null quando não houve chamada no período.
export function percentualFrequencia(presencas, dias) {
  if (!dias) return null;
  return Math.round((presencas / dias) * 1000) / 10;
}

export function formatPercentual(valor) {
  if (valor === null || valor === undefined) return "—";
  return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

export function abaixoDoMinimo(valor) {
  return valor !== null && valor !== undefined && valor < FREQUENCIA_MINIMA;
}

// Dias com chamada = linhas de attendance do aluno no período (uma por data,
// garantido pelo UNIQUE (student_id, date)).
export function resumirAluno(registros) {
  const dias = registros.length;
  const presencas = registros.filter((r) => r.present).length;
  return {
    dias,
    presencas,
    faltas: dias - presencas,
    percentual: percentualFrequencia(presencas, dias),
  };
}

// Junta os alunos da turma com os registros do período. Aluno sem nenhuma
// chamada aparece com percentual null; quem saiu da turma mas tem registro
// no período continua na lista (o nome vem do join students(name)).
export function montarRelatorioTurma(alunos, registros) {
  const porAluno = new Map();
  for (const aluno of alunos) porAluno.set(aluno.id, { id: aluno.id, name: aluno.name, registros: [] });
  for (const r of registros) {
    if (!porAluno.has(r.student_id)) {
      porAluno.set(r.student_id, { id: r.student_id, name: r.students?.name || "—", registros: [] });
    }
    porAluno.get(r.student_id).registros.push(r);
  }

  const linhas = [...porAluno.values()]
    .map(({ registros: regs, ...aluno }) => ({ ...aluno, ...resumirAluno(regs) }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const diasLetivos = new Set(registros.map((r) => r.date)).size;
  const presencas = linhas.reduce((t, l) => t + l.presencas, 0);
  const registrosTotais = linhas.reduce((t, l) => t + l.dias, 0);

  return {
    linhas,
    diasLetivos,
    percentualTurma: percentualFrequencia(presencas, registrosTotais),
    abaixoDoMinimo: linhas.filter((l) => abaixoDoMinimo(l.percentual)).length,
  };
}
