"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Pencil,
  User,
  Phone,
  MapPin,
  Calendar,
  Bus,
  School,
  Users,
  FileText,
  Loader2,
  ClipboardList,
  Link2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { QUARTER_LABELS } from "@/lib/relatorio-checklist";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`text-sm font-semibold ${value ? "text-foreground" : "text-muted-foreground"}`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function AlunoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const [linkQuarter, setLinkQuarter] = useState("");
  const [linkYear, setLinkYear] = useState(String(currentYear));
  const [generatingLink, setGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerateLink() {
    setLinkError("");
    if (!linkQuarter) return setLinkError("Selecione o trimestre.");
    setGeneratingLink(true);
    const res = await fetch("/api/relatorio/gerar-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: id, quarter: Number(linkQuarter), year: Number(linkYear) }),
    });
    const json = await res.json();
    if (!res.ok) { setLinkError(json.error || "Erro ao gerar link."); setGeneratingLink(false); return; }
    setGeneratedLink(`${window.location.origin}/relatorio/${json.token}`);
    setGeneratingLink(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [studentRes, guardiansRes] = await Promise.all([
        supabase
          .from("students")
          .select("*, classes(name, grade, shift), units(name)")
          .eq("id", id)
          .single(),
        supabase
          .from("student_guardians")
          .select("*, guardians(*)")
          .eq("student_id", id),
      ]);

      if (studentRes.data) setStudent(studentRes.data);
      if (guardiansRes.data) setGuardians(guardiansRes.data.map((sg) => sg.guardians));
      setLoading(false);
    }
    load();
  }, [id]);

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
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={student.name}>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/alunos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/dashboard/alunos/${id}/editar`}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </PageHeader>

      {/* Student Header Card */}
      <div className="bg-white border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16 rounded-xl">
            <AvatarFallback className="bg-gradient-to-br from-[#004ac6] to-[#2563eb] text-white text-lg font-bold rounded-xl">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold font-heading text-foreground">{student.name}</h2>
              <StatusBadge status={student.status} />
              {student.uses_transport && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-violet-50 text-violet-600 rounded-full px-3 py-1 font-bold uppercase tracking-tight">
                  <Bus className="h-3 w-3" />
                  Transporte
                </span>
              )}
              {student.enrollment_type && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 rounded-full px-3 py-1 font-bold uppercase tracking-tight">
                  {student.enrollment_type}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {student.classes?.grade} - {student.classes?.name} &bull; {student.classes?.shift} &bull; {student.units?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold font-heading flex items-center gap-2 text-foreground mb-5">
            <User className="h-4 w-4 text-blue-600" />
            Dados Pessoais
          </h3>
          <div className="space-y-4">
            <InfoItem icon={FileText} label="CPF" value={student.cpf} />
            <InfoItem icon={FileText} label="Certidão de Nascimento" value={student.birth_certificate_number} />
            <InfoItem
              icon={Calendar}
              label="Data de Nascimento"
              value={student.birth_date ? new Date(student.birth_date).toLocaleDateString("pt-BR") : null}
            />
            <InfoItem icon={User} label="Sexo" value={student.gender} />
            <InfoItem icon={MapPin} label="Naturalidade" value={student.birthplace} />
          </div>
        </div>

        {/* Dados Escolares */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold font-heading flex items-center gap-2 text-foreground mb-5">
            <School className="h-4 w-4 text-blue-600" />
            Dados Escolares
          </h3>
          <div className="space-y-4">
            <InfoItem icon={School} label="Turma" value={student.classes?.name} />
            <InfoItem icon={School} label="Série / Ano" value={student.classes?.grade} />
            <InfoItem icon={Calendar} label="Turno" value={student.classes?.shift} />
            <InfoItem icon={MapPin} label="Unidade" value={student.units?.name} />
            <InfoItem icon={School} label="Escola Anterior" value={student.previous_school} />
            {student.observations && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Observações</p>
                <p className="text-sm bg-muted rounded-xl p-3 text-muted-foreground">{student.observations}</p>
              </div>
            )}
          </div>
        </div>

        {/* Gerar Link de Avaliação */}
        <div className="bg-white border border-border rounded-xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold font-heading flex items-center gap-2 text-foreground mb-5">
            <ClipboardList className="h-4 w-4 text-blue-600" />
            Relatório Trimestral
          </h3>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Trimestre</label>
              <Select value={linkQuarter} onValueChange={v => { setLinkQuarter(v); setGeneratedLink(""); setLinkError(""); }}>
                <SelectTrigger className="h-9 w-[170px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4].map(q => <SelectItem key={q} value={String(q)}>{QUARTER_LABELS[q]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Ano</label>
              <Select value={linkYear} onValueChange={v => { setLinkYear(v); setGeneratedLink(""); setLinkError(""); }}>
                <SelectTrigger className="h-9 w-[110px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[currentYear, currentYear - 1].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" onClick={handleGenerateLink} disabled={generatingLink}>
              {generatingLink ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
              {generatingLink ? "Gerando..." : "Gerar Link"}
            </Button>
          </div>
          {linkError && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">{linkError}</p>
          )}
          {generatedLink && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-800">Link gerado — envie para o professor preencher a avaliação.</p>
              <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-200 px-3 py-2">
                <p className="text-xs text-slate-600 flex-1 truncate font-mono">{generatedLink}</p>
                <button onClick={handleCopy} className="shrink-0 p-1.5 rounded-md hover:bg-blue-50 transition-colors">
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-blue-600" />}
                </button>
              </div>
              <p className="text-xs text-blue-600">{copied ? "✓ Copiado!" : "Clique no ícone para copiar o link"}</p>
            </div>
          )}
        </div>

        {/* Responsáveis */}
        <div className="bg-white border border-border rounded-xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold font-heading flex items-center gap-2 text-foreground mb-5">
            <Users className="h-4 w-4 text-blue-600" />
            Responsáveis
          </h3>
          {guardians.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum responsável cadastrado
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guardians.map((guardian) => (
                <div
                  key={guardian.id}
                  className="rounded-xl bg-muted/50 border border-border p-5 space-y-3"
                >
                  <div>
                    <p className="font-bold text-sm text-foreground">{guardian.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{guardian.relationship}</p>
                  </div>
                  <div className="border-t border-border pt-3 space-y-2">
                    <InfoItem icon={Phone} label="Telefone" value={guardian.phone} />
                    <InfoItem icon={FileText} label="CPF" value={guardian.cpf} />
                    <InfoItem icon={MapPin} label="Endereço" value={guardian.address} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
