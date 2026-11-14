import { mediaUrlPrefix } from "@/lib/supabase/env";

/**
 * Images must be files in /public ("/assets/...") or uploads in the media
 * bucket. next/image only allows those, and anything else would break the page.
 */
export function isAllowedImageUrl(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  const prefix = mediaUrlPrefix();
  return Boolean(prefix && url.startsWith(prefix));
}

/** Button links: "#", a path on this site, or an http(s) URL. */
export function isAllowedLinkUrl(url: string) {
  if (url === "#" || (url.startsWith("/") && !url.startsWith("//"))) return true;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
