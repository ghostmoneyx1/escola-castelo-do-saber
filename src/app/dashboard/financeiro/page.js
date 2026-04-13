"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Wallet, Search, Loader2, CheckCircle, Clock, AlertTriangle, ThumbsUp, Save,
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

const STATUS_STYLE = {
  "Pago":     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "A vencer": "bg-amber-50 text-amber-600 border-amber-200",
  "Atrasado": "bg-red-50 text-red-600 border-red-200",
};

function SummaryCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
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

export default function FinanceiroPage() {
  const now = new Date();
  const currentYear  = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [installments, setInstallments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [monthFilter, setMonthFilter] = useState(String(currentMonth));
  const [yearFilter, setYearFilter]   = useState(String(currentYear));
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedInst, setSelectedInst]   = useState(null);
  const [obsInput, setObsInput]           = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [monthFilter, yearFilter]);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from("installments")
      .select("*, contracts(due_day), students(name)")
      .eq("year", Number(yearFilter))
      .order("due_date");

    if (monthFilter !== "Todos") q = q.eq("month", Number(monthFilter));

    const { data } = await q;
    setInstallments(data || []);
    setLoading(false);
  }

  function openConfirm(inst) {
    setSelectedInst(inst);
    setObsInput("");
    setConfirmDialog(true);
  }

  async function handleConfirmPago() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("installments").update({
      status:       "Pago",
      paid_at:      new Date().toISOString(),
      observations: obsInput.trim() || null,
    }).eq("id", selectedInst.id);
    setConfirmDialog(false);
    setSaving(false);
    load();
  }

  const filtered = installments.filter(inst => {
    const status = calcStatus(inst);
    const matchSearch = !search.trim() || inst.students?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPago     = installments.filter(i => i.status === "Pago").reduce((a, i) => a + Number(i.amount), 0);
  const totalVencer   = installments.filter(i => calcStatus(i) === "A vencer").reduce((a, i) => a + Number(i.amount), 0);
  const totalAtrasado = installments.filter(i => calcStatus(i) === "Atrasado").reduce((a, i) => a + Number(i.amount), 0);

  const years = [currentYear - 1, currentYear, currentYear + 1].map(String);

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro" subtitle="Acompanhe os pagamentos mensais dos alunos">
        <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
          <Link href="/dashboard/contratos">Gerenciar Contratos →</Link>
        </Button>
      </PageHeader>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard icon={CheckCircle}   label="Recebido"  value={totalPago}     colorClass="bg-emerald-50 text-emerald-600" />
        <SummaryCard icon={Clock}         label="A Vencer"  value={totalVencer}   colorClass="bg-amber-50 text-amber-600" />
        <SummaryCard icon={AlertTriangle} label="Atrasado"  value={totalAtrasado} colorClass="bg-red-50 text-red-600" />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por aluno..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="h-10 w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os meses</SelectItem>
            {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="h-10 w-[110px]"><SelectValue /></SelectTrigger>
          <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Pago">Pago</SelectItem>
            <SelectItem value="A vencer">A vencer</SelectItem>
            <SelectItem value="Atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Wallet}
              title="Nenhum lançamento encontrado"
              description="Crie contratos para os alunos e as parcelas aparecerão aqui automaticamente"
            >
              <Button asChild size="sm">
                <Link href="/dashboard/contratos/novo">Novo Contrato</Link>
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
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Parcela</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Vencimento</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Valor</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Status</th>
                    <th className="px-5 py-3 w-[140px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inst => {
                    const status  = calcStatus(inst);
                    const dueDate = new Date(inst.due_date + "T00:00:00").toLocaleDateString("pt-BR");
                    return (
                      <tr key={inst.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap">{inst.students?.name}</td>
                        <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                          {MONTHS[inst.month - 1]}/{inst.year}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{dueDate}</td>
                        <td className="px-5 py-3.5 font-semibold font-heading whitespace-nowrap">
                          R$ {fmt(inst.amount)}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLE[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          {inst.status !== "Pago" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openConfirm(inst)}
                              className="h-7 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1.5"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              Confirmar pagamento
                            </Button>
                          )}
                          {inst.status === "Pago" && inst.paid_at && (
                            <span className="text-xs text-muted-foreground">
                              Pago em {new Date(inst.paid_at).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">{filtered.length} parcela{filtered.length !== 1 ? "s" : ""}</p>
            </div>
          </>
        )}
      </div>

      {/* Dialog confirmar pagamento */}
      <Dialog open={confirmDialog} onOpenChange={v => !saving && setConfirmDialog(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-emerald-600" />
              Confirmar Pagamento
            </DialogTitle>
          </DialogHeader>
          {selectedInst && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-xl px-4 py-3 space-y-1 text-sm">
                <p><span className="text-muted-foreground">Aluno:</span> <span className="font-semibold">{selectedInst.students?.name}</span></p>
                <p><span className="text-muted-foreground">Parcela:</span> <span className="font-semibold">{MONTHS[selectedInst.month - 1]}/{selectedInst.year}</span></p>
                <p><span className="text-muted-foreground">Valor:</span> <span className="font-semibold text-emerald-600">R$ {fmt(selectedInst.amount)}</span></p>
              </div>
              <div className="space-y-1.5">
                <Label>Observações (opcional)</Label>
                <Input
                  placeholder="Ex: Pago via Pix, dinheiro..."
                  value={obsInput}
                  onChange={e => setObsInput(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleConfirmPago} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <CheckCircle className="h-4 w-4 mr-1.5" />}
              Confirmar pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
