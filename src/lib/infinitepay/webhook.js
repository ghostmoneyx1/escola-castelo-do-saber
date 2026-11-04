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

import { PREFIXO_GRUPO } from "./grupo";

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
    return !error;
  }

  // Sem o log não há rastro do evento. Banco fora (ex.: Supabase acordando
  // depois de pausa) responde 400 pra InfinitePay reenviar mais tarde.
  const encerrar = async (resultado, extra) => {
    const registrado = await registrar(resultado, extra);
    return registrado
      ? { status: 200, resultado }
      : { status: 400, resultado: "erro_banco" };
  };

  if (orderNsu?.startsWith("teste-")) return encerrar("teste_recebido");

  // payment_check: { conferencia } quando respondeu, { falhou: true } quando caiu.
  async function conferir() {
    try {
      return { conferencia: await checar({ orderNsu, transactionNsu, slug }) };
    } catch (e) {
      console.error("webhook: payment_check falhou:", e.message);
      return { falhou: true };
    }
  }
  const valorPago = conferencia => Number(
    conferencia.paid_amount ?? conferencia.amount ?? corpo.paid_amount ?? corpo.amount
  );
  const dadosDoPagamento = conferencia => ({
    status: "Pago",
    paid_at: agora.toISOString(),
    payment_method: METODO_POR_CAPTURA[conferencia.capture_method || corpo.capture_method] || null,
    transaction_nsu: transactionNsu,
    receipt_url: corpo.receipt_url || null,
    infinitepay_slug: slug == null ? null : String(slug),
  });

  if (orderNsu?.startsWith(PREFIXO_GRUPO)) {
    return processarGrupo(orderNsu.slice(PREFIXO_GRUPO.length));
  }
  if (!orderNsu || !UUID_RE.test(orderNsu)) return encerrar("ignorado_sem_parcela");

  const { data: parcela, error: erroBusca } = await supabase
    .from("installments")
    .select("id, amount, status, transaction_nsu")
    .eq("id", orderNsu)
    .maybeSingle();

  if (erroBusca) {
    console.error("webhook: erro ao buscar parcela:", erroBusca.message);
    return { status: 400, resultado: "erro_banco" };
  }
  if (!parcela) return encerrar("parcela_nao_encontrada");

  if (parcela.status === "Pago") {
    // Mesma transação = a InfinitePay reenviando. Transação diferente (pagou
    // pelo "pagar tudo", em dinheiro ou duas vezes) = dinheiro a devolver.
    if (!transactionNsu || transactionNsu === parcela.transaction_nsu) {
      return encerrar("duplicado", { installment_id: parcela.id });
    }
    const { conferencia } = await conferir();
    return conferencia?.paid
      ? encerrar("pago_em_duplicidade", { installment_id: parcela.id, verified: true })
      : encerrar("duplicado", { installment_id: parcela.id });
  }

  const { conferencia, falhou } = await conferir();
  if (falhou) {
    await registrar("falha_na_verificacao", { installment_id: parcela.id });
    return { status: 400, resultado: "falha_na_verificacao" };
  }

  if (!conferencia?.paid) return encerrar("nao_confirmado", { installment_id: parcela.id });

  const esperadoCentavos = Math.round(Number(parcela.amount) * 100);
  const pagoCentavos = valorPago(conferencia);
  // Pagar a mais acontece (juros do parcelamento repassados). A menos, não.
  if (!Number.isFinite(pagoCentavos) || pagoCentavos < esperadoCentavos) {
    return encerrar("valor_divergente", { installment_id: parcela.id });
  }

  const { error: erroUpdate } = await supabase
    .from("installments")
    .update({ ...dadosDoPagamento(conferencia), paid_amount: pagoCentavos / 100 })
    .eq("id", parcela.id)
    .neq("status", "Pago");

  if (erroUpdate) {
    console.error("webhook: erro ao baixar parcela:", erroUpdate.message);
    return { status: 400, resultado: "erro_banco" };
  }

  // Parcela já baixada: mesmo sem log, não pede reenvio (viraria "duplicado").
  await registrar("pago", { installment_id: parcela.id, verified: true });
  return { status: 200, resultado: "pago" };

  /** Link "pagar tudo": baixa todas as parcelas do grupo de uma vez. */
  async function processarGrupo(grupoId) {
    if (!UUID_RE.test(grupoId)) return encerrar("ignorado_sem_parcela");

    const { data: grupo, error: erroGrupo } = await supabase
      .from("payment_groups")
      .select("id, amount, status, installment_ids, transaction_nsu")
      .eq("id", grupoId)
      .maybeSingle();
    if (erroGrupo) {
      console.error("webhook: erro ao buscar grupo:", erroGrupo.message);
      return { status: 400, resultado: "erro_banco" };
    }
    if (!grupo) return encerrar("grupo_nao_encontrado");
    if (grupo.status === "pago" && (!transactionNsu || transactionNsu === grupo.transaction_nsu)) {
      return encerrar("duplicado");
    }

    const { conferencia, falhou } = await conferir();
    if (falhou) {
      await registrar("falha_na_verificacao");
      return { status: 400, resultado: "falha_na_verificacao" };
    }
    if (!conferencia?.paid) return encerrar("nao_confirmado");
    if (grupo.status === "pago") {
      return encerrar("pago_em_duplicidade", { installment_id: grupo.installment_ids?.[0] ?? null, verified: true });
    }

    const pagoCentavos = valorPago(conferencia);
    if (!Number.isFinite(pagoCentavos) || pagoCentavos < Math.round(Number(grupo.amount) * 100)) {
      return encerrar("valor_divergente");
    }

    const { data: parcelas, error: erroParcelas } = await supabase
      .from("installments")
      .select("id, amount, status, transaction_nsu")
      .in("id", grupo.installment_ids);
    if (erroParcelas) {
      console.error("webhook: erro ao buscar parcelas do grupo:", erroParcelas.message);
      return { status: 400, resultado: "erro_banco" };
    }

    // Já paga por outra transação (link avulso, dinheiro): entra como
    // duplicidade pra secretaria devolver. Paga por esta mesma transação é
    // só a InfinitePay reenviando depois de uma falha no meio do caminho.
    const duplicadas = (parcelas || []).filter(p => p.status === "Pago" && p.transaction_nsu !== transactionNsu);
    const abertas = (parcelas || []).filter(p => p.status !== "Pago");
    for (const p of abertas) {
      const { error } = await supabase
        .from("installments")
        .update({ ...dadosDoPagamento(conferencia), paid_amount: Number(p.amount) })
        .eq("id", p.id)
        .neq("status", "Pago");
      if (error) {
        console.error("webhook: erro ao baixar parcela do grupo:", error.message);
        return { status: 400, resultado: "erro_banco" };
      }
    }

    const { error: erroFecha } = await supabase
      .from("payment_groups")
      .update({
        status: "pago",
        paid_at: agora.toISOString(),
        transaction_nsu: transactionNsu,
        paid_amount: pagoCentavos / 100,
        duplicate_ids: duplicadas.map(p => p.id),
      })
      .eq("id", grupo.id)
      .neq("status", "pago");
    if (erroFecha) {
      console.error("webhook: erro ao fechar grupo:", erroFecha.message);
      return { status: 400, resultado: "erro_banco" };
    }

    // Uma linha por parcela paga em dobro: é o que o painel lista pra devolver.
    for (const p of duplicadas) {
      await registrar("pago_em_duplicidade", { installment_id: p.id, verified: true });
    }
    const resultado = duplicadas.length ? "pago_grupo_com_duplicidade" : "pago_grupo";
    await registrar(resultado, { verified: true });
    return { status: 200, resultado };
  }
}
