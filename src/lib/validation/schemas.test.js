import { describe, it, expect } from "vitest";
import {
  chamadaSubmitSchema,
  relatorioSubmitSchema,
  gerarTokenSchema,
  tokenParamSchema,
} from "./schemas";

const validUuid = "11111111-1111-4111-8111-111111111111";
const anotherUuid = "22222222-2222-4222-8222-222222222222";
const validToken = "a".repeat(48);

describe("chamadaSubmitSchema", () => {
  it("aceita payload válido", () => {
    const result = chamadaSubmitSchema.safeParse({
      class_id: validUuid,
      date: "2026-05-26",
      attendance: { [anotherUuid]: true },
    });
    expect(result.success).toBe(true);
  });

  it("rejeita class_id que não é UUID", () => {
    const result = chamadaSubmitSchema.safeParse({
      class_id: "not-a-uuid",
      date: "2026-05-26",
      attendance: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejeita data fora do formato YYYY-MM-DD", () => {
    const result = chamadaSubmitSchema.safeParse({
      class_id: validUuid,
      date: "26/05/2026",
      attendance: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejeita chave de attendance que não é UUID", () => {
    const result = chamadaSubmitSchema.safeParse({
      class_id: validUuid,
      date: "2026-05-26",
      attendance: { "not-uuid": true },
    });
    expect(result.success).toBe(false);
  });
});

describe("relatorioSubmitSchema", () => {
  it("aceita payload mínimo válido", () => {
    const result = relatorioSubmitSchema.safeParse({
      token: validToken,
      responses: { acad_1: "sempre" },
    });
    expect(result.success).toBe(true);
  });

  it("rejeita token muito curto", () => {
    const result = relatorioSubmitSchema.safeParse({
      token: "short",
      responses: { acad_1: "sempre" },
    });
    expect(result.success).toBe(false);
  });

  it("rejeita observations acima de 4000 chars", () => {
    const result = relatorioSubmitSchema.safeParse({
      token: validToken,
      responses: { acad_1: "sempre" },
      observations: "x".repeat(4001),
    });
    expect(result.success).toBe(false);
  });

  it("aceita professor_name e observations opcionais", () => {
    const result = relatorioSubmitSchema.safeParse({
      token: validToken,
      responses: { acad_1: "sempre" },
      professor_name: "Maria Souza",
      observations: "Tudo certo",
    });
    expect(result.success).toBe(true);
  });
});

describe("gerarTokenSchema", () => {
  it("coage strings de quarter/year pra número", () => {
    const result = gerarTokenSchema.safeParse({
      student_id: validUuid,
      quarter: "2",
      year: "2026",
    });
    expect(result.success).toBe(true);
    expect(result.data.quarter).toBe(2);
    expect(result.data.year).toBe(2026);
  });

  it("rejeita quarter fora de 1..4", () => {
    const result = gerarTokenSchema.safeParse({
      student_id: validUuid,
      quarter: 5,
      year: 2026,
    });
    expect(result.success).toBe(false);
  });

  it("rejeita year absurdo", () => {
    const result = gerarTokenSchema.safeParse({
      student_id: validUuid,
      quarter: 1,
      year: 1900,
    });
    expect(result.success).toBe(false);
  });
});

describe("tokenParamSchema", () => {
  it("aceita 48 hex chars", () => {
    expect(tokenParamSchema.safeParse(validToken).success).toBe(true);
  });

  it("rejeita comprimento errado", () => {
    expect(tokenParamSchema.safeParse("a".repeat(47)).success).toBe(false);
    expect(tokenParamSchema.safeParse("a".repeat(49)).success).toBe(false);
  });

  it("rejeita caracteres fora do alfabeto hex", () => {
    const bad = "g".repeat(48);
    expect(tokenParamSchema.safeParse(bad).success).toBe(false);
  });
});
