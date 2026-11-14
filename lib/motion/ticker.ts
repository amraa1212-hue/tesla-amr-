// One requestAnimationFrame loop, each subscriber with its own frame rate.

type Frame = (t: number, dt: number) => void;
type Sub = { fn: Frame; interval: number; last: number };

let subs = new Set<Sub>();
let raf = 0;

function loop(t: number) {
  raf = requestAnimationFrame(loop);
  for (const s of subs) {
    if (s.interval && s.last && t - s.last < s.interval) continue;
    const dt = s.last ? t - s.last : 16;
    s.last = t;
    s.fn(t, dt);
  }
}

/**
 * Subscribe to the shared loop. `fps` 0 means every frame.
 * `first` puts the subscriber ahead of the others (Lenis, so scroll
 * position is current for everyone else). Returns an unsubscribe function.
 */
export function addTicker(fn: Frame, fps = 0, first = false) {
  const s: Sub = { fn, interval: fps ? 1000 / fps : 0, last: 0 };
  if (first) subs = new Set([s, ...subs]);
  else subs.add(s);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    subs.delete(s);
    if (!subs.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
