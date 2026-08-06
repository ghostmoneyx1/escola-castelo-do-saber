"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet, Loader2, MessageCircle, Copy, Check, AlertTriangle, CheckCircle2, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { montarMensagemCobranca, linkWhatsapp } from "@/lib/mensalidades/whatsapp";

function fmt(v) {
  return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

const SITUACAO_STYLE = {
  "Em atraso": "bg-red-50 text-red-700 border-red-200",
  "Em aberto": "bg-blue-50 text-blue-700 border-blue-200",
  "A vencer": "bg-amber-50 text-amber-600 border-amber-200",
};

function Moldura({ children }) {
  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="h-[18px] w-[18px] text-muted-foreground" />
        <h3 className="font-semibold font-heading text-foreground">Situação financeira</h3>
      </div>
      {children}
    </div>
  );
}

/**
 * Cruza o aluno do Supabase com a planilha de cobrança e mostra o que ele deve,
 * sem sair da ficha. Quando os nomes não batem, avisa em vez de fingir que
 * está tudo em dia.
 */
export function SituacaoFinanceira({ nome }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [origem, setOrigem] = useState("");

  useEffect(() => setOrigem(window.location.origin), []);

  useEffect(() => {
    if (!nome) return;
    let ativo = true;
    (async () => {
      try {
        const res = await fetch(`/api/mensalidades/aluno?nome=${encodeURIComponent(nome)}`);
        const json = await res.json();
        if (!ativo) return;
        if (!res.ok) setErro(json.error || "Não foi possível ler a planilha.");
        else setDados(json);
      } catch {
        if (ativo) setErro("Não foi possível ler a planilha.");
      }
    })();
    return () => { ativo = false; };
  }, [nome]);

  if (erro) {
    return (
      <Moldura>
        <p className="text-sm text-muted-foreground">{erro}</p>
      </Moldura>
    );
  }

  if (!dados) {
    return (
      <Moldura>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Consultando a planilha de cobrança...
        </div>
      </Moldura>
    );
  }

  if (!dados.aluno) {
    return (
      <Moldura>
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-[18px] w-[18px] text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              {dados.situacao === "ambiguo"
                ? "Mais de um nome parecido na planilha"
                : "Este aluno não foi encontrado na planilha de cobrança"}
            </p>
            {dados.sugestoes.length > 0 ? (
              <>
                <p className="text-muted-foreground mt-1">Talvez seja um destes:</p>
                <ul className="mt-1.5 space-y-0.5">
                  {dados.sugestoes.map(s => (
                    <li key={s} className="text-muted-foreground">• {s}</li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-2">
                  Padronize o nome na planilha para o vínculo passar a ser automático.
                </p>
              </>
            ) : (
              <p className="text-muted-foreground mt-1">
                Só os alunos da planilha de cobrança aparecem aqui.
              </p>
            )}
          </div>
        </div>
      </Moldura>
    );
  }

  const a = dados.aluno;
  const linkConsulta = origem ? `${origem}/mensalidades?a=${a.codigo}` : "";
  const zap = linkWhatsapp(a.whatsapp, montarMensagemCobranca(a, { linkConsulta }));

  async function copiarLink() {
    await navigator.clipboard.writeText(linkConsulta);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <Moldura>
      {dados.situacao === "aproximado" && (
        <p className="text-xs text-muted-foreground mb-3">
          Vinculado por aproximação a <span className="font-medium">{a.aluno}</span> na planilha.
        </p>
      )}

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Mensalidade</p>
          <p className="text-sm font-semibold text-foreground">
            {a.valorMensal != null ? `R$ ${fmt(a.valorMensal)}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Total em aberto</p>
          <p className={`text-sm font-semibold ${a.total ? "text-foreground" : "text-emerald-700"}`}>
            {a.total ? `R$ ${fmt(a.total)}` : "Nada em aberto"}
          </p>
        </div>
        {a.mesesAtrasados > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium">Em atraso</p>
            <p className="text-sm font-semibold text-red-600">
              {a.mesesAtrasados} {a.mesesAtrasados === 1 ? "mês" : "meses"}
            </p>
          </div>
        )}
      </div>

      {a.pendentes.length === 0 ? (
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Tudo em dia</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {a.pendentes.map(p => (
            <div
              key={p.mes}
              className="flex items-center justify-between gap-3 border border-border rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-foreground">{p.mes}</span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${SITUACAO_STYLE[p.situacao]}`}
                >
                  {p.situacao}
                </span>
              </div>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Link de pagamento
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="shrink-0 text-xs text-muted-foreground">sem link</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-border">
        {zap && (
          <Button asChild size="sm" variant="outline" className="gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
            <a href={zap} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-3.5 w-3.5" />
              Cobrar no WhatsApp
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={copiarLink} disabled={!origem} className="gap-1.5">
          {copiado ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copiado ? "Copiado" : "Copiar link do aluno"}
        </Button>
        <Button asChild size="sm" variant="ghost" className="gap-1.5">
          <Link href="/dashboard/cobranca">Ver cobrança →</Link>
        </Button>
      </div>
    </Moldura>
  );
}
