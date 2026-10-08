"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Search, AlertTriangle, Clock, CheckCircle, MessageCircle, Copy, Check,
  QrCode, PhoneOff, Link2, Loader2,
} from "lucide-react";
import { montarMensagemCobranca, linkWhatsapp } from "@/lib/mensalidades/whatsapp";

function fmt(v) {
  return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

const SITUACAO_STYLE = {
  "Em atraso": "bg-red-50 text-red-700 border-red-200",
  "A vencer": "bg-amber-50 text-amber-600 border-amber-200",
};

const LOTE = 40;
const MAX_LOTES = 50;

function SummaryCard({ icon: Icon, label, value, hint, colorClass, children }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold font-heading">{value}</p>
          {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function AcoesAluno({ aluno, origem, onQr }) {
  const [copiado, setCopiado] = useState(false);

  const linkConsulta = origem ? `${origem}/mensalidades?a=${aluno.codigo}` : "";
  const mensagem = montarMensagemCobranca(aluno, { linkConsulta });
  const zap = linkWhatsapp(aluno.whatsapp, mensagem);

  async function copiarLink() {
    await navigator.clipboard.writeText(linkConsulta);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {zap ? (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
        >
          <a href={zap} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-3.5 w-3.5" />
            Cobrar
          </a>
        </Button>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-2">
          <PhoneOff className="h-3.5 w-3.5" />
          Sem telefone
        </span>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={copiarLink}
        disabled={!origem}
        className="h-7 text-xs gap-1.5"
        title="Copiar link direto do aluno"
      >
        {copiado ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copiado ? "Copiado" : "Link"}
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onQr(aluno)}
        className="h-7 text-xs px-2"
        title="QR Code do aluno"
      >
        <QrCode className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function CobrancaClient({ ano, alunos, resumo }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [origem, setOrigem] = useState("");
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("Com pendência");
  const [qrAluno, setQrAluno] = useState(null);
  const [geracao, setGeracao] = useState(null);

  useEffect(() => setOrigem(window.location.origin), []);

  const filtrados = useMemo(() => {
    const alvo = search.trim().toLowerCase();
    return alunos.filter(a => {
      const casaBusca =
        !alvo ||
        a.aluno.toLowerCase().includes(alvo) ||
        (a.responsavel || "").toLowerCase().includes(alvo);

      const casaFiltro =
        filtro === "Todos" ||
        (filtro === "Com pendência" && a.pendentes.length > 0) ||
        (filtro === "Em atraso" && a.mesesAtrasados > 0) ||
        (filtro === "Em dia" && a.pendentes.length === 0) ||
        (filtro === "Sem link" && a.parcelasSemLinkApi > 0) ||
        (filtro === "Telefone a conferir" && a.telefoneSuspeito);

      return casaBusca && casaFiltro;
    });
  }, [alunos, search, filtro]);

  /**
   * Gera os links em lotes: cada chamada cria até LOTE links e diz quantos
   * ainda faltam. Assim nenhuma request estoura o tempo da Vercel.
   */
  async function gerarLinksQueFaltam() {
    setGeracao({ feitos: 0, restantes: resumo.parcelasSemLinkApi, erro: "", concluido: false });
    let feitos = 0;
    let erro = "";

    for (let i = 0; i < MAX_LOTES; i++) {
      let json;
      try {
        const res = await fetch("/api/infinitepay/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ano, limite: LOTE }),
        });
        json = await res.json();
        if (!res.ok) {
          erro = json.error || "Falha ao gerar links.";
          break;
        }
      } catch {
        erro = "Falha de conexão ao gerar links.";
        break;
      }

      feitos += json.gerados;
      if (json.falhas?.length) erro = `${json.falhas.length} parcela(s) falharam: ${json.falhas[0].erro}`;
      setGeracao({ feitos, restantes: json.restantes, erro, concluido: false });
      if (!json.restantes || json.gerados === 0) break;
    }

    setGeracao(g => ({ ...g, feitos, erro, concluido: true }));
    startTransition(() => router.refresh());
  }

  const qrSrc = qrAluno ? `/api/mensalidades/qr?a=${qrAluno.codigo}` : null;
  const gerando = geracao && !geracao.concluido;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cobrança"
        subtitle={`${resumo.totalAlunos} alunos com contrato aberto em ${ano}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={AlertTriangle}
          label="Em atraso"
          value={`R$ ${fmt(resumo.totalAtrasado)}`}
          hint={`${resumo.comAtraso} aluno${resumo.comAtraso === 1 ? "" : "s"}`}
          colorClass="bg-red-50 text-red-600"
        />
        <SummaryCard
          icon={Clock}
          label="A vencer"
          value={`R$ ${fmt(resumo.totalAVencer)}`}
          colorClass="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          icon={CheckCircle}
          label="Em dia"
          value={`${resumo.emDia}/${resumo.totalAlunos}`}
          hint="sem nenhuma pendência"
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          icon={Link2}
          label="Parcelas sem link da InfinitePay"
          value={resumo.parcelasSemLinkApi}
          hint={
            resumo.parcelasSemLinkApi === 0
              ? "todas com baixa automática"
              : resumo.parcelasSemLink > 0
                ? `${resumo.parcelasSemLink} sem link nenhum · ${resumo.parcelasSemLinkApi - resumo.parcelasSemLink} com link antigo da planilha`
                : "link antigo da planilha, sem baixa automática"
          }
          colorClass="bg-blue-50 text-blue-600"
        >
          {(resumo.parcelasSemLinkApi > 0 || geracao) && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5 w-full"
                onClick={gerarLinksQueFaltam}
                disabled={gerando}
              >
                {gerando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                {gerando ? `Gerando... ${geracao.feitos} prontos` : "Gerar links na InfinitePay"}
              </Button>
              {geracao?.concluido && (
                <p className={`text-xs mt-2 ${geracao.erro ? "text-amber-600" : "text-emerald-700"}`}>
                  {geracao.erro || `${geracao.feitos} link${geracao.feitos === 1 ? "" : "s"} gerado${geracao.feitos === 1 ? "" : "s"}.`}
                </p>
              )}
            </div>
          )}
        </SummaryCard>
      </div>

      {resumo.semTelefoneConfiavel > 0 && (
        <div className="bg-white border border-border rounded-xl px-5 py-4 flex items-start gap-3">
          <PhoneOff className="h-[18px] w-[18px] text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-medium text-foreground">
              {resumo.semTelefoneConfiavel} telefone
              {resumo.semTelefoneConfiavel === 1 ? "" : "s"} sem o 9 de celular.
            </span>{" "}
            <span className="text-muted-foreground">
              O sistema completa automaticamente, mas confira antes de enviar — filtre por
              &quot;Telefone a conferir&quot; e corrija na ficha do aluno.
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-0 sm:min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por aluno ou responsável..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="h-10 w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Com pendência">Com pendência</SelectItem>
            <SelectItem value="Em atraso">Em atraso</SelectItem>
            <SelectItem value="Em dia">Em dia</SelectItem>
            <SelectItem value="Sem link">Sem link</SelectItem>
            <SelectItem value="Telefone a conferir">Telefone a conferir</SelectItem>
            <SelectItem value="Todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Aluno</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Responsável</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Meses em aberto</th>
                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3">Total</th>
                <th className="px-5 py-3 w-[260px]"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Nenhum aluno nesse filtro.
                  </td>
                </tr>
              )}
              {filtrados.map(a => (
                <tr key={a.id} className="border-b border-border hover:bg-muted/30 transition-colors align-top">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{a.aluno}</p>
                    {a.serie && <p className="text-xs text-muted-foreground mt-0.5">{a.serie}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    <p>{a.responsavel || "—"}</p>
                    <p className="text-xs mt-0.5">
                      {a.telefone || "sem telefone"}
                      {a.telefoneSuspeito && a.telefone && (
                        <span className="ml-1.5 text-amber-600 font-medium">conferir</span>
                      )}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    {a.pendentes.length === 0 ? (
                      <span className="text-emerald-700 font-medium text-xs">Tudo em dia</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {a.pendentes.map(p => (
                          <span
                            key={p.id}
                            title={`${p.situacao}${p.link ? " · link pronto" : " · sem link"}`}
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${SITUACAO_STYLE[p.situacao]} ${p.link ? "" : "border-dashed opacity-70"}`}
                          >
                            {p.mes.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-semibold font-heading whitespace-nowrap">
                    {a.total ? `R$ ${fmt(a.total)}` : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <AcoesAluno aluno={a} origem={origem} onQr={setQrAluno} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {filtrados.length} de {alunos.length} alunos
          </p>
          <p className="text-xs text-muted-foreground">
            Mês tracejado = parcela ainda sem link de pagamento
          </p>
        </div>
      </div>

      <Dialog open={!!qrAluno} onOpenChange={v => !v && setQrAluno(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              {qrAluno?.aluno}
            </DialogTitle>
          </DialogHeader>
          {qrSrc && (
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt="QR Code do aluno" width={240} height={240} />
              <p className="text-xs text-muted-foreground text-center">
                O responsável aponta a câmera e já cai na página com as mensalidades dele,
                sem digitar nada.
              </p>
              <Button asChild variant="outline" size="sm">
                <a href={`${qrSrc}&download=1`} download={`qr-${qrAluno.codigo}.svg`}>
                  Baixar QR
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
