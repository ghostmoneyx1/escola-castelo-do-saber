import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const body = await request.json();
  const { class_id, date, attendance } = body;

  if (!class_id || !date || !attendance) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Delete existing records for this class+date, then re-insert (same logic do painel)
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, total: records.length });
}
