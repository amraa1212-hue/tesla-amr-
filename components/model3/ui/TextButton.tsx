import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextButtonProps = {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

/** Secondary link styled as `[ Label → ]`. */
export function TextButton({ href, external, className, children }: TextButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={cn(
        "group/tb inline-flex items-center gap-[.5em] text-label leading-none font-bold whitespace-nowrap decoration-accent decoration-2 underline-offset-[.3em] transition-colors duration-150 ease-entrance",
        "hover:text-accent focus-visible:text-accent",
        "on-light:hover:text-foreground on-light:hover:underline on-light:focus-visible:text-foreground on-light:focus-visible:underline",
        className,
      )}
    >
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-250 ease-plate group-hover/tb:translate-x-1">
        →
      </span>
      <span aria-hidden="true">]</span>
    </a>
  );
}
