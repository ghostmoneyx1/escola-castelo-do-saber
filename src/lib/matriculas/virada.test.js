import { describe, it, expect } from "vitest";
import { sincronizarTurmaAtual } from "./virada";

function fake(matriculas) {
  const updates = [];
  return {
    updates,
    from(tabela) {
      if (tabela === "students") {
        return { update: patch => ({ eq: async (_c, id) => { updates.push({ id, patch }); return { error: null }; } }) };
      }
      const q = { select: () => q, eq: () => q, then: r => Promise.resolve({ data: matriculas, error: null }).then(r) };
      return q;
    },
  };
}

const m = (id, turmaNova, turmaAtual, extra = {}) => ({
  student_id: id, class_id: turmaNova, enrollment_type: "Infantil", classes: { unit_id: "u1" },
  students: { class_id: turmaAtual, unit_id: "u1", enrollment_type: "Projeto" }, ...extra,
});

describe("virada do ano letivo", () => {
  it("2026 não mexe em nada", async () => {
    const sb = fake([m("a", "t27", "t26")]);
    expect(await sincronizarTurmaAtual(sb, 2026)).toEqual({ atualizados: 0 });
    expect(sb.updates).toHaveLength(0);
  });

  it("2027 copia turma, unidade e tipo da matrícula pro cadastro", async () => {
    const sb = fake([m("a", "t27", "t26")]);
    await sincronizarTurmaAtual(sb, 2027);
    expect(sb.updates).toEqual([{ id: "a", patch: { class_id: "t27", unit_id: "u1", enrollment_type: "Infantil" } }]);
  });

  it("quem já está igual não é atualizado de novo", async () => {
    const igual = m("a", "t27", "t27", { students: { class_id: "t27", unit_id: "u1", enrollment_type: "Infantil" } });
    const sb = fake([igual]);
    expect(await sincronizarTurmaAtual(sb, 2027)).toEqual({ atualizados: 0 });
  });
});
