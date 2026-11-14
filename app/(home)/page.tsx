import type { Metadata } from "next";
import { ChargingMap } from "@/components/home/ChargingMap";
import { CtaCard } from "@/components/home/CtaCard";
import { Footer } from "@/components/home/Footer";
import { FsdFeature } from "@/components/home/FsdFeature";
import { Hero } from "@/components/home/Hero";
import { Locations } from "@/components/home/Locations";
import { Navbar } from "@/components/home/Navbar";
import { OffersSection } from "@/components/home/OffersSection";
import { getHomeContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tesla — Model 3",
  description: "Tesla Model 3, бүрэн бие даасан жолоодлого, урамшуулал болон цэнэглэх цэгүүд.",
};

// Static page: saves in /admin regenerate it at once (revalidatePath); this
// interval also picks up edits made directly in Supabase.
export const revalidate = 300;

export default async function HomePage() {
  const { offers, ctas, stats } = await getHomeContent();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FsdFeature />
        <OffersSection offers={offers} />
        {ctas.map((cta, i) => (
          <CtaCard key={i} {...cta} />
        ))}
        <ChargingMap />
        <Locations stats={stats} />
      </main>
      <Footer />
    </>
  );
}
