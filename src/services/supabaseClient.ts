import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Configurações do Supabase ausentes no arquivo .env. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  );
}

// Cliente principal com persistência de sessão para login e consultas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Cliente temporário sem persistência de sessão para cadastro (evita auto-login antes de confirmar)
export const supabaseEphemeralClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
