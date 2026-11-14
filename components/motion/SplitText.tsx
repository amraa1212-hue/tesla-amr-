"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { clamp01, isReducedMotion } from "@/lib/motion/env";
import { observeReveal } from "@/lib/motion/reveal";
import { CFG, spring } from "@/lib/motion/spring";

type Mode = "words" | "chars";

/** Wraps every word (or character) in an inline-block span, keeping inner elements such as <small> and <sup>. */
function split(node: ReactNode, mode: Mode): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      const text = String(child);
      const tokens = mode === "chars" ? Array.from(text) : text.split(/(\s+)/);
      return tokens.map((tok, i) => {
        if (!tok) return null;
        if (/^\s+$/.test(tok)) return tok;
        return (
          <span key={i} className="sp inline-block">
            {tok}
          </span>
        );
      });
    }
    if (isValidElement<{ children?: ReactNode }>(child)) {
      return cloneElement(child, undefined, split(child.props.children, mode));
    }
    return child;
  });
}

type SplitTextProps = {
  as?: ElementType;
  mode: Mode;
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Text that types in word by word (or character by character) when it
 * scrolls into view (`data-split` in the original page). Screen readers get
 * the plain text; the split copy is aria-hidden.
 */
export function SplitText({ as, mode, delay = 0, className, children }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pieces = Array.from(el.querySelectorAll<HTMLElement>(".sp"));
    const off = mode === "chars" ? 0.3 : 0.35;
    const isH2 = el.classList.contains("h2");

    if (!isReducedMotion()) {
      pieces.forEach((s) => {
        s.style.opacity = "0";
        s.style.transform = `translateY(${off}em)`;
      });
      if (isH2) el.style.setProperty("--bar", "0");
    }
    el.style.opacity = "1";

    const stops: Array<() => void> = [];
    const unobserve = observeReveal(el, (instant, extraDelay) => {
      const start = delay + extraDelay;
      const stagger = mode === "chars" ? 24 : 110;
      const cfg = mode === "chars" ? CFG.FIGURE : CFG.TYPE;
      pieces.forEach((s, i) => {
        const set = (p: number) => {
          s.style.opacity = String(clamp01(p));
          s.style.transform = p >= 1 ? "" : `translateY(${((1 - p) * off).toFixed(4)}em)`;
        };
        if (instant) set(1);
        else stops.push(spring(cfg, set, start + i * stagger));
      });
      if (isH2) {
        const bar = (p: number) => el.style.setProperty("--bar", clamp01(p).toFixed(4));
        if (instant) bar(1);
        else stops.push(spring(CFG.REVEAL, bar, start + pieces.length * stagger));
      }
    });

    return () => {
      unobserve();
      stops.forEach((stop) => stop());
    };
  }, [mode, delay]);

  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag ref={ref} className={className} data-split={mode}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">{split(children, mode)}</span>
    </Tag>
  );
}
