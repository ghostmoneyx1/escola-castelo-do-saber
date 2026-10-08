import { describe, it, expect, vi, beforeEach } from "vitest";
import { gerarLinksParaParcelas } from "./links";

function fakeSupabase({ vinculos = [], erroUpdate = null } = {}) {
  const updates = [];
  return {
    updates,
    from(table) {
      if (table === "student_guardians") {
        return { select: () => ({ in: async () => ({ data: vinculos, error: null }) }) };
      }
      return {
        update: row => ({
          eq: async (_col, id) => {
            updates.push({ id, row });
            return { error: erroUpdate };
          },
        }),
      };
    },
  };
}

const parcela = {
  id: "8b1c8e5e-0000-4000-8000-000000000001",
  month: 10,
  year: 2026,
  amount: "300.00",
  student_id: "aluno-1",
  students: { id: "aluno-1", name: "Samir Gael" },
};

describe("geração de links", () => {
  beforeEach(() => {
    process.env.INFINITEPAY_WEBHOOK_TOKEN = "tok";
    process.env.MENSALIDADES_LINK_SECRET = "segredo";
  });

  it("cria o link com os dados da parcela e grava na parcela", async () => {
    const supabase = fakeSupabase({
      vinculos: [{ student_id: "aluno-1", is_primary: true, guardians: { name: "Naiara", phone: "71993363876" } }],
    });
    const criar = vi.fn().mockResolvedValue({ url: "https://checkout/x" });

    const r = await gerarLinksParaParcelas({
      supabase, parcelas: [parcela], baseUrl: "https://escola.test", criar,
    });

    expect(r).toEqual({ gerados: 1, falhas: [] });
    const chamada = criar.mock.calls[0][0];
    expect(chamada).toMatchObject({
      orderNsu: parcela.id,
      descricao: "Mensalidade Outubro/2026 - Samir Gael",
      valorCentavos: 30000,
      cliente: { name: "Naiara", phone_number: "+5571993363876" },
      webhookUrl: "https://escola.test/api/infinitepay/webhook?t=tok",
    });
    expect(chamada.redirectUrl).toMatch(/^https:\/\/escola\.test\/mensalidades\?a=[a-f0-9]{12}$/);
    expect(supabase.updates[0]).toMatchObject({
      id: parcela.id,
      row: { payment_link: "https://checkout/x", payment_link_source: "api" },
    });
  });

  it("não manda telefone suspeito pra InfinitePay", async () => {
    const supabase = fakeSupabase({
      vinculos: [{ student_id: "aluno-1", is_primary: true, guardians: { name: "Rosane", phone: "7183445644" } }],
    });
    const criar = vi.fn().mockResolvedValue({ url: "https://checkout/x" });
    await gerarLinksParaParcelas({ supabase, parcelas: [parcela], baseUrl: "https://escola.test", criar });
    expect(criar.mock.calls[0][0].cliente).toEqual({ name: "Rosane" });
  });

  it("coleta falha por parcela sem derrubar o lote", async () => {
    const supabase = fakeSupabase();
    const criar = vi.fn()
      .mockRejectedValueOnce(new Error("InfinitePay fora"))
      .mockResolvedValue({ url: "https://checkout/y" });

    const r = await gerarLinksParaParcelas({
      supabase,
      parcelas: [parcela, { ...parcela, id: "8b1c8e5e-0000-4000-8000-000000000002", month: 11 }],
      baseUrl: "https://escola.test",
      criar,
    });

    expect(r.gerados).toBe(1);
    expect(r.falhas).toEqual([{ id: parcela.id, erro: "InfinitePay fora" }]);
  });

  it("exige o token do webhook", async () => {
    delete process.env.INFINITEPAY_WEBHOOK_TOKEN;
    await expect(
      gerarLinksParaParcelas({ supabase: fakeSupabase(), parcelas: [parcela], baseUrl: "https://x", criar: vi.fn() })
    ).rejects.toThrow("INFINITEPAY_WEBHOOK_TOKEN");
  });
});
