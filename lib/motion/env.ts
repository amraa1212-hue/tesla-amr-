// Browser-only helpers shared by the motion layer. Call them from effects.

let reduced: boolean | undefined;

/** Read once, like the original script: a mid-visit change needs a reload. */
export function isReducedMotion() {
  if (reduced === undefined) {
    reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return reduced;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Value of a CSS custom property on :root, e.g. token("--color-accent"). */
export function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
