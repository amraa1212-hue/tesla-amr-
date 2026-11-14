import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/admin.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { template: "%s · Админ", default: "Админ" },
  robots: { index: false, follow: false },
};

// Its own root layout, so the admin never loads the public design systems
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
