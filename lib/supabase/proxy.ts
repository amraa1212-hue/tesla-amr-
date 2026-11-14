import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "./env";

export const LOGIN_PATH = "/admin/login";
export const ADMIN_HOME = "/admin";

/**
 * Refreshes the auth session on /admin requests and sends signed-out visitors
 * to the login page. Admin rights are checked again on the server (see
 * lib/admin/auth.ts) and enforced by RLS in the database.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getSupabaseEnv();
  // Without Supabase the login page explains what to configure.
  if (!env) {
    return request.nextUrl.pathname === LOGIN_PATH ? response : redirect(request, LOGIN_PATH, response);
  }

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Verifies the JWT and refreshes it when it is about to expire.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const onLogin = request.nextUrl.pathname === LOGIN_PATH;

  if (!signedIn && !onLogin) return redirect(request, LOGIN_PATH, response);
  if (signedIn && onLogin) return redirect(request, ADMIN_HOME, response);
  return response;
}

/** Redirect that keeps the refreshed session cookies and no-cache headers. */
function redirect(request: NextRequest, pathname: string, from: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const res = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) res.headers.set(header, value);
  }
  return res;
}
