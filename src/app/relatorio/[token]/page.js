"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CHECKLIST, RESPOSTAS, COLOR_STYLES, QUARTER_LABELS,
} from "@/lib/relatorio-checklist";
import { Loader2, CheckCircle2, AlertCircle, School } from "lucide-react";

const SCALE_INACTIVE = "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50";

export default function RelatorioPublicoPage() {
  const { token } = useParams();
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({});
  const [professorName, setProfessorName] = useState("");
  const [observations, setObservations] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("report_tokens")
        .select("*, students(name, classes(name, grade, shift), units(name))")
        .eq("token", token)
        .single();

      if (error || !data) { setError("Link inválido ou expirado."); setLoading(false); return; }
      if (data.used) { setError("Este relatório já foi preenchido."); setLoading(false); return; }
      setTokenData(data);
      setLoading(false);
    }
    load();
  }, [token]);

  function setResponse(itemId, value) {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  }

  const allItems = CHECKLIST.flatMap(c => c.items);
  const answeredCount = allItems.filter(i => responses[i.id]).length;
  const allAnswered = answeredCount === allItems.length;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!allAnswered) {
      setSubmitError(`Responda todas as ${allItems.length} perguntas. (${answeredCount}/${allItems.length} respondidas)`);
      return;
    }
    setSubmitting(true);

    const res = await fetch("/api/relatorio/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, responses, professor_name: professorName, observations }),
    });

    const json = await res.json();
    if (!res.ok) {
      setSubmitError(json.error || "Erro ao enviar. Tente novamente.");
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl border border-border p-8 max-w-md w-full text-center space-y-3">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h1 className="text-lg font-bold text-foreground">Link inválido</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl border border-border p-8 max-w-md w-full text-center space-y-4">
        <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto" />
        <h1 className="text-xl font-bold text-foreground">Avaliação enviada!</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O relatório de <strong>{tokenData?.students?.name}</strong> foi registrado com sucesso.<br />
          Obrigado pela sua avaliação.
        </p>
      </div>
    </div>
  );

  const student = tokenData.students;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <School className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Escola Castelo do Saber</p>
            <p className="text-sm font-bold text-foreground">Avaliação Trimestral</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">{QUARTER_LABELS[tokenData.quarter]} / {tokenData.year}</p>
            <p className="text-xs font-semibold text-blue-600">{answeredCount}/{allItems.length} respondidas</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Dados do aluno */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-3">Aluno avaliado</p>
          <p className="text-lg font-bold text-foreground">{student?.name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {student?.classes?.grade} — {student?.classes?.name} &bull; {student?.classes?.shift} &bull; {student?.units?.name}
          </p>
        </div>

        {/* Nome do professor */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Seu nome (professor)
          </label>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={professorName}
            onChange={e => setProfessorName(e.target.value)}
            className="w-full rounded-xl border border-input bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Perguntas por categoria */}
        {CHECKLIST.map(cat => {
          const st = COLOR_STYLES[cat.color];
          const catAnswered = cat.items.filter(i => responses[i.id]).length;
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className={`px-5 py-4 border-b ${st.header} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{cat.emoji}</span>
                  <span className={`font-bold text-sm ${st.title}`}>{cat.label}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {catAnswered}/{cat.items.length}
                </span>
              </div>
              <div className="divide-y divide-border">
                {cat.items.map((item, idx) => (
                  <div key={item.id} className="px-5 py-4 space-y-3">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="text-xs text-muted-foreground mr-1.5">{idx + 1}.</span>
                      {item.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {RESPOSTAS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setResponse(item.id, opt.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            responses[item.id] === opt.value ? opt.color : SCALE_INACTIVE
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Observações */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Observações adicionais (opcional)
          </label>
          <textarea
            rows={4}
            placeholder="Descreva aspectos relevantes que não foram abordados nas perguntas acima..."
            value={observations}
            onChange={e => setObservations(e.target.value)}
            className="w-full rounded-xl border border-input bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
          />
        </div>

        {/* Progresso + erro */}
        {submitError && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
            {submitError}
          </div>
        )}

        {/* Botão enviar */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            allAnswered
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {submitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Enviando avaliação...</>
          ) : (
            <><CheckCircle2 className="h-4 w-4" /> Enviar Avaliação</>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground pb-6">
          Ao enviar, o relatório será processado e estará disponível para a coordenação.
        </p>
      </div>
    </div>
  );
}
