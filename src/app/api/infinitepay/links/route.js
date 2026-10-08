import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { gerarLinksSchema, parseBody } from "@/lib/validation/schemas";
import { criarLink, paraCentavos } from "@/lib/infinitepay/client";
import {
  codigoDoAluno, escolherResponsavel, normalizarWhatsapp,
} from "@/lib/mensalidades/parcelas";
import { MONTHS } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LOTE_PARALELO = 5;

/**
 * URL pública do app. Em preview da Vercel o origin do request seria a URL
 * do preview (protegida), e a InfinitePay não conseguiria chamar o webhook —
 * por isso APP_URL manda.
 */
function baseUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return new URL(req.url).origin;
}

function webhookUrl(base) {
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

/**
 * GET ?teste=1 — gera um link de R$ 1,00 apontando pro nosso webhook.
 * Serve pra provar o caminho inteiro (link → pagamento → webhook) sem
 * mexer em parcela de aluno. O webhook registra como "teste_recebido".
 */
export async function GET(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;

  const base = baseUrl(req);
  const hook = webhookUrl(base);
  if (!hook) {
    return NextResponse.json({ error: "INFINITEPAY_WEBHOOK_TOKEN não configurada" }, { status: 500 });
  }

  try {
    const { url } = await criarLink({
      orderNsu: `teste-${Date.now()}`,
      descricao: "Teste de integração do sistema (pode ignorar)",
      valorCentavos: 100,
      webhookUrl: hook,
    });
    return NextResponse.json({ url, webhook: hook.replace(/t=.*$/, "t=***") });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}

/**
 * POST — gera links de pagamento pra parcelas em aberto.
 * Aceita um contrato, uma lista de parcelas, ou "todas sem link do ano"
 * em lotes (o painel chama repetidamente até `restantes` zerar).
 */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const { supabase } = guard;

  const parsed = await parseBody(req, gerarLinksSchema);
  if (parsed instanceof NextResponse) return parsed;
  const { contractId, installmentIds, ano, limite, somenteSemLink } = parsed.data;

  const base = baseUrl(req);
  const hook = webhookUrl(base);
  if (!hook) {
    return NextResponse.json({ error: "INFINITEPAY_WEBHOOK_TOKEN não configurada" }, { status: 500 });
  }

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
  // Link colado da planilha paga, mas não aponta pro webhook: entra na fila também.
  if (somenteSemLink) consulta = consulta.or("payment_link.is.null,payment_link_source.eq.manual");

  const { data: parcelas, error } = await consulta;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let vinculos;
  try {
    vinculos = await carregarVinculos(supabase, [...new Set(parcelas.map(p => p.student_id))]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  const falhas = [];
  let gerados = 0;

  async function gerar(p) {
    const descricao = `Mensalidade ${MONTHS[p.month - 1]}/${p.year} - ${p.students?.name || ""}`;
    const { url } = await criarLink({
      orderNsu: p.id,
      descricao,
      valorCentavos: paraCentavos(p.amount),
      cliente: clienteDoLink(escolherResponsavel(vinculos.get(p.student_id))),
      webhookUrl: hook,
      redirectUrl: `${base}/mensalidades?a=${codigoDoAluno(p.student_id)}`,
    });
    const { error: erroUpdate } = await supabase
      .from("installments")
      .update({
        payment_link: url,
        payment_link_source: "api",
        link_generated_at: new Date().toISOString(),
      })
      .eq("id", p.id);
    if (erroUpdate) throw new Error(erroUpdate.message);
  }

  for (let i = 0; i < parcelas.length; i += LOTE_PARALELO) {
    const lote = parcelas.slice(i, i + LOTE_PARALELO);
    const resultados = await Promise.allSettled(lote.map(gerar));
    resultados.forEach((r, j) => {
      if (r.status === "fulfilled") gerados++;
      else falhas.push({ id: lote[j].id, erro: r.reason?.message || "falha" });
    });
  }

  let restantes = 0;
  if (!contractId && !installmentIds) {
    const { count } = await supabase
      .from("installments")
      .select("id", { count: "exact", head: true })
      .eq("year", ano)
      .neq("status", "Pago")
      .or("payment_link.is.null,payment_link_source.eq.manual");
    restantes = count ?? 0;
  }

  return NextResponse.json({ gerados, falhas, restantes });
}
