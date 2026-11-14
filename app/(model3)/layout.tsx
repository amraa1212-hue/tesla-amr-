import { Manrope, Oswald, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/model3.css";

const oswald = Oswald({ subsets: ["latin", "cyrillic"], weight: ["500", "700"], variable: "--font-oswald" });
// No Cyrillic in Space Grotesk: without a metric fallback, Mongolian text falls through to Manrope
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  adjustFontFallback: false,
});
const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "700"], variable: "--font-manrope" });

// Runs before first paint: hides reveal targets only when JS and motion are on,
// and shows everything again if the motion layer has not started after 3 s.
const MOTION_BOOT = `(function(d){d.classList.add("js");if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("motion");setTimeout(function(){if(!window.__m3Ready)d.classList.remove("motion")},3000)})(document.documentElement);`;

// Its own root layout, so /model3 loads only this design system's CSS and fonts
export default function Model3Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={`${oswald.variable} ${spaceGrotesk.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
