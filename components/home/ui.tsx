import Image from "next/image";
import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { cn } from "@/lib/cn";
import type { Img } from "@/data/types";

/** Heading styles of the home design system. */
export const h1 = "font-heading text-h1 leading-[1.2] font-normal tracking-[-0.01em]";
export const h2 = "font-heading text-h2 leading-[1.2] font-normal tracking-[-0.01em]";

export function Section({
  className,
  containerClassName,
  children,
}: {
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden bg-background px-page py-section-lg", className)}>
      <div className={cn("mx-auto w-full max-w-page", containerClassName)}>{children}</div>
    </section>
  );
}

const BUTTON_VARIANT = {
  primary: "border border-primary bg-primary text-white hover:border-primary-hover hover:bg-primary-hover",
  secondary: "border border-transparent bg-neutral-5 text-foreground hover:bg-neutral-10",
  link: "group/btn",
} as const;

type ButtonProps = {
  href: string;
  variant?: keyof typeof BUTTON_VARIANT;
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
};

/** `link` buttons get a chevron that nudges right on hover. */
export function Button({ href, variant = "primary", size = "md", className, children }: ButtonProps) {
  return (
    <AppLink
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-body text-regular leading-normal font-semibold whitespace-nowrap transition-[background-color,border-color] duration-200 ease-[ease]",
        variant === "link" ? "p-0" : size === "sm" ? "px-5 py-2" : "px-6 py-2.5",
        BUTTON_VARIANT[variant],
        className,
      )}
    >
      {children}
      {variant === "link" && (
        <img
          className="shrink-0 transition-transform duration-200 ease-[ease] group-hover/btn:translate-x-[3px]"
          src="/assets/icons/chevron-right.svg"
          width={24}
          height={24}
          alt=""
        />
      )}
    </AppLink>
  );
}

type MediaCoverProps = Img & {
  sizes: string;
  preload?: boolean;
  /** "span" inside buttons. */
  as?: "div" | "span";
};

/** Cover image filling its positioned parent, dimmed by a dark overlay. */
export function MediaCover({ src, alt, sizes, preload, as: Tag = "div" }: MediaCoverProps) {
  return (
    <Tag className="pointer-events-none absolute inset-0 after:absolute after:inset-0 after:bg-overlay">
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
    </Tag>
  );
}
