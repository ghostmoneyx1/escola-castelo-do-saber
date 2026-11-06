/**
 * Virada do ano letivo. Matrícula de um ano que ainda não começou fica só na
 * tabela `enrollments` (o cadastro do aluno guarda a turma "de agora", usada
 * na chamada, boletim e documentos). Quando o ano começa, esta função copia
 * turma, unidade e tipo da matrícula ativa pro cadastro. Idempotente: roda
 * todo dia no cron e só mexe em quem está diferente.
 *
 * Só de 2027 em diante: em 2026 o cadastro é a fonte (há matrículas antigas
 * desatualizadas que não devem sobrescrever o cadastro).
 */
export const PRIMEIRO_ANO_SINCRONIZADO = 2027;

export async function sincronizarTurmaAtual(supabase, ano) {
  if (ano < PRIMEIRO_ANO_SINCRONIZADO) return { atualizados: 0 };

  const { data, error } = await supabase
    .from("enrollments")
    .select("student_id, class_id, enrollment_type, classes(unit_id), students(class_id, unit_id, enrollment_type)")
    .eq("year", ano)
    .eq("status", "Ativa");
  if (error) throw new Error(error.message);

  let atualizados = 0;
  for (const m of data || []) {
    const s = m.students;
    if (!s) continue;
    const patch = {
      class_id: m.class_id,
      unit_id: m.classes?.unit_id ?? s.unit_id,
      enrollment_type: m.enrollment_type ?? s.enrollment_type,
    };
    if (patch.class_id === s.class_id && patch.unit_id === s.unit_id && patch.enrollment_type === s.enrollment_type) continue;
    const { error: e } = await supabase.from("students").update(patch).eq("id", m.student_id);
    if (e) throw new Error(e.message);
    atualizados++;
  }
  return { atualizados };
}
