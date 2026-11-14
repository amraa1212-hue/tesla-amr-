import type { Metadata } from "next";
import { ChargingMap } from "@/components/home/ChargingMap";
import { CtaCard } from "@/components/home/CtaCard";
import { Footer } from "@/components/home/Footer";
import { FsdFeature } from "@/components/home/FsdFeature";
import { Hero } from "@/components/home/Hero";
import { Locations } from "@/components/home/Locations";
import { Navbar } from "@/components/home/Navbar";
import { OffersSection } from "@/components/home/OffersSection";
import { CTAS } from "@/data/home";

export const metadata: Metadata = {
  title: "Tesla — Model 3",
  description: "Tesla Model 3, бүрэн бие даасан жолоодлого, урамшуулал болон цэнэглэх цэгүүд.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FsdFeature />
        <OffersSection />
        {CTAS.map((cta) => (
          <CtaCard key={cta.title} {...cta} />
        ))}
        <ChargingMap />
        <Locations />
      </main>
      <Footer />
    </>
  );
}
