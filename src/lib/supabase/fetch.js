/**
 * O Next (14, App Router) pode guardar no Data Cache qualquer GET feito com
 * o fetch global — e o PostgREST lê com GET. Um loop que lista, atualiza e
 * lista de novo passa a enxergar a primeira resposta pra sempre. Dado do
 * Supabase nunca pode vir do cache do Next.
 */
export function fetchSemCache(url, init) {
  return fetch(url, { ...init, cache: "no-store" });
}
