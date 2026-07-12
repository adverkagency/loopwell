import { createBrowserClient } from "@supabase/ssr";

/** Browser-side Supabase client (one per component tree is fine — it's a singleton under the hood). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
