"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Printer } from "lucide-react";
import { AREAS, NIVEIS, NIVEL_MAP, SEMESTER_LABELS } from "@/lib/boletim-infantil";
import { generateDocument } from "@/lib/pdf/generate";

export function BoletimInfantil({ student }) {
  const [semester, setSemester] = useState("1");
  const [responses, setResponses] = useState({});
  const [evalId, setEvalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!student?.id) return;
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("infantil_evaluations")
        .select("id, responses")
        .eq("student_id", student.id)
        .eq("semester", Number(semester))
        .eq("year", year)
        .maybeSingle();

      if (cancelled) return;

      if (data) {
        setEvalId(data.id);
        setResponses(data.responses || {});
      } else {
        setEvalId(null);
        setResponses({});
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [student?.id, semester, year]);

  async function setNivel(criterioId, nivel) {
    const next = { ...responses };
    if (next[criterioId] === nivel) {
      delete next[criterioId];
    } else {
      next[criterioId] = nivel;
    }
    setResponses(next);

    setSaving(true);
    const supabase = createClient();
    if (evalId) {
      await supabase
        .from("infantil_evaluations")
        .update({ responses: next })
        .eq("id", evalId);
    } else {
      const { data } = await supabase
        .from("infantil_evaluations")
        .insert({
          student_id: student.id,
          semester: Number(semester),
          year,
          responses: next,
        })
        .select("id")
        .single();
      if (data?.id) setEvalId(data.id);
    }
    setSaving(false);
  }

  async function handleGeneratePdf() {
    setGeneratingPdf(true);
    try {
      await generateDocument(student.id, "Boletim Infantil", { semester: Number(semester) });
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar PDF.");
    }
    setGeneratingPdf(false);
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-muted rounded-xl p-4 flex flex-wrap items-center gap-4 no-print">
        <div className="flex-1" />
        <Select value={semester} onValueChange={setSemester}>
          <SelectTrigger className="bg-white border-none py-3 px-4 h-auto min-w-[160px] text-sm font-medium shadow-none w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2].map((s) => (
              <SelectItem key={s} value={String(s)}>{SEMESTER_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGeneratePdf} disabled={generatingPdf} className="bg-blue-600 hover:bg-blue-700 text-white">
          {generatingPdf ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Printer className="h-4 w-4 mr-2" />}
          Gerar PDF
        </Button>
      </div>

      {/* Cabeçalho aluno */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 p-5">
        <h2 className="font-bold text-xl text-foreground mb-1">{student.name}</h2>
        <p className="text-sm text-foreground/80 font-medium">
          {student.classes?.grade} {student.classes?.name ? `- ${student.classes.name}` : ""}
        </p>
        <p className="text-sm text-foreground/80 font-medium mt-0.5">
          {SEMESTER_LABELS[semester]} / {year}
        </p>
      </div>

      {/* Legenda */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-wrap gap-4">
        {NIVEIS.map(n => (
          <div key={n.value} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: n.hex }} />
            <span className="text-xs font-medium text-foreground">{n.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-5">
          {AREAS.map(area => (
            <div key={area.id} className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="bg-muted/40 px-5 py-3 border-b border-border flex items-center gap-2">
                <span className="text-base">{area.emoji}</span>
                <h3 className="text-sm font-semibold text-foreground">{area.label}</h3>
              </div>
              {area.avaliar && area.avaliar.length > 0 && (
                <div className="px-5 py-3 border-b border-border bg-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Avaliar:</p>
                  <ul className="list-disc list-inside text-xs text-foreground/80 space-y-0.5">
                    {area.avaliar.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-2.5">Critério</th>
                    {NIVEIS.map(n => (
                      <th key={n.value} className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-3 py-2.5 w-[110px]">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: n.hex }} />
                          {n.short}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {area.items.map(item => {
                    const current = responses[item.id];
                    return (
                      <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 text-sm text-foreground">{item.label}</td>
                        {NIVEIS.map(n => {
                          const active = current === n.value;
                          return (
                            <td key={n.value} className="px-3 py-3 text-center">
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => setNivel(item.id, n.value)}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                                style={{
                                  background: active ? n.hex : "white",
                                  borderColor: active ? n.hex : "#cbd5e1",
                                }}
                                aria-label={`${item.label} — ${n.label}`}
                              >
                                {active && (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
