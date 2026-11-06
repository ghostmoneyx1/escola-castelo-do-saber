import { createClient } from "@/lib/supabase/server";
import { anoLetivo } from "@/lib/constants";
import TurmasClient from "./turmas-client";

export const dynamic = "force-dynamic";

export default async function TurmasPage({ searchParams }) {
  const ano = anoLetivo(searchParams?.ano);
  const supabase = await createClient();
  const [classesRes, unitsRes, matriculasRes] = await Promise.all([
    supabase.from("classes").select("*").eq("is_active", true).eq("year", ano).order("grade"),
    supabase.from("units").select("*"),
    supabase.from("enrollments").select("class_id, students(status)").eq("year", ano).eq("status", "Ativa"),
  ]);

  const studentCounts = {};
  (matriculasRes.data || []).forEach((m) => {
    if (m.class_id && m.students?.status === "Ativo") studentCounts[m.class_id] = (studentCounts[m.class_id] || 0) + 1;
  });

  return (
    <TurmasClient
      key={ano}
      ano={ano}
      initialClasses={classesRes.data || []}
      units={unitsRes.data || []}
      studentCounts={studentCounts}
    />
  );
}
