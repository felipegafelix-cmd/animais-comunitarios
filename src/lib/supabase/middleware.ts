import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Se não estiver configurado (modo demo), ignorar middleware
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: CHAMAR supabase.auth.getUser() É NECESSÁRIO PARA REFRESH DA SESSÃO!
  // Apenas a chamada de getUser() refresca os tokens automaticamente caso tenham expirado.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirecionamento e Proteção de Rotas:
  // Definindo se o usuário tentar acessar uma rota protegida sem estar autenticado
  const isPublicRoute = request.nextUrl.pathname.startsWith("/login");
  const isStaticFile = request.nextUrl.pathname.startsWith("/_next") || 
                       request.nextUrl.pathname.startsWith("/manifest") ||
                       request.nextUrl.pathname.endsWith(".svg") ||
                       request.nextUrl.pathname.endsWith(".ico");

  if (!isStaticFile && !user && !isPublicRoute) {
    // Redireciona o usuário não autenticado para a página de login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Se estiver logado e tentar acessar /login, manda para /
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
