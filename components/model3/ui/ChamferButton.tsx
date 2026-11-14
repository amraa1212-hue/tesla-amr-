import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const SHAPE = "M220 42L212.932 50H0V0H220V42Z";
const TICKS = "M205 49.5H213L219.5 42V36M212 0.5H219.5V7M8 0.5H0.5V7M7.5 49.5H0.5V42.5";

type ChamferButtonProps = {
  href: string;
  /** Hollow (secondary) style. */
  ghost?: boolean;
  /** Opens in a new tab. */
  external?: boolean;
  className?: string;
  children: ReactNode;
};

/** Primary CTA: chamfered plate that floods with accent on hover. */
export function ChamferButton({ href, ghost, external, className, children }: ChamferButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={cn(
        "group/chamfer relative isolate inline-flex h-[2.5em] min-w-[11em] items-center justify-between gap-[.75em] pr-[1.1em] pl-[1em] text-title leading-none font-bold whitespace-nowrap text-accent transition-colors duration-250 ease-plate hover:text-foreground focus-visible:text-foreground",
        ghost && "on-light:text-foreground",
        className,
      )}
    >
      <svg
        className="absolute inset-0 -z-1 size-full overflow-visible"
        viewBox="0 0 220 50"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={SHAPE}
          vectorEffect="non-scaling-stroke"
          className={ghost ? "fill-none stroke-accent on-light:stroke-foreground" : "fill-surface-dark"}
        />
        <path
          d={SHAPE}
          className="origin-left scale-x-0 fill-accent transition-transform duration-250 ease-plate [transform-box:fill-box] group-hover/chamfer:scale-x-100 group-focus-visible/chamfer:scale-x-100"
        />
        <path d={SHAPE} fill="none" strokeOpacity={0.25} vectorEffect="non-scaling-stroke" className="stroke-accent" />
        <path d={TICKS} fill="none" vectorEffect="non-scaling-stroke" className="stroke-accent" />
      </svg>
      <span>{children}</span>
      <svg
        className="h-[.55em] w-[.65em] shrink-0 overflow-visible transition-transform duration-250 ease-plate group-hover/chamfer:translate-x-1 group-focus-visible/chamfer:translate-x-1"
        viewBox="0 0 13 10.7"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 5.35H13M8 10.35L13 5.35L8 0.35" fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
    </a>
  );
}
