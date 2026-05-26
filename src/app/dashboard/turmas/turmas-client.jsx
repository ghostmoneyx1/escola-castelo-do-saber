"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Plus,
  Loader2,
  Save,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { SHIFTS } from "@/lib/constants";
import { StatusBadge } from "@/components/shared/status-badge";

const GRADES = [
  "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
  "Projeto Pé na Escola",
];

export default function TurmasClient({ initialClasses, units, studentCounts }) {
  const router = useRouter();
  const [dialog, setDialog] = useState({ open: false, editId: null });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", grade: "", shift: "", unit_id: "" });
  const [, startTransition] = useTransition();

  function openNew() {
    setForm({ name: "", grade: "", shift: "", unit_id: "" });
    setDialog({ open: true, editId: null });
  }

  function openEdit(cls) {
    setForm({ name: cls.name, grade: cls.grade, shift: cls.shift, unit_id: cls.unit_id });
    setDialog({ open: true, editId: cls.id });
  }

  async function handleSave() {
    if (!form.name || !form.grade || !form.shift || !form.unit_id) return;
    setSaving(true);
    const supabase = createClient();
    if (dialog.editId) {
      await supabase
        .from("classes")
        .update({ name: form.name, grade: form.grade, shift: form.shift, unit_id: form.unit_id })
        .eq("id", dialog.editId);
    } else {
      await supabase
        .from("classes")
        .insert({
          name: form.name,
          grade: form.grade,
          shift: form.shift,
          unit_id: form.unit_id,
          year: new Date().getFullYear(),
        });
    }
    setDialog({ open: false, editId: null });
    setSaving(false);
    startTransition(() => router.refresh());
  }

  async function handleDelete(id) {
    const supabase = createClient();
    await supabase.from("classes").update({ is_active: false }).eq("id", id);
    startTransition(() => router.refresh());
  }

  function getUnitName(unitId) {
    return units.find((u) => u.id === unitId)?.name || "—";
  }

  return (
    <div>
      <PageHeader
        title="Turmas"
        subtitle={`${initialClasses.length} turma${initialClasses.length !== 1 ? "s" : ""} ativa${initialClasses.length !== 1 ? "s" : ""}`}
      >
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4 mr-1.5" />
          Nova Turma
        </Button>
      </PageHeader>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {initialClasses.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={GraduationCap}
              title="Nenhuma turma cadastrada"
              description="Crie turmas para organizar os alunos"
            >
              <Button size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                Nova Turma
              </Button>
            </EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Turma</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Série / Ano</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Turno</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Unidade</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center">Alunos</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialClasses.map((cls) => (
                  <TableRow key={cls.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-5 py-3.5 text-sm font-medium text-foreground">{cls.name}</TableCell>
                    <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">{cls.grade}</TableCell>
                    <TableCell className="px-5 py-3.5"><StatusBadge status={cls.shift} /></TableCell>
                    <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">{getUnitName(cls.unit_id)}</TableCell>
                    <TableCell className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {studentCounts[cls.id] || 0}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(cls)}>
                            <Pencil className="h-4 w-4 mr-2" />Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(cls.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={dialog.open} onOpenChange={(v) => !saving && setDialog({ open: v, editId: v ? dialog.editId : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.editId ? "Editar Turma" : "Nova Turma"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Nome da Turma</Label>
              <Input placeholder="Ex: Turma A" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Série / Ano</Label>
              <Select value={form.grade} onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Turno</Label>
              <Select value={form.shift} onValueChange={(v) => setForm((p) => ({ ...p, shift: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{SHIFTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Unidade</Label>
              <Select value={form.unit_id} onValueChange={(v) => setForm((p) => ({ ...p, unit_id: v }))}>
                <SelectTrigger>
                  <SelectValue>
                    {form.unit_id
                      ? (units.find(u => u.id === form.unit_id)
                          ? `${units.find(u => u.id === form.unit_id).name} - ${units.find(u => u.id === form.unit_id).address}`
                          : form.unit_id)
                      : "Selecione"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>{units.map((u) => <SelectItem key={u.id} value={u.id}>{u.name} - {u.address}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false, editId: null })} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.name || !form.grade || !form.shift || !form.unit_id}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              {dialog.editId ? "Salvar" : "Criar Turma"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
