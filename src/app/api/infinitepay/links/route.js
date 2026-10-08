import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { gerarLinksSchema, parseBody } from "@/lib/validation/schemas";
import { criarLink } from "@/lib/infinitepay/client";
import {
  baseUrlPublica, webhookUrl, listarParcelasParaLink,
  gerarLinksParaParcelas, contarParcelasSemLinkApi,
} from "@/lib/infinitepay/links";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET ?teste=1 — gera um link de R$ 1,00 apontando pro nosso webhook.
 * Serve pra provar o caminho inteiro (link → pagamento → webhook) sem
 * mexer em parcela de aluno. O webhook registra como "teste_recebido".
 */
export async function GET(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;

  const base = baseUrlPublica(req);
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
 * O cron diário (/api/cron/links) faz o mesmo sem ninguém clicar.
 */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const { supabase } = guard;

  const parsed = await parseBody(req, gerarLinksSchema);
  if (parsed instanceof NextResponse) return parsed;
  const { contractId, installmentIds, ano, limite, somenteSemLink } = parsed.data;

  try {
    const parcelas = await listarParcelasParaLink(supabase, {
      ano, contractId, installmentIds, limite, somenteSemLink,
    });
    const { gerados, falhas, limiteAtingido } = await gerarLinksParaParcelas({
      supabase, parcelas, baseUrl: baseUrlPublica(req),
    });
    const restantes =
      !contractId && !installmentIds ? await contarParcelasSemLinkApi(supabase, ano) : 0;
    if (limiteAtingido) {
      falhas.push({ id: null, erro: "InfinitePay limitou as requisições; o cron diário termina o resto" });
    }

    return NextResponse.json({ gerados, falhas, restantes, limiteAtingido });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
