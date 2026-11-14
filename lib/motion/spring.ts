import { addTicker } from "./ticker";

/** Damped spring presets: [stiffness, damping] (mass 1). */
export const CFG = {
  REVEAL: [90, 26],
  ROW: [170, 24],
  ITEM: [170, 24],
  FIGURE: [200, 24],
  TYPE: [210, 24],
  COPY: [110, 26],
  VEIL: [70, 24],
  CLEAR: [140, 26],
  TRIGGER: [140, 30],
} satisfies Record<string, SpringConfig>;

export type SpringConfig = readonly [number, number];

/**
 * Runs a spring from 0 to 1 with 1 ms substeps (64 ms cap), calling
 * `onUpdate` every frame after `delay` ms. Returns a cancel function.
 */
export function spring([k, c]: SpringConfig, onUpdate: (x: number) => void, delay = 0) {
  let x = 0;
  let v = 0;
  let waited = 0;
  const stop = addTicker((_t, frame) => {
    let dt = Math.min(frame, 64);
    if (waited < delay) {
      waited += dt;
      if (waited < delay) return;
      dt = waited - delay;
    }
    for (let i = 0; i < Math.round(dt); i++) {
      v += (-k * (x - 1) - c * v) * 0.001;
      x += v * 0.001;
    }
    if (Math.abs(v) < 0.0005 && Math.abs(x - 1) < 0.0005) {
      onUpdate(1);
      stop();
      return;
    }
    onUpdate(x);
  });
  return stop;
}
