import { isAllowedImageUrl, isAllowedLinkUrl } from "@/lib/admin/urls";
import { createPublicClient } from "@/lib/supabase/public";
import { CHARGING_STATS, CTAS, type ChargingStat, type Cta, type Offer, OFFERS } from "@/data/home";

const PLACEHOLDER_IMAGE = "/assets/images/offer-placeholder.png";

export type HomeContent = { offers: Offer[]; ctas: Cta[]; stats: ChargingStat[] };

const FALLBACK: HomeContent = { offers: OFFERS, ctas: CTAS, stats: CHARGING_STATS };

/** Images render with `fill`, so the size only has to be plausible. */
function image(src: unknown, alt: unknown) {
  const url = typeof src === "string" && isAllowedImageUrl(src) ? src : PLACEHOLDER_IMAGE;
  return { src: url, alt: typeof alt === "string" ? alt : "", width: 1536, height: 870 };
}

const text = (value: unknown) => (typeof value === "string" ? value : "");

/**
 * Home page content managed in /admin. Falls back to the static content in
 * data/home.ts while Supabase is not configured or a query fails.
 */
export async function getHomeContent(): Promise<HomeContent> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK;

  const [offers, ctas, stats] = await Promise.all([
    supabase
      .from("offers")
      .select("image_url, image_alt, tag, quote, title, subtitle, logo")
      .eq("published", true)
      .order("position")
      .order("created_at"),
    supabase
      .from("ctas")
      .select("title, body, link_url, image_url, image_alt")
      .eq("published", true)
      .order("position")
      .order("created_at"),
    supabase.from("charging_stats").select("value, label").eq("published", true).order("position").order("created_at"),
  ]);

  for (const [name, result] of Object.entries({ offers, ctas, stats })) {
    if (result.error) console.error(`Loading ${name} from Supabase failed, using static content:`, result.error.message);
  }

  return {
    offers: offers.error
      ? FALLBACK.offers
      : offers.data.map((row) => ({
          image: image(row.image_url, row.image_alt),
          tag: text(row.tag) || undefined,
          quote: text(row.quote) || undefined,
          title: text(row.title),
          subtitle: text(row.subtitle),
          logo: text(row.logo).startsWith("/assets/") ? text(row.logo) : "/assets/icons/placeholder-logo-1.svg",
        })),
    ctas: ctas.error
      ? FALLBACK.ctas
      : ctas.data.map((row) => ({
          title: text(row.title),
          text: text(row.body),
          href: isAllowedLinkUrl(text(row.link_url)) ? text(row.link_url) : "#",
          image: image(row.image_url, row.image_alt),
        })),
    stats: stats.error ? FALLBACK.stats : stats.data.map((row) => ({ value: text(row.value), label: text(row.label) })),
  };
}
