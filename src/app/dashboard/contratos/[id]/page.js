"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Loader2, ThumbsUp, Pencil, Save, CheckCircle, Clock, AlertTriangle, Trash2,
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
  "A vencer": "bg-slate-50 text-slate-500 border-slate-200",
  "Atrasado": "bg-red-50 text-red-600 border-red-200",
};

export default function ContratoDetailPage() {
  const { id } = useParams();
  const router  = useRouter();

  const [contract, setContract]       = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [editDialog, setEditDialog]   = useState(false);
  const [editInst, setEditInst]       = useState(null);
  const [saving, setSaving]           = useState(false);

  async function load() {
    const supabase = createClient();
    const [contractRes, instRes] = await Promise.all([
      supabase.from("contracts").select("*, students(name, classes(name, grade, shift))").eq("id", id).single(),
      supabase.from("installments").select("*").eq("contract_id", id).order("month"),
    ]);
    setContract(contractRes.data);
    setInstallments(instRes.data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function markAsPaid(inst) {
    const supabase = createClient();
    await supabase.from("installments").update({
      status:  "Pago",
      paid_at: new Date().toISOString(),
    }).eq("id", inst.id);
    load();
  }

  async function toggleContractStatus() {
    const supabase = createClient();
    await supabase.from("contracts").update({
      status: contract.status === "Aberto" ? "Fechado" : "Aberto",
    }).eq("id", id);
    load();
  }

  async function handleDeleteContract() {
    if (!confirm("Excluir este contrato e todas as parcelas?")) return;
    const supabase = createClient();
    await supabase.from("contracts").delete().eq("id", id);
    router.push("/dashboard/contratos");
  }

  function openEdit(inst) {
    setEditInst({ ...inst, amount: String(inst.amount), due_date: inst.due_date });
    setEditDialog(true);
  }

  async function handleSaveEdit() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("installments").update({
      amount:   parseFloat(editInst.amount) || 0,
      due_date: editInst.due_date,
      status:   editInst.status,
      paid_at:  editInst.status === "Pago" ? (editInst.paid_at || new Date().toISOString()) : null,
    }).eq("id", editInst.id);
    setEditDialog(false);
    setSaving(false);
    load();
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (!contract) return (
    <div className="text-center py-20 text-muted-foreground">Contrato não encontrado.</div>
  );

  const pagas     = installments.filter(i => i.status === "Pago").length;
  const atrasadas = installments.filter(i => calcStatus(i) === "Atrasado").length;
  const aVencer   = installments.filter(i => calcStatus(i) === "A vencer").length;
  const totalPago = installments.filter(i => i.status === "Pago").reduce((a, i) => a + Number(i.amount), 0);
  const totalAberto = installments.filter(i => i.status !== "Pago").reduce((a, i) => a + Number(i.amount), 0);

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title={contract.students?.name} subtitle={`Contrato ${contract.year} — Dia ${contract.due_day} de cada mês`}>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={toggleContractStatus}>
            {contract.status === "Aberto" ? "Fechar Contrato" : "Reabrir Contrato"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeleteContract} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/contratos"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
          </Button>
        </div>
      </PageHeader>

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-heading text-emerald-600">{pagas}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Pagas</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-heading text-amber-500">{aVencer}</p>
          <p className="text-xs text-muted-foreground mt-0.5">A vencer</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold font-heading text-red-600">{atrasadas}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Atrasadas</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 text-center">
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${
            contract.status === "Aberto" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"
          }`}>{contract.status}</span>
          <p className="text-xs text-muted-foreground mt-1">Status</p>
        </div>
      </div>

      {/* Financeiro */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-emerald-600 font-semibold mb-1">Total recebido</p>
          <p className="text-xl font-bold font-heading text-emerald-700">R$ {fmt(totalPago)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-600 font-semibold mb-1">Total em aberto</p>
          <p className="text-xl font-bold font-heading text-amber-700">R$ {fmt(totalAberto)}</p>
        </div>
      </div>

      {/* Parcelas */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Parcelas — {contract.year}</h2>
          <span className="text-xs text-muted-foreground">R$ {fmt(contract.monthly_amount)}/mês</span>
        </div>
        <div className="divide-y divide-border">
          {installments.map((inst, i) => {
            const status  = calcStatus(inst);
            const dueDate = new Date(inst.due_date + "T00:00:00").toLocaleDateString("pt-BR");
            return (
              <div key={inst.id} className={`flex items-center gap-4 px-5 py-3.5 ${status === "Atrasado" ? "bg-red-50/30" : ""}`}>
                {/* Número */}
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>

                {/* Mês */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{MONTHS[inst.month - 1]}/{inst.year}</p>
                  <p className="text-xs text-muted-foreground">Vence: {dueDate}</p>
                </div>

                {/* Valor */}
                <span className="text-sm font-bold font-heading shrink-0">R$ {fmt(inst.amount)}</span>

                {/* Status badge */}
                <span className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLE[status]}`}>
                  {status}
                </span>

                {/* Ações */}
                <div className="flex items-center gap-1 shrink-0">
                  {inst.status !== "Pago" && (
                    <button
                      onClick={() => markAsPaid(inst)}
                      title="Marcar como pago"
                      className="p-1.5 text-muted-foreground hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(inst)}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog editar parcela */}
      <Dialog open={editDialog} onOpenChange={v => !saving && setEditDialog(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Parcela</DialogTitle>
          </DialogHeader>
          {editInst && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Valor (R$)</Label>
                <Input type="number" step="0.01" value={editInst.amount} onChange={e => setEditInst(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Data de vencimento</Label>
                <Input type="date" value={editInst.due_date} onChange={e => setEditInst(p => ({ ...p, due_date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editInst.status} onValueChange={v => setEditInst(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A vencer">A vencer</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
