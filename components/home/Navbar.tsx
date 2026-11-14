"use client";

import { useState } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { Logo } from "@/components/ui/Logo";
import { MODEL_LINKS, NAV_LABEL, TEST_DRIVE_LABEL } from "@/data/nav";
import { Button } from "./ui";

/** Below 992px the menu drops down under the bar. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const bar = "h-0.5 w-6 bg-current transition duration-200 ease-[ease]";

  return (
    <header data-open={open ? "" : undefined} className="group/nav relative z-10 bg-background px-page">
      <nav aria-label={NAV_LABEL} className="flex h-18 items-center gap-8">
        <div className="flex flex-[1_0_0] items-center max-lg:flex-[1_1_auto]">
          <Logo className="justify-center" imgClassName="h-auto w-[120px]" />
        </div>

        <ul
          id="navbar-menu"
          className="flex items-center gap-8 max-lg:absolute max-lg:inset-x-0 max-lg:top-18 max-lg:hidden max-lg:flex-col max-lg:items-stretch max-lg:gap-0 max-lg:border-b max-lg:border-border max-lg:bg-background max-lg:px-page max-lg:pt-2 max-lg:pb-6 max-lg:group-data-[open]/nav:flex"
        >
          {MODEL_LINKS.map((link) => (
            <li key={link.label}>
              <AppLink
                href={link.href}
                className="block whitespace-nowrap transition-opacity duration-200 ease-[ease] hover:opacity-70 max-lg:py-3"
              >
                {link.label}
              </AppLink>
            </li>
          ))}
          <li className="hidden max-sm:block max-sm:pt-3">
            <Button href="#" size="sm" className="w-full">
              {TEST_DRIVE_LABEL}
            </Button>
          </li>
        </ul>

        <div className="flex flex-[1_0_0] items-center justify-end gap-4 max-lg:flex-none">
          <Button href="#" size="sm" className="max-sm:hidden">
            {TEST_DRIVE_LABEL}
          </Button>
          <button
            type="button"
            aria-controls="navbar-menu"
            aria-expanded={open}
            aria-label={open ? "Цэс хаах" : "Цэс нээх"}
            onClick={() => setOpen((o) => !o)}
            className="hidden size-11 flex-col items-center justify-center gap-1.5 max-lg:inline-flex"
          >
            <span className={`${bar} group-data-[open]/nav:translate-y-2 group-data-[open]/nav:rotate-45`} />
            <span className={`${bar} group-data-[open]/nav:opacity-0`} />
            <span className={`${bar} group-data-[open]/nav:-translate-y-2 group-data-[open]/nav:-rotate-45`} />
          </button>
        </div>
      </nav>
    </header>
  );
}
