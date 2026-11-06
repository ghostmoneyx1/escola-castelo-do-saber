import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { baseUrlPublica } from "@/lib/infinitepay/links";
import { configuracaoOpenwa } from "@/lib/openwa/client";
import { dispararCobranca, RITMO_PADRAO } from "@/lib/mensalidades/disparo-whatsapp";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Rodada de avisos de cobrança (início do mês, D0, D+1, D+2 e D+3) por WhatsApp via OpenWA.
 * Chamada de hora em hora pelo agendador da VPS (9h–17h) e uma vez por dia
 * pelo cron da Vercel; cada chamada manda no máximo WHATSAPP_POR_RODADA
 * mensagens e respeita o teto WHATSAPP_POR_DIA. Só envia de verdade com
 * WHATSAPP_COBRANCA_ATIVA=true; sem isso grava os avisos como "simulado".
 *
 * A Vercel manda `Authorization: Bearer <CRON_SECRET>`; sem isso, 401.
 */
function numeroDaEnv(nome, padrao) {
  const n = Number.parseInt(process.env[nome] || "", 10);
  return Number.isFinite(n) && n >= 0 ? n : padrao;
}

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
      ritmo: {
        ...RITMO_PADRAO,
        porRodada: numeroDaEnv("WHATSAPP_POR_RODADA", RITMO_PADRAO.porRodada),
        porDia: numeroDaEnv("WHATSAPP_POR_DIA", RITMO_PADRAO.porDia),
      },
    });
    if (resumo.erro) console.error("cron/cobranca-whatsapp:", resumo.erro);
    return NextResponse.json(resumo);
  } catch (e) {
    console.error("cron/cobranca-whatsapp:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
