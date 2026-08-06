import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAuth } from "@/lib/auth/require-auth";

export const dynamic = "force-dynamic";

/**
 * QR Code (SVG) da consulta pública. Sem `a`, gera o QR do link geral —
 * o que a escola imprime pro mural. Com `a`, o link direto do aluno.
 *
 * Autenticada: quem gera QR é a secretaria, não o responsável.
 */
export async function GET(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;

  const { searchParams, origin } = new URL(req.url);
  const codigo = searchParams.get("a");

  if (codigo && !/^[a-f0-9]{12}$/.test(codigo)) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  const alvo = codigo
    ? `${origin}/mensalidades?a=${codigo}`
    : `${origin}/mensalidades`;

  const svg = await QRCode.toString(alvo, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 480,
  });

  const headers = {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "private, max-age=3600",
  };
  if (searchParams.get("download")) {
    headers["Content-Disposition"] = `attachment; filename="qr-${codigo || "mensalidades"}.svg"`;
  }

  return new NextResponse(svg, { headers });
}
