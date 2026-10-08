import { createHmac } from "node:crypto";
import { MONTHS } from "@/lib/constants";

/** Remove acento e caixa pra comparar nome digitado com o cadastro. */
export function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function somenteDigitos(texto) {
  return String(texto || "").replace(/\D/g, "");
}

/**
 * Telefone do cadastro -> número E.164 pro wa.me.
 * Parte dos números está no formato antigo, sem o 9 de celular
 * ("71 8344-5644"). Insere o 9 e marca como suspeito pra secretaria conferir
 * antes de mandar mensagem.
 */
export function normalizarWhatsapp(bruto) {
  let d = somenteDigitos(bruto);
  if (d.startsWith("55") && d.length > 11) d = d.slice(2);

  if (d.length === 11) return { numero: `55${d}`, suspeito: false };
  if (d.length === 10) return { numero: `55${d.slice(0, 2)}9${d.slice(2)}`, suspeito: true };
  return { numero: null, suspeito: true };
}

/**
 * Código curto e estável de um aluno, usado no link direto
 * (/mensalidades?a=<codigo>). HMAC do id pra não ser adivinhável — quem não
 * recebeu o link da escola não consegue montar um.
 */
export function codigoDoAluno(studentId) {
  const segredo = process.env.MENSALIDADES_LINK_SECRET || "";
  return createHmac("sha256", segredo)
    .update(String(studentId))
    .digest("hex")
    .slice(0, 12);
}

function inicioDoDia(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** "Pago" | "Em atraso" | "A vencer", a partir do status e do vencimento. */
export function situacaoParcela(parcela, hoje = new Date()) {
  if (parcela.status === "Pago") return "Pago";
  const vencimento = new Date(`${parcela.due_date}T00:00:00`);
  return vencimento < inicioDoDia(hoje) ? "Em atraso" : "A vencer";
}

/** Responsável principal; se ele não tiver telefone, o primeiro que tiver. */
export function escolherResponsavel(vinculos = []) {
  const ordenados = [...vinculos].sort(
    (a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))
  );
  const comTelefone = ordenados.find(v => somenteDigitos(v.guardians?.phone).length >= 10);
  return (comTelefone || ordenados[0])?.guardians || null;
}

/**
 * Visão de cobrança de um aluno: o que está em aberto, com link quando
 * existe, mais o telefone do responsável pro WhatsApp.
 */
export function montarAluno({ student, contrato, responsavel, telefones = [], parcelas }, hoje = new Date()) {
  const { numero: whatsapp, suspeito: telefoneSuspeito } = normalizarWhatsapp(responsavel?.phone);

  const pendentes = parcelas
    .filter(p => p.status !== "Pago")
    .sort((a, b) => a.month - b.month)
    .map(p => ({
      id: p.id,
      mes: MONTHS[p.month - 1],
      mesNumero: p.month,
      ano: p.year,
      vencimento: p.due_date,
      valor: p.amount == null ? null : Number(p.amount),
      link: p.payment_link || null,
      linkSource: p.payment_link ? p.payment_link_source || null : null,
      situacao: situacaoParcela(p, hoje),
    }));

  const total = pendentes.reduce((soma, p) => soma + (p.valor || 0), 0);

  return {
    id: student.id,
    aluno: student.name,
    responsavel: responsavel?.name || null,
    serie: student.classes?.grade || student.classes?.name || null,
    telefone: responsavel?.phone || null,
    whatsapp,
    telefoneSuspeito,
    telefones,
    codigo: codigoDoAluno(student.id),
    valorMensal: contrato?.monthly_amount == null ? null : Number(contrato.monthly_amount),
    pendentes,
    total: total || null,
    mesesAtrasados: pendentes.filter(p => p.situacao === "Em atraso").length,
    parcelasSemLink: pendentes.filter(p => !p.link).length,
    // Link colado da planilha paga, mas não avisa o webhook: conta como pendente de API.
    parcelasSemLinkApi: pendentes.filter(p => !p.link || p.linkSource === "manual").length,
  };
}

/** Formato devolvido pela rota pública — sem telefone, código nem ids. */
export function paraResponsavel(aluno) {
  return {
    aluno: aluno.aluno,
    responsavel: aluno.responsavel,
    serie: aluno.serie,
    pendentes: aluno.pendentes.map(({ id: _id, linkSource: _src, ...p }) => p),
    total: aluno.total,
  };
}
