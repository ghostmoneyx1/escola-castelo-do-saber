import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Subdomínio dedicado da consulta (mensalidade.escolacastelodosaber.net):
 * a raiz serve a consulta pública, sem passar pelo gate de login.
 * O resto do app continua respondendo normal nesse host — quem cair em
 * /dashboard ali segue sendo barrado pela autenticação.
 */
function ehSubdominioDaConsulta(request) {
  const host = request.headers.get("host") || "";
  return host.startsWith("mensalidade.") || host.startsWith("mensalidades.");
}

export async function middleware(request) {
  if (ehSubdominioDaConsulta(request) && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/mensalidades";
    return NextResponse.rewrite(url);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip middleware if env vars missing
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  try {
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  } catch (e) {
    // If middleware fails, allow request through
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Roda só em rotas HTML autenticáveis.
    // Exclui: /api/* (cada route handler chama requireAuth), /relatorio/[token]
    // (acesso público por token, sem login), /mensalidades (consulta pública do
    // responsável), /login, /auth/*, assets estáticos.
    "/((?!api|relatorio|mensalidades|login|auth|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
