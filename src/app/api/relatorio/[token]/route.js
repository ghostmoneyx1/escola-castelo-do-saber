import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { tokenParamSchema } from "@/lib/validation/schemas";

/**
 * Endpoint público gated por token opaco.
 * Substitui a leitura direta do browser que dependia de
 * `Public read by token USING (true)` (vulnerabilidade — agora removida).
 */
export async function GET(_request, { params }) {
  const { token } = await params;

  const tokenCheck = tokenParamSchema.safeParse(token);
  if (!tokenCheck.success) {
    return NextResponse.json({ error: "Link inválido" }, { status: 404 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("report_tokens")
    .select(
      "id, token, student_id, quarter, year, used, expires_at, students(name, classes(name, grade, shift), units(name))"
    )
    .eq("token", tokenCheck.data)
    .maybeSingle();

  if (error) {
    console.error("relatorio/[token] read:", error);
    return NextResponse.json({ error: "Erro ao validar link" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Link inválido" }, { status: 404 });
  }

  if (data.used) {
    return NextResponse.json({ error: "Este relatório já foi preenchido" }, { status: 409 });
  }

  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Link expirado" }, { status: 410 });
  }

  return NextResponse.json({
    token: data.token,
    quarter: data.quarter,
    year: data.year,
    students: data.students,
  });
}
