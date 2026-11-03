import { describe, it, expect, vi, beforeEach } from "vitest";
import { estagioDaParcela, hojeNaEscola, montarLembrete, vencimentosDoDia } from "./lembretes";
import { selecionarAvisos, dispararCobranca, conciliarLotes } from "./disparo-whatsapp";
import * as consultas from "./consultas";
import * as openwa from "@/lib/openwa/client";

vi.mock("./consultas", () => ({ carregarAlunos: vi.fn() }));
vi.mock("@/lib/openwa/client", async orig => ({
  ...(await orig()),
  statusSessao: vi.fn(),
  enviarLote: vi.fn(),
  statusLote: vi.fn(),
  resolverChatId: vi.fn(),
}));

function parcela(id, vencimento, extra = {}) {
  return {
    id, mes: "Novembro", mesNumero: 11, valor: 330, vencimento, situacao: "A vencer",
    link: `https://checkout.infinitepay.io/castelodosaber?lenc=${id}`, ...extra,
  };
}

function aluno(extra = {}) {
  return {
    id: "aluno-1", aluno: "Lunna Victoria", responsavel: "Naiara Reis",
    whatsapp: "5571993363876", telefoneSuspeito: false, codigo: "abc123abc123",
    pendentes: [], ...extra,
  };
}

/** Supabase fake só com o que o disparo usa em whatsapp_messages. */
function fakeSupabase(existentes = []) {
  const linhas = existentes.map((r, i) => ({ id: `old-${i}`, ...r }));
  const updates = [];
  return {
    linhas,
    updates,
    from() {
      return {
        select: () => ({
          in: async (_c, ids) => ({ data: linhas.filter(l => ids.includes(l.installment_id)), error: null }),
          eq: async (col, val) => ({ data: linhas.filter(l => l[col] === val), error: null }),
        }),
        insert: async novas => {
          novas.forEach((n, i) => linhas.push({ id: `new-${linhas.length + i}`, ...n }));
          return { error: null };
        },
        update: patch => ({
          eq: async (col, val) => {
            updates.push({ col, val, patch });
            linhas.filter(l => l[col] === val).forEach(l => Object.assign(l, patch));
            return { error: null };
          },
        }),
      };
    },
  };
}

const cfg = { url: "https://wa.test", apiKey: "k", sessionId: "s" };

describe("estágios e datas", () => {
  it("usa a data de Salvador, não a UTC", () => {
    // 02:00 UTC do dia 10 ainda é 23:00 do dia 9 em Salvador.
    expect(hojeNaEscola(new Date("2026-11-10T02:00:00Z"))).toBe("2026-11-09");
  });

  it("D-1 na véspera, D0 no dia, D+3 três dias depois", () => {
    expect(vencimentosDoDia("2026-11-09")).toEqual({ "D-1": "2026-11-10", D0: "2026-11-09", "D+3": "2026-11-06" });
    expect(estagioDaParcela("2026-11-10", "2026-11-09")).toBe("D-1");
    expect(estagioDaParcela("2026-11-10", "2026-11-10")).toBe("D0");
    expect(estagioDaParcela("2026-11-10", "2026-11-13")).toBe("D+3");
    expect(estagioDaParcela("2026-11-10", "2026-11-12")).toBeNull();
  });

  it("atravessa virada de mês", () => {
    expect(estagioDaParcela("2026-12-01", "2026-11-30")).toBe("D-1");
    expect(estagioDaParcela("2026-10-30", "2026-11-02")).toBe("D+3");
  });
});

describe("texto do aviso", () => {
  const base = { aluno: "Lunna Victoria", responsavel: "Naiara Reis", parcela: parcela("p1", "2026-11-10"), link: "https://pay/x" };

  it("traz aluno, mês, valor, vencimento e link", () => {
    const t = montarLembrete("D-1", base);
    expect(t).toContain("Naiara");
    expect(t).toContain("*Lunna Victoria*");
    expect(t).toContain("Novembro");
    expect(t).toMatch(/R\$\s?330,00/);
    expect(t).toContain("vence amanhã, 10/11");
    expect(t).toContain("https://pay/x");
  });

  it("D+3 fala em atraso e lembra do pagamento na secretaria", () => {
    const t = montarLembrete("D+3", base);
    expect(t).toContain("vencida em 10/11");
    expect(t).toContain("pagou na secretaria");
  });
});

describe("seleção dos avisos", () => {
  const hoje = "2026-11-09";
  const baseUrl = "https://escola.test";

  it("só pega parcela no dia do estágio", () => {
    const a = aluno({ pendentes: [parcela("p1", "2026-11-10"), parcela("p2", "2026-12-10")] });
    const r = selecionarAvisos([a], { hoje, baseUrl });
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ installment_id: "p1", stage: "D-1", status: "pronto", phone: "5571993363876" });
  });

  it("manda o link curto do site, não o da InfinitePay (~470 caracteres)", () => {
    const a = aluno({ pendentes: [parcela("p1", "2026-11-10")] });
    const [r] = selecionarAvisos([a], { hoje, baseUrl });
    expect(r.body).toContain("https://escola.test/p/abc123abc123-11");
    expect(r.body).not.toContain("infinitepay");
  });

  it("pula telefone ausente ou sem o 9", () => {
    const semTel = aluno({ whatsapp: null, pendentes: [parcela("p1", "2026-11-10")] });
    const suspeito = aluno({ telefoneSuspeito: true, pendentes: [parcela("p2", "2026-11-10")] });
    const r = selecionarAvisos([semTel, suspeito], { hoje, baseUrl });
    expect(r.map(x => x.status)).toEqual(["pulado", "pulado"]);
  });
});

describe("disparo do dia", () => {
  const agora = new Date("2026-11-09T12:15:00Z");
  const baseUrl = "https://escola.test";

  beforeEach(() => {
    vi.clearAllMocks();
    openwa.resolverChatId.mockImplementation(async (_cfg, n) => `${n}@s.whatsapp.net`);
    consultas.carregarAlunos.mockResolvedValue([
      aluno({ pendentes: [parcela("p1", "2026-11-10")] }),
      aluno({ id: "aluno-2", aluno: "Samir Gael", whatsapp: null, pendentes: [parcela("p2", "2026-11-10")] }),
    ]);
  });

  it("desligado: grava simulado e não fala com o OpenWA", async () => {
    const sb = fakeSupabase();
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: false, baseUrl, agora });
    expect(r).toMatchObject({ modo: "simulacao", simulados: 1, pulados: 1 });
    expect(openwa.enviarLote).not.toHaveBeenCalled();
    expect(sb.linhas.map(l => l.status).sort()).toEqual(["pulado", "simulado"]);
  });

  it("simulação não repete na mesma rodada do dia", async () => {
    const sb = fakeSupabase([{ installment_id: "p1", stage: "D-1", status: "simulado" }]);
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: false, baseUrl, agora });
    expect(r.simulados).toBe(0);
  });

  it("ligado: grava na_fila antes e manda um lote só", async () => {
    openwa.statusSessao.mockResolvedValue("ready");
    openwa.enviarLote.mockResolvedValue({ batchId: "x" });
    const sb = fakeSupabase();
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora });

    expect(r).toMatchObject({ modo: "envio", enfileirados: 1, pulados: 1 });
    const [, { batchId, mensagens }] = openwa.enviarLote.mock.calls[0];
    expect(mensagens).toHaveLength(1);
    expect(mensagens[0].chatId).toBe("5571993363876@s.whatsapp.net");
    expect(mensagens[0].texto).toContain("Lunna");
    expect(sb.linhas.find(l => l.installment_id === "p1")).toMatchObject({ status: "na_fila", batch_id: batchId, batch_index: 0 });
  });

  it("não reenvia aviso que já saiu, mas tenta de novo o que falhou", async () => {
    openwa.statusSessao.mockResolvedValue("ready");
    openwa.enviarLote.mockResolvedValue({});
    const enviado = fakeSupabase([{ installment_id: "p1", stage: "D-1", status: "enviado" }]);
    expect((await dispararCobranca({ supabase: enviado, cfg, ativo: true, baseUrl, agora })).enfileirados).toBe(0);

    const falhou = fakeSupabase([{ installment_id: "p1", stage: "D-1", status: "falhou" }]);
    expect((await dispararCobranca({ supabase: falhou, cfg, ativo: true, baseUrl, agora })).enfileirados).toBe(1);
  });

  it("número sem WhatsApp vira pulado e não entra no lote", async () => {
    openwa.statusSessao.mockResolvedValue("ready");
    openwa.resolverChatId.mockResolvedValue(null);
    const sb = fakeSupabase();
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora });
    expect(r).toMatchObject({ enfileirados: 0, pulados: 2 });
    expect(openwa.enviarLote).not.toHaveBeenCalled();
    expect(sb.linhas.find(l => l.installment_id === "p1")).toMatchObject({ status: "pulado", error: "número sem WhatsApp" });
  });

  it("erro ao conferir um número vira falha só daquele aviso", async () => {
    consultas.carregarAlunos.mockResolvedValue([
      aluno({ pendentes: [parcela("p1", "2026-11-10")] }),
      aluno({ id: "aluno-3", aluno: "Davi", whatsapp: "5571988887777", pendentes: [parcela("p3", "2026-11-10")] }),
    ]);
    openwa.statusSessao.mockResolvedValue("ready");
    openwa.enviarLote.mockResolvedValue({});
    openwa.resolverChatId.mockImplementation(async (_cfg, n) => {
      if (n === "5571993363876") throw new Error("OpenWA respondeu HTTP 502");
      return `${n}@c.us`;
    });
    const sb = fakeSupabase();
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora });
    expect(r).toMatchObject({ enfileirados: 1, falhas: 1 });
    expect(sb.linhas.find(l => l.installment_id === "p1")).toMatchObject({ status: "falhou" });
    expect(sb.linhas.find(l => l.installment_id === "p3")).toMatchObject({ status: "na_fila" });
  });

  it("sessão caída: registra falha e não manda lote", async () => {
    openwa.statusSessao.mockResolvedValue("qr_ready");
    const sb = fakeSupabase();
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora });
    expect(r.erro).toMatch(/qr_ready/);
    expect(openwa.enviarLote).not.toHaveBeenCalled();
    expect(sb.linhas.find(l => l.installment_id === "p1").status).toBe("falhou");
  });

  it("OpenWA recusa o lote: avisos viram falhou", async () => {
    openwa.statusSessao.mockResolvedValue("ready");
    openwa.enviarLote.mockRejectedValue(new Error("OpenWA respondeu HTTP 500"));
    const sb = fakeSupabase();
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora });
    expect(r.erro).toMatch(/500/);
    expect(sb.linhas.find(l => l.installment_id === "p1")).toMatchObject({ status: "falhou" });
  });
});

describe("conciliação dos lotes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marca enviado/falhou pela posição e deixa pendente o que ainda roda", async () => {
    const sb = fakeSupabase([
      { installment_id: "p1", status: "na_fila", batch_id: "b1", batch_index: 0 },
      { installment_id: "p2", status: "na_fila", batch_id: "b1", batch_index: 1 },
      { installment_id: "p3", status: "na_fila", batch_id: "b1", batch_index: 2 },
    ]);
    openwa.statusLote.mockResolvedValue({
      status: "processing",
      results: [
        { status: "sent", sentAt: "2026-11-09T12:16:00Z" },
        { status: "failed", error: { message: "número sem WhatsApp" } },
      ],
    });
    expect(await conciliarLotes(sb, cfg)).toBe(2);
    expect(sb.linhas.map(l => l.status)).toEqual(["enviado", "falhou", "na_fila"]);
    expect(sb.linhas[1].error).toBe("número sem WhatsApp");
  });

  it("lote que não termina em 24 h fecha como falhou", async () => {
    const sb = fakeSupabase([
      { installment_id: "p1", status: "na_fila", batch_id: "b2", batch_index: 0, created_at: "2026-11-09T12:15:00Z" },
      { installment_id: "p2", status: "na_fila", batch_id: "b2", batch_index: 1, created_at: "2026-11-10T12:00:00Z" },
    ]);
    openwa.statusLote.mockResolvedValue({ status: "processing", results: [] });
    await conciliarLotes(sb, cfg, new Date("2026-11-10T12:30:00Z"));
    expect(sb.linhas[0]).toMatchObject({ status: "falhou", error: expect.stringContaining("travado") });
    expect(sb.linhas[1].status).toBe("na_fila");
  });

  it("lote sumido do OpenWA fecha como falhou", async () => {
    const sb = fakeSupabase([{ installment_id: "p1", status: "na_fila", batch_id: "b9", batch_index: 0 }]);
    openwa.statusLote.mockRejectedValue(Object.assign(new Error("404"), { status: 404 }));
    await conciliarLotes(sb, cfg);
    expect(sb.linhas[0]).toMatchObject({ status: "falhou", error: "lote não encontrado no OpenWA" });
  });
});
