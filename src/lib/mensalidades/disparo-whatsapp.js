import { randomUUID } from "node:crypto";
import { carregarAlunos } from "./consultas";
import { estagioDaParcela, hojeNaEscola, montarLembrete } from "./lembretes";
import {
  resolverChatId, enviarLote, statusLote, statusSessao, LOTE_MAX,
} from "@/lib/openwa/client";

/**
 * Cobrança automática por WhatsApp. O cron diário chama `dispararCobranca`:
 * fecha os lotes de ontem, escolhe as parcelas que recebem aviso hoje,
 * grava cada aviso em `whatsapp_messages` e entrega um lote ao OpenWA.
 *
 * Gravar antes de enviar é o que garante "no máximo uma vez": o índice único
 * (parcela, estágio) barra uma segunda rodada no mesmo dia.
 */

// Estados que contam como "este aviso já foi tratado".
const DEFINITIVOS = new Set(["na_fila", "enviado", "pulado"]);

// Uma rodada leva poucos minutos; passou um dia inteiro, o OpenWA perdeu o
// lote (reinício no meio do envio) e ele não vai mais terminar.
const LOTE_TRAVADO_MS = 24 * 60 * 60 * 1000;

// Ritmo anti-bloqueio. O disparo roda em rodadas curtas espalhadas pelo dia
// (agendador de hora em hora na VPS + o cron diário da Vercel), nunca um
// bloco único: poucas mensagens por vez, teto por dia e só em horário comercial.
export const RITMO_PADRAO = { porRodada: 6, porDia: 30, horaInicio: 8, horaFim: 18 };

// Quando o teto do dia não dá pra todos, quem vence hoje e quem está atrasado
// vêm antes do lembrete de véspera (que vira o aviso "vence hoje" amanhã).
const PRIORIDADE = { D0: 0, "D+3": 1, "D-1": 2 };

const FUSO_ESCOLA = "America/Bahia";

function horaNaEscola(agora) {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: FUSO_ESCOLA, hour: "numeric", hourCycle: "h23" }).format(agora));
}

// Salvador é UTC-3 o ano todo (sem horário de verão).
function inicioDoDiaUtc(hoje) {
  return `${hoje}T03:00:00Z`;
}

/** Avisos do dia a partir da visão de cobrança dos alunos. Função pura. */
export function selecionarAvisos(alunos, { hoje, baseUrl }) {
  const avisos = [];
  for (const a of alunos) {
    for (const p of a.pendentes) {
      if (p.situacao === "Pago") continue;
      const estagio = estagioDaParcela(p.vencimento, hoje);
      if (!estagio) continue;

      // Link curto: o da InfinitePay tem ~470 caracteres e vira um bloco no WhatsApp.
      const link = `${baseUrl}/p/${a.codigo}-${p.mesNumero}`;
      const aviso = {
        installment_id: p.id,
        student_id: a.id,
        stage: estagio,
        phone: a.whatsapp,
        body: montarLembrete(estagio, { aluno: a.aluno, responsavel: a.responsavel, parcela: p, link }),
        status: "pronto",
        error: null,
      };
      if (!a.whatsapp) {
        aviso.status = "pulado";
        aviso.error = "sem telefone do responsável";
      } else if (a.telefoneSuspeito) {
        // Número antigo sem o 9: mandar pode cair em outra pessoa.
        aviso.status = "pulado";
        aviso.error = "telefone a conferir (sem o 9)";
      }
      avisos.push(aviso);
    }
  }
  return avisos;
}

async function jaTratados(supabase, avisos, { incluirSimulados }) {
  const ids = [...new Set(avisos.map(a => a.installment_id))];
  if (!ids.length) return new Set();
  const { data, error } = await supabase
    .from("whatsapp_messages")
    .select("installment_id, stage, status")
    .in("installment_id", ids);
  if (error) throw new Error(error.message);
  return new Set(
    (data || [])
      .filter(r => DEFINITIVOS.has(r.status) || (incluirSimulados && r.status === "simulado"))
      .map(r => `${r.installment_id}|${r.stage}`)
  );
}

async function inserir(supabase, linhas) {
  if (!linhas.length) return;
  const { error } = await supabase.from("whatsapp_messages").insert(linhas);
  if (error) throw new Error(error.message);
}

/**
 * Atualiza os avisos `na_fila` com o resultado que o OpenWA devolveu.
 * Lote ainda rodando fica pra próxima vez; lote encerrado fecha tudo.
 */
export async function conciliarLotes(supabase, cfg, agora = new Date()) {
  const { data, error } = await supabase
    .from("whatsapp_messages")
    .select("id, batch_id, batch_index, created_at")
    .eq("status", "na_fila");
  if (error) throw new Error(error.message);

  const porLote = new Map();
  for (const r of data || []) {
    if (!porLote.has(r.batch_id)) porLote.set(r.batch_id, []);
    porLote.get(r.batch_id).push(r);
  }

  let atualizados = 0;
  for (const [batchId, linhas] of porLote) {
    let lote;
    try {
      lote = await statusLote(cfg, batchId);
    } catch (e) {
      if (e.status !== 404) throw e;
      lote = { status: "failed", results: [], perdido: true };
    }
    const encerrado = ["completed", "failed", "cancelled"].includes(lote.status);

    for (const linha of linhas) {
      const r = lote.results?.[linha.batch_index];
      let patch = null;
      if (r?.status === "sent") {
        patch = { status: "enviado", sent_at: r.sentAt || new Date().toISOString(), error: null };
      } else if (r?.status === "failed" || r?.status === "cancelled") {
        patch = { status: "falhou", error: r.error?.message || r.status };
      } else if (encerrado) {
        patch = { status: "falhou", error: lote.perdido ? "lote não encontrado no OpenWA" : `lote ${lote.status}` };
      } else if (agora - new Date(linha.created_at) > LOTE_TRAVADO_MS) {
        patch = { status: "falhou", error: "lote travado no OpenWA (mais de 24 h sem terminar)" };
      }
      if (!patch) continue;
      const { error: erroUpdate } = await supabase.from("whatsapp_messages").update(patch).eq("id", linha.id);
      if (erroUpdate) throw new Error(erroUpdate.message);
      atualizados++;
    }
  }
  return atualizados;
}

/**
 * Rodada do dia. Com `ativo` falso (ou sem OpenWA configurado) nada sai:
 * os avisos ficam gravados como `simulado` pra conferir antes de ligar.
 */
async function contar(supabase, filtro) {
  let q = supabase.from("whatsapp_messages").select("id", { count: "exact", head: true });
  q = filtro(q);
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return count || 0;
}

export async function dispararCobranca({
  supabase, cfg, ativo, baseUrl, agora = new Date(), ritmo = RITMO_PADRAO,
}) {
  const hoje = hojeNaEscola(agora);
  const enviar = Boolean(ativo && cfg);
  const resumo = { hoje, modo: enviar ? "envio" : "simulacao", conciliados: 0, enfileirados: 0, pulados: 0, simulados: 0 };

  if (enviar) {
    const hora = horaNaEscola(agora);
    if (hora < ritmo.horaInicio || hora >= ritmo.horaFim) {
      resumo.parado = `fora do horário de envio (${ritmo.horaInicio}h–${ritmo.horaFim}h)`;
      return resumo;
    }
    resumo.conciliados = await conciliarLotes(supabase, cfg, agora);
    // Rodada anterior ainda mandando: espera ela acabar, nunca dois lotes juntos.
    if (await contar(supabase, q => q.eq("status", "na_fila")) > 0) {
      resumo.parado = "rodada anterior ainda enviando";
      return resumo;
    }
  }

  const alunos = await carregarAlunos(supabase, { ano: Number(hoje.slice(0, 4)) });
  const candidatos = selecionarAvisos(alunos, { hoje, baseUrl });
  const tratados = await jaTratados(supabase, candidatos, { incluirSimulados: !enviar });
  const avisos = candidatos.filter(a => !tratados.has(`${a.installment_id}|${a.stage}`));

  const pulados = avisos.filter(a => a.status === "pulado");
  const prontos = avisos.filter(a => a.status === "pronto");
  const linha = ({ installment_id, student_id, stage, phone, body, error }) =>
    ({ installment_id, student_id, stage, phone, body, error });

  await inserir(supabase, pulados.map(a => ({ ...linha(a), status: "pulado" })));
  resumo.pulados = pulados.length;

  if (!enviar) {
    await inserir(supabase, prontos.map(a => ({ ...linha(a), status: "simulado" })));
    resumo.simulados = prontos.length;
    return resumo;
  }
  if (!prontos.length) return resumo;

  // Sessão caída (chip desconectado, QR pendente): não grava nada e a próxima
  // rodada tenta de novo — gravar "falhou" a cada hora só encheria o painel.
  const status = await statusSessao(cfg).catch(e => `erro: ${e.message}`);
  if (status !== "ready") {
    resumo.erro = `Sessão do WhatsApp não está pronta (${status})`;
    return resumo;
  }

  // Um número que não deu pra conferir não pode derrubar a rodada: o cron só
  // passa uma vez por dia e os outros avisos do estágio se perderiam.
  const enviadosHoje = await contar(supabase, q =>
    q.in("status", ["na_fila", "enviado"]).gte("created_at", inicioDoDiaUtc(hoje)));
  const vagas = Math.max(Math.min(ritmo.porRodada, ritmo.porDia - enviadosHoje, LOTE_MAX), 0);
  resumo.restantesHoje = prontos.length;
  if (!vagas) {
    resumo.parado = `teto do dia atingido (${ritmo.porDia})`;
    return resumo;
  }
  const daRodada = [...prontos]
    .sort((x, y) => PRIORIDADE[x.stage] - PRIORIDADE[y.stage])
    .slice(0, vagas);

  const resolvidos = [];
  const descartados = [];
  for (const a of daRodada) {
    try {
      const chatId = await resolverChatId(cfg, a.phone);
      if (chatId) resolvidos.push({ ...a, chatId });
      else descartados.push({ ...linha(a), status: "pulado", error: "número sem WhatsApp" });
    } catch (e) {
      descartados.push({ ...linha(a), status: "falhou", error: `não deu pra conferir o número: ${e.message}` });
    }
  }
  await inserir(supabase, descartados);
  resumo.pulados += descartados.filter(d => d.status === "pulado").length;
  resumo.falhas = descartados.filter(d => d.status === "falhou").length;

  const lote = resolvidos;
  resumo.restantesHoje = prontos.length - daRodada.length;
  if (!lote.length) return resumo;
  const batchId = `cobranca-${hoje}-${randomUUID().slice(0, 8)}`;
  await inserir(
    supabase,
    lote.map((a, i) => ({ ...linha(a), status: "na_fila", batch_id: batchId, batch_index: i }))
  );

  try {
    await enviarLote(cfg, {
      batchId,
      mensagens: lote.map(a => ({ chatId: a.chatId, texto: a.body })),
    });
  } catch (e) {
    const { error } = await supabase
      .from("whatsapp_messages")
      .update({ status: "falhou", error: e.message })
      .eq("batch_id", batchId);
    if (error) throw new Error(error.message);
    resumo.erro = e.message;
    return resumo;
  }

  resumo.enfileirados = lote.length;
  resumo.batchId = batchId;
  return resumo;
}
