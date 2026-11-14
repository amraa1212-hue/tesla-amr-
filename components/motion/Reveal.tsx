"use client";

import { useRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import type { RevealKind } from "@/lib/motion/reveal";
import { useReveal } from "./useReveal";

type RevealProps<T extends ElementType> = {
  as?: T;
  kind?: RevealKind;
  /** Extra delay in ms before the spring starts. */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Renders `as` (a div by default) and plays its entrance on scroll. */
export function Reveal<T extends ElementType = "div">({ as, kind = "block", delay = 0, ...rest }: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, kind, delay);
  const Tag = (as ?? "div") as ElementType;
  return <Tag ref={ref} data-reveal={kind} {...rest} />;
}
