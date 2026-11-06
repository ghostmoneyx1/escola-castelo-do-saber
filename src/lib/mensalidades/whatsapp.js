export { montarCobrancaManual } from "./lembretes";

/** URL do WhatsApp Web/app com a mensagem já preenchida. */
export function linkWhatsapp(numero, mensagem) {
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
