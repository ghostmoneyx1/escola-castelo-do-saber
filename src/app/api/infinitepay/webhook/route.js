import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checarPagamento } from "@/lib/infinitepay/client";
import { processarWebhook } from "@/lib/infinitepay/webhook";

export const dynamic = "force-dynamic";

/**
 * O webhook da InfinitePay não traz assinatura. A URL cadastrada em cada
 * link carrega um token nosso (?t=...), que barra quem só descobriu o
 * endereço. A prova de pagamento de verdade é o payment_check feito dentro
 * de processarWebhook.
 */
function tokenConfere(recebido) {
  const esperado = process.env.INFINITEPAY_WEBHOOK_TOKEN;
  if (!esperado || !recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req) {
  if (!tokenConfere(new URL(req.url).searchParams.get("t"))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    console.error("infinitepay/webhook: admin client indisponível:", e.message);
    return NextResponse.json({ error: "Configuração incompleta" }, { status: 500 });
  }

  const { status, resultado } = await processarWebhook({
    corpo,
    supabase,
    checar: checarPagamento,
  });

  return NextResponse.json({ ok: status === 200, resultado }, { status });
}
