import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request, { params }) {
  const { classId } = await params;

  const supabase = createAdminClient();

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
