import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";

export async function GET(_request, { params }) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const { supabase } = guard;

  const { classId } = await params;

  const [classRes, studentsRes] = await Promise.all([
    supabase
      .from("classes")
      .select("id, name, grade, shift, units(name)")
      .eq("id", classId)
      .single(),
    supabase
      .from("students")
      .select("id, name")
      .eq("class_id", classId)
      .eq("status", "Ativo")
      .order("name"),
  ]);

  if (classRes.error || !classRes.data) {
    return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    class: classRes.data,
    students: studentsRes.data || [],
  });
}
