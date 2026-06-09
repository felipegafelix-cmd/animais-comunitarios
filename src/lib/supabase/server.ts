/**
 * Cliente Supabase para Server Components e Route Handlers.
 * Preferir este cliente em páginas que buscam dados no servidor.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export function createSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Server-side: não persiste sessão no browser
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
