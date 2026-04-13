"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Link2, Copy, Check, Loader2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { QUARTER_LABELS } from "@/lib/relatorio-checklist";

export default function GerarLinkRelatorioPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [form, setForm] = useState({ student_id: "", quarter: "", year: String(new Date().getFullYear()) });
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("students")
        .select("id, name, classes(name, grade), units(name)")
        .eq("status", "Ativo")
        .order("name");
      setStudents(data || []);
    }
    load();
  }, []);

  const filteredStudents = studentSearch.trim()
    ? students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
    : students;

  const currentYear = new Date().getFullYear();

  async function handleGenerate() {
    setError("");
    if (!form.student_id) return setError("Selecione um aluno.");
    if (!form.quarter) return setError("Selecione o trimestre.");
    setGenerating(true);

    const res = await fetch("/api/relatorio/gerar-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: form.student_id, quarter: Number(form.quarter), year: Number(form.year) }),
    });

    const json = await res.json();
    if (!res.ok) { setError(json.error || "Erro ao gerar link."); setGenerating(false); return; }

    const baseUrl = window.location.origin;
    setGeneratedLink(`${baseUrl}/relatorio/${json.token}`);
    setGenerating(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectedStudent = students.find(s => s.id === form.student_id);

  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Gerar Link de Avaliação" subtitle="Envie o link para o professor preencher o relatório">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/relatorios-trimestrais">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
      </PageHeader>

      <div className="bg-white border border-border rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Aluno *</label>
          <Select value={form.student_id} onValueChange={v => setForm(p => ({ ...p, student_id: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o aluno">
                {selectedStudent ? `${selectedStudent.name} — ${selectedStudent.classes?.grade}` : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Buscar aluno..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="h-8"
                />
              </div>
              {filteredStudents.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} — {s.classes?.grade} ({s.units?.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Trimestre *</label>
            <Select value={form.quarter} onValueChange={v => setForm(p => ({ ...p, quarter: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4].map(q => <SelectItem key={q} value={String(q)}>{QUARTER_LABELS[q]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ano</label>
            <Select value={form.year} onValueChange={v => setForm(p => ({ ...p, year: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[currentYear, currentYear - 1].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</div>
        )}

        <Button onClick={handleGenerate} disabled={generating} className="w-full" size="sm">
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
          {generating ? "Gerando..." : "Gerar Link"}
        </Button>
      </div>

      {/* Link gerado */}
      {generatedLink && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold text-blue-800">Link gerado com sucesso!</p>
          </div>
          <p className="text-xs text-blue-700">
            Envie este link para o professor preencher a avaliação de <strong>{selectedStudent?.name}</strong>.
          </p>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-200 px-3 py-2">
            <p className="text-xs text-slate-600 flex-1 truncate font-mono">{generatedLink}</p>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
            >
              {copied
                ? <Check className="h-4 w-4 text-emerald-600" />
                : <Copy className="h-4 w-4 text-blue-600" />}
            </button>
          </div>
          <p className="text-xs text-blue-600">
            {copied ? "✓ Copiado!" : "Clique no ícone para copiar o link"}
          </p>
        </div>
      )}
    </div>
  );
}
