"use client";

import { Children, useRef, type ReactNode } from "react";
import { useSlider } from "@/lib/hooks/useSlider";

// Same behaviour on both pages; each design system styles it its own way.
const STYLES = {
  home: {
    root: "flex flex-col gap-8",
    track:
      "relative mr-[calc(50%_-_50vw)] flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    controls: "flex items-center justify-between gap-4",
    dots: "-ml-1 flex",
    dot: "grid size-4 place-items-center before:size-2 before:rounded-full before:bg-foreground before:opacity-20 before:transition-opacity before:duration-200 before:ease-[ease] aria-[current=true]:before:opacity-100",
    arrows: "flex gap-4",
    arrow:
      "inline-flex rounded-sm border border-background bg-surface p-3 transition-colors duration-200 ease-[ease] hover:bg-neutral-5",
    arrowIcon: undefined,
  },
  model3: {
    root: "flex flex-col gap-10",
    track:
      "group/track relative mr-[calc(50%_-_50vw)] flex snap-x snap-mandatory gap-8 overflow-x-auto pr-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    controls: "flex items-center justify-between",
    dots: "flex gap-1",
    dot: "grid size-5 place-items-center before:size-[.5625rem] before:border before:border-on-dark-faint before:transition-colors before:duration-150 aria-[current=true]:before:border-accent aria-[current=true]:before:bg-accent",
    arrows: "flex gap-3",
    arrow:
      "grid size-12 place-items-center border border-border-on-dark transition-colors duration-150 ease-entrance hover:border-accent",
    arrowIcon: "size-5 invert",
  },
} as const;

type SliderProps = {
  variant: keyof typeof STYLES;
  /** Accessible name of the carousel region. */
  label: string;
  /** The slides. */
  children: ReactNode;
};

export function Slider({ variant, label, children }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const { active, goTo, prev, next } = useSlider(trackRef, count);
  const s = STYLES[variant];

  return (
    <div className={s.root}>
      <div
        ref={trackRef}
        className={s.track}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        data-lenis-prevent={variant === "model3" ? "" : undefined}
      >
        {children}
      </div>

      <div className={s.controls}>
        <div className={s.dots} aria-label="Слайд сонгох">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              className={s.dot}
              aria-label={`${i + 1}-р слайд`}
              aria-current={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className={s.arrows}>
          <button className={s.arrow} type="button" aria-label="Өмнөх" onClick={prev}>
            <img className={s.arrowIcon} src="/assets/icons/arrow-back.svg" width={24} height={24} alt="" />
          </button>
          <button className={s.arrow} type="button" aria-label="Дараах" onClick={next}>
            <img className={s.arrowIcon} src="/assets/icons/arrow-forward.svg" width={24} height={24} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
