import { clamp01, isReducedMotion } from "./env";
import { CFG, type SpringConfig } from "./spring";

export type RevealKind = "block" | "copy" | "item" | "figure";

export const REVEAL_KIND: Record<RevealKind, { cfg: SpringConfig; y: number }> = {
  block: { cfg: CFG.REVEAL, y: 0.75 },
  copy: { cfg: CFG.COPY, y: 0.75 },
  item: { cfg: CFG.ITEM, y: 1 },
  figure: { cfg: CFG.FIGURE, y: 1.25 },
};

export function showBlock(el: HTMLElement, p: number, y: number) {
  el.style.opacity = String(clamp01(p));
  el.style.transform = p >= 1 ? "" : `translateY(${((1 - p) * y).toFixed(4)}rem)`;
}

/** Starts an element's entrance. `instant` jumps to the end state. */
export type Play = (instant: boolean, extraDelay: number) => void;

const plays = new Map<Element, Play>();
let observer: IntersectionObserver | null = null;
let queue: Element[] = [];
let scheduled = false;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        let batch = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          observer?.unobserve(e.target);
          const play = plays.get(e.target);
          plays.delete(e.target);
          // Mode "forward": plays while scrolling down; arriving from above shows the end state
          const fromBelow = e.boundingClientRect.top >= 0;
          play?.(!fromBelow, batch++ * 70);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

// Observe in document order, as the original querySelectorAll did, so
// elements entering together keep their top-to-bottom 70 ms stagger.
function flush() {
  scheduled = false;
  const els = queue.filter((el) => plays.has(el));
  queue = [];
  els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  const io = getObserver();
  els.forEach((el) => io.observe(el));
}

/** Calls `play` when `el` scrolls into view. Returns a cleanup function. */
export function observeReveal(el: Element, play: Play) {
  if (isReducedMotion() || !("IntersectionObserver" in window)) {
    play(true, 0);
    return () => {};
  }
  plays.set(el, play);
  queue.push(el);
  if (!scheduled) {
    scheduled = true;
    queueMicrotask(flush);
  }
  return () => {
    plays.delete(el);
    observer?.unobserve(el);
  };
}
