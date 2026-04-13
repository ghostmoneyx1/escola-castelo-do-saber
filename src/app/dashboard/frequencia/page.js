"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarCheck,
  Loader2,
  Save,
  CheckCircle,
  XCircle,
  Link2,
  Check,
} from "lucide-react";

export default function FrequenciaPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]       = useState(false);
  const [copied, setCopied]     = useState(false);

  function copyLink() {
    const url = `${window.location.origin}/chamada/${selectedClass}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("classes")
        .select("*")
        .eq("is_active", true)
        .order("grade");
      setClasses(data || []);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedClass || !selectedDate) return;
    async function loadStudentsAndAttendance() {
      setLoading(true);
      setSaved(false);
      const supabase = createClient();

      const [studentsRes, attendanceRes] = await Promise.all([
        supabase
          .from("students")
          .select("id, name")
          .eq("class_id", selectedClass)
          .eq("status", "Ativo")
          .order("name"),
        supabase
          .from("attendance")
          .select("*")
          .eq("class_id", selectedClass)
          .eq("date", selectedDate),
      ]);

      setStudents(studentsRes.data || []);

      const att = {};
      (studentsRes.data || []).forEach((s) => {
        const record = (attendanceRes.data || []).find(
          (a) => a.student_id === s.id
        );
        att[s.id] = record ? record.present : true;
      });
      setAttendance(att);
      setLoading(false);
    }
    loadStudentsAndAttendance();
  }, [selectedClass, selectedDate]);

  function toggleAttendance(studentId) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
    setSaved(false);
  }

  function markAll(present) {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = present;
    });
    setAttendance(updated);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    // Delete existing records for this class/date
    await supabase
      .from("attendance")
      .delete()
      .eq("class_id", selectedClass)
      .eq("date", selectedDate);

    // Insert new records
    const records = students.map((s) => ({
      student_id: s.id,
      class_id: selectedClass,
      date: selectedDate,
      present: attendance[s.id] ?? true,
    }));

    if (records.length > 0) {
      await supabase.from("attendance").insert(records);
    }

    setSaving(false);
    setSaved(true);
  }

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  function getInitials(name) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controle de Frequência"
        subtitle="Registre a presença dos alunos por turma e data"
      >
        {selectedClass && (
          <Button variant="outline" size="sm" onClick={copyLink} className="whitespace-nowrap">
            {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Link2 className="h-4 w-4 mr-1.5" />}
            {copied ? "Link copiado!" : "Copiar link da chamada"}
          </Button>
        )}
      </PageHeader>

      {/* Filter Bar */}
      <div className="bg-muted rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="bg-white border-none py-3 px-4 h-auto min-w-[160px] text-sm font-medium shadow-none">
              <SelectValue>
                {selectedClass ? classes.find(c => c.id === selectedClass) ? `${classes.find(c => c.id === selectedClass).grade} - ${classes.find(c => c.id === selectedClass).name} (${classes.find(c => c.id === selectedClass).shift})` : selectedClass : "Selecione uma turma"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.grade} - {c.name} ({c.shift})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="pl-4 pr-4 py-3 h-auto bg-white border-none shadow-none focus-visible:ring-2 focus-visible:ring-blue-500/20 text-sm w-full sm:w-[200px]"
        />
      </div>

      {!selectedClass ? (
        <div className="bg-white border border-border rounded-xl py-16 text-center">
          <CalendarCheck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-muted-foreground font-medium">
            Selecione uma turma e data para registrar a frequência
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white border border-border rounded-xl py-16 text-center">
          <p className="text-muted-foreground font-medium">Nenhum aluno nesta turma</p>
        </div>
      ) : (
        <>
          {/* Summary + Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="bg-white p-4 rounded-xl border border-border border-l-4 border-l-emerald-500 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-bold text-foreground">{presentCount}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">presentes</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-border border-l-4 border-l-red-500 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-bold text-foreground">{absentCount}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ausentes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => markAll(true)}>
                Todos Presentes
              </Button>
              <Button variant="outline" size="sm" onClick={() => markAll(false)}>
                Todos Ausentes
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saved ? "Salvo!" : "Salvar"}
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Aluno</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center w-[120px]">Presença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border"
                    onClick={() => toggleAttendance(student.id)}
                  >
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={attendance[student.id] ?? true}
                          onCheckedChange={() => toggleAttendance(student.id)}
                          className="h-5 w-5"
                        />
                        <span
                          className={`ml-2 text-xs font-bold ${
                            attendance[student.id]
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {attendance[student.id] ? "Presente" : "Ausente"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
