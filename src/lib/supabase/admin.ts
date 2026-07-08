import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente com a service_role key - ignora RLS. Uso restrito a operações
 * administrativas server-side (ex: provisionar usuários). Nunca importar
 * em código que rode no cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
