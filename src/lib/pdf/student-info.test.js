import { describe, it, expect } from "vitest";
import { levelText, nextStage } from "./student-info";

describe("nextStage", () => {
  it("avança dentro do Fundamental I", () => {
    expect(nextStage("1º Ano")).toEqual({ grade: "2º Ano", level: "Ensino Fundamental I" });
    expect(nextStage("4º Ano")).toEqual({ grade: "5º Ano", level: "Ensino Fundamental I" });
  });

  it("5º Ano segue para o 6º Ano do Fundamental II", () => {
    expect(nextStage("5º Ano")).toEqual({ grade: "6º Ano", level: "Ensino Fundamental II" });
  });

  it("avança dentro da Educação Infantil e do Grupo 05 para o 1º Ano", () => {
    expect(nextStage("Grupo 02")).toEqual({ grade: "Grupo 03", level: "Educação Infantil" });
    expect(nextStage("Grupo 05")).toEqual({ grade: "1º Ano", level: "Ensino Fundamental I" });
  });

  it("devolve null quando não reconhece a turma", () => {
    expect(nextStage("")).toBeNull();
    expect(nextStage(undefined)).toBeNull();
    expect(nextStage("Turma Especial")).toBeNull();
  });
});

describe("levelText", () => {
  it("concorda artigo com o nível", () => {
    expect(levelText("Educação Infantil")).toBe("da Educação Infantil");
    expect(levelText("Ensino Fundamental I")).toBe("do Ensino Fundamental I");
    expect(levelText("Ensino Fundamental II")).toBe("do Ensino Fundamental II");
    expect(levelText(undefined)).toBe("");
  });
});
