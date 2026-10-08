import {
  montarAluno, paraResponsavel, normalizar, somenteDigitos, escolherResponsavel,
} from "./parcelas";

/**
 * Consultas de cobrança em cima de contracts/installments.
 * Recebem o client do Supabase de quem chama: sessão (secretaria) ou
 * service role (rotas públicas, que não têm sessão e precisam passar a RLS).
 */

const SELECT_PARCELAS = [
  "id, student_id, contract_id, month, year, due_date, amount, status, paid_at",
  "payment_link, payment_link_source, payment_method",
  "contracts!inner(id, monthly_amount, due_day, status)",
  "students!inner(id, name, status, classes(name, grade))",
].join(", ");

export function anoAtual() {
  return new Date().getFullYear();
}

async function carregarVinculos(supabase, studentIds) {
  const porAluno = new Map();
  if (!studentIds.length) return porAluno;

  const { data, error } = await supabase
    .from("student_guardians")
    .select("student_id, is_primary, guardians(name, phone)")
    .in("student_id", studentIds);
  if (error) throw new Error(error.message);

  for (const v of data || []) {
    if (!porAluno.has(v.student_id)) porAluno.set(v.student_id, []);
    porAluno.get(v.student_id).push(v);
  }
  return porAluno;
}

function agrupar(parcelas, vinculos, hoje) {
  const grupos = new Map();
  for (const p of parcelas) {
    if (!grupos.has(p.student_id)) {
      grupos.set(p.student_id, { student: p.students, contrato: p.contracts, parcelas: [] });
    }
    grupos.get(p.student_id).parcelas.push(p);
  }

  return [...grupos.values()].map(g => {
    const vinculosDoAluno = vinculos.get(g.student.id) || [];
    return montarAluno(
      {
        ...g,
        responsavel: escolherResponsavel(vinculosDoAluno),
        telefones: vinculosDoAluno
          .map(v => somenteDigitos(v.guardians?.phone))
          .filter(t => t.length >= 8),
      },
      hoje
    );
  });
}

/** Alunos com contrato aberto no ano, já com responsável e parcelas. */
export async function carregarAlunos(supabase, { ano = anoAtual(), studentId, hoje } = {}) {
  let consulta = supabase
    .from("installments")
    .select(SELECT_PARCELAS)
    .eq("year", ano)
    .eq("contracts.status", "Aberto")
    .order("month");
  if (studentId) consulta = consulta.eq("student_id", studentId);

  const { data, error } = await consulta;
  if (error) throw new Error(error.message);

  const ids = [...new Set((data || []).map(p => p.student_id))];
  const vinculos = await carregarVinculos(supabase, ids);
  return agrupar(data || [], vinculos, hoje);
}

/**
 * Visão da secretaria: todo mundo com contrato + agregados de inadimplência.
 * Inclui telefone e código, por isso só pode ser usada em rota autenticada.
 */
export async function obterCobranca(supabase, { ano = anoAtual() } = {}) {
  const alunos = (await carregarAlunos(supabase, { ano })).sort(
    (a, b) =>
      b.mesesAtrasados - a.mesesAtrasados ||
      (b.total || 0) - (a.total || 0) ||
      a.aluno.localeCompare(b.aluno, "pt-BR")
  );

  const soma = filtro =>
    alunos.reduce(
      (t, a) => t + a.pendentes.filter(filtro).reduce((s, p) => s + (p.valor || 0), 0),
      0
    );

  return {
    ano,
    alunos,
    resumo: {
      totalAlunos: alunos.length,
      emDia: alunos.filter(a => a.pendentes.length === 0).length,
      comAtraso: alunos.filter(a => a.mesesAtrasados > 0).length,
      semTelefoneConfiavel: alunos.filter(a => a.telefoneSuspeito).length,
      parcelasSemLink: alunos.reduce((t, a) => t + a.parcelasSemLink, 0),
      parcelasSemLinkApi: alunos.reduce((t, a) => t + a.parcelasSemLinkApi, 0),
      totalAtrasado: soma(p => p.situacao === "Em atraso"),
      totalAVencer: soma(p => p.situacao === "A vencer"),
    },
  };
}

/**
 * Busca pública: nome parcial da criança + 4 últimos dígitos do telefone de
 * qualquer responsável vinculado.
 */
export async function buscarMensalidades(supabase, nome, tel4, opts = {}) {
  const alvo = normalizar(nome);
  const alunos = await carregarAlunos(supabase, opts);
  return alunos
    .filter(a => normalizar(a.aluno).includes(alvo) && a.telefones.some(t => t.endsWith(tel4)))
    .map(paraResponsavel);
}

/** Link direto que a escola manda pronto: /mensalidades?a=<codigo>. */
export async function buscarPorCodigo(supabase, codigo, opts = {}) {
  const alunos = await carregarAlunos(supabase, opts);
  return alunos.filter(a => a.codigo === codigo).map(paraResponsavel);
}

/** Ficha do aluno: null quando ele não tem contrato aberto no ano. */
export async function situacaoDoAluno(supabase, studentId, opts = {}) {
  const [aluno] = await carregarAlunos(supabase, { ...opts, studentId });
  return aluno || null;
}
