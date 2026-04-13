"use client";

import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Search,
  Loader2,
  Calendar,
  FilePlus,
  Download,
} from "lucide-react";
import { DOCUMENT_TYPES } from "@/lib/constants";
import { generateDocument } from "@/lib/pdf/generate";

export default function DocumentosPage() {
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [generateDialog, setGenerateDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newDoc, setNewDoc] = useState({ student_id: "", type: "" });
  const [studentSearch, setStudentSearch] = useState("");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    loadDocuments();
    loadStudents();
  }, []);

  async function loadDocuments() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("documents")
      .select("*, students(name)")
      .order("created_at", { ascending: false });
    setDocuments(data || []);
    setLoading(false);
  }

  async function loadStudents() {
    const supabase = createClient();
    const { data } = await supabase
      .from("students")
      .select("id, name")
      .eq("status", "Ativo")
      .order("name");
    setStudents(data || []);
  }

  async function handleGenerate() {
    if (!newDoc.student_id || !newDoc.type) return;
    setGenerating(true);

    try {
      // Generate and download PDF
      await generateDocument(newDoc.student_id, newDoc.type);

      // Save record to database
      const supabase = createClient();
      await supabase.from("documents").insert({
        student_id: newDoc.student_id,
        type: newDoc.type,
        status: "Emitido",
      });
    } catch (err) {
      console.error("Erro ao gerar documento:", err);
    }

    setGenerateDialog(false);
    setNewDoc({ student_id: "", type: "" });
    setGenerating(false);
    loadDocuments();
  }

  async function handleDownload(doc) {
    setDownloading(doc.id);
    try {
      await generateDocument(doc.student_id, doc.type);
    } catch (err) {
      console.error("Erro ao baixar documento:", err);
    }
    setDownloading(null);
  }

  const filtered = search.trim()
    ? documents.filter(
        (d) =>
          d.students?.name?.toLowerCase().includes(search.toLowerCase()) ||
          d.type.toLowerCase().includes(search.toLowerCase())
      )
    : documents;

  const filteredStudentsList = studentSearch.trim()
    ? students.filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
    : students;

  const accentColors = ["border-blue-500", "border-emerald-500", "border-amber-400", "border-violet-500", "border-pink-500"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos e Atestados"
        subtitle="Gere e gerencie documentos escolares"
      >
        <Button onClick={() => setGenerateDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Gerar Documento
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {DOCUMENT_TYPES.map((type, i) => {
          const count = documents.filter((d) => d.type === type).length;
          return (
            <div key={type} className={`bg-white p-6 rounded-xl border border-border border-l-4 ${accentColors[i % accentColors.length]} text-center`}>
              <p className="text-3xl font-bold text-foreground">{count}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1 line-clamp-1">{type}</p>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-muted rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por aluno ou tipo de documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-4 py-3 h-auto bg-white border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500/20 text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={FileText}
              title="Nenhum documento encontrado"
              description="Gere documentos para os alunos"
              action={
                <Button onClick={() => setGenerateDialog(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Gerar Documento
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Documento</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Aluno</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Data</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center w-[80px]">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/30 transition-colors border-b border-border">
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="text-sm font-medium text-foreground">{doc.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-sm font-medium text-muted-foreground">{doc.students?.name || "—"}</TableCell>
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5"><StatusBadge status={doc.status} /></TableCell>
                    <TableCell className="px-5 py-3.5 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-blue-50"
                        onClick={() => handleDownload(doc)}
                        disabled={downloading === doc.id}
                      >
                        {downloading === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Download className="h-4 w-4 text-blue-600" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Generate Dialog */}
      <Dialog open={generateDialog} onOpenChange={(v) => !generating && setGenerateDialog(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-blue-600" />
              Gerar Novo Documento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select value={newDoc.type} onValueChange={(v) => setNewDoc((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aluno</label>
              <Select value={newDoc.student_id} onValueChange={(v) => setNewDoc((p) => ({ ...p, student_id: v }))}>
                <SelectTrigger><SelectValue>{newDoc.student_id ? students.find(s => s.id === newDoc.student_id)?.name || newDoc.student_id : "Selecione o aluno"}</SelectValue></SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input placeholder="Buscar aluno..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="h-8" />
                  </div>
                  {filteredStudentsList.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialog(false)} disabled={generating}>Cancelar</Button>
            <Button onClick={handleGenerate} disabled={generating || !newDoc.student_id || !newDoc.type} size="sm">
              {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FilePlus className="h-4 w-4 mr-2" />}
              Gerar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
