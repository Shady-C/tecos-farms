import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Get the current auth session in API routes / server code.
 * Returns null if not authenticated.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // No-op in API route; middleware handles cookie refresh
        },
      },
    }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
