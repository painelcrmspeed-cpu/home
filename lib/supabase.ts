import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente do navegador (usa a chave publishable/anon, que é pública). A segurança vem das regras (RLS) do banco.
let sb: SupabaseClient | null = null;
export const getSb = () =>
  (sb ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!));
