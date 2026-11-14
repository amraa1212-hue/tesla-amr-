"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { isReducedMotion } from "@/lib/motion/env";
import { setLenis } from "@/lib/motion/lenis";
import { addTicker } from "@/lib/motion/ticker";

declare global {
  interface Window {
    /** Set once the motion layer runs; the boot script in the layout checks it. */
    __m3Ready?: boolean;
  }
}

/** Smooth scrolling (Lenis) and the "motion is running" flag. Renders nothing. */
export function MotionRoot() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let stop: (() => void) | undefined;
    if (!isReducedMotion()) {
      const instance = new Lenis({ lerp: 0.1 });
      lenis = instance;
      setLenis(instance);
      // Registered first so scroll position is current for everyone else
      stop = addTicker((t) => instance.raf(t), 0, true);
    }
    window.__m3Ready = true;

    return () => {
      stop?.();
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
