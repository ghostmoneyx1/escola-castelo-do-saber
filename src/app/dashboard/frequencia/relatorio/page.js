"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
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
import { CalendarCheck, Download, Loader2 } from "lucide-react";
import {
  FREQUENCIA_MINIMA,
  abaixoDoMinimo,
  formatPercentual,
  montarRelatorioTurma,
} from "@/lib/frequencia/percentual";
import { generateRelatorioFrequencia } from "@/lib/pdf/generate";

const HEAD = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3.5";

function classLabel(c) {
  return `${c.grade} - ${c.name} (${c.shift})`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function RelatorioFrequenciaPage() {
  const year = new Date().getFullYear();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [de, setDe] = useState(`${year}-01-01`);
  const [ate, setAte] = useState(today());
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("classes")
        .select("*, units(name)")
        .eq("is_active", true)
        .eq("year", year)
        .order("grade");
      setClasses(data || []);
    }
    load();
  }, [year]);

  useEffect(() => {
    if (!selectedClass || !de || !ate) return;
    async function loadReport() {
      setLoading(true);
      const supabase = createClient();
      const [studentsRes, attendanceRes] = await Promise.all([
        supabase
          .from("students")
          .select("id, name")
          .eq("class_id", selectedClass)
          .eq("status", "Ativo"),
        supabase
          .from("attendance")
          .select("student_id, date, present, students(name)")
          .eq("class_id", selectedClass)
          .gte("date", de)
          .lte("date", ate),
      ]);
      setRelatorio(montarRelatorioTurma(studentsRes.data || [], attendanceRes.data || []));
      setLoading(false);
    }
    loadReport();
  }, [selectedClass, de, ate]);

  const turma = useMemo(() => classes.find((c) => c.id === selectedClass), [classes, selectedClass]);

  async function handleDownload() {
    setDownloading(true);
    try {
      await generateRelatorioFrequencia({
        turma: classLabel(turma),
        unit: turma.units?.name,
        de,
        ate,
        relatorio,
      });
    } catch (err) {
      console.error("Erro ao gerar relatório de frequência:", err);
    }
    setDownloading(false);
  }

  const canDownload = turma && relatorio && relatorio.linhas.length > 0 && !loading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatório de Frequência"
        subtitle="Percentual de presença por aluno no período, a partir das chamadas registradas"
      >
        <Button size="sm" onClick={handleDownload} disabled={!canDownload || downloading}>
          {downloading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
          Baixar PDF
        </Button>
      </PageHeader>

      <div className="bg-muted rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="bg-white border-none py-3 px-4 h-auto text-sm font-medium shadow-none">
              <SelectValue>{turma ? classLabel(turma) : "Selecione uma turma"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>{classLabel(c)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">De</span>
          <Input type="date" value={de} onChange={(e) => setDe(e.target.value)} className="bg-white border-none shadow-none w-[170px]" />
          <span className="text-sm text-muted-foreground">até</span>
          <Input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className="bg-white border-none shadow-none w-[170px]" />
        </div>
      </div>

      {!selectedClass ? (
        <div className="bg-white border border-border rounded-xl p-6">
          <EmptyState
            icon={CalendarCheck}
            title="Selecione uma turma"
            description="O percentual é calculado sobre os dias em que houve chamada no período"
          />
        </div>
      ) : loading || !relatorio ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dias com chamada</p>
              <p className="text-2xl font-heading font-semibold text-foreground mt-1">{relatorio.diasLetivos}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequência da turma</p>
              <p className="text-2xl font-heading font-semibold text-foreground mt-1">{formatPercentual(relatorio.percentualTurma)}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Abaixo de {FREQUENCIA_MINIMA}%</p>
              <p className="text-2xl font-heading font-semibold text-foreground mt-1">{relatorio.abaixoDoMinimo}</p>
            </div>
          </div>

          {relatorio.diasLetivos === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma chamada registrada para esta turma no período. Registre a presença em Frequência
              ou pelo link da chamada para o percentual aparecer aqui.
            </p>
          )}

          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted border-b border-border">
                    <TableHead className={HEAD}>Aluno</TableHead>
                    <TableHead className={`${HEAD} text-center`}>Dias</TableHead>
                    <TableHead className={`${HEAD} text-center`}>Presenças</TableHead>
                    <TableHead className={`${HEAD} text-center`}>Faltas</TableHead>
                    <TableHead className={`${HEAD} text-center`}>Frequência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatorio.linhas.map((l) => (
                    <TableRow key={l.id} className="border-b border-border">
                      <TableCell className="px-5 py-3.5 text-sm font-medium text-foreground">{l.name}</TableCell>
                      <TableCell className="px-5 py-3.5 text-sm text-center text-muted-foreground">{l.dias}</TableCell>
                      <TableCell className="px-5 py-3.5 text-sm text-center text-muted-foreground">{l.presencas}</TableCell>
                      <TableCell className="px-5 py-3.5 text-sm text-center text-muted-foreground">{l.faltas}</TableCell>
                      <TableCell
                        className={`px-5 py-3.5 text-sm text-center font-semibold ${
                          abaixoDoMinimo(l.percentual) ? "text-destructive" : "text-foreground"
                        }`}
                      >
                        {formatPercentual(l.percentual)}
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
