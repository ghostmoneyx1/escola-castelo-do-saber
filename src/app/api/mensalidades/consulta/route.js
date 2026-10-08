import { NextResponse } from "next/server";
import { consultaMensalidadesSchema, parseBody } from "@/lib/validation/schemas";
import { enforceRateLimit } from "@/lib/rate-limit/check";
import { createAdminClient } from "@/lib/supabase/admin";
import { buscarMensalidades, buscarPorCodigo } from "@/lib/mensalidades/consultas";

export const dynamic = "force-dynamic";

/**
 * Consulta pública do responsável. Não tem sessão, então lê o banco com
 * service role — e por isso devolve só o recorte de `paraResponsavel`
 * (sem telefone, código ou ids).
 */
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
    const supabase = createAdminClient();
    const resultados = codigo
      ? await buscarPorCodigo(supabase, codigo)
      : await buscarMensalidades(supabase, nome, tel);
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
