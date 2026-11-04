import { NextResponse } from "next/server";
import { pagarMensalidadesSchema, parseBody } from "@/lib/validation/schemas";
import { enforceRateLimit } from "@/lib/rate-limit/check";
import { createAdminClient } from "@/lib/supabase/admin";
import { carregarAlunos } from "@/lib/mensalidades/consultas";
import { linkDoGrupo } from "@/lib/infinitepay/grupo";
import { baseUrlPublica } from "@/lib/infinitepay/links";

export const dynamic = "force-dynamic";

/**
 * Consulta pública → checkout com as mensalidades que o responsável marcou.
 * Uma só, com link da API: usa o link dela. Mais de uma (ou sem link):
 * monta um checkout agrupado na hora (`payment_groups`).
 */
export async function POST(req) {
  const limited = await enforceRateLimit(req, { bucket: "mensalidades_pagar", max: 20, windowSec: 300 });
  if (limited) return limited;

  const parsed = await parseBody(req, pagarMensalidadesSchema);
  if (parsed instanceof NextResponse) return parsed;
  const { codigo } = parsed.data;
  const meses = [...new Set(parsed.data.meses)];

  try {
    const supabase = createAdminClient();
    const alunos = await carregarAlunos(supabase);
    const aluno = alunos.find(a => a.codigo === codigo);
    if (!aluno) return NextResponse.json({ error: "Link inválido. Peça um novo à coordenação." }, { status: 404 });

    const parcelas = aluno.pendentes.filter(p => meses.includes(p.mesNumero) && p.valor > 0);
    if (parcelas.length !== meses.length) {
      return NextResponse.json(
        { error: "Alguma mensalidade escolhida já foi paga ou mudou. Atualize a página e tente de novo." },
        { status: 409 }
      );
    }

    const [unica] = parcelas;
    const url = parcelas.length === 1 && unica.link && unica.linkSource === "api"
      ? unica.link
      : await linkDoGrupo({ supabase, aluno, parcelas, baseUrl: baseUrlPublica(req) });
    return NextResponse.json({ url }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("mensalidades/pagar:", e);
    return NextResponse.json(
      { error: "Não foi possível gerar o pagamento agora. Tente novamente em alguns instantes." },
      { status: 502 }
    );
  }
}
