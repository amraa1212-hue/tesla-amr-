"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { isReducedMotion } from "@/lib/motion/env";
import { addTicker } from "@/lib/motion/ticker";

/** Chamfered dark plate with a wheel icon that turns once every 10 s. */
export function StatPlate({ children }: { children: ReactNode }) {
  const wheelRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || isReducedMotion()) return;
    return addTicker((t) => {
      const deg = ((t % 10000) / 10000) * 360;
      wheel.style.transform = `rotate(${deg.toFixed(2)}deg)`;
    }, 30);
  }, []);

  return (
    <div className="relative grid min-h-[4.875rem] w-[17.3125rem] grid-cols-[5.1875rem_1fr] text-on-dark max-md:w-full max-md:max-w-[17.3125rem]">
      <svg
        className="absolute inset-0 size-full overflow-visible"
        viewBox="0 0 277 78"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0.5 0.5H276.5V69L268 77.5H0.5Z" vectorEffect="non-scaling-stroke" className="fill-surface-black stroke-accent" />
        <line x1="83" y1="0.5" x2="83" y2="77.5" vectorEffect="non-scaling-stroke" className="stroke-accent" />
      </svg>
      <div className="relative grid place-items-center" aria-hidden="true">
        <svg ref={wheelRef} className="size-8 text-accent" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1}>
          <circle cx="16" cy="16" r="14.5" />
          <circle cx="16" cy="16" r="10" />
          <circle cx="16" cy="16" r="3" />
          <path d="M16 13V6M18.85 15.07L25.5 12.9M17.76 18.43L21.9 24.1M14.24 18.43L10.1 24.1M13.15 15.07L6.5 12.9" />
        </svg>
      </div>
      {children}
    </div>
  );
}
