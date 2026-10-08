import { describe, it, expect, beforeEach } from "vitest";
import {
  normalizar, normalizarWhatsapp, codigoDoAluno, situacaoParcela,
  escolherResponsavel, montarAluno, paraResponsavel,
} from "./parcelas";

const HOJE = new Date("2026-10-07T12:00:00");

function parcela(month, extra = {}) {
  return {
    id: `p${month}`,
    month,
    year: 2026,
    due_date: `2026-${String(month).padStart(2, "0")}-10`,
    amount: "300.00",
    status: "A vencer",
    payment_link: null,
    ...extra,
  };
}

describe("normalização", () => {
  it("remove acento e caixa", () => {
    expect(normalizar("MARÇO")).toBe("marco");
    expect(normalizar("  José   da  Silva ")).toBe("jose da silva");
  });
});

describe("telefone para WhatsApp", () => {
  it("mantém celular de 11 dígitos", () => {
    expect(normalizarWhatsapp("71993363876")).toEqual({ numero: "5571993363876", suspeito: false });
  });

  it("insere o 9 em número antigo de 10 dígitos e marca pra conferir", () => {
    expect(normalizarWhatsapp("71 8344-5644")).toEqual({ numero: "5571983445644", suspeito: true });
  });

  it("não duplica o 55 quando já vem com DDI", () => {
    expect(normalizarWhatsapp("5571993363876").numero).toBe("5571993363876");
  });

  it("devolve null quando o número é curto demais", () => {
    expect(normalizarWhatsapp("9999")).toEqual({ numero: null, suspeito: true });
  });
});

describe("código do link direto", () => {
  beforeEach(() => {
    process.env.MENSALIDADES_LINK_SECRET = "segredo-de-teste";
  });

  it("tem 12 hex e é estável pro mesmo aluno", () => {
    const a = codigoDoAluno("8b1c8e5e-0000-4000-8000-000000000001");
    expect(a).toMatch(/^[a-f0-9]{12}$/);
    expect(codigoDoAluno("8b1c8e5e-0000-4000-8000-000000000001")).toBe(a);
  });

  it("muda quando o segredo muda", () => {
    const a = codigoDoAluno("x");
    process.env.MENSALIDADES_LINK_SECRET = "outro";
    expect(codigoDoAluno("x")).not.toBe(a);
  });
});

describe("situação da parcela", () => {
  it("paga é Pago, independente da data", () => {
    expect(situacaoParcela(parcela(1, { status: "Pago" }), HOJE)).toBe("Pago");
  });

  it("vencida é Em atraso", () => {
    expect(situacaoParcela(parcela(9), HOJE)).toBe("Em atraso");
  });

  it("vence hoje ou depois é A vencer", () => {
    expect(situacaoParcela(parcela(10, { due_date: "2026-10-07" }), HOJE)).toBe("A vencer");
    expect(situacaoParcela(parcela(11), HOJE)).toBe("A vencer");
  });
});

describe("responsável", () => {
  it("prefere o principal quando ele tem telefone", () => {
    const r = escolherResponsavel([
      { is_primary: false, guardians: { name: "Tio", phone: "71999990000" } },
      { is_primary: true, guardians: { name: "Mãe", phone: "71988880000" } },
    ]);
    expect(r.name).toBe("Mãe");
  });

  it("cai pro primeiro com telefone quando o principal não tem", () => {
    const r = escolherResponsavel([
      { is_primary: true, guardians: { name: "Mãe", phone: null } },
      { is_primary: false, guardians: { name: "Pai", phone: "71988880000" } },
    ]);
    expect(r.name).toBe("Pai");
  });

  it("devolve null sem vínculos", () => {
    expect(escolherResponsavel([])).toBeNull();
  });
});

describe("visão de cobrança do aluno", () => {
  beforeEach(() => {
    process.env.MENSALIDADES_LINK_SECRET = "segredo-de-teste";
  });

  const student = { id: "aluno-1", name: "Samir Gael", classes: { name: "1º Ano A", grade: "1º Ano" } };
  const contrato = { monthly_amount: "300.00" };
  const responsavel = { name: "Naiara", phone: "71993363876" };

  it("lista só o que está em aberto, em ordem, com total e atraso", () => {
    const a = montarAluno({
      student, contrato, responsavel,
      parcelas: [
        parcela(10, { payment_link: "https://pay/out", payment_link_source: "api" }),
        parcela(9),
        parcela(8, { status: "Pago" }),
        parcela(11, { payment_link: "https://invoice/antigo", payment_link_source: "manual" }),
      ],
    }, HOJE);

    expect(a.aluno).toBe("Samir Gael");
    expect(a.serie).toBe("1º Ano");
    expect(a.whatsapp).toBe("5571993363876");
    expect(a.telefoneSuspeito).toBe(false);
    expect(a.valorMensal).toBe(300);
    expect(a.pendentes.map(p => p.mes)).toEqual(["Setembro", "Outubro", "Novembro"]);
    expect(a.pendentes[0]).toMatchObject({ situacao: "Em atraso", link: null, valor: 300 });
    expect(a.pendentes[1]).toMatchObject({ situacao: "A vencer", link: "https://pay/out" });
    expect(a.total).toBe(900);
    expect(a.mesesAtrasados).toBe(1);
    expect(a.parcelasSemLink).toBe(1);
    expect(a.parcelasSemLinkApi).toBe(2); // sem link + link antigo da planilha
    expect(a.codigo).toMatch(/^[a-f0-9]{12}$/);
  });

  it("aluno em dia tem lista vazia e total nulo", () => {
    const a = montarAluno({
      student, contrato, responsavel,
      parcelas: [parcela(1, { status: "Pago" })],
    }, HOJE);
    expect(a.pendentes).toEqual([]);
    expect(a.total).toBeNull();
  });

  it("resposta pública não vaza telefone, código nem ids", () => {
    const a = montarAluno({
      student, contrato, responsavel, telefones: ["71993363876"],
      parcelas: [parcela(10)],
    }, HOJE);
    const r = paraResponsavel(a);
    expect(r).not.toHaveProperty("telefone");
    expect(r).not.toHaveProperty("whatsapp");
    expect(r).not.toHaveProperty("codigo");
    expect(r).not.toHaveProperty("telefones");
    expect(r).not.toHaveProperty("id");
    expect(r.pendentes[0]).not.toHaveProperty("id");
    expect(r.pendentes[0]).not.toHaveProperty("linkSource");
    expect(r.pendentes[0].mes).toBe("Outubro");
  });
});
