import { SCHOOL_NAME } from "@/lib/constants";

/**
 * Regras puras da cobrança automática por WhatsApp: em que dia cada aviso
 * sai e o que ele diz. O disparo em si fica em `disparo-whatsapp.js`.
 */

// M1: aviso de início de mês (dia 1 do mês do vencimento); os outros têm
// data fixa em relação ao vencimento.
export const ESTAGIOS = ["M1", "D-1", "D0", "D+3"];
const ESTAGIOS_FIXOS = ["D-1", "D0", "D+3"];

// Dias entre o envio e o vencimento: D-1 sai na véspera, D+3 três dias depois.
const DESLOCAMENTO = { "D-1": 1, D0: 0, "D+3": -3 };

// O M1 sai no dia 1, mas com o teto diário de mensagens nem todo mundo cabe
// num dia só: quem sobrou recebe nos dias seguintes, até o dia 5 e nunca a
// menos de 3 dias do vencimento (aí o D-1 já cuida).
const M1_ULTIMO_DIA = 5;
const M1_FOLGA_MINIMA = 3;

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
  return Object.fromEntries(ESTAGIOS_FIXOS.map(e => [e, somarDias(hoje, DESLOCAMENTO[e])]));
}

/** Estágio de uma parcela hoje, ou null se ela não recebe aviso hoje. */
export function estagioDaParcela(vencimento, hoje) {
  if (!vencimento) return null;
  const venc = String(vencimento).slice(0, 10);
  const alvo = vencimentosDoDia(hoje);
  const fixo = ESTAGIOS_FIXOS.find(e => alvo[e] === venc);
  if (fixo) return fixo;

  const mesmoMes = venc.slice(0, 7) === hoje.slice(0, 7);
  const diaHoje = Number(hoje.slice(8, 10));
  if (mesmoMes && diaHoje <= M1_ULTIMO_DIA && somarDias(hoje, M1_FOLGA_MINIMA) <= venc) return "M1";
  return null;
}

/** Link curto da parcela: /p/<codigo>-<mês>. O da InfinitePay tem ~470 caracteres. */
export function linkDaParcela(codigo, mesNumero, baseUrl = "") {
  return `${baseUrl}/p/${codigo}-${mesNumero}`;
}

/** Link curto pra consulta do aluno com as mensalidades devidas já marcadas. */
export function linkPagarTudo(codigo, baseUrl = "") {
  return `${baseUrl}/p/${codigo}-tudo`;
}

/** `link` e `tudo` do aviso de uma parcela, no formato de `montarLembrete`. */
export function linksDoAviso(aluno, parcela, baseUrl) {
  return {
    link: linkDaParcela(aluno.codigo, parcela.mesNumero, baseUrl),
    tudo: aluno.pagarTudo
      ? { meses: aluno.pagarTudo.meses, total: aluno.pagarTudo.total, link: linkPagarTudo(aluno.codigo, baseUrl) }
      : null,
  };
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
    M1: `Começou ${parcela.mes.toLowerCase()}! ${ref.charAt(0).toUpperCase()}${ref.slice(1)} vence no dia ${fmtData(parcela.vencimento)}. Se preferir, já dá para adiantar o pagamento.`,
    "D-1": `Passando para lembrar que ${ref} vence amanhã, ${fmtData(parcela.vencimento)}.`,
    D0: `Lembrete: ${ref} vence hoje, ${fmtData(parcela.vencimento)}.`,
    // Só no "Cobrar" manual: a vencer, mas sem ser véspera nem dia.
    lembrete: `Passando para lembrar que ${ref} vence no dia ${fmtData(parcela.vencimento)}.`,
    "D+3": `${ref.charAt(0).toUpperCase()}${ref.slice(1)}, vencida em ${fmtData(parcela.vencimento)}, ainda consta em aberto no nosso sistema.`,
  }[estagio];

  const linhas = [ola, "", corpo, "", "Para pagar por Pix ou cartão:", link, ""];
  if (tudo) {
    linhas.push(`Há ${tudo.meses} mensalidades em aberto (${fmtMoeda(tudo.total)}). Para ver todas e pagar de uma vez:`, tudo.link, "");
  }
  linhas.push(
    estagio === "D+3"
      ? "Se já pagou na secretaria, pode desconsiderar. Qualquer dúvida, fale com a secretaria."
      : "Se já pagou, pode desconsiderar."
  );
  linhas.push(`— ${SCHOOL_NAME}`);
  return linhas.join("\n");
}

/**
 * Mensagem do botão "Cobrar" (secretaria manda pelo próprio WhatsApp): o
 * mesmo texto e os mesmos links curtos do aviso automático, escolhendo pela
 * parcela que mais importa — a atrasada mais antiga, senão a próxima a vencer.
 */
export function montarCobrancaManual(aluno, { baseUrl, hoje = hojeNaEscola() }) {
  if (!aluno.pendentes.length) {
    const nome = primeiroNome(aluno.responsavel);
    return `${nome ? `Olá, ${nome}!` : "Olá!"} Passando para confirmar que as mensalidades de *${aluno.aluno}* estão todas em dia. Obrigado!\n— ${SCHOOL_NAME}`;
  }
  const parcela = aluno.pendentes.find(p => p.situacao === "Em atraso") || aluno.pendentes[0];
  const venc = String(parcela.vencimento).slice(0, 10);
  const estagio =
    venc < hoje ? "D+3" : venc === hoje ? "D0" : venc === somarDias(hoje, 1) ? "D-1" : "lembrete";
  return montarLembrete(estagio, {
    aluno: aluno.aluno,
    responsavel: aluno.responsavel,
    parcela,
    ...linksDoAviso(aluno, parcela, baseUrl),
  });
}
