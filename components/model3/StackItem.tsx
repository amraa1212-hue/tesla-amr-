import type { ReactNode } from "react";
import { ContourCanvas, type ContourVariant } from "@/components/motion/ContourCanvas";
import { DissolveCanvas } from "@/components/motion/DissolveCanvas";
import { cn } from "@/lib/cn";
import { surfaceClass, type Surface } from "./ui/Section";

type StackItemProps = {
  id?: string;
  surface: Surface;
  dissolve?: boolean;
  contour?: ContourVariant;
  /** Classes of the sticky <section>. */
  className?: string;
  /** Classes of the layer that scales down (layout and padding go here). */
  innerClassName?: string;
  children: ReactNode;
};

/** One layer of a <StickyStack>. */
export function StackItem({ id, surface, dissolve, contour, className, innerClassName, children }: StackItemProps) {
  return (
    <section id={id} className={cn("sticky top-0 overflow-clip", className)}>
      <div data-stack-inner="" className={cn("relative origin-top will-change-transform", surfaceClass(surface), innerClassName)}>
        {dissolve && <DissolveCanvas surface={surface} />}
        {contour && <ContourCanvas variant={contour} />}
        {children}
      </div>
      <div data-stack-shade="" aria-hidden="true" className="pointer-events-none absolute inset-0 z-5 bg-surface-black opacity-0" />
    </section>
  );
}
