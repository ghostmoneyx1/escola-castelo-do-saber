"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { MONTHS } from "@/lib/constants";

function fmt(v) {
  return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function calcDueDate(year, month, day) {
  // Clamp day to last day of month
  const lastDay = new Date(year, month, 0).getDate();
  const d = Math.min(day, lastDay);
  return `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

export default function NovoContratoPage() {
  const router   = useRouter();
  const currentYear = new Date().getFullYear();

  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const [form, setForm] = useState({
    student_id:     "",
    year:           String(currentYear),
    monthly_amount: "",
    due_day:        "10",
    observations:   "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("students").select("id, name").eq("status", "Ativo").order("name");
      setStudents(data || []);
    }
    load();
  }, []);

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
  }

  // Preview das 12 parcelas
  const year   = parseInt(form.year)  || currentYear;
  const day    = parseInt(form.due_day) || 10;
  const amount = parseFloat(form.monthly_amount) || 0;
  const preview = MONTHS.map((m, i) => ({
    month: i + 1,
    label: m,
    due_date: calcDueDate(year, i + 1, day),
    amount,
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.student_id)     return setError("Selecione um aluno.");
    if (!form.monthly_amount) return setError("Informe o valor da mensalidade.");

    setSaving(true);
    const supabase = createClient();

    // Cria contrato
    const { data: contract, error: contractErr } = await supabase
      .from("contracts")
      .insert({
        student_id:     form.student_id,
        year,
        monthly_amount: amount,
        due_day:        day,
        status:         "Aberto",
        observations:   form.observations || null,
      })
      .select()
      .single();

    if (contractErr) {
      if (contractErr.code === "23505") setError("Já existe um contrato para este aluno neste ano.");
      else setError("Erro ao criar contrato: " + contractErr.message);
      setSaving(false);
      return;
    }

    // Gera as 12 parcelas
    const installments = MONTHS.map((_, i) => ({
      contract_id: contract.id,
      student_id:  form.student_id,
      month:       i + 1,
      year,
      due_date:    calcDueDate(year, i + 1, day),
      amount,
      status:      "A vencer",
    }));

    const { error: instErr } = await supabase.from("installments").insert(installments);
    if (instErr) {
      setError("Contrato criado, mas erro ao gerar parcelas: " + instErr.message);
      setSaving(false);
      return;
    }

    router.push(`/dashboard/contratos/${contract.id}`);
  }

  const filteredStudents = studentSearch.trim()
    ? students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
    : students;

  const years = [currentYear - 1, currentYear, currentYear + 1].map(String);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Novo Contrato" subtitle="Defina o valor e o sistema gera as 12 parcelas automaticamente">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/contratos"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Dados do contrato */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Dados do Contrato</h2>

          <div className="space-y-1.5">
            <Label>Aluno *</Label>
            <Select value={form.student_id} onValueChange={v => set("student_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o aluno">
                  {form.student_id ? students.find(s => s.id === form.student_id)?.name || "Selecione" : "Selecione o aluno"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input placeholder="Buscar aluno..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} className="h-8" />
                </div>
                {filteredStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Ano letivo *</Label>
              <Select value={form.year} onValueChange={v => set("year", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Mensalidade (R$) *</Label>
              <Input type="number" step="0.01" placeholder="0.00" value={form.monthly_amount} onChange={e => set("monthly_amount", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Dia de vencimento</Label>
              <Input type="number" min="1" max="28" placeholder="10" value={form.due_day} onChange={e => set("due_day", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Input placeholder="Opcional" value={form.observations} onChange={e => set("observations", e.target.value)} />
          </div>
        </div>

        {/* Preview das parcelas */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Preview — 12 parcelas geradas automaticamente
            </h2>
            {amount > 0 && (
              <span className="text-xs text-muted-foreground font-medium">
                Total: R$ {fmt(amount * 12)}
              </span>
            )}
          </div>
          <div className="divide-y divide-border">
            {preview.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-sm font-medium text-foreground">{p.label}/{form.year}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    Vence: {p.due_date ? new Date(p.due_date + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                  </span>
                  <span className="text-sm font-semibold font-heading text-foreground">
                    {amount > 0 ? `R$ ${fmt(amount)}` : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</div>
        )}

        <div className="flex justify-end gap-3 pb-4">
          <Button type="button" asChild variant="outline" size="sm">
            <Link href="/dashboard/contratos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving} size="sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Gerando..." : "Criar Contrato e Gerar Parcelas"}
          </Button>
        </div>
      </form>
    </div>
  );
}
