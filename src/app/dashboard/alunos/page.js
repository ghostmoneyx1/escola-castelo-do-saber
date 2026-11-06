import { createClient } from "@/lib/supabase/server";
import { anoLetivo } from "@/lib/constants";
import AlunosClient from "./alunos-client";

export const dynamic = "force-dynamic";

/**
 * Lista do ano letivo: quem tem matrícula naquele ano, com a turma e o tipo
 * daquela matrícula. Ninguém é apagado; quem não está no ano só aparece na
 * busca ("em outros anos"), pra ser rematriculado.
 */
export default async function AlunosPage({ searchParams }) {
  const ano = anoLetivo(searchParams?.ano);
  const supabase = await createClient();
  const [matriculasRes, todosRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("status, enrollment_type, class_id, classes(name, grade), students(*, units(name))")
      .eq("year", ano),
    supabase.from("students").select("id, name, status").order("name"),
  ]);

  // Matrícula cancelada/transferida não some se for a única do ano; a ativa ganha.
  const porAluno = new Map();
  for (const m of matriculasRes.data || []) {
    if (!m.students) continue;
    const atual = porAluno.get(m.students.id);
    if (atual && atual.status === "Ativa") continue;
    porAluno.set(m.students.id, m);
  }
  const alunos = [...porAluno.values()]
    .map(m => ({
      ...m.students,
      class_id: m.class_id,
      classes: m.classes,
      enrollment_type: m.enrollment_type,
      matricula: m.status,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const outros = (todosRes.data || []).filter(s => !porAluno.has(s.id));

  return <AlunosClient key={ano} ano={ano} initialStudents={alunos} outrosAnos={outros} />;
}
