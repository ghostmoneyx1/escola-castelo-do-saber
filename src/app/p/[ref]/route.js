import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { carregarAlunos } from "@/lib/mensalidades/consultas";
import { enforceRateLimit } from "@/lib/rate-limit/check";
import { linkDoGrupo } from "@/lib/infinitepay/grupo";
import { baseUrlPublica } from "@/lib/infinitepay/links";

export const dynamic = "force-dynamic";

const REF = /^([a-f0-9]{12})-(\d{1,2}|tudo)$/;

/**
 * Link curto do aviso de cobrança por WhatsApp: /p/<codigo>-<mês>.
 * O link da InfinitePay tem ~470 caracteres e vira um bloco ilegível no
 * WhatsApp; este redireciona pra ele. Parcela já paga (ou sem link) cai na
 * consulta pública do aluno, que mostra a situação atualizada.
 * `codigo` é o HMAC do aluno — o mesmo de /mensalidades?a=.
 *
 * /p/<codigo>-tudo monta na hora um checkout com o que está em aberto (em
 * atraso + a atual). Sobrou uma só: vai pro link dela.
 */
export async function GET(req, { params }) {
  const limited = await enforceRateLimit(req, { bucket: "link_curto", max: 30, windowSec: 300 });
  if (limited) return limited;

  const consulta = new URL("/mensalidades", req.url);
  const m = REF.exec(params.ref || "");
  if (!m) return NextResponse.redirect(consulta);

  const [, codigo, mes] = m;
  consulta.searchParams.set("a", codigo);

  const supabase = createAdminClient();
  const alunos = await carregarAlunos(supabase);
  const aluno = alunos.find(a => a.codigo === codigo);
  if (!aluno) return NextResponse.redirect(consulta);

  if (mes === "tudo") {
    // Pendentes vêm em ordem de mês: a primeira é a que vence antes.
    if (!aluno.pagarTudo) return NextResponse.redirect(aluno.pendentes[0]?.link || consulta);
    try {
      const url = await linkDoGrupo({ supabase, aluno, baseUrl: baseUrlPublica(req) });
      return NextResponse.redirect(url || consulta);
    } catch (e) {
      console.error("p/tudo: não deu pra montar o link agrupado:", e.message);
      return NextResponse.redirect(consulta);
    }
  }

  const parcela = aluno.pendentes.find(p => p.mesNumero === Number(mes));
  return NextResponse.redirect(parcela?.link || consulta);
}
