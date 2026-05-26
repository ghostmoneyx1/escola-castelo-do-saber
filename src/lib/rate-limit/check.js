import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Extrai IP do request. Vercel/proxy populam x-forwarded-for (lista).
 * Pega o primeiro IP da lista (cliente real).
 */
export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Verifica + incrementa rate limit. Atômico via função SQL rate_limit_hit.
 *
 * @param {object} opts
 * @param {string} opts.key       chave única (ex: "relatorio_submit:1.2.3.4")
 * @param {number} opts.max       máximo de hits na janela
 * @param {number} opts.windowSec tamanho da janela em segundos
 * @returns {Promise<{allowed: boolean, remaining: number, resetAt: Date|null}>}
 */
export async function checkRateLimit({ key, max, windowSec }) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("rate_limit_hit", {
    p_key: key,
    p_max: max,
    p_window_sec: windowSec,
  });

  if (error) {
    console.error("rate_limit_hit error:", error);
    // Fail-open: se rate limit quebrou, deixa passar (não trava o app inteiro)
    return { allowed: true, remaining: max, resetAt: null };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    allowed: Boolean(row?.allowed),
    remaining: Number(row?.remaining ?? 0),
    resetAt: row?.reset_at ? new Date(row.reset_at) : null,
  };
}

/**
 * Helper pra route handlers. Retorna NextResponse 429 se exceder, ou null.
 *
 * Uso:
 *   const limit = await enforceRateLimit(request, {
 *     bucket: "relatorio_submit", max: 5, windowSec: 3600
 *   });
 *   if (limit) return limit;
 */
export async function enforceRateLimit(request, { bucket, max, windowSec, identifier }) {
  const id = identifier || getClientIp(request);
  const key = `${bucket}:${id}`;
  const { allowed, remaining, resetAt } = await checkRateLimit({ key, max, windowSec });

  if (allowed) return null;

  const retryAfterSec = resetAt
    ? Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000))
    : windowSec;

  return NextResponse.json(
    { error: "Muitas tentativas. Aguarde antes de tentar novamente." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Limit": String(max),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": resetAt ? resetAt.toISOString() : "",
      },
    }
  );
}
