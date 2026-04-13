"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  ArrowLeft,
  Save,
  Loader2,
  School,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { ENROLLMENT_TYPES } from "@/lib/constants";

function NovaMatriculaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStudentId = searchParams.get("student_id") || "";

  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState([]);
  const [units, setUnits] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    student_id: initialStudentId,
    unit_id: "",
    class_id: "",
    previous_school: "",
    enrollment_type: "",
  });

  useEffect(() => {
    async function loadOptions() {
      const supabase = createClient();
      const [classesRes, unitsRes, studentsRes] = await Promise.all([
        supabase.from("classes").select("*").eq("is_active", true).order("grade"),
        supabase.from("units").select("*").order("name"),
        supabase.from("students").select("id, name, cpf").eq("status", "Ativo").order("name"),
      ]);
      setClasses(classesRes.data || []);
      setUnits(unitsRes.data || []);
      setStudentsList(studentsRes.data || []);
    }
    loadOptions();
  }, []);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!form.student_id) {
      setError("Selecione um aluno");
      setSaving(false);
      return;
    }
    if (!form.unit_id) {
      setError("Selecione uma unidade");
      setSaving(false);
      return;
    }
    if (!form.class_id) {
      setError("Selecione uma turma");
      setSaving(false);
      return;
    }

    const supabase = createClient();

    // Verification: check if the student is already enrolled in active state this year
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", form.student_id)
      .eq("year", new Date().getFullYear())
      .eq("status", "Ativa")
      .maybeSingle();

    if (existingEnrollment) {
      setError("Este aluno já possui uma matrícula ativa para o ano letivo atual.");
      setSaving(false);
      return;
    }

    // 1. Update the student record with academic fields
    const { error: studentError } = await supabase
      .from("students")
      .update({
        unit_id: form.unit_id,
        class_id: form.class_id,
        previous_school: form.previous_school || null,
        enrollment_type: form.enrollment_type || null,
      })
      .eq("id", form.student_id);

    if (studentError) {
      setError("Erro ao atualizar aluno: " + studentError.message);
      setSaving(false);
      return;
    }

    // 2. Create the enrollment record
    const { error: enrollError } = await supabase.from("enrollments").insert({
      student_id: form.student_id,
      class_id: form.class_id,
      year: new Date().getFullYear(),
      status: "Ativa",
    });

    if (enrollError) {
      setError("Erro ao criar matrícula: " + enrollError.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard/matriculas");
  }

  const filteredClasses = form.unit_id
    ? classes.filter((c) => c.unit_id === form.unit_id)
    : classes;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selecao do Aluno */}
      <div className="bg-white border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <h2 className="font-heading text-lg font-bold text-foreground">Seleção de Aluno</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium">Aluno *</Label>
            <Select
              value={form.student_id}
              onValueChange={(v) => updateForm("student_id", v)}
              renderValue={(v) => {
                const s = studentsList.find((s) => s.id === v);
                return s ? s.name : null;
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {studentsList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {`${s.name} ${s.cpf ? `(CPF: ${s.cpf})` : ''}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Caso o aluno não esteja na lista, cadastre-o primeiro em <Link href="/dashboard/alunos/novo" className="text-blue-600 underline">Novo Aluno</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Dados Escolares */}
      <div className="bg-white border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <School className="h-5 w-5 text-blue-600" />
          <h2 className="font-heading text-lg font-bold text-foreground">Alocação de Matrícula</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Unidade *</Label>
            <Select
              value={form.unit_id}
              onValueChange={(v) => {
                updateForm("unit_id", v);
                updateForm("class_id", "");
              }}
              renderValue={(v) => {
                const u = units.find((u) => u.id === v);
                return u ? u.name : null;
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {`${u.name} - ${u.address}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Turma *</Label>
            <Select
              value={form.class_id}
              onValueChange={(v) => updateForm("class_id", v)}
              disabled={!form.unit_id}
              renderValue={(v) => {
                const c = filteredClasses.find((c) => c.id === v);
                return c ? `${c.grade} - ${c.name} (${c.shift})` : null;
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {filteredClasses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {`${c.grade} - ${c.name} (${c.shift})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Matrícula</Label>
            <Select
              value={form.enrollment_type}
              onValueChange={(v) => updateForm("enrollment_type", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {ENROLLMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="previous_school" className="text-sm font-medium">Escola Anterior</Label>
            <Input
              id="previous_school"
              placeholder="Nome da escola anterior (se houver)"
              value={form.previous_school}
              onChange={(e) => updateForm("previous_school", e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 font-semibold ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button type="button" asChild variant="outline" size="sm">
          <Link href="/dashboard/matriculas">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={saving} size="sm">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? "Efetuando..." : "Efetuar Matrícula"}
        </Button>
      </div>
    </form>
  );
}

export default function NovaMatriculaPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Nova Matrícula"
        subtitle="Vincule um aluno a uma turma para o ano letivo atual"
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/matriculas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </PageHeader>
      
      <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
        <NovaMatriculaForm />
      </Suspense>
    </div>
  );
}
