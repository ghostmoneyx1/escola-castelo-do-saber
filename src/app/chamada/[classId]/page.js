"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Send, CheckCheck } from "lucide-react";

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    .format(new Date(Number(y), Number(m) - 1, Number(d)));
}

export default function ChamadaPage() {
  const { classId } = useParams();
  const [classInfo, setClassInfo]   = useState(null);
  const [students, setStudents]     = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");
  const [date] = useState(todayISO());

  useEffect(() => {
    async function load() {
      const res  = await fetch(`/api/chamada/${classId}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Turma não encontrada"); setLoading(false); return; }

      setClassInfo(data.class);
      setStudents(data.students);

      // Default: todos presentes
      const att = {};
      data.students.forEach(s => { att[s.id] = true; });
      setAttendance(att);
      setLoading(false);
    }
    load();
  }, [classId]);

  function toggle(id) {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/chamada/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_id: classId, date, attendance }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const d = await res.json();
      setError(d.error || "Erro ao enviar. Tente novamente.");
    }
    setSubmitting(false);
  }

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount  = students.length - presentCount;

  // ── Estados de carregamento / erro ──────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );

  if (error && !classInfo) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-700">Turma não encontrada</p>
        <p className="text-sm text-slate-400 mt-1">{error}</p>
      </div>
    </div>
  );

  // ── Tela de sucesso ─────────────────────────────────────────────
  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
        <CheckCheck className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Chamada enviada!</h1>
      <p className="text-sm text-slate-500 mb-6">
        {classInfo.grade} — {classInfo.name}<br />
        {formatDate(date)}
      </p>
      <div className="flex gap-6 text-sm font-semibold">
        <span className="text-emerald-600">{presentCount} presentes</span>
        <span className="text-red-500">{absentCount} ausentes</span>
      </div>
      <p className="text-xs text-slate-400 mt-8">Pode fechar esta janela.</p>
    </div>
  );

  // ── Tela principal ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 pb-32">

      {/* Header */}
      <div className="bg-[#0c1222] text-white px-5 pt-10 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
          Escola Castelo do Saber
        </p>
        <h1 className="text-xl font-bold leading-tight">
          {classInfo.grade} — {classInfo.name}
        </h1>
        <p className="text-sm text-slate-300 mt-0.5">{classInfo.shift}</p>
        <p className="text-xs text-slate-400 mt-3 capitalize">{formatDate(date)}</p>
      </div>

      {/* Contador */}
      <div className="flex gap-3 px-4 pt-4">
        <div className="flex-1 bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-xl font-bold text-emerald-600">{presentCount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Presentes</p>
          </div>
        </div>
        <div className="flex-1 bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
          <div>
            <p className="text-xl font-bold text-red-500">{absentCount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ausentes</p>
          </div>
        </div>
      </div>

      {/* Instrução */}
      <p className="text-xs text-slate-400 text-center mt-3 px-4">
        Toque no nome do aluno para alternar presença / ausência
      </p>

      {/* Lista de alunos */}
      <div className="px-4 mt-3 space-y-2">
        {students.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-8 text-center">
            <p className="text-slate-400 text-sm">Nenhum aluno nesta turma</p>
          </div>
        ) : students.map((student, idx) => {
          const present = attendance[student.id] ?? true;
          return (
            <button
              key={student.id}
              onClick={() => toggle(student.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                present
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                present ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"
              }`}>
                {getInitials(student.name)}
              </div>

              {/* Nome */}
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${present ? "text-emerald-800" : "text-red-700"}`}>
                  <span className="text-slate-400 text-xs font-normal mr-1">{idx + 1}.</span>
                  {student.name}
                </p>
              </div>

              {/* Status */}
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                present
                  ? "bg-emerald-200 text-emerald-800"
                  : "bg-red-200 text-red-800"
              }`}>
                {present ? "Presente" : "Ausente"}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Botão fixo no rodapé */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={submitting || students.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#0c1222] text-white font-semibold text-sm py-4 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {submitting
            ? <Loader2 className="h-5 w-5 animate-spin" />
            : <Send className="h-5 w-5" />
          }
          {submitting ? "Enviando..." : `Enviar Chamada — ${students.length} alunos`}
        </button>
      </div>
    </div>
  );
}
