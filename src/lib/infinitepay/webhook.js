/**
 * Processa a notificação de pagamento da InfinitePay.
 *
 * Regras:
 * - Tudo que chega vira uma linha em `payment_events`, inclusive o que foi
 *   ignorado. É o nosso rastro quando alguém diz "paguei e não baixou".
 * - A parcela só vira "Pago" depois do `payment_check` confirmar, porque o
 *   webhook não traz assinatura e qualquer um que descubra a URL pode
 *   mandar um JSON.
 * - Responder 200 encerra; 400 faz a InfinitePay tentar de novo. Então 400
 *   só quando a falha é nossa e vale repetir (banco ou verificação fora).
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const METODO_POR_CAPTURA = { pix: "Pix", credit_card: "Cartão" };

export async function processarWebhook({ corpo, supabase, checar, agora = new Date() }) {
  const orderNsu = typeof corpo?.order_nsu === "string" ? corpo.order_nsu : null;
  const transactionNsu = corpo?.transaction_nsu == null ? null : String(corpo.transaction_nsu);
  const slug = corpo?.invoice_slug ?? corpo?.slug ?? null;

  async function registrar(result, extra = {}) {
    const { error } = await supabase.from("payment_events").insert({
      source: "infinitepay_webhook",
      order_nsu: orderNsu,
      transaction_nsu: transactionNsu,
      result,
      verified: false,
      payload: corpo ?? {},
      ...extra,
    });
    if (error) console.error("payment_events insert:", error.message);
  }

  const encerrar = async (resultado, extra) => {
    await registrar(resultado, extra);
    return { status: 200, resultado };
  };

  if (orderNsu?.startsWith("teste-")) return encerrar("teste_recebido");
  if (!orderNsu || !UUID_RE.test(orderNsu)) return encerrar("ignorado_sem_parcela");

  const { data: parcela, error: erroBusca } = await supabase
    .from("installments")
    .select("id, amount, status")
    .eq("id", orderNsu)
    .maybeSingle();

  if (erroBusca) {
    console.error("webhook: erro ao buscar parcela:", erroBusca.message);
    return { status: 400, resultado: "erro_banco" };
  }
  if (!parcela) return encerrar("parcela_nao_encontrada");
  if (parcela.status === "Pago") return encerrar("duplicado", { installment_id: parcela.id });

  let conferencia;
  try {
    conferencia = await checar({ orderNsu, transactionNsu, slug });
  } catch (e) {
    console.error("webhook: payment_check falhou:", e.message);
    await registrar("falha_na_verificacao", { installment_id: parcela.id });
    return { status: 400, resultado: "falha_na_verificacao" };
  }

  if (!conferencia?.paid) return encerrar("nao_confirmado", { installment_id: parcela.id });

  const esperadoCentavos = Math.round(Number(parcela.amount) * 100);
  const pagoCentavos = Number(
    conferencia.paid_amount ?? conferencia.amount ?? corpo.paid_amount ?? corpo.amount
  );
  // Pagar a mais acontece (juros do parcelamento repassados). A menos, não.
  if (!Number.isFinite(pagoCentavos) || pagoCentavos < esperadoCentavos) {
    return encerrar("valor_divergente", { installment_id: parcela.id });
  }

  const captura = conferencia.capture_method || corpo.capture_method;
  const { error: erroUpdate } = await supabase
    .from("installments")
    .update({
      status: "Pago",
      paid_at: agora.toISOString(),
      payment_method: METODO_POR_CAPTURA[captura] || null,
      transaction_nsu: transactionNsu,
      paid_amount: pagoCentavos / 100,
      receipt_url: corpo.receipt_url || null,
      infinitepay_slug: slug == null ? null : String(slug),
    })
    .eq("id", parcela.id)
    .neq("status", "Pago");

  if (erroUpdate) {
    console.error("webhook: erro ao baixar parcela:", erroUpdate.message);
    return { status: 400, resultado: "erro_banco" };
  }

  await registrar("pago", { installment_id: parcela.id, verified: true });
  return { status: 200, resultado: "pago" };
}
