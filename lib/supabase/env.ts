/** Storage bucket for images uploaded from /admin (see supabase/migrations). */
export const MEDIA_BUCKET = "media";

/**
 * Project URL and publishable key, or null while they are not set.
 * Referenced literally so Next.js can inline them into browser code.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url: url.replace(/\/+$/, ""), key } : null;
}

export function requireSupabaseEnv() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local",
    );
  }
  return env;
}

/** Prefix of public URLs for files in the media bucket. */
export function mediaUrlPrefix() {
  const env = getSupabaseEnv();
  return env ? `${env.url}/storage/v1/object/public/${MEDIA_BUCKET}/` : null;
}
