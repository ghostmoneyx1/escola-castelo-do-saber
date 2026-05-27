import { z } from "zod";
import { NextResponse } from "next/server";

const uuid = z.string().uuid({ message: "UUID inválido" });
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar em YYYY-MM-DD");

export const chamadaSubmitSchema = z.object({
  class_id: uuid,
  date: isoDate,
  attendance: z.record(uuid, z.boolean().or(z.number().int().min(0).max(1))),
});

export const relatorioSubmitSchema = z.object({
  token: z.string().min(20).max(128),
  responses: z.record(z.string().min(1), z.string().min(1)),
  professor_name: z.string().trim().min(1).max(120).optional().nullable(),
  observations: z.string().trim().max(4000).optional().nullable(),
});

export const gerarTokenSchema = z.object({
  student_id: uuid,
  quarter: z.coerce.number().int().min(1).max(2),
  year: z.coerce.number().int().min(2020).max(2100),
});

export const tokenParamSchema = z.string().regex(/^[a-f0-9]{48}$/, "Token inválido");

/**
 * Valida body de request usando schema Zod.
 * Retorna { data } ou NextResponse 400 pra dar `return`.
 */
export async function parseBody(request, schema) {
  let raw;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: result.error.issues.map(i => ({ path: i.path, message: i.message })) },
      { status: 400 }
    );
  }
  return { data: result.data };
}
