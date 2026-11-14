import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the admin uses sessions; public pages stay static and cookie-free.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
