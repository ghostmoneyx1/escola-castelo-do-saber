"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import Link from "next/link";
import { MONTHS } from "@/lib/constants";
import { SCHOOL_NAME } from "@/lib/constants";

function fmt(value) {
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function Row({ label, value, highlight, note }) {
  return (
    <tr className={highlight ? "bg-muted/30" : ""}>
      <td className="px-5 py-3 text-sm text-slate-600">{label}</td>
      {note && <td className="px-5 py-3 text-xs text-muted-foreground">{note}</td>}
      <td className={`px-5 py-3 text-sm font-semibold text-right ${highlight ? "text-foreground text-base font-bold" : "text-slate-700"}`}>
        {value}
      </td>
    </tr>
  );
}

export default function ReciboPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("employee_payments")
        .select("*, employees(name, cpf, role, units(name))")
        .eq("id", id)
        .single();
      setPayment(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (!payment) return (
    <div className="text-center py-20 text-muted-foreground">Recibo não encontrado.</div>
  );

  const emp      = payment.employees;
  const mesRef   = MONTHS[payment.reference_month - 1];
  const anoRef   = payment.reference_year;
  const emitidoEm = new Date(payment.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const paidDate  = payment.paid_at
    ? new Date(payment.paid_at).toLocaleDateString("pt-BR")
    : null;

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Recibo de Pagamento" subtitle={`${emp?.name} — ${mesRef}/${anoRef}`}>
        <div className="flex gap-2 no-print">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Imprimir
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/colaboradores/pagamentos">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Recibo */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">

        {/* Cabeçalho */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Recibo de Pagamento</p>
              <h2 className="text-lg font-bold text-foreground font-heading">{SCHOOL_NAME}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Competência</p>
              <p className="text-sm font-bold text-foreground">{mesRef} / {anoRef}</p>
            </div>
          </div>
        </div>

        {/* Dados do colaborador */}
        <div className="px-6 py-4 bg-muted/20 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Dados do Colaborador</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="text-sm font-medium">{emp?.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cargo</p>
              <p className="text-sm font-medium">{emp?.role}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CPF</p>
              <p className="text-sm font-medium">{emp?.cpf || "—"}</p>
            </div>
          </div>
        </div>

        {/* Tabela de valores */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-2.5">Descrição</th>
              <th className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-2.5"></th>
              <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-2.5">Valor (R$)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <Row label="Salário Base"           value={`R$ ${fmt(payment.base_salary)}`} />
            {Number(payment.bonuses) > 0 && (
              <Row label="Gratificações / Extras" note="(+)" value={`R$ ${fmt(payment.bonuses)}`} />
            )}
            {Number(payment.deductions) > 0 && (
              <Row label="Descontos"              note="(-)" value={`- R$ ${fmt(payment.deductions)}`} />
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-primary/5">
              <td className="px-5 py-4 text-sm font-bold text-foreground">VALOR LÍQUIDO A RECEBER</td>
              <td className="px-5 py-4"></td>
              <td className="px-5 py-4 text-right text-lg font-bold text-foreground font-heading">
                R$ {fmt(payment.net_amount)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Rodapé do recibo */}
        <div className="px-6 py-4 border-t border-border space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Forma de pagamento</p>
              <p className="font-medium">{payment.payment_method || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data do pagamento</p>
              <p className="font-medium">{paidDate || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Emitido em</p>
              <p className="font-medium">{emitidoEm}</p>
            </div>
          </div>

          {payment.observations && (
            <div className="bg-muted/30 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Observações</p>
              <p className="text-sm text-slate-700">{payment.observations}</p>
            </div>
          )}
        </div>

        {/* Assinaturas */}
        <div className="px-6 py-6 border-t border-border">
          <div className="grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2 mt-10">
                <p className="text-xs text-muted-foreground">{SCHOOL_NAME}</p>
                <p className="text-xs text-muted-foreground">Empregador</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-400 pt-2 mt-10">
                <p className="text-xs font-medium text-foreground">{emp?.name}</p>
                <p className="text-xs text-muted-foreground">Colaborador — {emp?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground pb-4 no-print">
        Recibo gerado em {emitidoEm}
      </div>
    </div>
  );
}
