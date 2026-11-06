import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { enforceRateLimit } from "@/lib/rate-limit/check";
import { configuracaoOpenwa, resolverChatId, enviarTexto } from "@/lib/openwa/client";
import { baseUrlPublica } from "@/lib/infinitepay/links";
import { MODELOS_TESTE, mensagemDeTeste, normalizarNumero } from "@/lib/mensalidades/teste-whatsapp";

export const dynamic = "force-dynamic";

/** Manda uma mensagem de teste (modelo fixo) pelo chip da cobrança. */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  // Teto baixo de propósito: é o mesmo chip que manda os avisos de verdade.
  const limite = await enforceRateLimit(req, {
    bucket: "whatsapp_teste", max: 10, windowSec: 3600, identifier: guard.user.id,
  });
  if (limite) return limite;

  const cfg = configuracaoOpenwa();
  if (!cfg) return NextResponse.json({ error: "WhatsApp não configurado neste ambiente." }, { status: 503 });

  const { numero: bruto, modelo = "simples" } = await req.json().catch(() => ({}));
  const numero = normalizarNumero(bruto);
  if (!numero) return NextResponse.json({ error: "Número inválido. Use DDD + número." }, { status: 400 });
  if (!MODELOS_TESTE.includes(modelo)) return NextResponse.json({ error: "Modelo inválido" }, { status: 400 });

  try {
    const chatId = await resolverChatId(cfg, numero);
    if (!chatId) return NextResponse.json({ error: "Esse número não tem WhatsApp." }, { status: 404 });
    const texto = mensagemDeTeste(modelo, { baseUrl: baseUrlPublica(req) });
    await enviarTexto(cfg, { chatId, texto });
    console.info(`whatsapp/teste: ${modelo} para ${numero} por ${guard.user.email}`);
    return NextResponse.json({ ok: true, texto });
  } catch (e) {
    console.error("whatsapp/teste:", e);
    return NextResponse.json({ error: `Não foi possível enviar: ${e.message}` }, { status: 502 });
  }
}
