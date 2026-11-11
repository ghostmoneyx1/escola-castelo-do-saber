import { describe, it, expect } from "vitest";
import {
  percentualFrequencia, formatPercentual, abaixoDoMinimo, resumirAluno, montarRelatorioTurma,
} from "./percentual";

function reg(student_id, date, present, name) {
  return { student_id, date, present, ...(name && { students: { name } }) };
}

describe("percentualFrequencia", () => {
  it("arredonda para uma casa", () => {
    expect(percentualFrequencia(2, 3)).toBe(66.7);
    expect(percentualFrequencia(3, 3)).toBe(100);
  });

  it("sem chamada no período é null, não 0%", () => {
    expect(percentualFrequencia(0, 0)).toBeNull();
  });
});

describe("formatPercentual", () => {
  it("usa vírgula decimal", () => {
    expect(formatPercentual(66.7)).toBe("66,7%");
    expect(formatPercentual(100)).toBe("100%");
    expect(formatPercentual(null)).toBe("—");
  });
});

describe("abaixoDoMinimo", () => {
  it("75% exato passa", () => {
    expect(abaixoDoMinimo(75)).toBe(false);
    expect(abaixoDoMinimo(74.9)).toBe(true);
    expect(abaixoDoMinimo(null)).toBe(false);
  });
});

describe("resumirAluno", () => {
  it("conta presenças e faltas", () => {
    const r = resumirAluno([reg("a", "2026-03-02", true), reg("a", "2026-03-03", false), reg("a", "2026-03-04", true), reg("a", "2026-03-05", true)]);
    expect(r).toEqual({ dias: 4, presencas: 3, faltas: 1, percentual: 75 });
  });
});

describe("montarRelatorioTurma", () => {
  const alunos = [{ id: "b", name: "Bruno" }, { id: "a", name: "Ana" }, { id: "c", name: "Caio" }];
  const registros = [
    reg("a", "2026-03-02", true), reg("a", "2026-03-03", true),
    reg("b", "2026-03-02", false), reg("b", "2026-03-03", false),
    reg("x", "2026-03-02", true, "Xavier (saiu da turma)"),
  ];
  const rel = montarRelatorioTurma(alunos, registros);

  it("ordena por nome e inclui quem tem registro mas saiu da turma", () => {
    expect(rel.linhas.map((l) => l.name)).toEqual(["Ana", "Bruno", "Caio", "Xavier (saiu da turma)"]);
  });

  it("aluno sem chamada fica sem percentual", () => {
    expect(rel.linhas.find((l) => l.id === "c")).toMatchObject({ dias: 0, percentual: null });
  });

  it("totais da turma", () => {
    expect(rel.diasLetivos).toBe(2);
    expect(rel.percentualTurma).toBe(60);
    expect(rel.abaixoDoMinimo).toBe(1);
  });
});
