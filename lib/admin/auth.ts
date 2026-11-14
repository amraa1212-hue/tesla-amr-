import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user and whether the database counts them as an admin.
 * Redirects to the login page when nobody is signed in. Cached per request.
 */
export const getAdminSession = cache(async () => {
  // Always per request, even when the redirect below happens before cookies() is read.
  await connection();
  if (!getSupabaseEnv()) redirect(LOGIN_PATH);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect(LOGIN_PATH);

  // Same check the RLS policies use (private.is_admin()).
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) console.error("is_admin check failed:", error.message);

  return {
    supabase,
    email: typeof claims.email === "string" ? claims.email : "",
    isAdmin: isAdmin === true,
    checkError: error?.message,
  };
});
