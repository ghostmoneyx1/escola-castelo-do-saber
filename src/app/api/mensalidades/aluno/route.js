import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { situacaoDoAluno } from "@/lib/mensalidades/consultas";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Situação financeira de um aluno (contrato aberto do ano corrente). */
export async function GET(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const { supabase } = guard;

  const id = new URL(req.url).searchParams.get("id");
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Informe o id do aluno" }, { status: 400 });
  }

  try {
    const aluno = await situacaoDoAluno(supabase, id);
    return NextResponse.json(
      { aluno: aluno && { ...aluno, telefones: undefined } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("mensalidades/aluno:", e);
    return NextResponse.json({ error: "Não foi possível carregar a situação financeira" }, { status: 502 });
  }
}
