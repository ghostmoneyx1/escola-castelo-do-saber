import { NextResponse } from "next/server";
import { consultaMensalidadesSchema, parseBody } from "@/lib/validation/schemas";
import { enforceRateLimit } from "@/lib/rate-limit/check";
import { buscarMensalidades, buscarPorCodigo } from "@/lib/mensalidades/sheet";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const limited = await enforceRateLimit(req, {
    bucket: "mensalidades_consulta",
    max: 20,
    windowSec: 300,
  });
  if (limited) return limited;

  const parsed = await parseBody(req, consultaMensalidadesSchema);
  if (parsed instanceof NextResponse) return parsed;
  const { nome, tel, codigo } = parsed.data;

  try {
    const resultados = codigo
      ? await buscarPorCodigo(codigo)
      : await buscarMensalidades(nome, tel);
    return NextResponse.json(
      { encontrado: resultados.length > 0, resultados },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("mensalidades/consulta:", e);
    return NextResponse.json(
      { error: "Não foi possível consultar agora. Tente novamente em alguns instantes." },
      { status: 502 }
    );
  }
}
