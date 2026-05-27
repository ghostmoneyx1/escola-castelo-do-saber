import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CHECKLIST, RESPOSTAS, QUARTER_LABELS, calcStatus, calcOverall } from "@/lib/relatorio-checklist";
import { relatorioSubmitSchema, parseBody } from "@/lib/validation/schemas";
import { enforceRateLimit } from "@/lib/rate-limit/check";

function buildPrompt(student, quarter, year, responses, observations) {
  const quarterLabel = QUARTER_LABELS[quarter];
  const lines = [];

  CHECKLIST.forEach(cat => {
    lines.push(`\n### ${cat.label}`);
    cat.items.forEach(item => {
      const resp = RESPOSTAS.find(r => r.value === responses[item.id]);
      lines.push(`- ${item.label} → ${resp?.label || "Não respondido"}`);
    });
  });

  if (observations) lines.push(`\n### Observações do professor\n${observations}`);

  return `Você é um especialista em pedagogia. Analise a avaliação abaixo e escreva um relatório curto, direto e acessível para os pais. Use frases simples e objetivas. Cada seção deve ter no máximo 3 frases.

Estudante: ${student.name}
Turma: ${student.classes?.grade} — ${student.classes?.name}
Período: ${quarterLabel} / ${year}

Avaliação do professor:
${lines.join("\n")}

Responda EXATAMENTE neste formato:

<SINTESE>
Em 2 a 3 frases, resuma como foi o desempenho geral do estudante neste semestre. Seja direto e claro.
</SINTESE>

<PONTOS_FORTES>
Em 2 a 3 frases, destaque o que o estudante faz bem. Use exemplos concretos das categorias avaliadas.
</PONTOS_FORTES>

<ASPECTOS_DESENVOLVER>
Em 2 a 3 frases, aponte o que precisa melhorar. Use linguagem positiva e construtiva, sem julgamentos.
</ASPECTOS_DESENVOLVER>

<ENCAMINHAMENTOS>
Em 2 a 3 frases, oriente a família sobre como apoiar o estudante em casa de forma prática e simples.
</ENCAMINHAMENTOS>`;
}

async function generateAISynthesis(student, quarter, year, responses, observations) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new Anthropic({ apiKey });
    const prompt = buildPrompt(student, quarter, year, responses, observations);

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0]?.text || "";

    const extract = (tag) => {
      const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
      const match = text.match(regex);
      return match ? match[1].trim() : null;
    };

    return {
      sintese:              extract("SINTESE"),
      pontos_fortes:        extract("PONTOS_FORTES"),
      aspectos_desenvolver: extract("ASPECTOS_DESENVOLVER"),
      encaminhamentos:      extract("ENCAMINHAMENTOS"),
    };
  } catch (err) {
    console.error("Erro ao gerar síntese IA:", err);
    return null;
  }
}

export async function POST(req) {
  // Rate limit ANTES de qualquer query/IA — protege banco e fatura Anthropic
  const limited = await enforceRateLimit(req, {
    bucket: "relatorio_submit",
    max: 5,
    windowSec: 3600,
  });
  if (limited) return limited;

  const parsed = await parseBody(req, relatorioSubmitSchema);
  if (parsed instanceof NextResponse) return parsed;
  const { token, responses, professor_name, observations } = parsed.data;

  const supabase = createAdminClient();

  const { data: tokenData, error: tokenError } = await supabase
    .from("report_tokens")
    .select("*, students(name, classes(name, grade, shift), units(name))")
    .eq("token", token)
    .maybeSingle();

  if (tokenError) {
    console.error("relatorio/submit token lookup:", tokenError);
    return NextResponse.json({ error: "Erro ao validar link" }, { status: 500 });
  }

  if (!tokenData) {
    return NextResponse.json({ error: "Link inválido" }, { status: 404 });
  }

  if (tokenData.used) {
    return NextResponse.json({ error: "Este relatório já foi preenchido" }, { status: 409 });
  }

  if (tokenData.expires_at && new Date(tokenData.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Link expirado" }, { status: 410 });
  }

  const student = tokenData.students;
  const { student_id, quarter, year } = tokenData;

  const status_academico     = calcStatus("academico",     responses);
  const status_frequencia    = calcStatus("frequencia",    responses);
  const status_comportamento = calcStatus("comportamento", responses);
  const status_social        = calcStatus("social",        responses);
  const status_autonomia     = calcStatus("autonomia",     responses);
  const status_geral         = calcOverall(responses);

  const synthesis = await generateAISynthesis(student, quarter, year, responses, observations);

  const { data: report, error: reportError } = await supabase
    .from("quarterly_reports")
    .insert({
      student_id,
      quarter,
      year,
      responses,
      status_academico,
      status_frequencia,
      status_comportamento,
      status_social,
      status_autonomia,
      status_geral,
      observations: observations || null,
      professor_name: professor_name || null,
      sintese:              synthesis?.sintese || null,
      pontos_fortes:        synthesis?.pontos_fortes || null,
      aspectos_desenvolver: synthesis?.aspectos_desenvolver || null,
      encaminhamentos:      synthesis?.encaminhamentos || null,
      filled_at:            new Date().toISOString(),
    })
    .select()
    .single();

  if (reportError) {
    if (reportError.code === "23505") {
      return NextResponse.json({ error: "Já existe um relatório deste aluno para este semestre." }, { status: 409 });
    }
    console.error("relatorio/submit insert:", reportError);
    return NextResponse.json({ error: "Falha ao salvar relatório" }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("report_tokens")
    .update({ used: true, report_id: report.id })
    .eq("token", token);

  if (updateError) {
    console.error("relatorio/submit mark used:", updateError);
  }

  return NextResponse.json({ success: true, report_id: report.id });
}
