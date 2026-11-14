import { Crimson_Text, Inter, Open_Sans, Roboto } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/home.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-inter" });
// No Cyrillic in Crimson Text: without a metric fallback, Mongolian text falls through to Open Sans
const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-crimson",
  adjustFontFallback: false,
});
const openSans = Open_Sans({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], variable: "--font-open-sans" });
const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  preload: false,
});

// Its own root layout, so / loads only this design system's CSS and fonts
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable} ${crimson.variable} ${openSans.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
