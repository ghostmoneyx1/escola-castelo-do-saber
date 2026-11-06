import { describe, it, expect, vi, beforeEach } from "vitest";
import { estagioDaParcela, hojeNaEscola, montarCobrancaManual, montarLembrete, vencimentosDoDia } from "./lembretes";
import { selecionarAvisos, dispararCobranca, conciliarLotes, umPorTelefone } from "./disparo-whatsapp";
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
  const linhas = existentes.map((r, i) => ({ id: `old-${i}`, created_at: "2026-11-01T12:00:00Z", ...r }));
  const updates = [];

  // Consulta encadeável (.eq/.in/.gte) que resolve como o PostgREST: data ou count.
  function consulta({ head }) {
    const filtros = [];
    const q = {
      eq(col, val) { filtros.push(l => l[col] === val); return q; },
      in(col, vals) { filtros.push(l => vals.includes(l[col])); return q; },
      gte(col, val) { filtros.push(l => String(l[col]) >= val); return q; },
      then(resolve) {
        const data = linhas.filter(l => filtros.every(f => f(l)));
        return Promise.resolve(head ? { count: data.length, error: null } : { data, error: null }).then(resolve);
      },
    };
    return q;
  }

  return {
    linhas,
    updates,
    from() {
      return {
        select: (_cols, opts = {}) => consulta({ head: opts.head }),
        insert: async novas => {
          novas.forEach((n, i) => linhas.push({ id: `new-${linhas.length + i}`, created_at: "2026-11-09T12:15:00Z", ...n }));
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

  it("D0 no dia e D+1, D+2, D+3 nos três dias seguintes; véspera não", () => {
    expect(vencimentosDoDia("2026-11-12")).toEqual({ D0: "2026-11-12", "D+1": "2026-11-11", "D+2": "2026-11-10", "D+3": "2026-11-09" });
    expect(estagioDaParcela("2026-11-10", "2026-11-09")).toBeNull();
    expect(estagioDaParcela("2026-11-10", "2026-11-10")).toBe("D0");
    expect(estagioDaParcela("2026-11-10", "2026-11-11")).toBe("D+1");
    expect(estagioDaParcela("2026-11-10", "2026-11-12")).toBe("D+2");
    expect(estagioDaParcela("2026-11-10", "2026-11-13")).toBe("D+3");
    expect(estagioDaParcela("2026-11-10", "2026-11-14")).toBeNull();
  });

  it("M1 no dia 1 do mês do vencimento; quem não coube sai até o dia 5", () => {
    expect(estagioDaParcela("2026-12-10", "2026-12-01")).toBe("M1");
    expect(estagioDaParcela("2026-12-10", "2026-12-05")).toBe("M1");
    expect(estagioDaParcela("2026-12-10", "2026-12-06")).toBeNull();
    // Mês anterior ainda não é "início do mês" da parcela.
    expect(estagioDaParcela("2026-12-10", "2026-11-30")).toBeNull();
  });

  it("M1 nunca no próprio dia do vencimento", () => {
    expect(estagioDaParcela("2026-12-01", "2026-12-01")).toBe("D0");
    expect(estagioDaParcela("2026-12-02", "2026-12-01")).toBe("M1");
    expect(estagioDaParcela("2026-12-03", "2026-12-03")).toBe("D0");
  });

  it("atravessa virada de mês", () => {
    expect(estagioDaParcela("2026-11-30", "2026-12-01")).toBe("D+1");
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

  it("sem outras em aberto, sai só o link da parcela", () => {
    expect(montarLembrete("D0", base)).not.toContain("de uma vez");
  });

  it("com mais de uma em aberto, traz o segundo link pra pagar todas", () => {
    const t = montarLembrete("D0", { ...base, tudo: { meses: 3, total: 990, link: "https://e/p/abc-tudo" } });
    expect(t).toMatch(/Há 3 mensalidades em aberto \(R\$\s?990,00\)\. Para ver todas e pagar de uma vez:\nhttps:\/\/e\/p\/abc-tudo/);
    expect(t.indexOf("https://pay/x")).toBeLessThan(t.indexOf("https://e/p/abc-tudo"));
  });

  it("M1 avisa o começo do mês e a data do vencimento", () => {
    const t = montarLembrete("M1", base);
    expect(t).toContain("Começou novembro!");
    expect(t).toContain("vence no dia 10/11");
    expect(t).toContain("https://pay/x");
  });

  it("D+1 e D+2 cobram o atraso com textos diferentes", () => {
    const d1 = montarLembrete("D+1", base);
    const d2 = montarLembrete("D+2", base);
    expect(d1).toContain("venceu ontem (10/11)");
    expect(d2).toContain("vencida em 10/11");
    expect(d1).not.toBe(d2);
    for (const t of [d1, d2]) expect(t).toContain("pagou na secretaria");
  });

  it("D+3 fala em atraso e lembra do pagamento na secretaria", () => {
    const t = montarLembrete("D+3", base);
    expect(t).toContain("vencida em 10/11");
    expect(t).toContain("pagou na secretaria");
  });
});

describe("Cobrar manual (secretaria)", () => {
  const baseUrl = "https://escola.test";
  const hoje = "2026-11-06";

  it("usa o mesmo texto e link curto do aviso automático", () => {
    const a = aluno({ pendentes: [parcela("p1", "2026-11-05", { situacao: "Em atraso" })] });
    const t = montarCobrancaManual(a, { baseUrl, hoje });
    const [linha] = selecionarAvisos([a], { hoje, baseUrl });
    expect(t).toBe(linha.body);
    expect(t).toContain(`${baseUrl}/p/abc123abc123-11`);
    expect(t).not.toContain("infinitepay");
  });

  it("com atraso, cobra a atrasada mais antiga e leva o link de pagar tudo", () => {
    const a = aluno({
      pendentes: [
        parcela("p10", "2026-10-10", { mes: "Outubro", mesNumero: 10, situacao: "Em atraso" }),
        parcela("p11", "2026-11-10"),
      ],
      pagarTudo: { meses: 2, total: 660 },
    });
    const t = montarCobrancaManual(a, { baseUrl, hoje });
    expect(t).toContain("de Outubro");
    expect(t).toContain("vencida em 10/10");
    expect(t).toContain(`${baseUrl}/p/abc123abc123-10`);
    expect(t).toContain(`${baseUrl}/p/abc123abc123-tudo`);
  });

  it("a vencer fora da véspera fala a data, sem 'amanhã'", () => {
    const t = montarCobrancaManual(aluno({ pendentes: [parcela("p1", "2026-11-10")] }), { baseUrl, hoje });
    expect(t).toContain("vence no dia 10/11");
    expect(t).not.toContain("amanhã");
  });

  it("sem pendência, confirma que está em dia", () => {
    expect(montarCobrancaManual(aluno(), { baseUrl, hoje })).toContain("estão todas em dia");
  });
});

describe("seleção dos avisos", () => {
  const hoje = "2026-11-09";
  const baseUrl = "https://escola.test";

  it("só pega parcela no dia do estágio", () => {
    const a = aluno({ pendentes: [parcela("p1", "2026-11-08"), parcela("p2", "2026-12-10")] });
    const r = selecionarAvisos([a], { hoje, baseUrl });
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ installment_id: "p1", stage: "D+1", status: "pronto", phone: "5571993363876" });
  });

  it("manda o link curto do site, não o da InfinitePay (~470 caracteres)", () => {
    const a = aluno({ pendentes: [parcela("p1", "2026-11-08")] });
    const [r] = selecionarAvisos([a], { hoje, baseUrl });
    expect(r.body).toContain("https://escola.test/p/abc123abc123-11");
    expect(r.body).not.toContain("infinitepay");
  });

  it("aluno com várias em aberto ganha o link curto do pagar tudo", () => {
    const a = aluno({ pendentes: [parcela("p1", "2026-11-08")], pagarTudo: { meses: 2, total: 660, parcelas: [] } });
    const [r] = selecionarAvisos([a], { hoje, baseUrl });
    expect(r.body).toContain("https://escola.test/p/abc123abc123-tudo");
  });

  it("pula telefone ausente ou sem o 9", () => {
    const semTel = aluno({ whatsapp: null, pendentes: [parcela("p1", "2026-11-08")] });
    const suspeito = aluno({ telefoneSuspeito: true, pendentes: [parcela("p2", "2026-11-08")] });
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
      aluno({ pendentes: [parcela("p1", "2026-11-08")] }),
      aluno({ id: "aluno-2", aluno: "Samir Gael", whatsapp: null, pendentes: [parcela("p2", "2026-11-08")] }),
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
    const sb = fakeSupabase([{ installment_id: "p1", stage: "D+1", status: "simulado" }]);
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
    const enviado = fakeSupabase([{ installment_id: "p1", stage: "D+1", status: "enviado" }]);
    expect((await dispararCobranca({ supabase: enviado, cfg, ativo: true, baseUrl, agora })).enfileirados).toBe(0);

    const falhou = fakeSupabase([{ installment_id: "p1", stage: "D+1", status: "falhou" }]);
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
      aluno({ pendentes: [parcela("p1", "2026-11-08")] }),
      aluno({ id: "aluno-3", aluno: "Davi", whatsapp: "5571988887777", pendentes: [parcela("p3", "2026-11-08")] }),
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

  it("sessão caída: não manda nem grava, a próxima rodada tenta de novo", async () => {
    openwa.statusSessao.mockResolvedValue("qr_ready");
    const sb = fakeSupabase();
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora });
    expect(r.erro).toMatch(/qr_ready/);
    expect(openwa.enviarLote).not.toHaveBeenCalled();
    expect(sb.linhas.find(l => l.installment_id === "p1")).toBeUndefined();
  });

  it("fora do horário comercial não manda nada", async () => {
    openwa.statusSessao.mockResolvedValue("ready");
    const sb = fakeSupabase();
    // 23:30 UTC = 20:30 em Salvador
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora: new Date("2026-11-09T23:30:00Z") });
    expect(r.parado).toMatch(/fora do horário/);
    expect(openwa.enviarLote).not.toHaveBeenCalled();
    expect(sb.linhas).toHaveLength(0);
  });

  it("rodada anterior ainda enviando: espera", async () => {
    openwa.statusSessao.mockResolvedValue("ready");
    openwa.statusLote.mockResolvedValue({ status: "processing", results: [] });
    const sb = fakeSupabase([{ installment_id: "x", stage: "D0", status: "na_fila", batch_id: "b0", batch_index: 0, created_at: "2026-11-09T12:00:00Z" }]);
    const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora });
    expect(r.parado).toMatch(/rodada anterior/);
    expect(openwa.enviarLote).not.toHaveBeenCalled();
  });

  describe("ritmo", () => {
    const tres = () => [
      aluno({ id: "a1", whatsapp: "5571900000001", pendentes: [parcela("vespera", "2026-11-08")] }),
      aluno({ id: "a2", whatsapp: "5571900000002", pendentes: [parcela("hoje", "2026-11-09")] }),
      aluno({ id: "a3", whatsapp: "5571900000003", pendentes: [parcela("atraso", "2026-11-06")] }),
    ];

    beforeEach(() => {
      openwa.statusSessao.mockResolvedValue("ready");
      openwa.enviarLote.mockResolvedValue({});
      consultas.carregarAlunos.mockResolvedValue(tres());
    });

    it("manda no máximo o tamanho da rodada, priorizando vence hoje e atrasado", async () => {
      const sb = fakeSupabase();
      const r = await dispararCobranca({
        supabase: sb, cfg, ativo: true, baseUrl, agora, ritmo: { porRodada: 2, porDia: 30, horaInicio: 8, horaFim: 18 },
      });
      expect(r).toMatchObject({ enfileirados: 2, restantesHoje: 1 });
      const fila = sb.linhas.filter(l => l.status === "na_fila").map(l => l.stage);
      expect(fila).toEqual(["D0", "D+3"]);
    });

    it("a rodada seguinte pega o que sobrou, depois que a anterior terminou", async () => {
      const sb = fakeSupabase();
      const ritmo = { porRodada: 2, porDia: 30, horaInicio: 8, horaFim: 18 };
      await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora, ritmo });
      openwa.statusLote.mockResolvedValue({ status: "completed", results: [{ status: "sent" }, { status: "sent" }] });
      const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora: new Date("2026-11-09T13:07:00Z"), ritmo });
      expect(r).toMatchObject({ conciliados: 2, enfileirados: 1, restantesHoje: 0 });
      expect(sb.linhas.find(l => l.installment_id === "vespera").status).toBe("na_fila");
    });

    it("no mesmo estágio, quem ainda não recebeu aviso da parcela vai primeiro", async () => {
      consultas.carregarAlunos.mockResolvedValue([
        aluno({ id: "a1", whatsapp: "5571900000001", pendentes: [parcela("ja-avisada", "2026-11-09")] }),
        aluno({ id: "a2", whatsapp: "5571900000002", pendentes: [parcela("nunca-avisada", "2026-11-09")] }),
      ]);
      const sb = fakeSupabase([
        { installment_id: "ja-avisada", stage: "D+1", status: "enviado", created_at: "2026-11-08T12:10:00Z" },
      ]);
      await dispararCobranca({
        supabase: sb, cfg, ativo: true, baseUrl, agora, ritmo: { porRodada: 1, porDia: 30, horaInicio: 8, horaFim: 18 },
      });
      expect(sb.linhas.filter(l => l.status === "na_fila").map(l => l.installment_id)).toEqual(["nunca-avisada"]);
    });

    it("um telefone recebe no máximo uma mensagem por dia", async () => {
      const tel = "5571900000009";
      consultas.carregarAlunos.mockResolvedValue([
        aluno({ id: "irmao-1", whatsapp: tel, pendentes: [parcela("i1", "2026-11-08")] }),
        aluno({ id: "irmao-2", whatsapp: tel, pendentes: [parcela("i2", "2026-11-09")] }),
        aluno({ id: "outro", whatsapp: "5571900000010", pendentes: [parcela("o1", "2026-11-09")] }),
      ]);
      const sb = fakeSupabase();
      const ritmo = { porRodada: 6, porDia: 60, horaInicio: 8, horaFim: 18 };
      await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora, ritmo });
      // Fica a de maior prioridade (D0) desse telefone.
      expect(sb.linhas.filter(l => l.status === "na_fila").map(l => l.installment_id).sort()).toEqual(["i2", "o1"]);

      // Rodada seguinte do mesmo dia: o irmão que sobrou não sai.
      openwa.statusLote.mockResolvedValue({ status: "completed", results: [{ status: "sent" }, { status: "sent" }] });
      const r = await dispararCobranca({ supabase: sb, cfg, ativo: true, baseUrl, agora: new Date("2026-11-09T13:07:00Z"), ritmo });
      expect(r.enfileirados).toBe(0);
    });

    it("umPorTelefone respeita quem já recebeu hoje", () => {
      const avisos = [{ installment_id: "a", stage: "D0", phone: "1" }, { installment_id: "b", stage: "D0", phone: "2" }];
      expect(umPorTelefone(avisos, { jaAvisadosHoje: new Set(["1"]) }).map(a => a.installment_id)).toEqual(["b"]);
    });

    it("para no teto do dia", async () => {
      const sb = fakeSupabase([
        { installment_id: "z1", stage: "D0", status: "enviado", created_at: "2026-11-09T12:05:00Z" },
        { installment_id: "z2", stage: "D0", status: "enviado", created_at: "2026-11-09T12:06:00Z" },
        // de ontem: não conta pro teto de hoje
        { installment_id: "z3", stage: "D0", status: "enviado", created_at: "2026-11-08T15:00:00Z" },
      ]);
      const r = await dispararCobranca({
        supabase: sb, cfg, ativo: true, baseUrl, agora, ritmo: { porRodada: 6, porDia: 3, horaInicio: 8, horaFim: 18 },
      });
      expect(r.enfileirados).toBe(1);
      const r2 = await dispararCobranca({
        supabase: sb, cfg, ativo: true, baseUrl, agora, ritmo: { porRodada: 6, porDia: 2, horaInicio: 8, horaFim: 18 },
      });
      expect(r2.parado).toMatch(/rodada anterior|teto/);
    });
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
    expect(await conciliarLotes(sb, cfg, new Date("2026-11-01T12:30:00Z"))).toBe(2);
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
