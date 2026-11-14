import { addTicker } from "./ticker";

// Scroll-linked updates (sticky stack, dissolves, plate parallax) run once
// per frame, and only when the scroll position or the viewport changed.

type ScrollFrame = (vh: number) => void;

const subs = new Set<ScrollFrame>();
let lastY = -1;
let dirty = true;
let stop: (() => void) | null = null;

const onResize = () => {
  dirty = true;
};

export function onScrollFrame(fn: ScrollFrame) {
  subs.add(fn);
  dirty = true;
  if (!stop) {
    addEventListener("resize", onResize);
    stop = addTicker(() => {
      if (scrollY === lastY && !dirty) return;
      lastY = scrollY;
      dirty = false;
      const vh = innerHeight;
      subs.forEach((f) => f(vh));
    });
  }
  return () => {
    subs.delete(fn);
    if (!subs.size && stop) {
      stop();
      stop = null;
      removeEventListener("resize", onResize);
    }
  };
}
