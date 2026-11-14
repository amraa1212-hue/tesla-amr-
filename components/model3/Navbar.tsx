"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/components/motion/useReveal";
import { AppLink } from "@/components/ui/AppLink";
import { Logo } from "@/components/ui/Logo";
import { MODEL_LINKS, NAV_LABEL, TEST_DRIVE_LABEL, TEST_DRIVE_URL } from "@/data/nav";
import { clamp01, isReducedMotion } from "@/lib/motion/env";
import { getLenis } from "@/lib/motion/lenis";
import { CFG, spring } from "@/lib/motion/spring";
import { ChamferButton } from "./ui/ChamferButton";
import { TextButton } from "./ui/TextButton";

const DESKTOP = "(min-width: 1280px)";

/** Below 1280px the menu opens as a full-screen sheet. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useReveal(headerRef, "block");

  // Sheet open: lock page scroll and bring the rows in one after another
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const root = document.documentElement;
    const lenis = getLenis();
    const rows = Array.from(sheet.querySelectorAll<HTMLElement>("li"));

    if (open && !matchMedia(DESKTOP).matches) {
      root.style.overflow = "hidden";
      lenis?.stop();
      const stops = isReducedMotion()
        ? []
        : rows.map((li, i) => {
            li.style.opacity = "0";
            li.style.transform = "translateY(1.5rem)";
            return spring(
              CFG.ROW,
              (p) => {
                li.style.opacity = String(clamp01(p));
                li.style.transform = p >= 1 ? "" : `translateY(${((1 - p) * 1.5).toFixed(4)}rem)`;
              },
              120 + i * 55,
            );
          });
      return () => stops.forEach((stop) => stop());
    }

    root.style.overflow = "";
    lenis?.start();
    rows.forEach((li) => {
      li.style.opacity = "";
      li.style.transform = "";
    });
  }, [open]);

  // Escape closes and returns focus to the toggle
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Growing to desktop closes the sheet
  useEffect(() => {
    const desktop = matchMedia(DESKTOP);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      ref={headerRef}
      data-reveal="block"
      data-open={open ? "" : undefined}
      className="group/nav absolute inset-x-0 top-0 z-40 px-gutter text-foreground"
    >
      <nav aria-label={NAV_LABEL} className="relative flex h-22 items-center justify-between">
        <div>
          <Logo imgClassName="w-30" />
        </div>

        <div
          ref={sheetRef}
          className="max-xl:contents"
          onClick={(e) => {
            if ((e.target as Element).closest("a")) setOpen(false);
          }}
          {...(open ? { role: "dialog", "aria-modal": true, "aria-label": NAV_LABEL } : {})}
        >
          <ul
            id="navbar-menu"
            className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-16 max-xl:fixed max-xl:inset-0 max-xl:hidden max-xl:translate-none max-xl:flex-col max-xl:items-start max-xl:justify-center max-xl:gap-2 max-xl:bg-background max-xl:px-gutter max-xl:pt-24 max-xl:pb-12 max-xl:group-data-[open]/nav:flex"
          >
            {MODEL_LINKS.map((link) => (
              <li key={link.label}>
                <AppLink
                  href={link.href}
                  aria-current={link.href === "/model3" ? "page" : undefined}
                  className="block text-label font-medium whitespace-nowrap decoration-accent decoration-2 underline-offset-[.35em] transition-colors duration-150 ease-entrance hover:underline aria-[current=page]:underline max-xl:group-data-[open]/nav:font-display max-xl:group-data-[open]/nav:text-display max-xl:group-data-[open]/nav:leading-none max-xl:group-data-[open]/nav:font-bold"
                >
                  {link.label}
                </AppLink>
              </li>
            ))}
            <li className="hidden max-xl:mt-8 max-xl:block">
              <ChamferButton href={TEST_DRIVE_URL} external>
                {TEST_DRIVE_LABEL}
              </ChamferButton>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-6">
          <TextButton href={TEST_DRIVE_URL} external className="max-xl:hidden">
            {TEST_DRIVE_LABEL}
          </TextButton>
          <button
            ref={toggleRef}
            type="button"
            aria-controls="navbar-menu"
            aria-expanded={open}
            aria-label={open ? "Цэс хаах" : "Цэс нээх"}
            onClick={() => setOpen((o) => !o)}
            className="relative hidden size-11 max-xl:z-2 max-xl:block"
          >
            <span className="absolute inset-x-2.5 top-[calc(50%-4px)] h-px bg-current transition-transform duration-250 ease-plate group-data-[open]/nav:translate-y-[4px] group-data-[open]/nav:rotate-45" />
            <span className="absolute inset-x-2.5 top-[calc(50%+4px)] h-px bg-current transition-transform duration-250 ease-plate group-data-[open]/nav:-translate-y-[4px] group-data-[open]/nav:-rotate-45" />
          </button>
        </div>
      </nav>
    </header>
  );
}
