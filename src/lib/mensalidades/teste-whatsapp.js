import { hojeNaEscola, montarLembrete, ESTAGIOS } from "./lembretes";

/**
 * Mensagens de teste do painel de WhatsApp. Só modelos fixos: o painel não
 * manda texto livre, pra ninguém transformar o chip da cobrança em disparador
 * (é o tipo de uso que derruba o número).
 */

export const MODELOS_TESTE = ["simples", ...ESTAGIOS];

const AVISO_TESTE = "[TESTE — não é cobrança real]";

/** "71 99999-8888" → "5571999998888"; null se não parece celular brasileiro. */
export function normalizarNumero(bruto) {
  let n = String(bruto || "").replace(/\D/g, "");
  if (n.length === 10 || n.length === 11) n = `55${n}`;
  return /^55\d{10,11}$/.test(n) ? n : null;
}

function vencimentoDoModelo(modelo, hoje) {
  const d = new Date(`${hoje}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + ({ M1: 9, "D-1": 1, D0: 0, "D+3": -3 }[modelo] ?? 0));
  return d.toISOString().slice(0, 10);
}

/** Texto que o teste manda. Os avisos usam o mesmo `montarLembrete` do disparo. */
export function mensagemDeTeste(modelo, { baseUrl, agora = new Date() }) {
  if (modelo === "simples") {
    return `${AVISO_TESTE}\n\nTeste do WhatsApp de cobrança da Escola Castelo do Saber. Se chegou, o número está funcionando.`;
  }
  const hoje = hojeNaEscola(agora);
  const vencimento = vencimentoDoModelo(modelo, hoje);
  const mes = new Date(`${vencimento}T12:00:00Z`).toLocaleDateString("pt-BR", { month: "long", timeZone: "UTC" });
  const link = `${baseUrl}/mensalidades`;
  const texto = montarLembrete(modelo, {
    aluno: "Aluno Exemplo",
    responsavel: "Responsável",
    parcela: { id: `teste-${modelo}`, mes: mes.charAt(0).toUpperCase() + mes.slice(1), valor: 300, vencimento },
    link,
    tudo: modelo === "D+3" ? { meses: 2, total: 600, link } : null,
  });
  return `${AVISO_TESTE}\n\n${texto}`;
}
