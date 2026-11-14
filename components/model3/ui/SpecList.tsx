import { Fragment } from "react";
import { cn } from "@/lib/cn";
import type { Spec } from "@/data/model3";

type SpecListProps = {
  items: Spec[];
  /** Compact list inside a StatPlate. */
  plate?: boolean;
};

export function SpecList({ items, plate }: SpecListProps) {
  return (
    <dl
      className={
        plate
          ? "relative flex flex-col justify-center gap-[.4rem] px-3 pt-[.6rem] pb-[.9rem]"
          : "grid grid-cols-2 gap-x-8 gap-y-5 max-md:grid-cols-1"
      }
    >
      {items.map((item) => {
        const lines = Array.isArray(item.value) ? item.value : [item.value];
        return (
          <div key={item.label} className={cn("flex flex-col", plate ? "gap-[.15rem]" : "gap-[.35rem]")}>
            <dt className={cn("text-eyebrow tracking-[-.04em]", plate ? "text-accent" : "text-on-dark-muted")}>
              {item.label}
              {item.labelNote ? <sup>{item.labelNote}</sup> : null}
            </dt>
            <dd className={cn("font-medium text-on-dark", plate && "text-eyebrow")}>
              {lines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
              {item.valueNote ? <sup>{item.valueNote}</sup> : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
