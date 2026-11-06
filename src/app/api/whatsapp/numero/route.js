import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { enforceRateLimit } from "@/lib/rate-limit/check";
import { configuracaoOpenwa, resolverChatId } from "@/lib/openwa/client";
import { normalizarNumero } from "@/lib/mensalidades/teste-whatsapp";

export const dynamic = "force-dynamic";

/** Confere se o número tem WhatsApp e com qual id (com ou sem o 9). */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const limite = await enforceRateLimit(req, {
    bucket: "whatsapp_numero", max: 30, windowSec: 600, identifier: guard.user.id,
  });
  if (limite) return limite;

  const cfg = configuracaoOpenwa();
  if (!cfg) return NextResponse.json({ error: "WhatsApp não configurado neste ambiente." }, { status: 503 });

  const { numero: bruto } = await req.json().catch(() => ({}));
  const numero = normalizarNumero(bruto);
  if (!numero) return NextResponse.json({ error: "Número inválido. Use DDD + número." }, { status: 400 });

  try {
    const chatId = await resolverChatId(cfg, numero);
    return NextResponse.json({
      numero,
      temWhatsapp: Boolean(chatId),
      contaWhatsapp: chatId ? chatId.replace(/@.*/, "") : null,
    });
  } catch (e) {
    console.error("whatsapp/numero:", e);
    return NextResponse.json({ error: "Não deu pra conferir o número agora" }, { status: 502 });
  }
}
