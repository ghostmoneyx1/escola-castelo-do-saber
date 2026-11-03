import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { baseUrlPublica } from "@/lib/infinitepay/links";
import { configuracaoOpenwa } from "@/lib/openwa/client";
import { dispararCobranca } from "@/lib/mensalidades/disparo-whatsapp";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Cron diário (vercel.json, 12:00 UTC = 9h em Salvador): avisos de cobrança
 * D-1, D0 e D+3 por WhatsApp via OpenWA. Só envia de verdade com
 * WHATSAPP_COBRANCA_ATIVA=true; sem isso grava os avisos como "simulado".
 *
 * A Vercel manda `Authorization: Bearer <CRON_SECRET>`; sem isso, 401.
 */
function autorizado(req) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo) return false;
  const recebido = Buffer.from(req.headers.get("authorization") || "");
  const esperado = Buffer.from(`Bearer ${segredo}`);
  return recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
}

export async function GET(req) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const resumo = await dispararCobranca({
      supabase: createAdminClient(),
      cfg: configuracaoOpenwa(),
      ativo: process.env.WHATSAPP_COBRANCA_ATIVA === "true",
      baseUrl: baseUrlPublica(req),
    });
    if (resumo.erro) console.error("cron/cobranca-whatsapp:", resumo.erro);
    return NextResponse.json(resumo);
  } catch (e) {
    console.error("cron/cobranca-whatsapp:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
