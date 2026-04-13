"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  FileText, Plus, Loader2, Search, CheckCircle, Clock, AlertTriangle, DollarSign,
} from "lucide-react";
import Link from "next/link";
import { MONTHS } from "@/lib/constants";

function fmt(v) {
  return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function calcStatus(inst) {
  if (inst.status === "Pago") return "Pago";
  const today = new Date(); today.setHours(0,0,0,0);
  const due   = new Date(inst.due_date + "T00:00:00");
  return due < today ? "Atrasado" : "A vencer";
}

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold font-heading">R$ {fmt(value)}</p>
        </div>
      </div>
    </div>
  );
}

export default function ContratosPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [yearFilter, setYearFilter] = useState(String(currentYear));
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => { load(); }, [yearFilter]);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("contracts")
      .select("*, students(name), installments(*)")
      .eq("year", Number(yearFilter))
      .order("created_at", { ascending: false });
    setContracts(data || []);
    setLoading(false);
  }

  const filtered = contracts.filter(c => {
    const matchSearch = !search.trim() || c.students?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Totalizadores globais
  const allInst = contracts.flatMap(c => c.installments || []);
  const totalPago     = allInst.filter(i => i.status === "Pago").reduce((a, i) => a + Number(i.amount), 0);
  const totalVencer   = allInst.filter(i => calcStatus(i) === "A vencer").reduce((a, i) => a + Number(i.amount), 0);
  const totalAtrasado = allInst.filter(i => calcStatus(i) === "Atrasado").reduce((a, i) => a + Number(i.amount), 0);

  const years = [currentYear, currentYear - 1, currentYear + 1].sort((a,b) => b-a).map(String);

  return (
    <div className="space-y-6">
      <PageHeader title="Contratos / Mensalidades" subtitle="Gerencie os contratos e parcelas dos alunos">
        <Button asChild size="sm" className="whitespace-nowrap">
          <Link href="/dashboard/contratos/novo">
            <Plus className="h-4 w-4 mr-1.5" /> Novo Contrato
          </Link>
        </Button>
      </PageHeader>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={CheckCircle} label="Recebido" value={totalPago}     color="bg-emerald-50 text-emerald-600" />
        <SummaryCard icon={Clock}       label="A Vencer"  value={totalVencer}   color="bg-amber-50 text-amber-600" />
        <SummaryCard icon={AlertTriangle} label="Atrasado" value={totalAtrasado} color="bg-red-50 text-red-600" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-0 sm:min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por aluno..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="h-10 w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Aberto">Aberto</SelectItem>
            <SelectItem value="Fechado">Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={FileText} title="Nenhum contrato encontrado" description="Crie o contrato de um aluno para gerar as parcelas automaticamente">
              <Button asChild size="sm">
                <Link href="/dashboard/contratos/novo"><Plus className="h-4 w-4 mr-1.5" />Novo Contrato</Link>
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
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Mensalidade</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Vencimento</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Pagas</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Atrasadas</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Status</th>
                    <th className="px-5 py-3 w-[60px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(contract => {
                    const insts    = contract.installments || [];
                    const pagas    = insts.filter(i => i.status === "Pago").length;
                    const atrasadas = insts.filter(i => calcStatus(i) === "Atrasado").length;
                    return (
                      <tr key={contract.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/contratos/${contract.id}`)}>
                        <td className="px-5 py-3.5 font-medium text-foreground">{contract.students?.name}</td>
                        <td className="px-5 py-3.5 font-semibold font-heading">R$ {fmt(contract.monthly_amount)}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">Dia {contract.due_day}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-emerald-600 font-semibold">{pagas}</span>
                          <span className="text-muted-foreground">/12</span>
                        </td>
                        <td className="px-5 py-3.5">
                          {atrasadas > 0
                            ? <span className="text-red-600 font-semibold">{atrasadas}</span>
                            : <span className="text-muted-foreground">—</span>
                          }
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            contract.status === "Aberto"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>{contract.status}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-xs text-blue-600 font-medium">Ver →</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">{filtered.length} contrato{filtered.length !== 1 ? "s" : ""}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
