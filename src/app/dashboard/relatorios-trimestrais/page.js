"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ClipboardList, Plus, Loader2, Eye, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";
import { QUARTER_LABELS, STATUS_MAP } from "@/lib/relatorio-checklist";

function StatusDot({ status }) {
  const s = STATUS_MAP[status];
  if (!s) return <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />;
  return <span className={`w-2.5 h-2.5 rounded-full ${s.dot} inline-block`} />;
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status];
  if (!s) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.badge}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function RelatoriosTrimestraisPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));
  const [quarterFilter, setQuarterFilter] = useState("Todos");

  useEffect(() => { loadReports(); }, [yearFilter, quarterFilter]);

  async function loadReports() {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from("quarterly_reports")
      .select("*, students(name, classes(name, grade))")
      .eq("year", Number(yearFilter))
      .order("created_at", { ascending: false });
    if (quarterFilter !== "Todos") q = q.eq("quarter", Number(quarterFilter));
    const { data } = await q;
    setReports(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Excluir este relatório?")) return;
    const supabase = createClient();
    await supabase.from("quarterly_reports").delete().eq("id", id);
    loadReports();
  }

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2].map(String);

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios Semestrais" subtitle="Acompanhamento do desempenho por aluno">
        <Button asChild size="sm">
          <Link href="/dashboard/relatorios-trimestrais/novo">
            <Plus className="h-4 w-4 mr-1.5" /> Gerar Link
          </Link>
        </Button>
      </PageHeader>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 bg-white border border-border rounded-xl px-5 py-3.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 self-center">Legenda:</span>
        {[
          { status: "verde",    desc: "Bom desempenho (≥70%)" },
          { status: "amarelo",  desc: "Atenção necessária (40–69%)" },
          { status: "vermelho", desc: "Intervenção urgente (<40%)" },
        ].map(({ status, desc }) => {
          const s = STATUS_MAP[status];
          return (
            <span key={status} className="flex items-center gap-2 text-xs text-slate-600">
              <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
              {desc}
            </span>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={quarterFilter} onValueChange={setQuarterFilter}>
          <SelectTrigger className="h-9 w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os semestres</SelectItem>
            {[1,2].map(q => <SelectItem key={q} value={String(q)}>{QUARTER_LABELS[q]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : reports.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ClipboardList}
              title="Nenhum relatório encontrado"
              description="Gere um link para o professor preencher a avaliação de um aluno"
            >
              <Button asChild size="sm">
                <Link href="/dashboard/relatorios-trimestrais/novo">
                  <Plus className="h-4 w-4 mr-1.5" /> Gerar Link
                </Link>
              </Button>
            </EmptyState>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Aluno</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Semestre</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Acadêmico</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Frequência</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Comportamento</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Social</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Evolução</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Geral</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">IA</th>
                    <th className="px-5 py-3 w-[80px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">{r.students?.name}</p>
                        <p className="text-xs text-muted-foreground">{r.students?.classes?.grade} — {r.students?.classes?.name}</p>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-sm">{QUARTER_LABELS[r.quarter]}</td>
                      <td className="px-5 py-3.5"><StatusDot status={r.status_academico} /></td>
                      <td className="px-5 py-3.5"><StatusDot status={r.status_frequencia} /></td>
                      <td className="px-5 py-3.5"><StatusDot status={r.status_comportamento} /></td>
                      <td className="px-5 py-3.5"><StatusDot status={r.status_social} /></td>
                      <td className="px-5 py-3.5"><StatusDot status={r.status_autonomia} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status_geral} /></td>
                      <td className="px-5 py-3.5">
                        {r.sintese
                          ? <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                          : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => router.push(`/dashboard/relatorios-trimestrais/${r.id}`)}
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-1.5 text-muted-foreground hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">{reports.length} relatório{reports.length !== 1 ? "s" : ""}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
