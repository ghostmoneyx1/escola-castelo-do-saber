"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { MONTHS, PAYMENT_METHODS } from "@/lib/constants";

function fmt(value) {
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function NovoPagamentoForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const preselected  = searchParams.get("employee_id") || "";

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [employees, setEmployees] = useState([]);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  const [form, setForm] = useState({
    employee_id:     preselected,
    reference_month: String(currentMonth),
    reference_year:  String(currentYear),
    base_salary:     "",
    bonuses:         "0",
    deductions:      "0",
    payment_method:  "",
    paid_at:         "",
    observations:    "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("employees")
        .select("id, name, role, base_salary, cpf")
        .eq("status", "Ativo")
        .order("name");
      setEmployees(data || []);

      // Pre-fill salary if employee is preselected
      if (preselected && data) {
        const emp = data.find(e => e.id === preselected);
        if (emp) setForm(p => ({ ...p, base_salary: String(emp.base_salary) }));
      }
    }
    load();
  }, [preselected]);

  // Auto-fill salary when employee changes
  function handleEmployeeChange(id) {
    const emp = employees.find(e => e.id === id);
    setForm(p => ({ ...p, employee_id: id, base_salary: emp ? String(emp.base_salary) : "" }));
  }

  const base       = parseFloat(form.base_salary)  || 0;
  const bonuses    = parseFloat(form.bonuses)       || 0;
  const deductions = parseFloat(form.deductions)    || 0;
  const net        = base + bonuses - deductions;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.employee_id)     return setError("Selecione um colaborador.");
    if (!form.reference_month) return setError("Selecione o mês.");
    if (!form.base_salary)     return setError("Informe o salário base.");

    setSaving(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("employee_payments").insert({
      employee_id:     form.employee_id,
      reference_month: Number(form.reference_month),
      reference_year:  Number(form.reference_year),
      base_salary:     base,
      bonuses,
      deductions,
      net_amount:      net,
      payment_method:  form.payment_method || null,
      paid_at:         form.paid_at || null,
      observations:    form.observations.trim() || null,
    });

    if (err) {
      if (err.code === "23505") setError("Já existe um lançamento para este colaborador neste mês/ano.");
      else setError("Erro ao salvar: " + err.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard/colaboradores/pagamentos");
  }

  const years = [currentYear, currentYear - 1].map(String);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Novo Lançamento de Pagamento" subtitle="Registre o pagamento mensal de um colaborador">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/colaboradores/pagamentos">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Identificação */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Identificação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 space-y-1.5">
              <Label>Colaborador *</Label>
              <Select value={form.employee_id} onValueChange={handleEmployeeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione">
                    {form.employee_id ? employees.find(e => e.id === form.employee_id)?.name || "Selecione" : "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {employees.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name} — {e.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Mês de referência *</Label>
              <Select value={form.reference_month} onValueChange={v => setForm(p => ({ ...p, reference_month: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Ano</Label>
              <Select value={form.reference_year} onValueChange={v => setForm(p => ({ ...p, reference_year: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Salário Base (R$) *</Label>
              <Input
                type="number" step="0.01" placeholder="0.00"
                value={form.base_salary}
                onChange={e => setForm(p => ({ ...p, base_salary: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gratificações / Extras (R$)</Label>
              <Input
                type="number" step="0.01" placeholder="0.00"
                value={form.bonuses}
                onChange={e => setForm(p => ({ ...p, bonuses: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descontos (R$)</Label>
              <Input
                type="number" step="0.01" placeholder="0.00"
                value={form.deductions}
                onChange={e => setForm(p => ({ ...p, deductions: e.target.value }))}
              />
            </div>
          </div>

          {/* Preview do líquido */}
          <div className="bg-muted/40 rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>Base: <span className="font-medium text-foreground">R$ {fmt(base)}</span></p>
              <p>+ Bônus: <span className="font-medium text-emerald-600">R$ {fmt(bonuses)}</span></p>
              <p>- Descontos: <span className="font-medium text-red-600">R$ {fmt(deductions)}</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Valor Líquido</p>
              <p className="text-2xl font-bold font-heading">R$ {fmt(net)}</p>
            </div>
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-white border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Pagamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Método de pagamento</Label>
              <Select value={form.payment_method} onValueChange={v => setForm(p => ({ ...p, payment_method: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Data do pagamento</Label>
              <Input
                type="date"
                value={form.paid_at}
                onChange={e => setForm(p => ({ ...p, paid_at: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Observações</Label>
            <textarea
              rows={2}
              placeholder="Informações adicionais sobre este pagamento..."
              value={form.observations}
              onChange={e => setForm(p => ({ ...p, observations: e.target.value }))}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pb-4">
          <Button type="button" asChild variant="outline" size="sm">
            <Link href="/dashboard/colaboradores/pagamentos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving} size="sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Salvando..." : "Salvar Lançamento"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NovoPagamentoPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <NovoPagamentoForm />
    </Suspense>
  );
}
