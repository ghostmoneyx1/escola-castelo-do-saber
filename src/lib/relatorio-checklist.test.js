import { describe, it, expect } from "vitest";
import { calcStatus, calcOverall, CHECKLIST } from "./relatorio-checklist";

const allItemIds = (catId) =>
  CHECKLIST.find((c) => c.id === catId).items.map((i) => i.id);

const fillCategory = (catId, value) =>
  Object.fromEntries(allItemIds(catId).map((id) => [id, value]));

const fillAllCategories = (value) =>
  CHECKLIST.reduce((acc, cat) => ({ ...acc, ...fillCategory(cat.id, value) }), {});

describe("calcStatus", () => {
  it("retorna null para categoria inexistente", () => {
    expect(calcStatus("inexistente", {})).toBeNull();
  });

  it("retorna null quando todos itens são nao_observado", () => {
    const responses = fillCategory("academico", "nao_observado");
    expect(calcStatus("academico", responses)).toBeNull();
  });

  it("retorna null quando categoria sem respostas", () => {
    expect(calcStatus("academico", {})).toBeNull();
  });

  it("retorna verde quando tudo é sempre (100%)", () => {
    const responses = fillCategory("academico", "sempre");
    expect(calcStatus("academico", responses)).toBe("verde");
  });

  it("retorna verde com frequentemente (75% — acima de 70)", () => {
    const responses = fillCategory("academico", "frequentemente");
    expect(calcStatus("academico", responses)).toBe("verde");
  });

  it("retorna amarelo em 50% (boundary inferior do verde)", () => {
    // 2 sempre (8) + 4 raramente (4) = 12/24 = 50%
    const ids = allItemIds("academico");
    const responses = {
      [ids[0]]: "sempre",
      [ids[1]]: "sempre",
      [ids[2]]: "raramente",
      [ids[3]]: "raramente",
      [ids[4]]: "raramente",
      [ids[5]]: "raramente",
    };
    expect(calcStatus("academico", responses)).toBe("amarelo");
  });

  it("retorna vermelho quando tudo é raramente (25%)", () => {
    const responses = fillCategory("academico", "raramente");
    expect(calcStatus("academico", responses)).toBe("vermelho");
  });

  it("retorna vermelho em 37.5% (abaixo de 40)", () => {
    // 1 sempre (4) + 5 raramente (5) = 9/24 = 37.5%
    const ids = allItemIds("academico");
    const responses = {
      [ids[0]]: "sempre",
      [ids[1]]: "raramente",
      [ids[2]]: "raramente",
      [ids[3]]: "raramente",
      [ids[4]]: "raramente",
      [ids[5]]: "raramente",
    };
    expect(calcStatus("academico", responses)).toBe("vermelho");
  });

  it("ignora nao_observado no denominador", () => {
    // 1 sempre observada, restante nao_observado → 100% observado = verde
    const ids = allItemIds("academico");
    const responses = {
      [ids[0]]: "sempre",
      [ids[1]]: "nao_observado",
      [ids[2]]: "nao_observado",
      [ids[3]]: "nao_observado",
      [ids[4]]: "nao_observado",
      [ids[5]]: "nao_observado",
    };
    expect(calcStatus("academico", responses)).toBe("verde");
  });
});

describe("calcOverall", () => {
  it("retorna null quando nenhuma categoria tem dado observado", () => {
    expect(calcOverall({})).toBeNull();
    expect(calcOverall(fillAllCategories("nao_observado"))).toBeNull();
  });

  it("retorna verde quando todas as 5 categorias são verde", () => {
    expect(calcOverall(fillAllCategories("sempre"))).toBe("verde");
  });

  it("retorna vermelho com 2+ categorias vermelhas", () => {
    const responses = {
      ...fillCategory("academico", "raramente"),
      ...fillCategory("frequencia", "raramente"),
      ...fillCategory("comportamento", "sempre"),
      ...fillCategory("social", "sempre"),
      ...fillCategory("autonomia", "sempre"),
    };
    expect(calcOverall(responses)).toBe("vermelho");
  });

  it("retorna amarelo com exatamente 1 categoria vermelha", () => {
    const responses = {
      ...fillCategory("academico", "raramente"),
      ...fillCategory("frequencia", "sempre"),
      ...fillCategory("comportamento", "sempre"),
      ...fillCategory("social", "sempre"),
      ...fillCategory("autonomia", "sempre"),
    };
    expect(calcOverall(responses)).toBe("amarelo");
  });

  it("retorna amarelo com 2+ categorias amarelas (sem vermelhas)", () => {
    // Construir amarelo em 2 categorias usando 50%
    const ids1 = allItemIds("academico");
    const ids2 = allItemIds("frequencia");
    const amareloPattern = (ids) => ({
      [ids[0]]: "sempre",
      [ids[1]]: "sempre",
      [ids[2]]: "raramente",
      [ids[3]]: "raramente",
      [ids[4]]: "raramente",
      [ids[5]]: "raramente",
    });
    const responses = {
      ...amareloPattern(ids1),
      ...amareloPattern(ids2),
      ...fillCategory("comportamento", "sempre"),
      ...fillCategory("social", "sempre"),
      ...fillCategory("autonomia", "sempre"),
    };
    expect(calcOverall(responses)).toBe("amarelo");
  });

  it("retorna amarelo quando 1 categoria amarela e demais verde (default branch)", () => {
    const ids = allItemIds("academico");
    const responses = {
      ...{
        [ids[0]]: "sempre",
        [ids[1]]: "sempre",
        [ids[2]]: "raramente",
        [ids[3]]: "raramente",
        [ids[4]]: "raramente",
        [ids[5]]: "raramente",
      },
      ...fillCategory("frequencia", "sempre"),
      ...fillCategory("comportamento", "sempre"),
      ...fillCategory("social", "sempre"),
      ...fillCategory("autonomia", "sempre"),
    };
    expect(calcOverall(responses)).toBe("amarelo");
  });
});
