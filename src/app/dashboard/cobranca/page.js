import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { obterCobranca } from "@/lib/mensalidades/sheet";
import { CobrancaClient } from "./cobranca-client";

export const dynamic = "force-dynamic";

export default async function CobrancaPage() {
  let dados;
  try {
    dados = await obterCobranca();
  } catch (e) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cobrança" subtitle="Mensalidades em aberto e envio de cobrança" />
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Não foi possível ler a planilha</p>
              <p className="text-sm text-muted-foreground mt-1">{e.message}</p>
              <p className="text-sm text-muted-foreground mt-3">
                Confira se a planilha continua compartilhada e se a variável
                <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-xs">
                  MENSALIDADES_SHEET_CSV_URL
                </code>
                está configurada.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <CobrancaClient alunos={dados.alunos} resumo={dados.resumo} />;
}
