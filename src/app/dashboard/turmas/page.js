import { createClient } from "@/lib/supabase/server";
import TurmasClient from "./turmas-client";

export const dynamic = "force-dynamic";

export default async function TurmasPage() {
  const supabase = await createClient();
  const [classesRes, unitsRes, studentsRes] = await Promise.all([
    supabase.from("classes").select("*").eq("is_active", true).order("grade"),
    supabase.from("units").select("*"),
    supabase.from("students").select("class_id").eq("status", "Ativo"),
  ]);

  const studentCounts = {};
  (studentsRes.data || []).forEach((s) => {
    if (s.class_id) studentCounts[s.class_id] = (studentCounts[s.class_id] || 0) + 1;
  });

  return (
    <TurmasClient
      initialClasses={classesRes.data || []}
      units={unitsRes.data || []}
      studentCounts={studentCounts}
    />
  );
}
