import { criarLink, paraCentavos } from "./client";
import {
  codigoDoAluno, escolherResponsavel, normalizarWhatsapp,
} from "@/lib/mensalidades/parcelas";
import { MONTHS } from "@/lib/constants";

const LOTE_PARALELO = 5;

/**
 * "Sem link da API": parcela sem link nenhum ou com link colado da planilha.
 * O link manual paga, mas não aponta pro webhook, então precisa ser trocado.
 */
export const FILTRO_SEM_LINK_API = "payment_link.is.null,payment_link_source.eq.manual";

/**
 * URL pública do app. Em preview da Vercel o origin do request seria a URL
 * do preview (protegida), e a InfinitePay não conseguiria chamar o webhook —
 * por isso APP_URL manda.
 */
export function baseUrlPublica(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return new URL(req.url).origin;
}

export function webhookUrl(base) {
  const token = process.env.INFINITEPAY_WEBHOOK_TOKEN;
  return token ? `${base}/api/infinitepay/webhook?t=${encodeURIComponent(token)}` : null;
}

function clienteDoLink(responsavel) {
  if (!responsavel?.name) return undefined;
  const { numero, suspeito } = normalizarWhatsapp(responsavel.phone);
  const cliente = { name: responsavel.name };
  if (numero && !suspeito) cliente.phone_number = `+${numero}`;
  return cliente;
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

/** Parcelas em aberto que ainda precisam de link, por contrato, lista ou ano. */
export async function listarParcelasParaLink(supabase, {
  ano, contractId, installmentIds, limite = 40, somenteSemLink = true, ignorarIds = [],
} = {}) {
  let consulta = supabase
    .from("installments")
    .select("id, month, year, amount, student_id, payment_link, students(id, name)")
    .neq("status", "Pago")
    .order("year")
    .order("month")
    .limit(limite);

  if (contractId) consulta = consulta.eq("contract_id", contractId);
  else if (installmentIds) consulta = consulta.in("id", installmentIds);
  else consulta = consulta.eq("year", ano);
  if (somenteSemLink) consulta = consulta.or(FILTRO_SEM_LINK_API);
  if (ignorarIds.length) consulta = consulta.not("id", "in", `(${ignorarIds.join(",")})`);

  const { data, error } = await consulta;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function contarParcelasSemLinkApi(supabase, ano) {
  const { count, error } = await supabase
    .from("installments")
    .select("id", { count: "exact", head: true })
    .eq("year", ano)
    .neq("status", "Pago")
    .or(FILTRO_SEM_LINK_API);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/**
 * Cria o link de cada parcela na InfinitePay e grava na parcela.
 * `order_nsu` = id da parcela: é assim que o webhook diz qual parcela pagou.
 */
export async function gerarLinksParaParcelas({ supabase, parcelas, baseUrl, criar = criarLink }) {
  const hook = webhookUrl(baseUrl);
  if (!hook) throw new Error("INFINITEPAY_WEBHOOK_TOKEN não configurada");

  const vinculos = await carregarVinculos(supabase, [...new Set(parcelas.map(p => p.student_id))]);
  const falhas = [];
  let gerados = 0;

  async function gerar(p) {
    const descricao = `Mensalidade ${MONTHS[p.month - 1]}/${p.year} - ${p.students?.name || ""}`;
    const { url } = await criar({
      orderNsu: p.id,
      descricao,
      valorCentavos: paraCentavos(p.amount),
      cliente: clienteDoLink(escolherResponsavel(vinculos.get(p.student_id))),
      webhookUrl: hook,
      redirectUrl: `${baseUrl}/mensalidades?a=${codigoDoAluno(p.student_id)}`,
    });
    const { error } = await supabase
      .from("installments")
      .update({
        payment_link: url,
        payment_link_source: "api",
        link_generated_at: new Date().toISOString(),
      })
      .eq("id", p.id);
    if (error) throw new Error(error.message);
  }

  for (let i = 0; i < parcelas.length; i += LOTE_PARALELO) {
    const lote = parcelas.slice(i, i + LOTE_PARALELO);
    const resultados = await Promise.allSettled(lote.map(gerar));
    resultados.forEach((r, j) => {
      if (r.status === "fulfilled") gerados++;
      else falhas.push({ id: lote[j].id, erro: r.reason?.message || "falha" });
    });
  }

  return { gerados, falhas };
}
