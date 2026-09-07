import { describe, it, expect } from "vitest";
import { formatScore, subjectAverages, yearIndex, HISTORICO_SUBJECTS } from "./historico-data";

const grade = (name, unit, score) => ({ unit, score, subjects: { name } });

describe("subjectAverages", () => {
  it("faz a média das unidades e casa 'Português' com 'Língua Portuguesa'", () => {
    const grades = [
      grade("Português", 1, 8),
      grade("Português", 2, 10),
      grade("Inglês", 1, 7.5),
      grade("Matemática", 1, "9.0"),
    ];
    const result = subjectAverages(grades);
    expect(result["Língua Portuguesa"]).toBe(9);
    expect(result["Língua Estrangeira (Inglês)"]).toBe(7.5);
    expect(result["Matemática"]).toBe(9);
    expect(result["Ciências"]).toBeNull();
  });

  it("ignora notas nulas e matérias fora da lista do histórico", () => {
    const result = subjectAverages([
      grade("História", 1, null),
      grade("Educação Física", 1, 10),
      grade("Artes", 2, 10),
    ]);
    expect(result["História"]).toBeNull();
    expect(Object.keys(result)).toEqual(HISTORICO_SUBJECTS.map((s) => s.label));
  });

  it("arredonda para uma casa decimal", () => {
    const result = subjectAverages([grade("Ciências", 1, 7), grade("Ciências", 2, 8), grade("Ciências", 3, 8)]);
    expect(result["Ciências"]).toBe(7.7);
  });
});

describe("yearIndex", () => {
  it("mapeia a série do Fundamental I para a coluna", () => {
    expect(yearIndex("1º Ano")).toBe(0);
    expect(yearIndex("5º Ano")).toBe(4);
    expect(yearIndex("3º ano Ensino Fundamental")).toBe(2);
  });

  it("devolve null para Educação Infantil ou turma desconhecida", () => {
    expect(yearIndex("Grupo 05")).toBeNull();
    expect(yearIndex("")).toBeNull();
    expect(yearIndex(undefined)).toBeNull();
  });
});

describe("formatScore", () => {
  it("usa vírgula decimal e uma casa", () => {
    expect(formatScore(9)).toBe("9,0");
    expect(formatScore(7.5)).toBe("7,5");
    expect(formatScore(null)).toBe("");
  });
});
