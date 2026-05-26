import { createClient } from "@/lib/supabase/server";
import AlunosClient from "./alunos-client";

export const dynamic = "force-dynamic";

export default async function AlunosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("*, classes(name, grade), units(name)")
    .order("name");

  return <AlunosClient initialStudents={data || []} />;
}
