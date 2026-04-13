"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Users,
  Bus,
} from "lucide-react";
import Link from "next/link";
import { GENDERS, RELATIONSHIPS, ENROLLMENT_TYPES } from "@/lib/constants";

const emptyGuardian = {
  name: "",
  relationship: "",
  cpf: "",
  birth_date: "",
  phone: "",
  address: "",
  cep: "",
};

export default function NovoAlunoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const formatCPF = (v) => {
    return v.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})/,"$1-$2").replace(/(-\d{2})\d+?$/,"$1");
  };
  const formatPhone = (v) => {
    return v.replace(/\D/g,"").replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d{4})/,"$1-$2").replace(/(-\d{4})\d+?$/,"$1");
  };
  const formatCEP = (v) => {
    return v.replace(/\D/g,"").replace(/(\d{5})(\d)/,"$1-$2").replace(/(-\d{3})\d+?$/,"$1");
  };

  async function handleCEPChange(index, cepValue) {
    const formattedCEP = formatCEP(cepValue);
    updateGuardian(index, "cep", formattedCEP);
    
    const cleanCep = formattedCEP.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          const address = `${data.logradouro}, , ${data.bairro}, ${data.localidade} - ${data.uf}`;
          updateGuardian(index, "address", address);
        }
      } catch (e) {
        console.error("Erro ao buscar CEP", e);
      }
    }
  }


  // Student fields
  const [student, setStudent] = useState({
    name: "",
    birth_date: "",
    cpf: "",
    birth_certificate_number: "",
    gender: "",
    birthplace: "",
    enrollment_type: "Particular", // default
    uses_transport: false,
    observations: "",
  });

  // Guardians (Pai, Mãe by default)
  const [guardians, setGuardians] = useState([
    { ...emptyGuardian, relationship: "Mãe" },
    { ...emptyGuardian, relationship: "Pai" },
  ]);

  function updateStudent(field, value) {
    setStudent((prev) => ({ ...prev, [field]: value }));
  }

  function updateGuardian(index, field, value) {
    setGuardians((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addGuardian() {
    setGuardians((prev) => [...prev, { ...emptyGuardian }]);
  }

  function removeGuardian(index) {
    if (guardians.length <= 1) return;
    setGuardians((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!student.name.trim()) {
      setError("Nome do aluno é obrigatório");
      setSaving(false);
      return;
    }

    const supabase = createClient();

    // 1. Create student
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .insert({
        name: student.name.trim(),
        birth_date: student.birth_date || null,
        cpf: student.cpf || null,
        birth_certificate_number: student.birth_certificate_number || null,
        gender: student.gender || null,
        birthplace: student.birthplace || null,
        enrollment_type: student.enrollment_type || "Particular",
        uses_transport: student.uses_transport,
        observations: student.observations || null,
        status: "Ativo",
      })
      .select()
      .single();

    if (studentError) {
      setError("Erro ao cadastrar aluno: " + studentError.message);
      setSaving(false);
      return;
    }

    // 2. Create guardians
    const validGuardians = guardians.filter((g) => g.name.trim());
    for (const guardian of validGuardians) {
      const { data: guardianData, error: guardianError } = await supabase
        .from("guardians")
        .insert({
          name: guardian.name.trim(),
          relationship: guardian.relationship || null,
          cpf: guardian.cpf || null,
          birth_date: guardian.birth_date || null,
          phone: guardian.phone || null,
          address: guardian.address || null,
        })
        .select()
        .single();

      if (!guardianError && guardianData) {
        await supabase.from("student_guardians").insert({
          student_id: studentData.id,
          guardian_id: guardianData.id,
          is_primary: guardian.relationship === "Mãe",
        });
      }
    }

    // Go to New Enrollment for this student
    router.push(`/dashboard/matriculas/nova?student_id=${studentData.id}`);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Novo Aluno"
        subtitle="Cadastre os dados pessoais do aluno e responsáveis"
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/alunos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Aluno */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="font-heading text-lg font-bold text-foreground">Dados do Aluno</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Nome completo do aluno"
                value={student.name}
                onChange={(e) => updateStudent("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date" className="text-sm font-medium">Data de Nascimento *</Label>
              <Input
                id="birth_date"
                type="date"
                value={student.birth_date}
                onChange={(e) => updateStudent("birth_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={student.cpf}
                onChange={(e) => updateStudent("cpf", formatCPF(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_certificate" className="text-sm font-medium">Nº Certidão de Nascimento</Label>
              <Input
                id="birth_certificate"
                placeholder="Nº da certidão"
                value={student.birth_certificate_number}
                onChange={(e) =>
                  updateStudent("birth_certificate_number", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sexo</Label>
              <Select
                value={student.gender}
                onValueChange={(v) => updateStudent("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Naturalidade</Label>
              <Input
                id="birthplace"
                placeholder="Cidade / Estado"
                value={student.birthplace}
                onChange={(e) => updateStudent("birthplace", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de Matrícula</Label>
              <Select
                value={student.enrollment_type}
                onValueChange={(v) => updateStudent("enrollment_type", v)}
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

            <div className="md:col-span-3 flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 ring-1 ring-violet-100/50 mt-2">
              <Bus className="h-5 w-5 text-violet-500" />
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Transporte Escolar</p>
                <p className="text-xs text-muted-foreground">
                  Aluno utiliza a condução da escola
                </p>
              </div>
              <Switch
                checked={student.uses_transport}
                onCheckedChange={(v) => updateStudent("uses_transport", v)}
              />
            </div>
          </div>
        </div>

        {/* Responsaveis */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="font-heading text-lg font-bold text-foreground">Responsáveis</h2>
            </div>
            <Button type="button" onClick={addGuardian} variant="outline" size="sm">
              + Adicionar
            </Button>
          </div>
          <div className="space-y-6">
            {guardians.map((guardian, index) => (
              <div key={index} className="space-y-4">
                {index > 0 && <div className="border-t border-border pt-6" />}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-muted-foreground">
                    Responsável {index + 1}
                    {guardian.relationship ? ` (${guardian.relationship})` : ""}
                  </p>
                  {guardians.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                      onClick={() => removeGuardian(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm font-medium">Nome Completo *</Label>
                    <Input
                      placeholder="Nome completo"
                      value={guardian.name}
                      onChange={(e) =>
                        updateGuardian(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Parentesco</Label>
                    <Select
                      value={guardian.relationship}
                      onValueChange={(v) =>
                        updateGuardian(index, "relationship", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIPS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">CPF</Label>
                    <Input
                      placeholder="000.000.000-00"
                      value={guardian.cpf}
                      onChange={(e) =>
                        updateGuardian(index, "cpf", formatCPF(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={guardian.birth_date}
                      onChange={(e) =>
                        updateGuardian(index, "birth_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Telefone *</Label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={guardian.phone}
                      onChange={(e) =>
                        updateGuardian(index, "phone", formatPhone(e.target.value))
                      }
                    />
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">CEP</Label>
                      <Input
                        placeholder="00000-000"
                        value={guardian.cep || ""}
                        onChange={(e) => handleCEPChange(index, e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-medium">Endereço (Rua, Número, Bairro, etc)</Label>
                      <Input
                        placeholder="Ex: Rua A, 123, Centro, São Paulo - SP"
                        value={guardian.address}
                        onChange={(e) =>
                          updateGuardian(index, "address", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observacoes */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="space-y-2">
            <Label htmlFor="observations" className="text-sm font-medium">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Informações adicionais (alergias, necessidades especiais, etc.)"
              value={student.observations}
              onChange={(e) => updateStudent("observations", e.target.value)}
              rows={3}
            />
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
            <Link href="/dashboard/alunos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving} size="sm">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Salvando..." : "Salvar e Matricular Aluno"}
          </Button>
        </div>
      </form>
    </div>
  );
}
