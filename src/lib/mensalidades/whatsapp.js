import { SCHOOL_NAME } from "@/lib/constants";

function fmtMoeda(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function primeiroNome(nomeCompleto) {
  return String(nomeCompleto || "").trim().split(/\s+/)[0] || "";
}

/**
 * Mensagem de cobrança pronta pra secretaria só revisar e enviar.
 * Lista cada mês com o link quando existe; quando não existe, cai no link
 * da consulta pública pra ela não prometer o que não tem.
 */
export function montarMensagemCobranca(aluno, { linkConsulta } = {}) {
  const saudacao = aluno.responsavel
    ? `Olá, ${primeiroNome(aluno.responsavel)}!`
    : "Olá!";

  if (!aluno.pendentes.length) {
    return `${saudacao} Passando para confirmar que as mensalidades de ${aluno.aluno} estão todas em dia. Obrigado! — ${SCHOOL_NAME}`;
  }

  const linhas = [
    saudacao,
    "",
    `Segue a situação das mensalidades de *${aluno.aluno}*:`,
    "",
  ];

  for (const p of aluno.pendentes) {
    const valor = p.valor != null ? ` — ${fmtMoeda(p.valor)}` : "";
    linhas.push(`• ${p.mes}${valor} (${p.situacao})`);
    if (p.link) linhas.push(`  ${p.link}`);
  }

  if (aluno.total != null) {
    linhas.push("", `Total em aberto: *${fmtMoeda(aluno.total)}*`);
  }

  const semLink = aluno.pendentes.some(p => !p.link);
  if (semLink && linkConsulta) {
    linhas.push("", `Você também pode consultar e pagar por aqui: ${linkConsulta}`);
  }

  linhas.push("", `Qualquer dúvida é só chamar. — ${SCHOOL_NAME}`);

  return linhas.join("\n");
}

/** URL do WhatsApp Web/app com a mensagem já preenchida. */
export function linkWhatsapp(numero, mensagem) {
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
