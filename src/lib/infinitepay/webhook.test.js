import { describe, it, expect, vi } from "vitest";
import { processarWebhook } from "./webhook";

const PARCELA_ID = "8b1c8e5e-0000-4000-8000-000000000001";

/** Supabase de mentira: só o que o webhook usa. */
function fakeSupabase({ parcela = null, erroBusca = null, erroUpdate = null, erroInsert = null } = {}) {
  const inserts = [];
  const updates = [];
  return {
    inserts,
    updates,
    from(table) {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: parcela, error: erroBusca }),
          }),
        }),
        insert: async row => {
          inserts.push({ table, row });
          return { error: erroInsert };
        },
        update: row => ({
          eq: () => ({
            neq: async () => {
              updates.push({ table, row });
              return { error: erroUpdate };
            },
          }),
        }),
      };
    },
  };
}

function corpoPago(extra = {}) {
  return {
    order_nsu: PARCELA_ID,
    transaction_nsu: "tx-123",
    invoice_slug: "slug-abc",
    amount: 30000,
    paid_amount: 30000,
    capture_method: "pix",
    receipt_url: "https://recibo",
    ...extra,
  };
}

const parcelaAberta = { id: PARCELA_ID, amount: "300.00", status: "A vencer" };

describe("webhook da InfinitePay", () => {
  it("registra teste sem tocar em parcela", async () => {
    const supabase = fakeSupabase();
    const r = await processarWebhook({ corpo: { order_nsu: "teste-1" }, supabase, checar: vi.fn() });
    expect(r).toEqual({ status: 200, resultado: "teste_recebido" });
    expect(supabase.inserts[0].row.result).toBe("teste_recebido");
    expect(supabase.updates).toHaveLength(0);
  });

  it("pede retry (400) quando nem o log consegue gravar", async () => {
    const supabase = fakeSupabase({ erroInsert: { message: "connection refused" } });
    const r = await processarWebhook({ corpo: { order_nsu: "teste-1" }, supabase, checar: vi.fn() });
    expect(r).toEqual({ status: 400, resultado: "erro_banco" });
  });

  it("ignora order_nsu que não é parcela", async () => {
    const supabase = fakeSupabase();
    const r = await processarWebhook({ corpo: { order_nsu: "qualquer" }, supabase, checar: vi.fn() });
    expect(r.resultado).toBe("ignorado_sem_parcela");
    expect(r.status).toBe(200);
  });

  it("parcela inexistente só gera log", async () => {
    const supabase = fakeSupabase({ parcela: null });
    const checar = vi.fn();
    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar });
    expect(r.resultado).toBe("parcela_nao_encontrada");
    expect(checar).not.toHaveBeenCalled();
  });

  it("parcela já paga é duplicado e não consulta a InfinitePay", async () => {
    const supabase = fakeSupabase({ parcela: { ...parcelaAberta, status: "Pago" } });
    const checar = vi.fn();
    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar });
    expect(r.resultado).toBe("duplicado");
    expect(checar).not.toHaveBeenCalled();
    expect(supabase.updates).toHaveLength(0);
  });

  it("pede retry (400) quando o payment_check cai", async () => {
    const supabase = fakeSupabase({ parcela: parcelaAberta });
    const checar = vi.fn().mockRejectedValue(new Error("timeout"));
    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar });
    expect(r).toEqual({ status: 400, resultado: "falha_na_verificacao" });
    expect(supabase.updates).toHaveLength(0);
  });

  it("não baixa quando a InfinitePay diz que não está pago", async () => {
    const supabase = fakeSupabase({ parcela: parcelaAberta });
    const checar = vi.fn().mockResolvedValue({ success: true, paid: false });
    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar });
    expect(r.resultado).toBe("nao_confirmado");
    expect(supabase.updates).toHaveLength(0);
  });

  it("não baixa quando pagou menos que a parcela", async () => {
    const supabase = fakeSupabase({ parcela: parcelaAberta });
    const checar = vi.fn().mockResolvedValue({ paid: true, paid_amount: 25000, capture_method: "pix" });
    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar });
    expect(r.resultado).toBe("valor_divergente");
    expect(supabase.updates).toHaveLength(0);
  });

  it("baixa a parcela com método, valor e recibo quando confirma", async () => {
    const supabase = fakeSupabase({ parcela: parcelaAberta });
    const checar = vi.fn().mockResolvedValue({
      success: true, paid: true, amount: 30000, paid_amount: 30000, installments: 1, capture_method: "pix",
    });
    const agora = new Date("2026-10-07T15:00:00Z");

    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar, agora });

    expect(r).toEqual({ status: 200, resultado: "pago" });
    expect(checar).toHaveBeenCalledWith({ orderNsu: PARCELA_ID, transactionNsu: "tx-123", slug: "slug-abc" });
    expect(supabase.updates[0].row).toMatchObject({
      status: "Pago",
      paid_at: agora.toISOString(),
      payment_method: "Pix",
      transaction_nsu: "tx-123",
      paid_amount: 300,
      receipt_url: "https://recibo",
      infinitepay_slug: "slug-abc",
    });
    const evento = supabase.inserts.at(-1).row;
    expect(evento).toMatchObject({ result: "pago", verified: true, installment_id: PARCELA_ID });
  });

  it("aceita pagar a mais (juros do cartão repassados)", async () => {
    const supabase = fakeSupabase({ parcela: parcelaAberta });
    const checar = vi.fn().mockResolvedValue({ paid: true, paid_amount: 31500, capture_method: "credit_card" });
    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar });
    expect(r.resultado).toBe("pago");
    expect(supabase.updates[0].row).toMatchObject({ payment_method: "Cartão", paid_amount: 315 });
  });

  it("pede retry quando o update falha", async () => {
    const supabase = fakeSupabase({ parcela: parcelaAberta, erroUpdate: { message: "boom" } });
    const checar = vi.fn().mockResolvedValue({ paid: true, paid_amount: 30000 });
    const r = await processarWebhook({ corpo: corpoPago(), supabase, checar });
    expect(r).toEqual({ status: 400, resultado: "erro_banco" });
  });
});
