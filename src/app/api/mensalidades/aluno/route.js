import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { casarAlunoDaPlanilha } from "@/lib/mensalidades/sheet";

export const dynamic = "force-dynamic";

/** Situação financeira de um aluno do Supabase, buscada na planilha por nome. */
export async function GET(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;

  const nome = new URL(req.url).searchParams.get("nome");
  if (!nome) return NextResponse.json({ error: "Informe o nome" }, { status: 400 });

  try {
    const { situacao, aluno, sugestoes } = await casarAlunoDaPlanilha(nome);
    return NextResponse.json(
      {
        situacao,
        aluno: aluno && {
          aluno: aluno.aluno,
          responsavel: aluno.responsavel,
          serie: aluno.serie,
          telefone: aluno.telefone,
          whatsapp: aluno.whatsapp,
          telefoneSuspeito: aluno.telefoneSuspeito,
          codigo: aluno.codigo,
          valorMensal: aluno.valorMensal,
          pendentes: aluno.pendentes,
          total: aluno.total,
          mesesAtrasados: aluno.mesesAtrasados,
        },
        sugestoes: sugestoes.map(s => s.aluno),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("mensalidades/aluno:", e);
    return NextResponse.json({ error: "Planilha indisponível" }, { status: 502 });
  }
}
