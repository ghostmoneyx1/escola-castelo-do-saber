import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import {
  configuracaoOpenwa, dadosSessao, ligarSessao, qrSessao, codigoPareamento,
} from "@/lib/openwa/client";
import { normalizarNumero } from "@/lib/mensalidades/teste-whatsapp";

export const dynamic = "force-dynamic";

const SEM_CONFIG = { error: "WhatsApp não configurado neste ambiente (faltam as variáveis do OpenWA)." };

/** Status da sessão da escola; com QR pendente, devolve o QR junto. */
export async function GET() {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const cfg = configuracaoOpenwa();
  if (!cfg) return NextResponse.json(SEM_CONFIG, { status: 503 });

  try {
    const s = await dadosSessao(cfg);
    const qr = s?.status === "qr_ready" ? await qrSessao(cfg).catch(() => null) : null;
    return NextResponse.json(
      {
        status: s?.status || null,
        telefone: s?.phone || null,
        nome: s?.pushName || null,
        conectadoEm: s?.connectedAt || null,
        ultimoErro: s?.lastError || null,
        qr,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("whatsapp/sessao:", e);
    return NextResponse.json({ error: "Não foi possível falar com o servidor do WhatsApp" }, { status: 502 });
  }
}

/** { acao: "ligar" } liga a sessão (gera QR); { acao: "codigo", numero } pede código de pareamento. */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const cfg = configuracaoOpenwa();
  if (!cfg) return NextResponse.json(SEM_CONFIG, { status: 503 });

  const body = await req.json().catch(() => ({}));
  try {
    if (body.acao === "ligar") {
      await ligarSessao(cfg);
      return NextResponse.json({ ok: true });
    }
    if (body.acao === "codigo") {
      const numero = normalizarNumero(body.numero);
      if (!numero) return NextResponse.json({ error: "Número inválido. Use DDD + número." }, { status: 400 });
      const codigo = await codigoPareamento(cfg, numero);
      if (!codigo) return NextResponse.json({ error: "O servidor não devolveu código. Ligue a sessão antes." }, { status: 502 });
      return NextResponse.json({ codigo });
    }
    return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
  } catch (e) {
    console.error("whatsapp/sessao POST:", e);
    return NextResponse.json({ error: `Falhou: ${e.message}` }, { status: 502 });
  }
}
