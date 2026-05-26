import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { chamadaSubmitSchema, parseBody } from "@/lib/validation/schemas";

export async function POST(request) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const { supabase } = guard;

  const parsed = await parseBody(request, chamadaSubmitSchema);
  if (parsed instanceof NextResponse) return parsed;
  const { class_id, date, attendance } = parsed.data;

  await supabase
    .from("attendance")
    .delete()
    .eq("class_id", class_id)
    .eq("date", date);

  const records = Object.entries(attendance).map(([student_id, present]) => ({
    student_id,
    class_id,
    date,
    present: Boolean(present),
  }));

  if (records.length > 0) {
    const { error } = await supabase.from("attendance").insert(records);
    if (error) {
      console.error("chamada/submit insert:", error);
      return NextResponse.json({ error: "Falha ao salvar chamada" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, total: records.length });
}
