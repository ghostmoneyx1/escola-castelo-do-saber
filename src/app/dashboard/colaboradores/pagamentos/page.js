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
import { Receipt, Plus, Loader2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { MONTHS } from "@/lib/constants";

function fmt(value) {
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export default function PagamentosColaboradoresPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [payments, setPayments]       = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [yearFilter, setYearFilter]   = useState(String(currentYear));
  const [monthFilter, setMonthFilter] = useState(String(currentMonth));
  const [empFilter, setEmpFilter]     = useState("Todos");

  useEffect(() => { loadEmployees(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [yearFilter, monthFilter, empFilter]);

  async function loadEmployees() {
    const supabase = createClient();
    const { data } = await supabase.from("employees").select("id, name").order("name");
    setEmployees(data || []);
  }

  async function load() {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from("employee_payments")
      .select("*, employees(name, role, cpf)")
      .eq("reference_year", Number(yearFilter))
      .order("created_at", { ascending: false });

    if (monthFilter !== "Todos") q = q.eq("reference_month", Number(monthFilter));
    if (empFilter !== "Todos")   q = q.eq("employee_id", empFilter);

    const { data } = await q;
    setPayments(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Excluir este lançamento?")) return;
    const supabase = createClient();
    await supabase.from("employee_payments").delete().eq("id", id);
    load();
  }

  const totalNet = payments.reduce((acc, p) => acc + Number(p.net_amount), 0);

  const years = [currentYear, currentYear - 1, currentYear - 2].map(String);

  return (
    <div className="space-y-6">
      <PageHeader title="Pagamentos de Colaboradores" subtitle="Lançamentos mensais e emissão de recibos">
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
            <Link href="/dashboard/colaboradores">← Colaboradores</Link>
          </Button>
          <Button asChild size="sm" className="whitespace-nowrap">
            <Link href="/dashboard/colaboradores/pagamentos/novo">
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Lançamento
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Resumo */}
      <div className="bg-white border border-border rounded-xl p-5">
        <p className="text-xs text-muted-foreground font-medium mb-1">Total líquido no período filtrado</p>
        <p className="text-2xl font-bold font-heading">R$ {fmt(totalNet)}</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os meses</SelectItem>
            {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={empFilter} onValueChange={setEmpFilter}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os colaboradores</SelectItem>
            {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Receipt} title="Nenhum lançamento encontrado" description="Registre o pagamento mensal de um colaborador">
              <Button asChild size="sm">
                <Link href="/dashboard/colaboradores/pagamentos/novo">
                  <Plus className="h-4 w-4 mr-1.5" /> Novo Lançamento
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
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Colaborador</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Referência</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Salário Base</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Bônus</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Descontos</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Líquido</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Método</th>
                    <th className="px-5 py-3 w-[80px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">{p.employees?.name}</p>
                        <p className="text-xs text-muted-foreground">{p.employees?.role}</p>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {MONTHS[p.reference_month - 1]}/{p.reference_year}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">R$ {fmt(p.base_salary)}</td>
                      <td className="px-5 py-3.5">
                        {Number(p.bonuses) > 0
                          ? <span className="text-emerald-600 font-medium">+ R$ {fmt(p.bonuses)}</span>
                          : <span className="text-muted-foreground">—</span>
                        }
                      </td>
                      <td className="px-5 py-3.5">
                        {Number(p.deductions) > 0
                          ? <span className="text-red-600 font-medium">- R$ {fmt(p.deductions)}</span>
                          : <span className="text-muted-foreground">—</span>
                        }
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold font-heading">R$ {fmt(p.net_amount)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{p.payment_method || "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => router.push(`/dashboard/colaboradores/pagamentos/${p.id}`)}
                            title="Ver recibo"
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
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
              <p className="text-xs text-muted-foreground">{payments.length} lançamento{payments.length !== 1 ? "s" : ""}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
