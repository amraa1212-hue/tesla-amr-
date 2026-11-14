"use client";

import { useEffect, useRef } from "react";
import { isReducedMotion, token } from "@/lib/motion/env";
import { addTicker } from "@/lib/motion/ticker";

// Animated contour lines (marching squares) behind a section.
const LINE_SCALE = 3.8;
const LINE_COUNT = 2.5;
const WAVE_AMOUNT = 0.37;
const WAVE_SPEED = 1.66;
const LINE_OPACITY = 0.85;
const CELLS = 96;

const COLOR_TOKEN = {
  light: "--color-contour-light",
  dark: "--color-contour-dark",
  hero: "--color-surface-soft",
} as const;

export type ContourVariant = keyof typeof COLOR_TOKEN;

type Point = [number, number];

const field = (x: number, y: number, t: number) => {
  let f = Math.sin(x + t * 0.6) * 0.5;
  f += Math.sin(y * 0.85 - t * 0.45) * 0.45;
  f += Math.sin((x + y) * 0.65 + t * 0.35) * 0.35;
  f += Math.sin((x - y) * 0.95 - t * 0.55) * 0.25;
  return f * 0.5 + 0.5;
};

/** Fills its positioned parent. */
export function ContourCanvas({ variant = "light" }: { variant?: ContourVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = isReducedMotion();
    const color = token(COLOR_TOKEN[variant]);
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stop: (() => void) | null = null;
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (now: number) => {
      if (!w || !h) return;
      const t = ((now - start) / 1000) * WAVE_SPEED;
      const cols = CELLS;
      const rows = Math.max(2, Math.round((CELLS * h) / w));
      const cw = w / cols;
      const ch = h / rows;
      const aspect = w / h;
      const vals = new Float32Array((cols + 1) * (rows + 1));
      for (let j = 0; j <= rows; j++) {
        const ny = ((j / rows) * 2 - 1) * LINE_SCALE;
        for (let i = 0; i <= cols; i++) {
          const nx = ((i / cols) * 2 - 1) * aspect * LINE_SCALE;
          const qx = nx + Math.sin(ny * 0.8 + t * 0.7) * WAVE_AMOUNT;
          const qy = ny + Math.cos(nx * 0.7 - t * 0.6) * WAVE_AMOUNT;
          vals[j * (cols + 1) + i] = field(qx, qy, t) * LINE_COUNT;
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.globalAlpha = LINE_OPACITY;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const seg = (p: Point, q: Point) => {
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(q[0], q[1]);
      };
      for (let level = 0.5; level < LINE_COUNT; level += 1) {
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const a = vals[j * (cols + 1) + i];
            const b = vals[j * (cols + 1) + i + 1];
            const c = vals[(j + 1) * (cols + 1) + i + 1];
            const d = vals[(j + 1) * (cols + 1) + i];
            const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = i * cw;
            const y = j * ch;
            const lerp = (p: number, q: number) => (level - p) / (q - p);
            const T: Point = [x + cw * lerp(a, b), y];
            const R: Point = [x + cw, y + ch * lerp(b, c)];
            const B: Point = [x + cw * lerp(d, c), y + ch];
            const L: Point = [x, y + ch * lerp(a, d)];
            switch (idx) {
              case 1: case 14: seg(L, B); break;
              case 2: case 13: seg(B, R); break;
              case 3: case 12: seg(L, R); break;
              case 4: case 11: seg(T, R); break;
              case 6: case 9: seg(T, B); break;
              case 7: case 8: seg(L, T); break;
              case 5: seg(L, T); seg(B, R); break; // saddle
              case 10: seg(T, R); seg(L, B); break; // saddle
            }
          }
        }
      }
      ctx.stroke();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    if (reduced) {
      draw(start);
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stop) stop = addTicker(draw, 1000 / 24);
      else if (!e.isIntersecting && stop) {
        stop();
        stop = null;
      }
    });
    io.observe(canvas);

    return () => {
      ro.disconnect();
      io.disconnect();
      stop?.();
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full" />;
}
