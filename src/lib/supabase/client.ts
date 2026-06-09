/**
 * Cliente Supabase para o browser (Client Components).
 * Usa a chave anon — segura para RLS configurado no Supabase.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Indica se as variáveis de ambiente do Supabase estão configuradas */
export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

/**
 * Instância singleton do cliente Supabase.
 * Retorna null se env vars não existirem (modo demo com mock data).
 */
export const supabaseBrowser = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
