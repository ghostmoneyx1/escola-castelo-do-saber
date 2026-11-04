import { SCHOOL_NAME } from "@/lib/constants";

/**
 * Regras puras da cobrança automática por WhatsApp: em que dia cada aviso
 * sai e o que ele diz. O disparo em si fica em `disparo-whatsapp.js`.
 */

export const ESTAGIOS = ["D-1", "D0", "D+3"];

// Dias entre o envio e o vencimento: D-1 sai na véspera, D+3 três dias depois.
const DESLOCAMENTO = { "D-1": 1, D0: 0, "D+3": -3 };

const FUSO = "America/Bahia";

/** Data de hoje em Salvador, "AAAA-MM-DD" (o servidor da Vercel roda em UTC). */
export function hojeNaEscola(agora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(agora);
}

function somarDias(dataIso, dias) {
  const d = new Date(`${dataIso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Vencimento que cada estágio procura hoje: { "D-1": "2026-11-10", ... }. */
export function vencimentosDoDia(hoje) {
  return Object.fromEntries(ESTAGIOS.map(e => [e, somarDias(hoje, DESLOCAMENTO[e])]));
}

/** Estágio de uma parcela hoje, ou null se ela não recebe aviso hoje. */
export function estagioDaParcela(vencimento, hoje) {
  if (!vencimento) return null;
  const alvo = vencimentosDoDia(hoje);
  return ESTAGIOS.find(e => alvo[e] === String(vencimento).slice(0, 10)) || null;
}

function primeiroNome(nome) {
  return String(nome || "").trim().split(/\s+/)[0] || "";
}

function fmtMoeda(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtData(iso) {
  const [, m, d] = String(iso).slice(0, 10).split("-");
  return `${d}/${m}`;
}

// Escolha estável por parcela: o mesmo aviso sempre sai igual, mas avisos de
// alunos diferentes variam — mensagens idênticas em série é o padrão de spam.
function variante(opcoes, chave) {
  let h = 0;
  for (const c of String(chave)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return opcoes[h % opcoes.length];
}

/**
 * Texto do aviso. `parcela` vem de `montarAluno` (mes, valor, vencimento, link);
 * `link` é o link curto da parcela. `tudo` ({ meses, total, link }) entra
 * quando há mais de uma mensalidade em aberto: um segundo link que paga
 * todas de uma vez.
 */
export function montarLembrete(estagio, { aluno, responsavel, parcela, link, tudo }) {
  const nome = primeiroNome(responsavel);
  const ola = variante(nome ? [`Olá, ${nome}!`, `Oi, ${nome}, tudo bem?`, `Bom dia, ${nome}!`] : ["Olá!", "Oi, tudo bem?"], parcela.id);
  const valor = parcela.valor != null ? ` (${fmtMoeda(parcela.valor)})` : "";
  const ref = `a mensalidade de *${aluno}* de ${parcela.mes}${valor}`;

  const corpo = {
    "D-1": `Passando para lembrar que ${ref} vence amanhã, ${fmtData(parcela.vencimento)}.`,
    D0: `Lembrete: ${ref} vence hoje, ${fmtData(parcela.vencimento)}.`,
    "D+3": `${ref.charAt(0).toUpperCase()}${ref.slice(1)}, vencida em ${fmtData(parcela.vencimento)}, ainda consta em aberto no nosso sistema.`,
  }[estagio];

  const linhas = [ola, "", corpo, "", "Para pagar por Pix ou cartão:", link, ""];
  if (tudo) {
    linhas.push(`Se preferir, pague as ${tudo.meses} mensalidades em aberto de uma vez (${fmtMoeda(tudo.total)}):`, tudo.link, "");
  }
  linhas.push(
    estagio === "D+3"
      ? "Se já pagou na secretaria, pode desconsiderar. Qualquer dúvida, fale com a secretaria."
      : "Se já pagou, pode desconsiderar."
  );
  linhas.push(`— ${SCHOOL_NAME}`);
  return linhas.join("\n");
}
