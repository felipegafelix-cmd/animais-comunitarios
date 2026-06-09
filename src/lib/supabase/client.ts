/**
 * Cliente Supabase para o browser (Client Components).
 * Usa o pacote @supabase/ssr para gerenciar as sessões corretamente.
 */
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Indica se as variáveis de ambiente do Supabase estão configuradas */
export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

/**
 * Instância singleton do cliente Supabase para o browser.
 * Retorna null se env vars não existirem (modo demo).
 */
export const supabaseBrowser = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;
