import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { carregarAlunos } from "@/lib/mensalidades/consultas";
import { enforceRateLimit } from "@/lib/rate-limit/check";

export const dynamic = "force-dynamic";

const REF = /^([a-f0-9]{12})-(\d{1,2})$/;

/**
 * Link curto do aviso de cobrança por WhatsApp: /p/<codigo>-<mês>.
 * O link da InfinitePay tem ~470 caracteres e vira um bloco ilegível no
 * WhatsApp; este redireciona pra ele. Parcela já paga (ou sem link) cai na
 * consulta pública do aluno, que mostra a situação atualizada.
 * `codigo` é o HMAC do aluno — o mesmo de /mensalidades?a=.
 */
export async function GET(req, { params }) {
  const limited = await enforceRateLimit(req, { bucket: "link_curto", max: 30, windowSec: 300 });
  if (limited) return limited;

  const consulta = new URL("/mensalidades", req.url);
  const m = REF.exec(params.ref || "");
  if (!m) return NextResponse.redirect(consulta);

  const [, codigo, mes] = m;
  consulta.searchParams.set("a", codigo);

  const alunos = await carregarAlunos(createAdminClient());
  const aluno = alunos.find(a => a.codigo === codigo);
  const parcela = aluno?.pendentes.find(p => p.mesNumero === Number(mes));

  return NextResponse.redirect(parcela?.link || consulta);
}
