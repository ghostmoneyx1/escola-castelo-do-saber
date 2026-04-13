"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Users, Plus, Loader2, Save, Pencil, Trash2, Receipt, Search,
} from "lucide-react";
import Link from "next/link";
import { EMPLOYEE_ROLES } from "@/lib/constants";

const INITIAL_FORM = { name: "", cpf: "", role: "", base_salary: "", status: "Ativo", observations: "" };

function fmt(value) {
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export default function ColaboradoresPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [dialog, setDialog]       = useState(false);
  const [saving, setSaving]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(INITIAL_FORM);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("name");
    setEmployees(data || []);
    setLoading(false);
  }

  function openNew() {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setDialog(true);
  }

  function openEdit(emp) {
    setEditingId(emp.id);
    setForm({
      name: emp.name,
      cpf: emp.cpf || "",
      role: emp.role,
      base_salary: emp.base_salary,
      status: emp.status,
      observations: emp.observations || "",
    });
    setDialog(true);
  }

  async function handleSave() {
    if (!form.name || !form.role) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      cpf: form.cpf.trim() || null,
      role: form.role,
      base_salary: parseFloat(form.base_salary) || 0,
      status: form.status,
      observations: form.observations.trim() || null,
    };
    if (editingId) {
      await supabase.from("employees").update(payload).eq("id", editingId);
    } else {
      await supabase.from("employees").insert(payload);
    }
    setDialog(false);
    setSaving(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Excluir este colaborador? Os pagamentos vinculados também serão removidos.")) return;
    const supabase = createClient();
    await supabase.from("employees").delete().eq("id", id);
    load();
  }

  const filtered = search.trim()
    ? employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()))
    : employees;

  const ativos   = employees.filter(e => e.status === "Ativo").length;
  const inativos = employees.filter(e => e.status === "Inativo").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Colaboradores" subtitle="Gerencie a equipe da escola">
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
            <Link href="/dashboard/colaboradores/pagamentos">
              <Receipt className="h-4 w-4 mr-1.5" />
              Pagamentos
            </Link>
          </Button>
          <Button size="sm" onClick={openNew} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-1.5" />
            Novo Colaborador
          </Button>
        </div>
      </PageHeader>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground font-medium mb-1">Total de Colaboradores</p>
          <p className="text-2xl font-bold font-heading">{employees.length}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground font-medium mb-1">Ativos</p>
          <p className="text-2xl font-bold font-heading text-emerald-600">{ativos}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground font-medium mb-1">Inativos</p>
          <p className="text-2xl font-bold font-heading text-slate-400">{inativos}</p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou cargo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Lista */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Users} title="Nenhum colaborador encontrado" description="Cadastre o primeiro membro da equipe">
              <Button size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" /> Novo Colaborador
              </Button>
            </EmptyState>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Nome</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Cargo</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">CPF</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Salário Base</th>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Status</th>
                    <th className="px-5 py-3 w-[120px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">{emp.name}</p>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{emp.role}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{emp.cpf || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold font-heading">R$ {fmt(emp.base_salary)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          emp.status === "Ativo"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => router.push(`/dashboard/colaboradores/pagamentos/novo?employee_id=${emp.id}`)}
                            title="Lançar pagamento"
                            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-muted transition-colors"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(emp)}
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
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
              <p className="text-xs text-muted-foreground">{filtered.length} colaborador{filtered.length !== 1 ? "es" : ""}</p>
            </div>
          </>
        )}
      </div>

      {/* Dialog criar/editar */}
      <Dialog open={dialog} onOpenChange={v => !saving && setDialog(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {editingId ? "Editar Colaborador" : "Novo Colaborador"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome completo *</Label>
              <Input placeholder="Nome do colaborador" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Cargo *</Label>
                <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>CPF</Label>
                <Input placeholder="000.000.000-00" value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Salário Base (R$)</Label>
                <Input type="number" step="0.01" placeholder="0.00" value={form.base_salary} onChange={e => setForm(p => ({ ...p, base_salary: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Observações</Label>
              <Input placeholder="Opcional" value={form.observations} onChange={e => setForm(p => ({ ...p, observations: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.name || !form.role}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
