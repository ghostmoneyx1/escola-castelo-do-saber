import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { createClient } from "@/lib/supabase/server";
import { obterCobranca } from "@/lib/mensalidades/consultas";
import { CobrancaClient } from "./cobranca-client";

export const dynamic = "force-dynamic";

export default async function CobrancaPage() {
  let dados;
  try {
    const supabase = await createClient();
    dados = await obterCobranca(supabase);
  } catch (e) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cobrança" subtitle="Mensalidades em aberto e envio de cobrança" />
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Não foi possível carregar a cobrança</p>
              <p className="text-sm text-muted-foreground mt-1">{e.message}</p>
              <p className="text-sm text-muted-foreground mt-3">
                Se a mensagem falar em coluna inexistente, falta rodar o script
                <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-xs">
                  atualizacao-2026-10-07-infinitepay.sql
                </code>
                no SQL Editor do Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <CobrancaClient ano={dados.ano} alunos={dados.alunos} resumo={dados.resumo} />;
}
