"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Loader2,
  Calendar,
} from "lucide-react";

export default function MatriculasPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      let query = supabase
        .from("enrollments")
        .select("*, students(name, cpf), classes(name, grade, shift)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "Todos") {
        query = query.eq("status", statusFilter);
      }

      const { data } = await query;
      let results = data || [];

      if (search.trim()) {
        const s = search.toLowerCase();
        results = results.filter(
          (e) => e.students?.name?.toLowerCase().includes(s)
        );
      }

      setEnrollments(results);
      setLoading(false);
    }
    setLoading(true);
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matrículas"
        subtitle={
          loading
            ? "Carregando..."
            : `${enrollments.length} matrícula${enrollments.length !== 1 ? "s" : ""}`
        }
      >
        <Button asChild size="sm" className="whitespace-nowrap">
          <Link href="/dashboard/matriculas/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova Matrícula
          </Link>
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="bg-muted rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-4 py-3 h-auto bg-white border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500/20 text-sm placeholder:text-muted-foreground"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-white border-none py-3 px-4 h-auto min-w-[160px] text-sm font-medium shadow-none w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Ativa">Ativa</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
            <SelectItem value="Transferida">Transferida</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ClipboardList}
              title="Nenhuma matrícula encontrada"
              description="Crie uma nova ficha de matrícula"
              action={
                <Button asChild size="sm">
                  <Link href="/dashboard/matriculas/nova">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Matrícula
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Aluno</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Turma</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Ano</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Data</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} className="hover:bg-muted/30 transition-colors border-b border-border">
                    <TableCell className="px-5 py-3.5">
                      <p className="text-sm font-medium text-foreground">
                        {enrollment.students?.name || "—"}
                      </p>
                      {enrollment.students?.cpf && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          CPF: {enrollment.students.cpf}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        {enrollment.classes?.grade} - {enrollment.classes?.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className="text-sm font-medium text-muted-foreground">{enrollment.year}</span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(enrollment.enrollment_date).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <StatusBadge status={enrollment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
