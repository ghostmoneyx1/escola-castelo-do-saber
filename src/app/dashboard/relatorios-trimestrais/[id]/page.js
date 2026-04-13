"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  CHECKLIST, RESPOSTA_LABELS, COLOR_STYLES, QUARTER_LABELS, STATUS_MAP,
} from "@/lib/relatorio-checklist";
import { ArrowLeft, Loader2, Printer, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const CAT_LABELS = {
  academico: "Desempenho Acadêmico",
  frequencia: "Frequência e Pontualidade",
  comportamento: "Comportamento e Disciplina",
  social: "Desenvolvimento Social",
  autonomia: "Autonomia e Engajamento",
};

const STATUS_LABEL = {
  verde:    { label: "Bom Desempenho",       color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  amarelo:  { label: "Atenção Necessária",   color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  vermelho: { label: "Intervenção Urgente",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

export default function ViewRelatorioPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("quarterly_reports")
        .select("*, students(name, cpf, birth_date, classes(name, grade, shift), units(name))")
        .eq("id", id)
        .single();
      setReport(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (!report) return (
    <div className="text-center py-20 text-muted-foreground">Relatório não encontrado.</div>
  );

  const s = report.students;
  const hasSynthesis = report.sintese || report.pontos_fortes || report.aspectos_desenvolver || report.encaminhamentos;
  const categories = ["academico", "frequencia", "comportamento", "social", "autonomia"];
  const overall = STATUS_LABEL[report.status_geral];
  const filledDate = formatDate(report.filled_at || report.created_at);

  return (
    <div>
      {/* Barra de ações — não aparece na impressão */}
      <div className="no-print flex items-center gap-3 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/relatorios-trimestrais">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" /> Imprimir / Salvar PDF
        </Button>
      </div>

      {/* ═══════════════════════════════════════════
          DOCUMENTO OFICIAL — layout para impressão
          ═══════════════════════════════════════════ */}
      <div
        id="report-doc"
        style={{
          maxWidth: 760,
          margin: "0 auto",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 13,
          color: "#1e293b",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* ── Cabeçalho ── */}
        <div style={{ background: "#1e40af", padding: "28px 36px 24px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", opacity: 0.75, marginBottom: 4 }}>
                Escola Castelo do Saber
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Relatório Trimestral</h1>
              <p style={{ fontSize: 13, marginTop: 6, opacity: 0.85 }}>
                {QUARTER_LABELS[report.quarter]} &bull; Ano letivo {report.year}
              </p>
            </div>
            {overall && (
              <div style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 10,
                padding: "10px 18px",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.8, marginBottom: 4 }}>
                  Resultado Geral
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{overall.label}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 28 }}>

          {/* ── Dados do Aluno ── */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "10px 18px" }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b" }}>
                Dados do Aluno
              </p>
            </div>
            <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
              {[
                { label: "Nome completo", value: s?.name },
                { label: "Turma", value: `${s?.classes?.grade} — ${s?.classes?.name}` },
                { label: "Unidade", value: s?.units?.name },
                { label: "Turno", value: s?.classes?.shift },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</p>
                  <p style={{ margin: "3px 0 0", fontWeight: 600, fontSize: 13 }}>{value || "—"}</p>
                </div>
              ))}
            </div>
            {report.professor_name && (
              <div style={{ borderTop: "1px solid #f1f5f9", padding: "10px 18px" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                  Professor(a) responsável: <strong style={{ color: "#1e293b" }}>{report.professor_name}</strong>
                </p>
              </div>
            )}
          </div>

          {/* ── Resultado por Categoria ── */}
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b" }}>
              Resultado por Categoria
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {categories.map(cat => {
                const status = report[`status_${cat}`];
                const st = STATUS_LABEL[status];
                return (
                  <div key={cat} style={{
                    border: `1px solid ${st?.border || "#e2e8f0"}`,
                    background: st?.bg || "#f8fafc",
                    borderRadius: 10,
                    padding: "12px 8px",
                    textAlign: "center",
                  }}>
                    <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {CAT_LABELS[cat].split(" ")[0]}
                    </p>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: st?.color || "#cbd5e1",
                      margin: "0 auto 6px",
                    }} />
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: st?.color || "#94a3b8" }}>
                      {st?.label || "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Síntese Pedagógica (IA) ── */}
          {hasSynthesis && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b" }}>
                  Análise Pedagógica
                </p>
                <span style={{
                  fontSize: 9, fontWeight: 700, background: "#ede9fe", color: "#7c3aed",
                  borderRadius: 20, padding: "2px 8px", letterSpacing: 1,
                }}>
                  ✦ GERADO POR IA
                </span>
              </div>

              {[
                { key: "sintese",              title: "Síntese Avaliativa",                       accent: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
                { key: "pontos_fortes",        title: "Pontos Fortes",                            accent: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
                { key: "aspectos_desenvolver", title: "Aspectos a Desenvolver",                   accent: "#b45309", bg: "#fffbeb", border: "#fde68a" },
                { key: "encaminhamentos",      title: "Estratégias e Encaminhamentos Pedagógicos", accent: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
              ].map(({ key, title, accent, bg, border }) => {
                if (!report[key]) return null;
                return (
                  <div key={key} style={{
                    border: `1px solid ${border}`,
                    background: bg,
                    borderRadius: 10,
                    padding: "16px 20px",
                    marginBottom: 10,
                  }}>
                    <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 1 }}>
                      {title}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: "#334155", whiteSpace: "pre-line" }}>
                      {report[key]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Avaliação Detalhada — recolhida por padrão, não aparece na impressão ── */}
          <div className="no-print">
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 10, padding: "10px 18px", cursor: "pointer",
                width: "100%", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b", flex: 1 }}>
                Avaliação Detalhada (30 itens)
              </span>
              {showDetails
                ? <ChevronUp size={16} color="#94a3b8" />
                : <ChevronDown size={16} color="#94a3b8" />}
            </button>

            {showDetails && (
              <div style={{ marginTop: 12 }}>
                {CHECKLIST.map(cat => {
                  const catStatus = report[`status_${cat.id}`];
                  const st = STATUS_LABEL[catStatus];
                  return (
                    <div key={cat.id} style={{ marginBottom: 12, border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 18px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
                      }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1e293b" }}>
                          {cat.emoji} {cat.label}
                        </p>
                        {st && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: st.color,
                            background: st.bg, border: `1px solid ${st.border}`,
                            borderRadius: 20, padding: "3px 12px",
                          }}>
                            {st.label}
                          </span>
                        )}
                      </div>
                      <div>
                        {cat.items.map((item, idx) => {
                          const resp = report.responses?.[item.id];
                          const rm = RESPOSTA_LABELS[resp];
                          return (
                            <div key={item.id} style={{
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              padding: "9px 18px",
                              borderBottom: idx < cat.items.length - 1 ? "1px solid #f1f5f9" : "none",
                              gap: 16,
                            }}>
                              <p style={{ margin: 0, fontSize: 12.5, color: "#334155", flex: 1 }}>
                                <span style={{ color: "#94a3b8", marginRight: 6, fontSize: 11 }}>{idx + 1}.</span>
                                {item.label}
                              </p>
                              {rm ? (
                                <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-lg border ${rm.bg} ${rm.text}`}>
                                  {rm.label}
                                </span>
                              ) : (
                                <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Observações do Professor ── */}
          {report.observations && (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "10px 18px" }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b" }}>
                  Observações do Professor
                </p>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: "#334155" }}>{report.observations}</p>
              </div>
            </div>
          )}

          {/* ── Assinaturas ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 8 }}>
            {["Professor(a) Responsável", "Coordenação Pedagógica"].map(label => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #94a3b8", paddingTop: 8, marginTop: 40 }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Rodapé ── */}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
              Escola Castelo do Saber &bull; {s?.units?.name}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
              Emitido em {filledDate}
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #report-doc {
            border: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
