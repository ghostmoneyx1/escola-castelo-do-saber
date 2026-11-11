"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectSearch } from "@/components/shared/select-search";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { MONTHS } from "@/lib/constants";
import { TODOS_OS_MESES, calcDueDate, montarParcelas } from "@/lib/mensalidades/meses";

function fmt(v) {
  return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export default function NovoContratoPage() {
  const router   = useRouter();
  const currentYear = new Date().getFullYear();

  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [meses, setMeses]       = useState(() => new Set(TODOS_OS_MESES));

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

  function toggleMes(month) {
    setMeses(prev => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  }

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
    if (meses.size === 0)     return setError("Marque pelo menos um mês.");

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

    const installments = montarParcelas({
      contractId: contract.id,
      studentId:  form.student_id,
      year,
      dueDay:     day,
      amount,
      meses,
    });

    const { error: instErr } = await supabase.from("installments").insert(installments);
    if (instErr) {
      setError("Contrato criado, mas erro ao gerar parcelas: " + instErr.message);
      setSaving(false);
      return;
    }

    // Links de pagamento na InfinitePay. Se falhar, o contrato fica salvo e a
    // página do contrato tem o botão "Gerar links".
    await fetch("/api/infinitepay/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractId: contract.id }),
    }).catch(() => {});

    router.push(`/dashboard/contratos/${contract.id}`);
  }

  const filteredStudents = studentSearch.trim()
    ? students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
    : students;

  const years = [currentYear - 1, currentYear, currentYear + 1].map(String);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Novo Contrato" subtitle="Defina o valor, escolha os meses e o sistema gera as parcelas e os links de pagamento">
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
              <SelectContent header={<SelectSearch value={studentSearch} onChange={setStudentSearch} placeholder="Buscar aluno..." />}>
                {filteredStudents.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">Nenhum aluno encontrado.</p>
                ) : (
                  filteredStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                )}
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
              Meses cobrados — {meses.size} parcela{meses.size === 1 ? "" : "s"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMeses(meses.size === 12 ? new Set() : new Set(TODOS_OS_MESES))}
                className="text-xs font-medium text-primary hover:underline"
              >
                {meses.size === 12 ? "Desmarcar todos" : "Marcar todos"}
              </button>
              {amount > 0 && (
                <span className="text-xs text-muted-foreground font-medium">
                  Total: R$ {fmt(amount * meses.size)}
                </span>
              )}
            </div>
          </div>
          <div className="divide-y divide-border">
            {preview.map((p) => (
              <div
                key={p.month}
                onClick={() => toggleMes(p.month)}
                className={`flex items-center justify-between px-5 py-3 cursor-pointer ${meses.has(p.month) ? "" : "opacity-50"}`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={meses.has(p.month)}
                    onCheckedChange={() => toggleMes(p.month)}
                    onClick={e => e.stopPropagation()}
                    aria-label={`${p.label}/${form.year}`}
                  />
                  <span className="text-sm font-medium text-foreground">{p.label}/{form.year}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    Vence: {p.due_date ? new Date(p.due_date + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                  </span>
                  <span className="text-sm font-semibold font-heading text-foreground">
                    {amount > 0 && meses.has(p.month) ? `R$ ${fmt(amount)}` : "—"}
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
