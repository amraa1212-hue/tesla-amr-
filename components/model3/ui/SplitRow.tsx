import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Img } from "@/data/types";
import { Plate } from "./Plate";

type SplitRowProps = {
  image: Img;
  /** Image on the left instead of the right (desktop only). */
  reverse?: boolean;
  /** The text column. */
  children: ReactNode;
};

/** Text beside an image; stacks below 1280px. */
export function SplitRow({ image, reverse, children }: SplitRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-20 max-xl:grid-cols-1 max-xl:gap-10",
        reverse ? "grid-cols-[1.15fr_1fr]" : "grid-cols-[1fr_1.15fr]",
      )}
    >
      <div className="flex flex-col items-start gap-6">{children}</div>
      <Plate
        {...image}
        sizes="(max-width: 1279px) 100vw, 50vw"
        reveal="figure"
        className={reverse ? "-order-1 max-xl:order-none" : undefined}
      />
    </div>
  );
}
