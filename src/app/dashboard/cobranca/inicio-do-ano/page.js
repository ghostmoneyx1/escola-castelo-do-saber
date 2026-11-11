import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { createClient } from "@/lib/supabase/server";
import { anoLetivo } from "@/lib/constants";
import { montarLinhas, terminaNaEscola } from "@/lib/mensalidades/taxas-inicio";
import { InicioDoAnoClient } from "./inicio-do-ano-client";

export const dynamic = "force-dynamic";

export default async function InicioDoAnoPage({ searchParams }) {
  const ano = anoLetivo(searchParams?.ano);
  const supabase = await createClient();
  const matriculasDoAno = (year) =>
    supabase
      .from("enrollments")
      .select("student_id, class_id, enrollment_type, students!inner(name, status), classes(grade, name, year)")
      .eq("year", year)
      .eq("status", "Ativa")
      .eq("students.status", "Ativo");
  const [matriculasRes, anterioresRes, taxasRes] = await Promise.all([
    matriculasDoAno(ano),
    matriculasDoAno(ano - 1),
    supabase.from("enrollment_fees").select("*").eq("year", ano),
  ]);

  const erro = matriculasRes.error || anterioresRes.error || taxasRes.error;
  if (erro) {
    return (
      <div className="space-y-6">
        <PageHeader title="Início do ano letivo" subtitle="Uniforme, material, pacote experiência e livro + matrícula" />
        <div className="bg-white border border-border rounded-xl p-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Não foi possível carregar os pagamentos</p>
            <p className="text-sm text-muted-foreground mt-1">{erro.message}</p>
            <p className="text-sm text-muted-foreground mt-3">
              Se a mensagem falar em tabela inexistente, falta rodar o script
              <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-xs">atualizacao-2026-11-11b-taxas-inicio-do-ano.sql</code>
              no SQL Editor do Supabase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // A taxa do início do ano é paga antes da rematrícula: quem estava no ano
  // anterior e ainda não rematriculou também aparece, menos o 5º Ano.
  const rematriculados = new Set((matriculasRes.data || []).map((m) => m.student_id));
  const naoRematriculados = (anterioresRes.data || []).filter(
    (m) => !rematriculados.has(m.student_id) && !terminaNaEscola(m.classes?.grade),
  );

  return (
    <InicioDoAnoClient
      key={ano}
      ano={ano}
      linhas={montarLinhas(matriculasRes.data || [], taxasRes.data || [], naoRematriculados)}
    />
  );
}
