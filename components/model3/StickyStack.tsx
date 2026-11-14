"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp01, isReducedMotion } from "@/lib/motion/env";
import { onScrollFrame } from "@/lib/motion/scroll";

/**
 * Sections that stick to the top and shrink into the dark backdrop as the
 * next one slides over them. Children must be <StackItem>s; the element
 * after the stack covers the last layer.
 */
export function StickyStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = ref.current;
    if (!stack) return;
    const reduced = isReducedMotion();
    const phone = matchMedia("(max-width: 639px)");
    const items = Array.from(stack.children) as HTMLElement[];
    const layers = items.map((item, i) => ({
      item,
      inner: item.querySelector<HTMLElement>("[data-stack-inner]"),
      shade: item.querySelector<HTMLElement>("[data-stack-shade]"),
      next: (items[i + 1] ?? stack.nextElementSibling) as HTMLElement | null,
    }));

    // Tall layers stick once their bottom reaches the viewport bottom
    const layout = () => {
      layers.forEach(({ item }) => {
        item.style.top = `${Math.min(0, innerHeight - item.offsetHeight)}px`;
      });
    };
    layout();
    addEventListener("resize", layout);

    const stop = onScrollFrame((vh) => {
      layers.forEach(({ inner, shade, next }) => {
        if (!next || !inner || !shade) return;
        const p = clamp01(1 - next.getBoundingClientRect().top / vh);
        inner.style.transform = p > 0 && !phone.matches && !reduced ? `scale(${1 - 0.1 * p})` : "";
        shade.style.opacity = String(0.55 * p);
        inner.style.visibility = p >= 1 ? "hidden" : "visible";
      });
    });

    return () => {
      removeEventListener("resize", layout);
      stop();
    };
  }, []);

  return (
    <div ref={ref} className="relative bg-surface-black">
      {children}
    </div>
  );
}
