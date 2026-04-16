import { createClient } from '@supabase/supabase-js';

// Instancia a ponte de comunicação única com nosso banco de dados
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
