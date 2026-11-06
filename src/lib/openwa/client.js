/**
 * Cliente do OpenWA (gateway de WhatsApp self-hosted, API não oficial).
 *
 * Roda na VPS junto com a sessão de outro cliente, por isso a chave daqui é
 * restrita à sessão da escola (`allowedSessions`) — nunca usar a master key.
 * Só servidor.
 */

const TIMEOUT_MS = 15_000;

// O OpenWA aceita no máximo 60 s entre mensagens; com `randomizeDelay` ele
// soma até 2 s. Ritmo de gente, não de robô: é o que segura o número.
const INTERVALO_MS = 45_000;
export const LOTE_MAX = 100;

export function configuracaoOpenwa() {
  const url = process.env.OPENWA_URL;
  const apiKey = process.env.OPENWA_API_KEY;
  const sessionId = process.env.OPENWA_SESSION_ID;
  if (!url || !apiKey || !sessionId) return null;
  return { url: url.replace(/\/$/, ""), apiKey, sessionId };
}

async function chamar(cfg, metodo, caminho, body) {
  const res = await fetch(
    `${cfg.url}/api/sessions/${encodeURIComponent(cfg.sessionId)}${caminho}`,
    {
      method: metodo,
      headers: { "X-API-Key": cfg.apiKey, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    }
  );
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const erro = new Error(`OpenWA ${caminho} respondeu HTTP ${res.status}`);
    erro.status = res.status;
    throw erro;
  }
  return json;
}

/**
 * Chat id real do número no WhatsApp, ou null se não tem conta.
 * Conta antiga de celular brasileiro pode estar registrada sem o 9; o motor
 * Baileys não corrige isso no envio, então perguntamos antes de mandar.
 */
export async function resolverChatId(cfg, numero) {
  const r = await chamar(cfg, "GET", `/contacts/check/${encodeURIComponent(numero)}`);
  return r?.exists ? r.whatsappId : null;
}

export async function statusSessao(cfg) {
  const sessao = await chamar(cfg, "GET", "");
  return sessao?.status || null;
}

/**
 * Entrega um lote pro OpenWA, que manda uma por uma no ritmo configurado.
 * Volta na hora (202); o resultado de cada mensagem sai em `statusLote`.
 */
export async function enviarLote(cfg, { batchId, mensagens }) {
  if (mensagens.length > LOTE_MAX) throw new Error(`Lote acima de ${LOTE_MAX} mensagens`);
  return chamar(cfg, "POST", "/messages/send-bulk", {
    batchId,
    messages: mensagens.map(m => ({
      chatId: m.chatId,
      type: "text",
      content: { text: m.texto },
    })),
    options: { delayBetweenMessages: INTERVALO_MS, randomizeDelay: true, stopOnError: false },
  });
}

/** `results` vem na mesma ordem das mensagens do lote. */
export async function statusLote(cfg, batchId) {
  return chamar(cfg, "GET", `/messages/batch/${encodeURIComponent(batchId)}`);
}

/** Dados da sessão: status, número conectado, nome no WhatsApp, último erro. */
export async function dadosSessao(cfg) {
  return chamar(cfg, "GET", "");
}

export async function ligarSessao(cfg) {
  return chamar(cfg, "POST", "/start");
}

/** QR do pareamento (data URL) quando a sessão está em `qr_ready`. */
export async function qrSessao(cfg) {
  const r = await chamar(cfg, "GET", "/qr");
  return r?.qrCode || null;
}

/** Código de 8 letras pra "Conectar com número de telefone" (expira rápido). */
export async function codigoPareamento(cfg, numero) {
  const r = await chamar(cfg, "POST", "/pairing-code", { phoneNumber: numero });
  return r?.code || r?.pairingCode || null;
}

export async function enviarTexto(cfg, { chatId, texto }) {
  return chamar(cfg, "POST", "/messages/send-text", { chatId, text: texto });
}
