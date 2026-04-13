"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Loader2,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Download,
  CheckCircle2,
  AlertTriangle,
  Bus,
} from "lucide-react";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    "bg-blue-600", "bg-emerald-600", "bg-amber-600",
    "bg-rose-600", "bg-violet-600", "bg-cyan-600",
    "bg-indigo-600", "bg-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function StatCard({ label, value, icon: Icon, loading }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground font-heading tracking-tight mt-1">
            {loading ? "—" : value}
          </p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="h-[18px] w-[18px] text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

export default function AlunosPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos os status");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, transport: 0 });
  const router = useRouter();

  const loadStudents = useCallback(async function () {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("students")
      .select("*, classes(name, grade), units(name)")
      .order("name");

    if (statusFilter !== "Todos os status") {
      query = query.eq("status", statusFilter);
    }
    if (typeFilter !== "Todos") {
      query = query.eq("enrollment_type", typeFilter);
    }

    const { data } = await query;
    const all = data || [];
    setStudents(all);
    setStats({
      total: all.length,
      active: all.filter((s) => s.status === "Ativo").length,
      pending: all.filter((s) => s.status === "Pendente").length,
      transport: all.filter((s) => s.uses_transport).length,
    });
    setLoading(false);
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  async function handleDelete() {
    if (!deleteDialog) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("students").delete().eq("id", deleteDialog.id);
    setDeleteDialog(null);
    setDeleting(false);
    loadStudents();
  }

  const filtered = search.trim()
    ? students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    : students;

  return (
    <div>
      <PageHeader title="Alunos">
        <Button
          variant="outline"
          size="sm"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Exportar
        </Button>
        <Button
          size="sm"
          onClick={() => router.push("/dashboard/alunos/novo")}
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Novo Aluno
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total de Alunos" value={stats.total} icon={Users} loading={loading} />
        <StatCard label="Ativos" value={stats.active} icon={CheckCircle2} loading={loading} />
        <StatCard label="Pendentes" value={stats.pending} icon={AlertTriangle} loading={loading} />
        <StatCard label="Transporte" value={stats.transport} icon={Bus} loading={loading} />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-0 sm:min-w-[260px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos os status">Todos os status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Transferido">Transferido</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-10 w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os tipos</SelectItem>
            <SelectItem value="Particular">Particular</SelectItem>
            <SelectItem value="Projeto">Projeto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="Nenhum aluno encontrado"
              description="Cadastre novos alunos para começar"
            >
              <Button
                size="sm"
                onClick={() => router.push("/dashboard/alunos/novo")}
              >
                <UserPlus className="h-4 w-4 mr-1.5" />
                Novo Aluno
              </Button>
            </EmptyState>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Nome</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Turma</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Unidade</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Tipo</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-right w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback
                            className={`${getAvatarColor(student.name)} text-white text-[11px] font-semibold rounded-lg`}
                          >
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.cpf || "Sem CPF"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">
                      {student.classes?.grade || "—"}
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-sm text-muted-foreground">
                      {student.units?.name || "—"}
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        student.enrollment_type === "Projeto"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        {student.enrollment_type === "Projeto" ? "Projeto" : "Particular"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <StatusBadge status={student.status} />
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/alunos/${student.id}`)}>
                            <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/alunos/${student.id}/editar`)}>
                            <Pencil className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteDialog(student)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-5 py-3 flex items-center justify-between border-t border-border">
            <p className="text-xs text-muted-foreground">
              {filtered.length} aluno{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          </>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(v) => !deleting && !v && setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir o aluno{" "}
            <strong className="text-foreground">{deleteDialog?.name}</strong>? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
