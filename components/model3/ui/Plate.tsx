"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReveal } from "@/components/motion/useReveal";
import { cn } from "@/lib/cn";
import type { Img } from "@/data/types";
import { clamp01, isReducedMotion } from "@/lib/motion/env";
import type { RevealKind } from "@/lib/motion/reveal";
import { onScrollFrame } from "@/lib/motion/scroll";

/** Stepped-corner outline, in objectBoundingBox units (0..1). */
const PLATE_PATH =
  "M 0.01915,0.00107H 0.98085C 0.98574,0.00107 0.99044,0.00300 0.99390,0.00642C 0.99736,0.00984 0.99930,0.01449 0.99930,0.01933V 0.88815C 0.99930,0.89299 0.99736,0.89763 0.99390,0.90105C 0.99044,0.90448 0.98574,0.90640 0.98085,0.90640H 0.64733C 0.63864,0.90640 0.63007,0.90834 0.62224,0.91206C 0.61442,0.91579 0.60754,0.92122 0.60212,0.92794L 0.56153,0.97830C 0.55635,0.98474 0.54976,0.98993 0.54227,0.99350C 0.53478,0.99707 0.52656,0.99892 0.51825,0.99892H 0.01915C 0.01426,0.99892 0.00956,0.99700 0.00610,0.99358C 0.00264,0.99016 0.00070,0.98551 0.00070,0.98067V 0.01933C 0.00070,0.01449 0.00264,0.00984 0.00610,0.00642C 0.00956,0.00300 0.01426,0.00107 0.01915,0.00107Z";

/** Render once per page: the clip path every plate's image uses. */
export function PlateClipDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="plate-clip" clipPathUnits="objectBoundingBox">
          <path d={PLATE_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}

type PlateProps = Img & {
  sizes: string;
  preload?: boolean;
  /** Diagram mode: whole drawing on the page background, no parallax. */
  contain?: boolean;
  reveal?: RevealKind;
  delay?: number;
  /** Position utilities; plates are `relative` unless told otherwise. */
  position?: string;
  /** Aspect-ratio utility; defaults to the plate's own ratio. */
  aspect?: string;
  className?: string;
};

/** Image in a stepped-corner frame. The image drifts with scroll and the frame insets on hover. */
export function Plate({
  src,
  width,
  height,
  alt,
  sizes,
  preload,
  contain,
  reveal,
  delay,
  position = "relative",
  aspect = "aspect-[710.995/462.995]",
  className,
}: PlateProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, reveal, delay);

  // Parallax: moves the overscanned image with `top`
  useEffect(() => {
    const plate = ref.current;
    if (!plate || contain || isReducedMotion()) return;
    return onScrollFrame((vh) => {
      const r = plate.getBoundingClientRect();
      if (!r.height || r.bottom < 0 || r.top > vh) return;
      const p = clamp01((vh - r.top) / (vh + r.height));
      plate.style.setProperty("--py", `${(-10 + 10 * p).toFixed(2)}%`);
    });
  }, [contain]);

  return (
    <div ref={ref} data-reveal={reveal} className={cn("group/plate", position, aspect, className)}>
      <svg
        className="pointer-events-none absolute inset-0 z-1 size-full overflow-visible"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d={PLATE_PATH} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className="stroke-plate-outline" />
      </svg>
      <div
        className={cn(
          "absolute inset-0 overflow-hidden transition-[inset] duration-700 ease-plate [-webkit-clip-path:url(#plate-clip)] [clip-path:url(#plate-clip)] group-hover/plate:inset-[5%]",
          contain ? "bg-background" : "bg-plate-fill",
        )}
      >
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          sizes={sizes}
          preload={preload}
          className={cn(
            "absolute left-0 w-full max-w-none",
            contain ? "top-0 h-full object-contain p-[6%]" : "top-[var(--py,-5%)] h-[110%] object-cover",
          )}
        />
      </div>
    </div>
  );
}
