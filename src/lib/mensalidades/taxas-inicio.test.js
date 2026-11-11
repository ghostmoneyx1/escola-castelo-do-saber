import { describe, it, expect } from "vitest";
import { nivelDaTurma, nivelNoAnoSeguinte, terminaNaEscola, valorPadrao, montarLinhas, totaisPorItem } from "./taxas-inicio";

describe("nivelDaTurma", () => {
  it("Grupo é Infantil, Ano é Fundamental", () => {
    expect(nivelDaTurma("Grupo 04")).toBe("Infantil");
    expect(nivelDaTurma("3º Ano Ensino Fundamental")).toBe("Fundamental");
    expect(nivelDaTurma(null)).toBeNull();
  });
});

describe("valorPadrao", () => {
  it("livro + matrícula depende do nível", () => {
    expect(valorPadrao("livro_matricula", "Infantil")).toBe(250);
    expect(valorPadrao("livro_matricula", "Fundamental")).toBe(350);
  });

  it("sem nível, só sugere quando o valor é igual nos dois", () => {
    expect(valorPadrao("uniforme", null)).toBe(150);
    expect(valorPadrao("livro_matricula", null)).toBeNull();
  });
});

describe("montarLinhas", () => {
  const matriculas = [
    { student_id: "b", class_id: "t2", enrollment_type: "Jornada Regular", students: { name: "Bruno" }, classes: { grade: "2º Ano Ensino Fundamental", name: "A" } },
    { student_id: "a", class_id: "t1", enrollment_type: "Infantil", students: { name: "Ana" }, classes: { grade: "Grupo 03", name: "B" } },
  ];
  const registros = [
    { id: "r1", student_id: "a", item: "uniforme", status: "Pago", amount: "150.00", paid_at: "2027-01-10" },
    { id: "r2", student_id: "a", item: "experiencia", status: "Dispensado", amount: "250.00" },
  ];
  const linhas = montarLinhas(matriculas, registros);

  it("ordena por nome e preenche o que não tem registro como Pendente", () => {
    expect(linhas.map((l) => l.name)).toEqual(["Ana", "Bruno"]);
    expect(linhas[0].itens.uniforme).toMatchObject({ id: "r1", status: "Pago", amount: 150 });
    expect(linhas[0].itens.material).toEqual({ item: "material", status: "Pendente", amount: 200 });
  });

  it("pendente soma só os itens pendentes, sem os dispensados", () => {
    expect(linhas[0].pendente).toBe(200 + 250);
    expect(linhas[1].pendente).toBe(150 + 200 + 250 + 350);
  });

  it("totais por item", () => {
    const uniforme = totaisPorItem(linhas).find((t) => t.key === "uniforme");
    expect(uniforme).toMatchObject({ pagos: 1, recebido: 150, pendentes: 1, aReceber: 150 });
  });
});

describe("não rematriculados", () => {
  it("Grupo 05 vai pro 1º Ano; 5º Ano sai da escola", () => {
    expect(nivelNoAnoSeguinte("Grupo 05")).toBe("Fundamental");
    expect(nivelNoAnoSeguinte("Grupo 04")).toBe("Infantil");
    expect(nivelNoAnoSeguinte("2º Ano Ensino Fundamental")).toBe("Fundamental");
    expect(terminaNaEscola("5º Ano Ensino Fundamental")).toBe(true);
    expect(terminaNaEscola("4º Ano Ensino Fundamental")).toBe(false);
  });

  it("entram na lista marcados, com a turma do ano anterior", () => {
    const linhas = montarLinhas(
      [{ student_id: "a", class_id: "t1", students: { name: "Ana" }, classes: { grade: "Grupo 03", name: "B", year: 2027 } }],
      [{ id: "r1", student_id: "c", item: "uniforme", status: "Pago", amount: "150.00" }],
      [{ student_id: "c", class_id: "t9", students: { name: "Caio" }, classes: { grade: "Grupo 05", name: "A", year: 2026 } }],
    );
    expect(linhas.map((l) => [l.name, l.rematriculado])).toEqual([["Ana", true], ["Caio", false]]);
    expect(linhas[1].turma).toBe("Grupo 05 - A (2026)");
    expect(linhas[1].itens.livro_matricula.amount).toBe(350);
    expect(linhas[1].itens.uniforme.status).toBe("Pago");
  });
});
