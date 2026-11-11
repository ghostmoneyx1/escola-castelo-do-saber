import { describe, it, expect } from "vitest";
import { calcDueDate, mesesLivres, montarParcelas } from "./meses";

describe("calcDueDate", () => {
  it("usa o dia do contrato", () => {
    expect(calcDueDate(2027, 3, 10)).toBe("2027-03-10");
  });

  it("fevereiro curto cai no último dia", () => {
    expect(calcDueDate(2027, 2, 28)).toBe("2027-02-28");
    expect(calcDueDate(2027, 2, 31)).toBe("2027-02-28");
    expect(calcDueDate(2028, 2, 30)).toBe("2028-02-29");
  });
});

describe("mesesLivres", () => {
  it("devolve só os meses sem parcela", () => {
    const parcelas = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => ({ month }));
    expect(mesesLivres(parcelas)).toEqual([4]);
    expect(mesesLivres([])).toHaveLength(12);
  });
});

describe("montarParcelas", () => {
  it("gera só os meses escolhidos, em ordem", () => {
    const parcelas = montarParcelas({
      contractId: "c1", studentId: "s1", year: 2027, dueDay: 10, amount: 450, meses: new Set([12, 4, 5]),
    });
    expect(parcelas.map((p) => p.month)).toEqual([4, 5, 12]);
    expect(parcelas[0]).toEqual({
      contract_id: "c1", student_id: "s1", month: 4, year: 2027,
      due_date: "2027-04-10", amount: 450, status: "A vencer",
    });
  });
});
