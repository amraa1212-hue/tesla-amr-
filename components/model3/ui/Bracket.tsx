import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/cn";
import type { Stat } from "@/data/model3";

const CORNERS = [
  ["tr", "top-0 right-0"],
  ["tl", "top-0 left-0 -scale-x-100"],
  ["bl", "bottom-0 left-0 -scale-100"],
  ["br", "bottom-0 right-0 -scale-y-100"],
] as const;

/** Four accent corner ticks; the parent must be positioned. */
export function BracketCorners() {
  return CORNERS.map(([pos, place]) => (
    <svg
      key={pos}
      className={cn("bracket-corner absolute size-2.5 overflow-visible text-accent", place)}
      viewBox="0 0 10.5 10.5"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 0.5H10V10.5" stroke="currentColor" fill="none" />
    </svg>
  ));
}

type BracketStatProps = Stat & {
  /** Standalone panel with its own corners and entrance (trim stats). */
  panel?: boolean;
  className?: string;
};

/** Label (eyebrow) above an Oswald figure that types in character by character. */
export function BracketStat({ label, labelNote, value, unit, panel, className }: BracketStatProps) {
  const content = (
    <>
      <dt className="text-eyebrow font-medium tracking-[-.04em] on-dark:text-accent">
        {label}
        {labelNote ? <sup>{labelNote}</sup> : null}
      </dt>
      <SplitText as="dd" mode="chars" className="pt-[.2em] font-display text-heading leading-[.72] font-bold tracking-[-.08em]">
        {value}
        {unit ? " " : null}
        {unit ? <small className="ml-[.35em] font-ui text-eyebrow font-medium tracking-[-.02em]">{unit}</small> : null}
      </SplitText>
    </>
  );

  const layout = cn("flex flex-col-reverse gap-3", className);
  if (!panel) return <div className={layout}>{content}</div>;
  return (
    <Reveal kind="item" className={cn("relative p-4", layout)}>
      {content}
      <BracketCorners />
    </Reveal>
  );
}
