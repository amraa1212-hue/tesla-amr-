import type { ReactNode } from "react";
import { ContourCanvas } from "@/components/motion/ContourCanvas";
import { DissolveCanvas } from "@/components/motion/DissolveCanvas";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/cn";

export type Surface = "light" | "dark";

/** Background, text colour and context (`on-dark:` / `on-light:` variants) of a section. */
export const surfaceClass = (surface: Surface) => (surface === "dark" ? "surface-dark" : "surface-light");

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("relative z-1 mx-auto w-full max-w-page", className)}>{children}</div>;
}

type SectionProps = {
  id?: string;
  surface: Surface;
  /** Chequered strip that carries the previous section's surface in. */
  dissolve?: boolean;
  /** Animated contour lines in the background. */
  contour?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({ id, surface, dissolve, contour, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("relative px-gutter py-section", surfaceClass(surface), className)}>
      {dissolve && <DissolveCanvas surface={surface} />}
      {contour && <ContourCanvas />}
      <Container>{children}</Container>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  center?: boolean;
  /** Extra content under the title, e.g. a tab list. */
  children?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, center, children }: SectionHeaderProps) {
  return (
    <div className={cn("mb-16 flex max-w-3xl flex-col gap-4", center ? "mx-auto items-center text-center" : "items-start")}>
      {eyebrow && (
        <Reveal as="p" kind="copy" className="mb-1 max-w-xl text-eyebrow font-medium tracking-[-.02em] on-dark:text-accent">
          {eyebrow}
        </Reveal>
      )}
      <SplitText as="h2" mode="words" className={cn("h2", center && "max-w-none before:left-1/2 before:-translate-x-1/2")}>
        {title}
      </SplitText>
      {description && (
        <Reveal as="p" kind="copy" className="max-w-xl text-lead">
          {description}
        </Reveal>
      )}
      {children}
    </div>
  );
}
