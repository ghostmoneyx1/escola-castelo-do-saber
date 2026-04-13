import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req) {
  try {
    const { student_id, quarter, year } = await req.json();

    if (!student_id || !quarter || !year) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const supabase = await createClient();
    const token = randomBytes(24).toString("hex");

    // Upsert: se já existe token para esse aluno/trimestre/ano, substitui
    const { data, error } = await supabase
      .from("report_tokens")
      .upsert(
        { token, student_id, quarter: Number(quarter), year: Number(year), used: false, report_id: null },
        { onConflict: "student_id,quarter,year" }
      )
      .select()
      .single();

    if (error) {
      // Se conflito, busca o token existente
      const { data: existing } = await supabase
        .from("report_tokens")
        .select("token, used")
        .eq("student_id", student_id)
        .eq("quarter", quarter)
        .eq("year", year)
        .single();
      if (existing) return NextResponse.json({ token: existing.token, used: existing.used });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ token: data.token, used: data.used });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
