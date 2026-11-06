"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, CheckCircle, Loader2, PhoneOff, QrCode, RefreshCw, Search, Send, Smartphone,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_SESSAO = {
  ready: { texto: "Conectado", classe: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  qr_ready: { texto: "Aguardando leitura do QR", classe: "bg-amber-50 text-amber-600 border-amber-200" },
  initializing: { texto: "Ligando…", classe: "bg-muted text-muted-foreground border-border" },
  starting: { texto: "Ligando…", classe: "bg-muted text-muted-foreground border-border" },
  disconnected: { texto: "Desconectado", classe: "bg-red-50 text-red-700 border-red-200" },
};

const STATUS_MENSAGEM = {
  enviado: { texto: "Enviado", classe: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  na_fila: { texto: "Na fila", classe: "bg-blue-50 text-blue-700 border-blue-200" },
  simulado: { texto: "Simulado", classe: "bg-muted text-muted-foreground border-border" },
  falhou: { texto: "Falhou", classe: "bg-red-50 text-red-700 border-red-200" },
  pulado: { texto: "Não enviado", classe: "bg-amber-50 text-amber-600 border-amber-200" },
};

const MODELOS = [
  { id: "simples", nome: "Teste simples" },
  { id: "D-1", nome: "Véspera (D-1)" },
  { id: "D0", nome: "Vence hoje (D0)" },
  { id: "D+3", nome: "Atrasada (D+3)" },
];

const ESTAGIO_NOME = { "D-1": "Véspera", D0: "Vence hoje", "D+3": "Atrasada" };

function Etiqueta({ mapa, valor }) {
  const s = mapa[valor] || { texto: valor || "—", classe: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${s.classe}`}>
      {s.texto}
    </span>
  );
}

function fmtTelefone(n) {
  const d = String(n || "").replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return n || "—";
}

function fmtDataHora(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Bahia",
  });
}

async function chamarApi(url, body) {
  const res = await fetch(url, body
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    : { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erro ${res.status}`);
  return json;
}

function Cartao({ titulo, descricao, children }) {
  return (
    <section className="bg-white border border-border rounded-xl p-5">
      <h2 className="font-heading font-semibold text-foreground">{titulo}</h2>
      {descricao && <p className="text-sm text-muted-foreground mt-1">{descricao}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PainelSessao({ configurado }) {
  const [sessao, setSessao] = useState(null);
  const [erro, setErro] = useState(null);
  const [ligando, setLigando] = useState(false);
  const [numeroPareamento, setNumeroPareamento] = useState("");
  const [codigo, setCodigo] = useState(null);
  const [gerandoCodigo, setGerandoCodigo] = useState(false);

  useEffect(() => {
    if (!configurado) return;
    let vivo = true;
    let timer;
    async function atualizar() {
      let status = null;
      try {
        const s = await chamarApi("/api/whatsapp/sessao");
        if (!vivo) return;
        status = s.status;
        setSessao(s);
        setErro(null);
        if (s.status === "ready") setCodigo(null);
      } catch (e) {
        if (vivo) setErro(e.message);
      }
      // Pareando, o QR troca a cada ~20 s; conectado, basta conferir de vez em quando.
      if (vivo) timer = setTimeout(atualizar, status === "ready" ? 30_000 : 4_000);
    }
    atualizar();
    return () => { vivo = false; clearTimeout(timer); };
  }, [configurado]);

  async function ligar() {
    setLigando(true);
    try {
      await chamarApi("/api/whatsapp/sessao", { acao: "ligar" });
    } catch (e) {
      setErro(e.message);
    } finally {
      setLigando(false);
    }
  }

  async function gerarCodigo() {
    setGerandoCodigo(true);
    setCodigo(null);
    try {
      const r = await chamarApi("/api/whatsapp/sessao", { acao: "codigo", numero: numeroPareamento });
      setCodigo(r.codigo);
    } catch (e) {
      setErro(e.message);
    } finally {
      setGerandoCodigo(false);
    }
  }

  if (!configurado) {
    return (
      <Cartao titulo="Conexão do WhatsApp">
        <p className="text-sm text-muted-foreground">
          WhatsApp não configurado neste ambiente (faltam OPENWA_URL, OPENWA_API_KEY e OPENWA_SESSION_ID).
        </p>
      </Cartao>
    );
  }

  const conectado = sessao?.status === "ready";

  return (
    <Cartao titulo="Conexão do WhatsApp" descricao="Chip que envia os avisos de mensalidade.">
      <div className="flex items-center gap-3 flex-wrap">
        {sessao ? <Etiqueta mapa={STATUS_SESSAO} valor={sessao.status} /> : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {sessao?.telefone && (
          <span className="text-sm text-foreground">
            {fmtTelefone(sessao.telefone)}{sessao.nome ? ` · ${sessao.nome}` : ""}
          </span>
        )}
      </div>
      {conectado && sessao.conectadoEm && (
        <p className="text-xs text-muted-foreground mt-2">Conectado desde {fmtDataHora(sessao.conectadoEm)}</p>
      )}
      {erro && <p className="text-sm text-red-700 mt-3">{erro}</p>}

      {sessao && !conectado && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            O chip está desconectado e os avisos não saem enquanto isso. Para reconectar, ligue a sessão e leia o QR no
            celular do chip: <b>WhatsApp → Aparelhos conectados → Conectar aparelho</b>.
          </p>
          {sessao.status !== "qr_ready" && (
            <Button onClick={ligar} disabled={ligando}>
              {ligando ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
              Ligar e gerar QR
            </Button>
          )}
          {sessao.qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sessao.qr} alt="QR para conectar o WhatsApp" className="w-64 h-64 border border-border rounded-lg" />
          )}
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Sem como ler o QR? No celular, escolha <b>Conectar com número de telefone</b>, deixe a tela aberta e só
              então gere o código (vale ~20 s).
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Input
                className="w-56"
                placeholder="71 98260-7878"
                value={numeroPareamento}
                onChange={e => setNumeroPareamento(e.target.value)}
              />
              <Button variant="outline" onClick={gerarCodigo} disabled={gerandoCodigo || !numeroPareamento}>
                {gerandoCodigo && <Loader2 className="h-4 w-4 animate-spin" />}
                Gerar código
              </Button>
            </div>
            {codigo && <p className="font-heading text-3xl font-semibold tracking-[0.3em] mt-3">{codigo}</p>}
          </div>
        </div>
      )}
    </Cartao>
  );
}

function PainelTeste() {
  const [numero, setNumero] = useState("");
  const [modelo, setModelo] = useState("simples");
  const [conferencia, setConferencia] = useState(null);
  const [envio, setEnvio] = useState(null);
  const [ocupado, setOcupado] = useState(null);

  async function conferir() {
    setOcupado("conferir");
    setConferencia(null);
    try {
      setConferencia(await chamarApi("/api/whatsapp/numero", { numero }));
    } catch (e) {
      setConferencia({ erro: e.message });
    } finally {
      setOcupado(null);
    }
  }

  async function enviar() {
    setOcupado("enviar");
    setEnvio(null);
    try {
      const r = await chamarApi("/api/whatsapp/teste", { numero, modelo });
      setEnvio({ ok: true, texto: r.texto });
    } catch (e) {
      setEnvio({ erro: e.message });
    } finally {
      setOcupado(null);
    }
  }

  return (
    <Cartao
      titulo="Conferir número e mandar teste"
      descricao="Veja se um número tem WhatsApp e receba no seu celular como o aviso chega. Toda mensagem de teste começa com [TESTE]."
    >
      <div className="flex gap-2 flex-wrap">
        <Input
          className="w-56"
          placeholder="71 99999-8888"
          value={numero}
          onChange={e => { setNumero(e.target.value); setConferencia(null); setEnvio(null); }}
        />
        <Button variant="outline" onClick={conferir} disabled={!numero || ocupado}>
          {ocupado === "conferir" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Conferir número
        </Button>
      </div>

      {conferencia?.erro && <p className="text-sm text-red-700 mt-3">{conferencia.erro}</p>}
      {conferencia && !conferencia.erro && (
        <div className="flex items-start gap-2 mt-3 text-sm">
          {conferencia.temWhatsapp ? (
            <>
              <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <p>
                Tem WhatsApp.
                {conferencia.contaWhatsapp !== conferencia.numero && (
                  <span className="text-muted-foreground">
                    {" "}A conta está registrada como {fmtTelefone(conferencia.contaWhatsapp)} (sem o 9) — o sistema
                    corrige sozinho no envio.
                  </span>
                )}
              </p>
            </>
          ) : (
            <>
              <PhoneOff className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p>Esse número não tem WhatsApp. Aviso pra ele fica como “não enviado”.</p>
            </>
          )}
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wide">Mensagem de teste</p>
        <div className="flex gap-2 flex-wrap mt-2">
          {MODELOS.map(m => (
            <Button
              key={m.id}
              size="sm"
              variant={modelo === m.id ? "default" : "outline"}
              onClick={() => setModelo(m.id)}
            >
              {m.nome}
            </Button>
          ))}
        </div>
        <Button className="mt-4" onClick={enviar} disabled={!numero || ocupado}>
          {ocupado === "enviar" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Enviar teste
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Até 10 testes por hora — é o mesmo chip que manda as cobranças de verdade.
        </p>
      </div>

      {envio?.erro && <p className="text-sm text-red-700 mt-3">{envio.erro}</p>}
      {envio?.ok && (
        <div className="mt-4">
          <p className="text-sm text-emerald-700 font-medium">Enviado. Confira no celular.</p>
          <pre className="mt-2 whitespace-pre-wrap text-sm bg-muted rounded-lg p-4 font-sans">{envio.texto}</pre>
        </div>
      )}
    </Cartao>
  );
}

export function WhatsappClient({ mensagens, erroMensagens, configurado, ativo, ritmo }) {
  const router = useRouter();
  const [atualizando, startTransition] = useTransition();
  const [filtro, setFiltro] = useState("todos");
  const [aberta, setAberta] = useState(null);

  const contagem = useMemo(() => {
    const c = {};
    for (const m of mensagens) c[m.status] = (c[m.status] || 0) + 1;
    return c;
  }, [mensagens]);

  const lista = filtro === "todos" ? mensagens : mensagens.filter(m => m.status === filtro);

  return (
    <div className="space-y-6">
      <PageHeader title="WhatsApp da cobrança" subtitle="Conexão do chip, testes e histórico dos avisos automáticos" />

      <div className={`border rounded-xl p-4 flex items-start gap-3 ${ativo ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
        {ativo ? <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />}
        <div className="text-sm">
          {ativo ? (
            <p className="font-semibold text-emerald-800">Envio automático ligado</p>
          ) : (
            <p className="font-semibold text-amber-800">Envio automático em simulação — nenhum aviso sai para os pais</p>
          )}
          <p className="text-muted-foreground mt-1">
            Avisos na véspera (D-1), no dia (D0) e 3 dias depois (D+3), de {ritmo.horaInicio}h às {ritmo.horaFim}h, em
            rodadas de até {ritmo.porRodada} mensagens por hora e no máximo {ritmo.porDia} por dia.
            {!ativo && " Em simulação, cada aviso que sairia fica registrado abaixo como “Simulado”."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <PainelSessao configurado={configurado} />
        <PainelTeste />
      </div>

      <section className="bg-white border border-border rounded-xl">
        <div className="p-5 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-heading font-semibold text-foreground">Avisos automáticos</h2>
            <p className="text-sm text-muted-foreground mt-1">Últimos {mensagens.length} registrados. Clique numa linha para ver o texto.</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {["todos", "enviado", "na_fila", "simulado", "pulado", "falhou"].map(f => (
              <Button
                key={f}
                size="sm"
                variant={filtro === f ? "default" : "outline"}
                onClick={() => setFiltro(f)}
              >
                {f === "todos" ? `Todos (${mensagens.length})` : `${STATUS_MENSAGEM[f].texto} (${contagem[f] || 0})`}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={() => startTransition(() => router.refresh())} disabled={atualizando}>
              <RefreshCw className={`h-3.5 w-3.5 ${atualizando ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {erroMensagens && <p className="px-5 pb-5 text-sm text-red-700">Não foi possível carregar: {erroMensagens}</p>}

        {!erroMensagens && lista.length === 0 && (
          <div className="px-5 pb-10 pt-4 text-center text-sm text-muted-foreground">
            <Smartphone className="h-6 w-6 mx-auto mb-2" />
            Nenhum aviso {filtro === "todos" ? "registrado ainda" : "com esse status"}.
          </div>
        )}

        {lista.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left text-[11px] uppercase font-semibold text-muted-foreground tracking-wide">
                  <th className="px-5 py-3.5">Quando</th>
                  <th className="px-5 py-3.5">Aluno</th>
                  <th className="px-5 py-3.5">Aviso</th>
                  <th className="px-5 py-3.5">Telefone</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(m => (
                  <MensagemLinha key={m.id} m={m} aberta={aberta === m.id} onClick={() => setAberta(aberta === m.id ? null : m.id)} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function MensagemLinha({ m, aberta, onClick }) {
  return (
    <>
      <tr className="border-t border-border cursor-pointer hover:bg-muted/50" onClick={onClick}>
        <td className="px-5 py-3.5 whitespace-nowrap">{fmtDataHora(m.enviadoEm || m.criadoEm)}</td>
        <td className="px-5 py-3.5">{m.aluno || "—"}</td>
        <td className="px-5 py-3.5 whitespace-nowrap">{ESTAGIO_NOME[m.estagio] || m.estagio}</td>
        <td className="px-5 py-3.5 whitespace-nowrap">{fmtTelefone(m.telefone)}</td>
        <td className="px-5 py-3.5">
          <Etiqueta mapa={STATUS_MENSAGEM} valor={m.status} />
          {m.erro && <p className="text-xs text-muted-foreground mt-1">{m.erro}</p>}
        </td>
      </tr>
      {aberta && (
        <tr className="border-t border-border bg-muted/30">
          <td colSpan={5} className="px-5 py-4">
            <pre className="whitespace-pre-wrap text-sm font-sans max-w-xl">{m.texto}</pre>
          </td>
        </tr>
      )}
    </>
  );
}
