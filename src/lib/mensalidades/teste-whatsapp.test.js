import { describe, it, expect } from "vitest";
import { mensagemDeTeste, normalizarNumero } from "./teste-whatsapp";

describe("normalizarNumero", () => {
  it("aceita com ou sem 55 e com máscara", () => {
    expect(normalizarNumero("(71) 99999-8888")).toBe("5571999998888");
    expect(normalizarNumero("5571999998888")).toBe("5571999998888");
    expect(normalizarNumero("71 8260-7878")).toBe("557182607878");
  });

  it("recusa o que não é telefone brasileiro", () => {
    expect(normalizarNumero("")).toBeNull();
    expect(normalizarNumero("12345")).toBeNull();
    expect(normalizarNumero("55 71 9999")).toBeNull();
  });
});

describe("mensagemDeTeste", () => {
  const agora = new Date("2026-11-09T14:00:00Z");
  const baseUrl = "https://www.escolacastelodosaber.net";

  it("sempre começa marcando que é teste", () => {
    for (const m of ["simples", "M1", "D0", "D+1", "D+2", "D+3"]) {
      expect(mensagemDeTeste(m, { baseUrl, agora })).toMatch(/^\[TESTE — não é cobrança real\]/);
    }
  });

  it("usa o mesmo texto do aviso real, com vencimento coerente com o estágio", () => {
    expect(mensagemDeTeste("M1", { baseUrl, agora })).toContain("vence no dia 18/11");
    expect(mensagemDeTeste("D+1", { baseUrl, agora })).toContain("venceu ontem (08/11)");
    expect(mensagemDeTeste("D0", { baseUrl, agora })).toContain("vence hoje, 09/11");
    const d3 = mensagemDeTeste("D+3", { baseUrl, agora });
    expect(d3).toContain("vencida em 06/11");
    expect(d3).toContain("Há 2 mensalidades em aberto");
    expect(d3).toContain(`${baseUrl}/mensalidades`);
  });
});
