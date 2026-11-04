import { criarLink, paraCentavos } from "./client";
import { clienteDoLink, webhookUrl } from "./links";

/**
 * "Pagar tudo": um checkout da InfinitePay com várias parcelas do mesmo aluno.
 * O grupo nasce em `payment_groups` quando o responsável clica no link curto
 * (/p/<codigo>-tudo), com o que está em aberto naquele momento — então o
 * valor nunca fica velho. O `order_nsu` é "grupo-<id>"; o webhook usa isso
 * pra baixar todas as parcelas de uma vez.
 */

export const PREFIXO_GRUPO = "grupo-";

// Clicar de novo no mesmo dia, com as mesmas parcelas, reaproveita o link
// em vez de criar outro na InfinitePay a cada clique.
const REUSO_MS = 24 * 60 * 60 * 1000;

function mesmoConjunto(a = [], b = []) {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every(x => s.has(x));
}

/** URL do checkout com todas as parcelas de `aluno.pagarTudo` (cria se preciso). */
export async function linkDoGrupo({ supabase, aluno, baseUrl, criar = criarLink, agora = new Date() }) {
  const parcelas = aluno.pagarTudo?.parcelas || [];
  if (!parcelas.length) return null;
  const ids = parcelas.map(p => p.id);

  const { data: abertos, error: erroBusca } = await supabase
    .from("payment_groups")
    .select("id, installment_ids, payment_link")
    .eq("student_id", aluno.id)
    .eq("status", "aberto")
    .gte("created_at", new Date(agora.getTime() - REUSO_MS).toISOString())
    .order("created_at", { ascending: false });
  if (erroBusca) throw new Error(erroBusca.message);
  const igual = (abertos || []).find(g => g.payment_link && mesmoConjunto(g.installment_ids, ids));
  if (igual) return igual.payment_link;

  const total = parcelas.reduce((s, p) => s + paraCentavos(p.valor), 0);
  const { data: grupo, error: erroInsert } = await supabase
    .from("payment_groups")
    .insert({ student_id: aluno.id, installment_ids: ids, amount: total / 100 })
    .select("id")
    .single();
  if (erroInsert) throw new Error(erroInsert.message);

  const hook = webhookUrl(baseUrl);
  if (!hook) throw new Error("INFINITEPAY_WEBHOOK_TOKEN não configurada");
  const { url } = await criar({
    orderNsu: `${PREFIXO_GRUPO}${grupo.id}`,
    itens: parcelas.map(p => ({
      descricao: `Mensalidade ${p.mes}/${p.ano} - ${aluno.aluno}`,
      valorCentavos: paraCentavos(p.valor),
    })),
    cliente: clienteDoLink({ name: aluno.responsavel, phone: aluno.telefone }),
    webhookUrl: hook,
    redirectUrl: `${baseUrl}/mensalidades?a=${aluno.codigo}`,
  });

  const { error: erroUpdate } = await supabase
    .from("payment_groups")
    .update({ payment_link: url })
    .eq("id", grupo.id);
  if (erroUpdate) throw new Error(erroUpdate.message);
  return url;
}
