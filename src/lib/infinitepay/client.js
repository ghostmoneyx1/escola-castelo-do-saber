/**
 * Cliente do Checkout Integrado da InfinitePay.
 *
 * A API não pede token: identifica a conta só pelo `handle` (a InfiniteTag
 * da escola, sem o "$"). Por isso o handle fica em variável de ambiente e
 * este módulo só roda no servidor.
 *
 * Docs: https://www.infinitepay.io/checkout-documentacao
 */

const BASE_URL = "https://api.checkout.infinitepay.io";
const TIMEOUT_MS = 10_000;
const DESCRICAO_MAX = 100;

export function obterHandle() {
  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) throw new Error("INFINITEPAY_HANDLE não configurada");
  return handle.replace(/^\$/, "");
}

/** R$ 300,00 -> 30000. A API só aceita inteiro em centavos. */
export function paraCentavos(valor) {
  return Math.round(Number(valor) * 100);
}

async function post(caminho, body) {
  const res = await fetch(`${BASE_URL}${caminho}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, json };
}

/**
 * Cria um link de pagamento (Pix ou cartão) e devolve a URL.
 * `orderNsu` é o nosso identificador — usamos o id da parcela, que é o que o
 * webhook devolve depois pra gente saber qual parcela foi paga.
 */
export async function criarLink({
  orderNsu,
  descricao,
  valorCentavos,
  cliente,
  webhookUrl,
  redirectUrl,
}) {
  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) {
    throw new Error("Valor inválido para o link de pagamento");
  }

  const body = {
    handle: obterHandle(),
    order_nsu: String(orderNsu),
    items: [
      {
        quantity: 1,
        price: valorCentavos,
        description: String(descricao || "Mensalidade").slice(0, DESCRICAO_MAX),
      },
    ],
  };
  if (cliente?.name) body.customer = cliente;
  if (webhookUrl) body.webhook_url = webhookUrl;
  if (redirectUrl) body.redirect_url = redirectUrl;

  const { ok, status, json } = await post("/links", body);
  if (!ok || !json?.url) {
    throw new Error(`InfinitePay não devolveu o link (HTTP ${status})`);
  }
  return { url: json.url };
}

/**
 * Confirma junto à InfinitePay se uma transação foi mesmo paga.
 * O webhook não vem assinado, então nunca confiamos só nele.
 */
export async function checarPagamento({ orderNsu, transactionNsu, slug }) {
  const { ok, status, json } = await post("/payment_check", {
    handle: obterHandle(),
    order_nsu: String(orderNsu),
    transaction_nsu: transactionNsu == null ? undefined : String(transactionNsu),
    slug: slug == null ? undefined : String(slug),
  });
  if (!ok || !json) throw new Error(`payment_check respondeu HTTP ${status}`);
  return json;
}
