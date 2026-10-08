import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { anoAtual } from "@/lib/mensalidades/consultas";
import {
  baseUrlPublica, listarParcelasParaLink, gerarLinksParaParcelas, contarParcelasSemLinkApi,
} from "@/lib/infinitepay/links";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Deixa folga pro maxDuration: o que sobrar fica pra próxima rodada.
const ORCAMENTO_MS = 45_000;
const LOTE = 20;

/**
 * Cron diário (vercel.json): toda parcela em aberto do ano sem link da API
 * ganha um. Cobre contrato importado, link que falhou na criação e parcela
 * editada à mão. Ninguém precisa clicar em nada.
 *
 * A Vercel manda `Authorization: Bearer <CRON_SECRET>`; sem isso, 401.
 */
function autorizado(req) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo) return false;
  const recebido = Buffer.from(req.headers.get("authorization") || "");
  const esperado = Buffer.from(`Bearer ${segredo}`);
  return recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
}

export async function GET(req) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  const ano = anoAtual();
  const baseUrl = baseUrlPublica(req);
  const inicio = Date.now();
  const falhas = [];
  let gerados = 0;
  let loteAnterior = "";
  let listagemRepetida = false;
  let limiteAtingido = false;

  try {
    while (Date.now() - inicio < ORCAMENTO_MS) {
      const parcelas = await listarParcelasParaLink(supabase, {
        ano,
        limite: LOTE,
        ignorarIds: falhas.map(f => f.id),
      });
      if (!parcelas.length) break;

      // Se a listagem devolve o mesmo lote de novo, a atualização não está
      // pegando (ou a leitura veio de cache). Parar evita gerar link em loop.
      const assinatura = parcelas.map(p => p.id).join(",");
      if (assinatura === loteAnterior) {
        listagemRepetida = true;
        break;
      }
      loteAnterior = assinatura;

      const r = await gerarLinksParaParcelas({ supabase, parcelas, baseUrl });
      gerados += r.gerados;
      falhas.push(...r.falhas);
      if (r.limiteAtingido) {
        limiteAtingido = true;
        break;
      }
      if (r.gerados === 0) break;
    }

    const restantes = await contarParcelasSemLinkApi(supabase, ano);
    if (falhas.length) console.error("cron/links: falhas", falhas);
    if (listagemRepetida) console.error("cron/links: listagem repetida, parado por segurança");
    if (limiteAtingido) console.warn("cron/links: InfinitePay respondeu 429, resto fica pra próxima rodada");

    return NextResponse.json({ ano, gerados, falhas: falhas.length, restantes, listagemRepetida, limiteAtingido });
  } catch (e) {
    console.error("cron/links:", e);
    return NextResponse.json({ error: e.message, gerados }, { status: 500 });
  }
}
