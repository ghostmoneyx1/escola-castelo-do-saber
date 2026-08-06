"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Search, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { SCHOOL_NAME } from "@/lib/constants";

const SITUACAO_STYLE = {
  "Em atraso": "bg-red-50 text-red-700",
  "A vencer": "bg-amber-50 text-amber-700",
  "Em aberto": "bg-blue-50 text-blue-700",
};

function fmtMoeda(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ParcelaItem({ parcela }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-border rounded-xl px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{parcela.mes}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {parcela.valor != null ? (
            <span className="text-sm text-muted-foreground">{fmtMoeda(parcela.valor)}</span>
          ) : (
            <span className="text-sm text-muted-foreground">Valor informado no pagamento</span>
          )}
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
              SITUACAO_STYLE[parcela.situacao] || "bg-muted text-muted-foreground"
            }`}
          >
            {parcela.situacao}
          </span>
        </div>
      </div>

      {parcela.link ? (
        <a
          href={parcela.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Pagar
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="shrink-0 text-xs text-muted-foreground">Aguardando link</span>
      )}
    </div>
  );
}

function ResultadoCard({ resultado }) {
  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <p className="text-lg font-semibold font-heading text-foreground">{resultado.aluno}</p>
      <p className="text-sm text-muted-foreground mt-0.5">
        {[resultado.serie, resultado.responsavel && `Responsável: ${resultado.responsavel}`]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {resultado.pendentes.length === 0 ? (
        <div className="flex items-center gap-2 mt-5 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-semibold">Tudo em dia por aqui!</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mt-5">
            {resultado.pendentes.map((p) => (
              <ParcelaItem key={p.mes} parcela={p} />
            ))}
          </div>

          {resultado.total != null && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground">Total em aberto</span>
              <span className="text-lg font-semibold font-heading text-foreground">
                {fmtMoeda(resultado.total)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ConsultaMensalidadesPage() {
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resposta, setResposta] = useState(null);

  async function consultar(e) {
    e.preventDefault();
    setErro("");
    setResposta(null);

    if (nome.trim().length < 3) {
      setErro("Digite pelo menos 3 letras do nome da criança.");
      return;
    }
    if (!/^\d{4}$/.test(tel)) {
      setErro("Digite os 4 últimos dígitos do telefone do responsável.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mensalidades/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), tel }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErro(json.error || "Não foi possível consultar agora.");
        return;
      }
      setResposta(json);
    } catch {
      setErro("Não foi possível consultar agora. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center text-center">
          <Image src="/logo.png" alt={SCHOOL_NAME} width={48} height={48} className="object-contain" />
          <h1 className="mt-4 text-2xl font-semibold font-heading tracking-tight text-foreground">
            Consulta de Mensalidades
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Veja o que está em aberto e pague pelo link
          </p>
        </div>

        <form onSubmit={consultar} className="bg-white border border-border rounded-xl p-6 mt-8">
          <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-1.5">
            Nome da criança
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria Eduarda"
            autoComplete="off"
            className="w-full h-10 px-3 rounded-[10px] border border-border bg-white text-sm outline-none focus:border-primary transition-colors"
          />

          <label htmlFor="tel" className="block text-sm font-medium text-foreground mb-1.5 mt-4">
            4 últimos dígitos do telefone do responsável
          </label>
          <input
            id="tel"
            type="text"
            inputMode="numeric"
            value={tel}
            onChange={(e) => setTel(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Ex: 5171"
            autoComplete="off"
            className="w-full h-10 px-3 rounded-[10px] border border-border bg-white text-sm outline-none focus:border-primary transition-colors tracking-widest"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Usamos os 4 dígitos só para confirmar que a consulta é sua.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-5 inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Consultando..." : "Consultar"}
          </button>

          {erro && (
            <div className="flex items-start gap-2 mt-4 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{erro}</span>
            </div>
          )}
        </form>

        {resposta && !resposta.encontrado && (
          <div className="bg-white border border-border rounded-xl p-6 mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma criança encontrada com esse nome e telefone. Confira a grafia ou fale com a
              coordenação.
            </p>
          </div>
        )}

        {resposta?.encontrado && (
          <div className="flex flex-col gap-4 mt-4">
            {resposta.resultados.map((r) => (
              <ResultadoCard key={`${r.aluno}-${r.responsavel}`} resultado={r} />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">{SCHOOL_NAME}</p>
      </div>
    </main>
  );
}
