"use client";

import { useEffect, useRef } from "react";
import { clamp01, isReducedMotion, token } from "@/lib/motion/env";
import { onScrollFrame } from "@/lib/motion/scroll";

// Chequered dissolve at the top of a section: carries the surface of the
// section above into this one and lifts away as the section scrolls up.
const CELL = 24;
const SOLID_UNTIL = 0.16;
const LIFT = 2;
const ACCENT_SHARE = 0.06;

const noise = (x: number, y: number) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

/** `surface` is the surface of the section this canvas sits in. */
export function DissolveCanvas({ surface }: { surface: "light" | "dark" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    const reduced = isReducedMotion();
    const accent = token("--color-accent");
    const carry = surface === "dark" ? token("--color-background") : token("--color-surface-black");
    let last = -1;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      last = -1;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const stop = onScrollFrame((vh) => {
      const progress = reduced ? 1 : clamp01(1 - host.getBoundingClientRect().top / vh);
      const p = Math.round(progress * 400) / 400;
      if (p === last) return;
      last = p;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      for (let y = 0; y < rows; y++) {
        const depth = y / (rows - 1) + p * LIFT;
        if (depth > 1) break;
        const solid = depth <= SOLID_UNTIL;
        const fade = clamp01(1 - (depth - SOLID_UNTIL) / (1 - SOLID_UNTIL));
        for (let x = 0; x < cols; x++) {
          if (!solid) {
            if ((x + y) % 2 !== 0) continue;
            if (noise(x, y) > fade) continue;
          }
          ctx.fillStyle = !solid && noise(x + 101, y + 57) < ACCENT_SHARE ? accent : carry;
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    });

    return () => {
      ro.disconnect();
      stop();
    };
  }, [surface]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-3 h-[34svh] w-full" />;
}
