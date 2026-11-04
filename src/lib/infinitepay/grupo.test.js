import { describe, it, expect, vi, beforeEach } from "vitest";
import { linkDoGrupo } from "./grupo";
import { processarWebhook } from "./webhook";

const ALUNO_ID = "5a000000-0000-4000-8000-000000000001";
const P1 = "8b1c8e5e-0000-4000-8000-000000000001";
const P2 = "8b1c8e5e-0000-4000-8000-000000000002";
const P3 = "8b1c8e5e-0000-4000-8000-000000000003";
const GRUPO = "9c000000-0000-4000-8000-000000000001";

/** Banco em memória com o pedaço da API do Supabase que o grupo e o webhook usam. */
function fakeDb(tabelas) {
  const db = { payment_groups: [], installments: [], payment_events: [], ...tabelas };
  let seq = 0;

  function consulta(tabela, acao, valor) {
    const filtros = [];
    const q = {
      eq: (c, v) => (filtros.push(r => r[c] === v), q),
      neq: (c, v) => (filtros.push(r => r[c] !== v), q),
      in: (c, vs) => (filtros.push(r => vs.includes(r[c])), q),
      gte: (c, v) => (filtros.push(r => r[c] >= v), q),
      order: () => q,
      select: () => q,
      single: async () => ({ data: executar()[0] ?? null, error: null }),
      maybeSingle: async () => ({ data: executar()[0] ?? null, error: null }),
      then: (ok, erro) => Promise.resolve({ data: executar(), error: null }).then(ok, erro),
    };
    function executar() {
      if (acao === "insert") return valor;
      const linhas = db[tabela].filter(r => filtros.every(f => f(r)));
      if (acao === "update") linhas.forEach(r => Object.assign(r, valor));
      return linhas.map(r => ({ ...r }));
    }
    return q;
  }

  return {
    db,
    from(tabela) {
      return {
        select: () => consulta(tabela, "select"),
        update: valor => consulta(tabela, "update", valor),
        insert: valor => {
          const linhas = (Array.isArray(valor) ? valor : [valor]).map(v => ({
            id: tabela === "payment_groups" ? GRUPO.replace(/1$/, String(++seq)) : `ev-${++seq}`,
            status: tabela === "payment_groups" ? "aberto" : v.status,
            created_at: new Date().toISOString(),
            ...v,
          }));
          db[tabela].push(...linhas);
          return consulta(tabela, "insert", linhas);
        },
      };
    },
  };
}

function aluno() {
  return {
    id: ALUNO_ID,
    aluno: "Maria Eduarda",
    responsavel: "Ana Souza",
    telefone: "71988887777",
    codigo: "abc123abc123",
  };
}

const setembro = { id: P1, mes: "Setembro", ano: 2026, valor: 300 };
const outubro = { id: P2, mes: "Outubro", ano: 2026, valor: 300 };
const novembro = { id: P3, mes: "Novembro", ano: 2026, valor: 350.5 };

beforeEach(() => {
  process.env.INFINITEPAY_WEBHOOK_TOKEN = "tok";
});

describe("link do pagar tudo", () => {
  it("cria um checkout com uma linha por mensalidade e grava o grupo", async () => {
    const supabase = fakeDb();
    const criar = vi.fn().mockResolvedValue({ url: "https://checkout/grupo" });
    const url = await linkDoGrupo({ supabase, aluno: aluno(), parcelas: [setembro, outubro, novembro], baseUrl: "https://escola.test", criar });

    expect(url).toBe("https://checkout/grupo");
    const [grupo] = supabase.db.payment_groups;
    expect(grupo).toMatchObject({ student_id: ALUNO_ID, installment_ids: [P1, P2, P3], amount: 950.5, payment_link: url });
    const pedido = criar.mock.calls[0][0];
    expect(pedido.orderNsu).toBe(`grupo-${grupo.id}`);
    expect(pedido.itens).toEqual([
      { descricao: "Mensalidade Setembro/2026 - Maria Eduarda", valorCentavos: 30000 },
      { descricao: "Mensalidade Outubro/2026 - Maria Eduarda", valorCentavos: 30000 },
      { descricao: "Mensalidade Novembro/2026 - Maria Eduarda", valorCentavos: 35050 },
    ]);
    expect(pedido.webhookUrl).toBe("https://escola.test/api/infinitepay/webhook?t=tok");
    expect(pedido.redirectUrl).toBe("https://escola.test/mensalidades?a=abc123abc123");
  });

  it("reaproveita o link aberto com as mesmas parcelas", async () => {
    const supabase = fakeDb();
    const criar = vi.fn().mockResolvedValue({ url: "https://checkout/1" });
    await linkDoGrupo({ supabase, aluno: aluno(), parcelas: [setembro, outubro], baseUrl: "https://e", criar });
    const url = await linkDoGrupo({ supabase, aluno: aluno(), parcelas: [outubro, setembro], baseUrl: "https://e", criar });
    expect(url).toBe("https://checkout/1");
    expect(criar).toHaveBeenCalledTimes(1);
  });

  it("parcelas mudaram (uma foi paga): cria outro link", async () => {
    const supabase = fakeDb();
    const criar = vi.fn().mockResolvedValueOnce({ url: "https://checkout/1" }).mockResolvedValueOnce({ url: "https://checkout/2" });
    await linkDoGrupo({ supabase, aluno: aluno(), parcelas: [setembro, outubro, novembro], baseUrl: "https://e", criar });
    const url = await linkDoGrupo({ supabase, aluno: aluno(), parcelas: [outubro, novembro], baseUrl: "https://e", criar });
    expect(url).toBe("https://checkout/2");
    expect(supabase.db.payment_groups).toHaveLength(2);
  });

  it("link de ontem não é reaproveitado", async () => {
    const supabase = fakeDb();
    const criar = vi.fn().mockResolvedValueOnce({ url: "https://checkout/1" }).mockResolvedValueOnce({ url: "https://checkout/2" });
    await linkDoGrupo({ supabase, aluno: aluno(), parcelas: [setembro, outubro], baseUrl: "https://e", criar });
    const amanha = new Date(Date.now() + 25 * 60 * 60 * 1000);
    const url = await linkDoGrupo({ supabase, aluno: aluno(), parcelas: [setembro, outubro], baseUrl: "https://e", criar, agora: amanha });
    expect(url).toBe("https://checkout/2");
  });
});

describe("webhook do pagar tudo", () => {
  const parcela = (id, extra = {}) => ({ id, amount: "300.00", status: "A vencer", transaction_nsu: null, ...extra });
  const grupoAberto = (extra = {}) => ({
    id: GRUPO, student_id: ALUNO_ID, installment_ids: [P1, P2], amount: "600.00", status: "aberto", transaction_nsu: null, ...extra,
  });
  const corpo = (extra = {}) => ({
    order_nsu: `grupo-${GRUPO}`, transaction_nsu: "tx-g", invoice_slug: "s", paid_amount: 60000, capture_method: "pix", ...extra,
  });
  const pago = vi.fn().mockResolvedValue({ paid: true, paid_amount: 60000, capture_method: "pix" });

  it("baixa todas as parcelas do grupo e fecha o grupo", async () => {
    const supabase = fakeDb({ payment_groups: [grupoAberto()], installments: [parcela(P1), parcela(P2)] });
    const r = await processarWebhook({ corpo: corpo(), supabase, checar: pago });

    expect(r).toEqual({ status: 200, resultado: "pago_grupo" });
    for (const p of supabase.db.installments) {
      expect(p).toMatchObject({ status: "Pago", transaction_nsu: "tx-g", payment_method: "Pix", paid_amount: 300 });
    }
    expect(supabase.db.payment_groups[0]).toMatchObject({ status: "pago", transaction_nsu: "tx-g", paid_amount: 600, duplicate_ids: [] });
    expect(supabase.db.payment_events.at(-1)).toMatchObject({ result: "pago_grupo", verified: true });
  });

  it("parcela que já estava paga por outra transação vira duplicidade", async () => {
    const supabase = fakeDb({
      payment_groups: [grupoAberto()],
      installments: [parcela(P1, { status: "Pago", transaction_nsu: "tx-avulso" }), parcela(P2)],
    });
    const r = await processarWebhook({ corpo: corpo(), supabase, checar: pago });

    expect(r.resultado).toBe("pago_grupo_com_duplicidade");
    expect(supabase.db.installments[0].transaction_nsu).toBe("tx-avulso");
    expect(supabase.db.installments[1].status).toBe("Pago");
    expect(supabase.db.payment_groups[0].duplicate_ids).toEqual([P1]);
    expect(supabase.db.payment_events.map(e => [e.result, e.installment_id ?? null])).toEqual([
      ["pago_em_duplicidade", P1],
      ["pago_grupo_com_duplicidade", null],
    ]);
  });

  it("não baixa nada quando pagou menos que o grupo", async () => {
    const supabase = fakeDb({ payment_groups: [grupoAberto()], installments: [parcela(P1), parcela(P2)] });
    const checar = vi.fn().mockResolvedValue({ paid: true, paid_amount: 30000 });
    const r = await processarWebhook({ corpo: corpo(), supabase, checar });
    expect(r.resultado).toBe("valor_divergente");
    expect(supabase.db.installments.every(p => p.status === "A vencer")).toBe(true);
    expect(supabase.db.payment_groups[0].status).toBe("aberto");
  });

  it("não baixa sem confirmação da InfinitePay", async () => {
    const supabase = fakeDb({ payment_groups: [grupoAberto()], installments: [parcela(P1), parcela(P2)] });
    const r = await processarWebhook({ corpo: corpo(), supabase, checar: vi.fn().mockResolvedValue({ paid: false }) });
    expect(r.resultado).toBe("nao_confirmado");
    expect(supabase.db.installments.every(p => p.status === "A vencer")).toBe(true);
  });

  it("reenvio da mesma transação é duplicado sem consultar", async () => {
    const supabase = fakeDb({ payment_groups: [grupoAberto({ status: "pago", transaction_nsu: "tx-g" })] });
    const checar = vi.fn();
    const r = await processarWebhook({ corpo: corpo(), supabase, checar });
    expect(r.resultado).toBe("duplicado");
    expect(checar).not.toHaveBeenCalled();
  });

  it("grupo pago duas vezes vira duplicidade", async () => {
    const supabase = fakeDb({ payment_groups: [grupoAberto({ status: "pago", transaction_nsu: "tx-g" })] });
    const r = await processarWebhook({ corpo: corpo({ transaction_nsu: "tx-2" }), supabase, checar: pago });
    expect(r.resultado).toBe("pago_em_duplicidade");
    expect(supabase.db.payment_events.at(-1)).toMatchObject({ installment_id: P1, verified: true });
  });

  it("retomada depois de falha no meio não acusa duplicidade da própria transação", async () => {
    const supabase = fakeDb({
      payment_groups: [grupoAberto()],
      installments: [parcela(P1, { status: "Pago", transaction_nsu: "tx-g" }), parcela(P2)],
    });
    const r = await processarWebhook({ corpo: corpo(), supabase, checar: pago });
    expect(r.resultado).toBe("pago_grupo");
    expect(supabase.db.payment_groups[0].duplicate_ids).toEqual([]);
  });

  it("pede retry quando o payment_check cai", async () => {
    const supabase = fakeDb({ payment_groups: [grupoAberto()], installments: [parcela(P1), parcela(P2)] });
    const r = await processarWebhook({ corpo: corpo(), supabase, checar: vi.fn().mockRejectedValue(new Error("x")) });
    expect(r).toEqual({ status: 400, resultado: "falha_na_verificacao" });
  });

  it("grupo inexistente só gera log", async () => {
    const supabase = fakeDb();
    const r = await processarWebhook({ corpo: corpo(), supabase, checar: vi.fn() });
    expect(r.resultado).toBe("grupo_nao_encontrado");
  });
});
