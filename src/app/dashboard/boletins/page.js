"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BookOpen,
  Loader2,
  Save,
  Pencil,
  Printer,
  Download,
} from "lucide-react";
import { UNIT_LABELS } from "@/lib/constants";
import { isInfantil } from "@/lib/boletim-infantil";
import { BoletimInfantil } from "@/components/boletins/boletim-infantil";

// Bimestre ativo atual para a Fase 1 (Bimestres menores que este ficam trancados)
const ATUAL_BIMESTRE = 2;

export default function BoletinsPage() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("1");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState({ open: false, grade: null });
  const [editScore, setEditScore] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [studentsRes, subjectsRes] = await Promise.all([
        supabase
          .from("students")
          .select("id, name, classes(name, grade)")
          .eq("status", "Ativo")
          .order("name"),
        supabase.from("subjects").select("*").eq("is_active", true).order("sort_order"),
      ]);
      setStudents(studentsRes.data || []);
      setSubjects(subjectsRes.data || []);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedStudent) {
      setGrades([]);
      return;
    }
    async function loadGrades() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("grades")
        .select("*, subjects(name)")
        .eq("student_id", selectedStudent)
        .eq("year", new Date().getFullYear());
      setGrades(data || []);
      setLoading(false);
    }
    loadGrades();
  }, [selectedStudent]);

  function getScore(subjectId, unit) {
    const grade = grades.find(
      (g) => g.subject_id === subjectId && g.unit === unit
    );
    return grade?.score;
  }

  function getGradeRecord(subjectId, unit) {
    return grades.find(
      (g) => g.subject_id === subjectId && g.unit === unit
    );
  }

  function getAverage(subjectId) {
    const subGrades = grades.filter((g) => g.subject_id === subjectId && g.score !== null);
    if (subGrades.length === 0) return null;
    const sum = subGrades.reduce((acc, g) => acc + Number(g.score), 0);
    return (sum / subGrades.length).toFixed(1);
  }

  async function handleSaveGrade() {
    if (!editDialog.grade) return;
    setSaving(true);
    const supabase = createClient();
    const { subjectId, unit } = editDialog.grade;
    const score = editScore === "" ? null : parseFloat(editScore);

    const existing = getGradeRecord(subjectId, unit);

    if (existing) {
      await supabase.from("grades").update({ score }).eq("id", existing.id);
    } else {
      await supabase.from("grades").insert({
        student_id: selectedStudent,
        subject_id: subjectId,
        unit,
        score,
        year: new Date().getFullYear(),
      });
    }

    const { data } = await supabase
      .from("grades")
      .select("*, subjects(name)")
      .eq("student_id", selectedStudent)
      .eq("year", new Date().getFullYear());
    setGrades(data || []);

    setEditDialog({ open: false, grade: null });
    setSaving(false);
  }

  const filteredStudents = search.trim()
    ? students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : students;

  const selectedStudentData = students.find((s) => s.id === selectedStudent);
  const studentIsInfantil = isInfantil(selectedStudentData?.classes?.grade);

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page {
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #printable-boletim, #printable-boletim * {
            visibility: visible;
          }
          #printable-boletim {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 40px !important;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="no-print">
        <PageHeader
          title="Boletim Escolar"
          subtitle="Consulte e lance as notas dos alunos por unidade"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-muted rounded-xl p-4 flex flex-wrap items-center gap-4 no-print">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="bg-white border-none py-3 px-4 h-auto min-w-[160px] w-full text-sm font-medium shadow-none">
              <SelectValue placeholder="Selecione um aluno">
                {selectedStudentData ? `${selectedStudentData.name} — ${selectedStudentData.classes?.grade} ${selectedStudentData.classes?.name}` : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Buscar aluno..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-4 pr-4 py-2 h-auto bg-white border-gray-200 text-sm"
                />
              </div>
              {filteredStudents.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} — {s.classes?.grade} {s.classes?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!studentIsInfantil && (
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="bg-white border-none py-3 px-4 h-auto min-w-[160px] text-sm font-medium shadow-none w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((u) => (
                <SelectItem key={u} value={String(u)}>{UNIT_LABELS[u]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!selectedStudent ? (
        <div className="bg-white border border-border rounded-xl py-16 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-muted-foreground font-medium">Selecione um aluno para visualizar o boletim</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20 no-print">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : studentIsInfantil ? (
        <BoletimInfantil student={selectedStudentData} />
      ) : (
        <div id="printable-boletim" className="bg-white">
          {/* Print Header */}
          <div className="hidden print:flex flex-col items-center justify-center mb-10 pb-6 border-b-2 border-slate-200">
            <Image src="/logo.png" alt="Escola Castelo do Saber Logo" width={300} height={80} priority className="h-20 w-auto mb-4" />
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Escola Castelo do Saber</h1>
            <p className="text-sm text-slate-500 font-medium">Educação Infantil e Ensino Fundamental</p>
            <p className="text-sm text-slate-500">Boletim Escolar Oficial - Ano Letivo {new Date().getFullYear()}</p>
          </div>

          {selectedStudentData && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 p-5 mb-6 print:bg-white print:border-none print:p-0 print:mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl text-foreground mb-1">{selectedStudentData.name}</h2>
                  <p className="text-sm text-foreground/80 font-medium">
                    {selectedStudentData.classes?.grade} - {selectedStudentData.classes?.name}
                  </p>
                  <p className="text-sm text-foreground/80 font-medium print:hidden">
                    Ano Letivo {new Date().getFullYear()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right mr-4 no-print">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unidade Atual</p>
                    <p className="font-bold text-blue-600">{UNIT_LABELS[selectedUnit]}</p>
                  </div>
                  <Button 
                    onClick={() => window.print()}
                    className="no-print bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Gerar PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Disciplina</TableHead>
                    {[1, 2, 3, 4].map((u) => (
                      <TableHead key={u} className={`text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center ${String(u) === selectedUnit ? "bg-blue-50/60" : ""}`}>
                        {UNIT_LABELS[u]}
                      </TableHead>
                    ))}
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center">Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => {
                    const avg = getAverage(subject.id);
                    return (
                      <TableRow key={subject.id} className="hover:bg-muted/30 transition-colors border-b border-border">
                        <TableCell className="px-5 py-3.5 text-sm font-medium text-foreground">{subject.name}</TableCell>
                        {[1, 2, 3, 4].map((u) => {
                          const score = getScore(subject.id, u);
                          const isCurrentUnit = String(u) === selectedUnit;
                          const isLocked = u < ATUAL_BIMESTRE;
                          return (
                            <TableCell key={u} className={`px-5 py-3.5 text-center ${isCurrentUnit ? "bg-blue-50/40" : ""}`}>
                              <button
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm ${isLocked ? "cursor-not-allowed opacity-70" : "hover:bg-gray-100 transition-colors"}`}
                                disabled={isLocked}
                                title={isLocked ? "Bimestre Trancado" : "Editar Nota"}
                                onClick={() => {
                                  if (isLocked) {
                                    alert("Este bimestre já foi encerrado e suas notas estão trancadas.");
                                    return;
                                  }
                                  setEditScore(score != null ? String(score) : "");
                                  setEditDialog({
                                    open: true,
                                    grade: { subjectId: subject.id, unit: u, subjectName: subject.name },
                                  });
                                }}
                              >
                                {score != null ? (
                                  <span className={score >= 7 ? "text-emerald-600 font-bold" : score >= 5 ? "text-amber-600 font-bold" : "text-red-600 font-bold"}>
                                    {score}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                                {!isLocked && <Pencil className="h-3 w-3 text-muted-foreground no-print" />}
                              </button>
                            </TableCell>
                          );
                        })}
                        <TableCell className="px-5 py-3.5 text-center">
                          {avg !== null ? (
                            <span className={`font-bold text-sm ${avg >= 7 ? "text-emerald-600" : avg >= 5 ? "text-amber-600" : "text-red-600"}`}>
                              {avg}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Print Footer with Signatures */}
          <div className="hidden print:block mt-32">
            <div className="flex justify-around items-center">
              <div className="text-center w-64">
                <div className="border-t border-slate-800 mb-2"></div>
                <p className="font-bold text-sm text-slate-800 uppercase tracking-widest">Diretoria</p>
                <p className="text-xs text-slate-500 font-medium">Escola Castelo do Saber</p>
              </div>
              <div className="text-center w-64">
                <div className="border-t border-slate-800 mb-2"></div>
                <p className="font-bold text-sm text-slate-800 uppercase tracking-widest">Secretaria</p>
                <p className="text-xs text-slate-500 font-medium">Escola Castelo do Saber</p>
              </div>
            </div>
            <div className="text-center mt-16">
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Documento emitido em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      )}

      <Dialog open={editDialog.open} onOpenChange={(open) => !saving && setEditDialog({ open, grade: open ? editDialog.grade : null })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Lançar Nota</DialogTitle>
          </DialogHeader>
          {editDialog.grade && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disciplina</p>
                <p className="font-medium text-foreground mt-0.5">{editDialog.grade.subjectName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Período</p>
                <p className="font-medium text-foreground mt-0.5">{UNIT_LABELS[editDialog.grade.unit]}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nota (0 a 10)</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="0.0"
                  value={editScore}
                  onChange={(e) => setEditScore(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, grade: null })} disabled={saving} size="sm">
              Cancelar
            </Button>
            <Button onClick={handleSaveGrade} disabled={saving} size="sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
