"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AnoLetivoSelect } from "@/components/shared/ano-letivo-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Save, Search, ClipboardCheck } from "lucide-react";
import { STATUS_TAXA, TAXAS_INICIO, totaisPorItem } from "@/lib/mensalidades/taxas-inicio";

const HEAD = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3.5 text-left";
const FORMAS = ["Pix", "Dinheiro", "Cartão"];
const TODOS = "todos";

const CHIP = {
  Pago:       "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pendente:   "bg-amber-50 text-amber-700 border-amber-200",
  Dispensado: "bg-muted text-muted-foreground border-border line-through",
};

function fmt(v) {
  if (v === null || v === undefined) return "—";
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function hoje() {
  return new Date().toISOString().split("T")[0];
}

export function InicioDoAnoClient({ ano, linhas }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busca, setBusca] = useState("");
  const [turma, setTurma] = useState(TODOS);
  const [tipo, setTipo] = useState(TODOS);
  const [soPendentes, setSoPendentes] = useState(false);
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const turmas = useMemo(
    () => [...new Map(linhas.filter((l) => l.classId).map((l) => [l.classId, l.turma])).entries()]
      .sort((a, b) => a[1].localeCompare(b[1], "pt-BR")),
    [linhas],
  );
  const tipos = useMemo(() => [...new Set(linhas.map((l) => l.tipo).filter(Boolean))].sort(), [linhas]);

  const filtradas = linhas.filter((l) =>
    (!busca.trim() || l.name.toLowerCase().includes(busca.trim().toLowerCase())) &&
    (turma === TODOS || l.classId === turma) &&
    (tipo === TODOS || l.tipo === tipo) &&
    (!soPendentes || l.temPendencia),
  );
  const totais = totaisPorItem(filtradas);

  function abrir(linha, taxa) {
    const atual = linha.itens[taxa.key];
    setEdit({
      studentId: linha.studentId,
      name: linha.name,
      item: taxa.key,
      label: taxa.label,
      status: atual.status === "Pendente" ? "Pago" : atual.status,
      amount: atual.amount === null || atual.amount === undefined ? "" : String(atual.amount),
      paid_at: atual.paid_at || hoje(),
      payment_method: atual.payment_method || "",
      observations: atual.observations || "",
    });
    setErro("");
  }

  async function salvar() {
    setSaving(true);
    const supabase = createClient();
    const isPago = edit.status === "Pago";
    const { error } = await supabase.from("enrollment_fees").upsert(
      {
        student_id: edit.studentId,
        year: ano,
        item: edit.item,
        status: edit.status,
        amount: edit.amount === "" ? null : parseFloat(edit.amount),
        paid_at: isPago ? edit.paid_at || hoje() : null,
        payment_method: isPago && edit.payment_method ? edit.payment_method : null,
        observations: edit.observations.trim() || null,
      },
      { onConflict: "student_id,year,item" },
    );
    setSaving(false);
    if (error) {
      setErro(`Erro ao salvar: ${error.message}`);
      return;
    }
    setEdit(null);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Início do ano letivo"
        subtitle={`Uniforme, material, pacote experiência e livro + matrícula — ${linhas.length} aluno${linhas.length === 1 ? "" : "s"} matriculado${linhas.length === 1 ? "" : "s"} em ${ano}`}
      >
        <AnoLetivoSelect />
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {totais.map((t) => (
          <div key={t.key} className="bg-white p-5 rounded-xl border border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.label}</p>
            <p className="text-xl font-heading font-semibold text-foreground mt-1">{fmt(t.recebido)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.pagos} pago{t.pagos === 1 ? "" : "s"} · {t.pendentes} pendente{t.pendentes === 1 ? "" : "s"} ({fmt(t.aReceber)})
            </p>
          </div>
        ))}
      </div>

      <div className="bg-muted rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-white border-none shadow-none"
          />
        </div>
        <Select value={turma} onValueChange={setTurma}>
          <SelectTrigger className="bg-white border-none shadow-none w-[220px]">
            <SelectValue>{turma === TODOS ? "Todas as turmas" : turmas.find(([id]) => id === turma)?.[1]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todas as turmas</SelectItem>
            {turmas.map(([id, label]) => <SelectItem key={id} value={id}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="bg-white border-none shadow-none w-[190px]">
            <SelectValue>{tipo === TODOS ? "Todos os tipos" : tipo}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos os tipos</SelectItem>
            {tipos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant={soPendentes ? "default" : "outline"} size="sm" onClick={() => setSoPendentes((v) => !v)}>
          Só com pendência
        </Button>
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {filtradas.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ClipboardCheck}
              title="Nenhum aluno encontrado"
              description={linhas.length === 0 ? `Nenhuma matrícula ativa em ${ano}` : "Ajuste os filtros"}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className={HEAD}>Aluno</th>
                  {TAXAS_INICIO.map((t) => <th key={t.key} className={HEAD}>{t.label}</th>)}
                  <th className={`${HEAD} text-right`}>Pendente</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((l) => (
                  <tr key={l.studentId} className="border-b border-border">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.turma}{l.tipo ? ` · ${l.tipo}` : ""}</p>
                    </td>
                    {TAXAS_INICIO.map((t) => {
                      const i = l.itens[t.key];
                      return (
                        <td key={t.key} className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => abrir(l, t)}
                            title={i.observations || `Editar ${t.label}`}
                            className={`inline-flex flex-col items-start rounded-lg border px-2.5 py-1 text-xs font-semibold hover:opacity-80 transition-opacity ${CHIP[i.status]}`}
                          >
                            <span>{i.status}</span>
                            <span className="font-medium">{fmt(i.amount)}</span>
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-5 py-3.5 text-right font-semibold text-foreground whitespace-nowrap">
                      {l.pendente > 0 ? fmt(l.pendente) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!edit} onOpenChange={(v) => !saving && !v && setEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit?.label}</DialogTitle>
          </DialogHeader>
          {edit && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{edit.name} · {ano}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Situação</Label>
                  <Select value={edit.status} onValueChange={(v) => setEdit((p) => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_TAXA.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Valor (R$)</Label>
                  <Input type="number" step="0.01" value={edit.amount} onChange={(e) => setEdit((p) => ({ ...p, amount: e.target.value }))} />
                </div>
              </div>
              {edit.status === "Pago" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Data do pagamento</Label>
                    <Input type="date" value={edit.paid_at} onChange={(e) => setEdit((p) => ({ ...p, paid_at: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Forma</Label>
                    <Select value={edit.payment_method} onValueChange={(v) => setEdit((p) => ({ ...p, payment_method: v }))}>
                      <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                      <SelectContent>
                        {FORMAS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Observação</Label>
                <Input
                  placeholder="Ex.: pagou em 2 vezes, desconto de irmão"
                  value={edit.observations}
                  onChange={(e) => setEdit((p) => ({ ...p, observations: e.target.value }))}
                />
              </div>
              {erro && <p className="text-sm text-red-600">{erro}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)} disabled={saving}>Cancelar</Button>
            <Button onClick={salvar} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
