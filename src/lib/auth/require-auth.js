import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Guard pra route handlers que exigem sessão autenticada.
 * Retorna { user, supabase } se OK, ou um NextResponse 401 pra dar `return`.
 *
 * Uso:
 *   const guard = await requireAuth();
 *   if (guard instanceof NextResponse) return guard;
 *   const { user, supabase } = guard;
 */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  return { user, supabase };
}
