import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { requireAuth } from "@/lib/auth/require-auth";
import { gerarTokenSchema, parseBody } from "@/lib/validation/schemas";
import { enforceRateLimit } from "@/lib/rate-limit/check";

export async function POST(req) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
  const { user, supabase } = guard;

  const limited = await enforceRateLimit(req, {
    bucket: "gerar_token",
    max: 30,
    windowSec: 60,
    identifier: user.id,
  });
  if (limited) return limited;

  const parsed = await parseBody(req, gerarTokenSchema);
  if (parsed instanceof NextResponse) return parsed;
  const { student_id, quarter, year } = parsed.data;

  const token = randomBytes(24).toString("hex");

  const { data, error } = await supabase
    .from("report_tokens")
    .upsert(
      { token, student_id, quarter, year, used: false, report_id: null },
      { onConflict: "student_id,quarter,year" }
    )
    .select("token, used")
    .single();

  if (error) {
    const { data: existing } = await supabase
      .from("report_tokens")
      .select("token, used")
      .eq("student_id", student_id)
      .eq("quarter", quarter)
      .eq("year", year)
      .maybeSingle();

    if (existing) return NextResponse.json({ token: existing.token, used: existing.used });

    console.error("relatorio/gerar-token:", error);
    return NextResponse.json({ error: "Falha ao gerar link" }, { status: 500 });
  }

  return NextResponse.json({ token: data.token, used: data.used });
}
