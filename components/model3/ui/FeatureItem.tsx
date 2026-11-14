import type { HTMLAttributes } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import type { Feature } from "@/data/model3";
import { BracketCorners } from "./Bracket";

type FeatureItemProps = Feature & Omit<HTMLAttributes<HTMLDivElement>, "title">;

/** Title and copy inside accent corner brackets. */
export function FeatureItem({ title, titleNote, text, className, ...rest }: FeatureItemProps) {
  return (
    <Reveal kind="item" className={cn("relative flex flex-col gap-3", className)} {...rest}>
      <h3 className="text-title leading-none font-bold">
        {title}
        {titleNote ? <sup>{titleNote}</sup> : null}
      </h3>
      <p>{text}</p>
      <BracketCorners />
    </Reveal>
  );
}
