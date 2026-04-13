"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  User,
  School,
  Bus,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  GENDERS,
  STUDENT_STATUSES,
  ENROLLMENT_TYPES,
} from "@/lib/constants";

const formatCEP = (v) =>
  v.replace(/\D/g,"").replace(/(\d{5})(\d)/,"$1-$2").replace(/(-\d{3})\d+?$/,"$1");

export default function EditarAlunoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [units, setUnits] = useState([]);
  const [error, setError]       = useState("");
  const [student, setStudent]   = useState(null);
  const [guardians, setGuardians] = useState([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [studentRes, classesRes, unitsRes, guardiansRes] = await Promise.all([
        supabase.from("students").select("*").eq("id", id).single(),
        supabase.from("classes").select("*").eq("is_active", true).order("grade"),
        supabase.from("units").select("*").order("name"),
        supabase.from("student_guardians").select("*, guardians(*)").eq("student_id", id),
      ]);
      if (studentRes.data) {
        setStudent({
          ...studentRes.data,
          birth_date: studentRes.data.birth_date || "",
          class_id: studentRes.data.class_id || "",
          unit_id: studentRes.data.unit_id || "",
        });
      }
      setClasses(classesRes.data || []);
      setUnits(unitsRes.data || []);
      setGuardians((guardiansRes.data || []).map(sg => ({ ...sg.guardians, _sg_id: sg.id })));
      setLoading(false);
    }
    load();
  }, [id]);

  function updateStudent(field, value) {
    setStudent((prev) => ({ ...prev, [field]: value }));
  }

  function updateGuardian(idx, field, value) {
    setGuardians(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  }

  async function handleCEPChange(idx, val) {
    const cep = formatCEP(val);
    updateGuardian(idx, "cep", cep);
    const clean = cep.replace(/\D/g, "");
    if (clean.length === 8) {
      try {
        const res  = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) updateGuardian(idx, "address", `${data.logradouro}, , ${data.bairro}, ${data.localidade} - ${data.uf}`);
      } catch {}
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!student) return;
    setError("");
    setSaving(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("students")
      .update({
        name: student.name.trim(),
        birth_date: student.birth_date || null,
        cpf: student.cpf || null,
        birth_certificate_number: student.birth_certificate_number || null,
        gender: student.gender || null,
        birthplace: student.birthplace || null,
        previous_school: student.previous_school || null,
        enrollment_type: student.enrollment_type || null,
        uses_transport: student.uses_transport,
        class_id: student.class_id || null,
        unit_id: student.unit_id || null,
        status: student.status,
        observations: student.observations || null,
      })
      .eq("id", id);

    if (updateError) {
      setError("Erro ao atualizar: " + updateError.message);
      setSaving(false);
      return;
    }

    // Salvar responsáveis
    for (const g of guardians) {
      if (!g.id) continue;
      await supabase.from("guardians").update({
        name:       g.name       || null,
        cpf:        g.cpf        || null,
        birth_date: g.birth_date || null,
        phone:      g.phone      || null,
        address:    g.address    || null,
      }).eq("id", g.id);
    }

    router.push(`/dashboard/alunos/${id}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Aluno não encontrado</p>
      </div>
    );
  }

  const filteredClasses = student.unit_id
    ? classes.filter((c) => c.unit_id === student.unit_id)
    : classes;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Editar Aluno" subtitle={student.name}>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/alunos/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Aluno */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold font-heading flex items-center gap-2 text-foreground mb-5">
            <User className="h-5 w-5 text-blue-600" />
            Dados do Aluno
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium">Nome Completo *</Label>
              <Input value={student.name} onChange={(e) => updateStudent("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data de Nascimento</Label>
              <Input type="date" value={student.birth_date} onChange={(e) => updateStudent("birth_date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">CPF</Label>
              <Input value={student.cpf || ""} onChange={(e) => updateStudent("cpf", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nº Certidão de Nascimento</Label>
              <Input value={student.birth_certificate_number || ""} onChange={(e) => updateStudent("birth_certificate_number", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sexo</Label>
              <Select value={student.gender || ""} onValueChange={(v) => updateStudent("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Naturalidade</Label>
              <Input value={student.birthplace || ""} onChange={(e) => updateStudent("birthplace", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={student.status} onValueChange={(v) => updateStudent("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STUDENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Dados Escolares */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold font-heading flex items-center gap-2 text-foreground mb-5">
            <School className="h-5 w-5 text-blue-600" />
            Dados Escolares
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Unidade</Label>
              <Select value={student.unit_id} onValueChange={(v) => { updateStudent("unit_id", v); updateStudent("class_id", ""); }}>
                <SelectTrigger><SelectValue placeholder="Selecione">
                  {student.unit_id ? (units.find(u => u.id === student.unit_id) ? units.find(u => u.id === student.unit_id).name : undefined) : undefined}
                </SelectValue></SelectTrigger>
                <SelectContent>{units.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Turma</Label>
              <Select value={student.class_id} onValueChange={(v) => updateStudent("class_id", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione">
                  {student.class_id ? (filteredClasses.find(c => c.id === student.class_id) ? `${filteredClasses.find(c => c.id === student.class_id).grade} - ${filteredClasses.find(c => c.id === student.class_id).name} (${filteredClasses.find(c => c.id === student.class_id).shift})` : undefined) : undefined}
                </SelectValue></SelectTrigger>
                <SelectContent>{filteredClasses.map((c) => <SelectItem key={c.id} value={c.id}>{`${c.grade} - ${c.name} (${c.shift})`}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de Matrícula</Label>
              <Select value={student.enrollment_type || ""} onValueChange={(v) => updateStudent("enrollment_type", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{ENROLLMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Escola Anterior</Label>
              <Input value={student.previous_school || ""} onChange={(e) => updateStudent("previous_school", e.target.value)} />
            </div>
            <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-muted">
              <Bus className="h-5 w-5 text-violet-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Transporte Escolar</p>
                <p className="text-xs text-muted-foreground">Utiliza condução</p>
              </div>
              <Switch checked={student.uses_transport} onCheckedChange={(v) => updateStudent("uses_transport", v)} />
            </div>
          </div>
        </div>

        {/* Responsáveis */}
        {guardians.length > 0 && (
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold font-heading flex items-center gap-2 text-foreground mb-5">
              <Users className="h-5 w-5 text-blue-600" />
              Responsáveis
            </h3>
            <div className="space-y-6">
              {guardians.map((g, idx) => (
                <div key={g.id} className="border border-border rounded-xl p-4 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.relationship}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-sm font-medium">Nome do Responsável</Label>
                      <Input placeholder="Nome completo" value={g.name || ""} onChange={e => updateGuardian(idx, "name", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">CPF</Label>
                      <Input placeholder="000.000.000-00" value={g.cpf || ""} onChange={e => updateGuardian(idx, "cpf", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Telefone</Label>
                      <Input placeholder="(00) 00000-0000" value={g.phone || ""} onChange={e => updateGuardian(idx, "phone", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Data de Nascimento</Label>
                      <Input type="date" value={g.birth_date || ""} onChange={e => updateGuardian(idx, "birth_date", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">CEP</Label>
                      <Input placeholder="00000-000" value={g.cep || ""} onChange={e => handleCEPChange(idx, e.target.value)} />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-sm font-medium">Endereço</Label>
                      <Input placeholder="Rua, número, bairro, cidade - UF" value={g.address || ""} onChange={e => updateGuardian(idx, "address", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observações */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Observações</Label>
            <Textarea value={student.observations || ""} onChange={(e) => updateStudent("observations", e.target.value)} rows={3} />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 font-medium ring-1 ring-red-100">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pb-6">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={`/dashboard/alunos/${id}`}>Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving}
            size="sm"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
