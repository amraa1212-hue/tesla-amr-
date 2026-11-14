import type { Metadata } from "next";
import { AffordableSection } from "@/components/model3/AffordableSection";
import { AutonomySection } from "@/components/model3/AutonomySection";
import { ConnectedSection } from "@/components/model3/ConnectedSection";
import { EndCta } from "@/components/model3/EndCta";
import { Footer } from "@/components/model3/Footer";
import { Footnotes } from "@/components/model3/Footnotes";
import { InteriorSection } from "@/components/model3/InteriorSection";
import { MeetSection } from "@/components/model3/MeetSection";
import { Model3Hero } from "@/components/model3/Model3Hero";
import { Navbar } from "@/components/model3/Navbar";
import { SafetySection } from "@/components/model3/SafetySection";
import { SpecsSection } from "@/components/model3/SpecsSection";
import { StickyStack } from "@/components/model3/StickyStack";
import { TrimsSection } from "@/components/model3/TrimsSection";
import { PlateClipDefs } from "@/components/model3/ui/Plate";
import { MotionRoot } from "@/components/motion/MotionRoot";

export const metadata: Metadata = {
  title: "Model 3 — Спорт цахилгаан седан | Tesla",
  description:
    "Tesla Model 3: хувилбарууд, үнэ, явах зай, хурдатгал, салон, аюулгүй байдал болон техникийн үзүүлэлтүүд.",
};

export default function Model3Page() {
  return (
    <>
      <MotionRoot />
      <PlateClipDefs />
      <Navbar />
      <main>
        <StickyStack>
          <Model3Hero />
          <MeetSection />
          <TrimsSection />
        </StickyStack>
        <AffordableSection />
        <InteriorSection />
        <ConnectedSection />
        <SafetySection />
        <AutonomySection />
        <SpecsSection />
        <EndCta />
        <Footnotes />
      </main>
      <Footer />
    </>
  );
}
