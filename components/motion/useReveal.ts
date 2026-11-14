import { useLayoutEffect, type RefObject } from "react";
import { isReducedMotion } from "@/lib/motion/env";
import { observeReveal, REVEAL_KIND, showBlock, type RevealKind } from "@/lib/motion/reveal";
import { spring } from "@/lib/motion/spring";

/**
 * Hides the element, then springs it up into place when it scrolls into
 * view (`data-reveal` in the original page). No-op when `kind` is unset.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, kind?: RevealKind, delay = 0) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !kind) return;
    const { cfg, y } = REVEAL_KIND[kind];
    if (!isReducedMotion() && "IntersectionObserver" in window) showBlock(el, 0, y);

    let stop: (() => void) | undefined;
    const unobserve = observeReveal(el, (instant, extraDelay) => {
      if (instant) showBlock(el, 1, y);
      else stop = spring(cfg, (p) => showBlock(el, p, y), delay + extraDelay);
    });
    return () => {
      unobserve();
      stop?.();
    };
  }, [ref, kind, delay]);
}
