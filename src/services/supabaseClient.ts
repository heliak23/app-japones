import { createClient } from '@supabase/supabase-js';

// Fallback com as credenciais públicas padrão do projeto caso a Vercel ou o ambiente não tenha o .env carregado
const DEFAULT_SUPABASE_URL = 'https://wexifvscjrdzejzadift.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleGlmdnNjanJkemVqemFkaWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3NjI1MzUsImV4cCI6MjExMDMzODUzNX0.iOvGKBkdL2L96ixLQb_ZkWXmGMxJqlD-nGv7eapjNKY';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.info(
    'Utilizando credenciais de fallback para o Supabase. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel da Vercel para isolamento.'
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
