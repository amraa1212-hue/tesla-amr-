"use client";

import { useEffect, useRef, useState } from "react";
import type { Feature } from "@/data/model3";
import { isReducedMotion } from "@/lib/motion/env";
import { addTicker } from "@/lib/motion/ticker";
import { FeatureItem } from "./ui/FeatureItem";

/**
 * Features joined by a crawling dashed line. Hover or focus picks the
 * active item, whose dot turns accent and pulses.
 */
export function FeatureStrip({ items }: { items: Feature[] }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const strip = stripRef.current;
    const line = lineRef.current;
    if (!strip || !line) return;
    const itemAt = (i: number) => strip.querySelectorAll<HTMLElement>(".strip-item")[i];

    if (isReducedMotion()) {
      itemAt(0)?.style.setProperty("--pulse-opacity", "0.6");
      return;
    }

    let stop: (() => void) | null = null;
    const frame = (t: number) => {
      line.style.setProperty("--dash", `${(-((t % 5200) / 5200) * 18.45).toFixed(2)}px`);
      const phase = (t % 3200) / 3200;
      const el = itemAt(activeRef.current);
      if (!el) return;
      el.style.setProperty("--pulse-scale", (1 + phase * 1.2).toFixed(3));
      el.style.setProperty("--pulse-opacity", ((1 - phase) * 0.9).toFixed(3));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stop) stop = addTicker(frame, 60);
      else if (!e.isIntersecting && stop) {
        stop();
        stop = null;
      }
    });
    io.observe(strip);

    return () => {
      io.disconnect();
      stop?.();
    };
  }, []);

  return (
    <div ref={stripRef} className="relative grid grid-cols-4 gap-8 pt-10 max-xl:grid-cols-2 max-xl:gap-y-14 max-md:grid-cols-1">
      <div ref={lineRef} className="strip-line" aria-hidden="true" />
      {items.map((item, i) => (
        <FeatureItem
          key={item.title}
          {...item}
          className="strip-item px-4 pt-5 pb-4"
          data-active={i === active ? "" : undefined}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
        />
      ))}
    </div>
  );
}
