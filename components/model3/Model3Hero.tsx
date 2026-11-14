import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { HERO } from "@/data/model3";
import { StackItem } from "./StackItem";
import { BracketCorners, BracketStat } from "./ui/Bracket";
import { ChamferButton } from "./ui/ChamferButton";
import { Plate } from "./ui/Plate";
import { TextButton } from "./ui/TextButton";

export function Model3Hero() {
  return (
    <StackItem
      surface="light"
      contour="hero"
      className="min-h-svh [@media(max-height:500px)]:min-h-auto"
      innerClassName="grid min-h-svh grid-cols-[1fr_13.625rem] grid-rows-[1fr_auto] gap-x-8 px-gutter pt-30 pb-10 max-xl:grid-cols-1 max-xl:grid-rows-[auto_auto_auto_auto] max-xl:gap-y-8 max-xl:pt-28 [@media(max-height:500px)]:min-h-auto"
    >
      <Plate
        {...HERO.image}
        sizes="(max-width: 1279px) 100vw, 69vw"
        preload
        reveal="figure"
        delay={600}
        position="absolute max-xl:relative"
        aspect="aspect-[2000/980]"
        className="top-[47%] left-1/2 z-1 w-[62rem] -translate-x-1/2 -translate-y-1/2 max-xl:top-auto max-xl:left-auto max-xl:row-start-2 max-xl:w-full max-xl:translate-none"
      />

      <div className="relative z-2 col-start-1 row-start-1 flex flex-col gap-5 self-center">
        <SplitText as="h1" mode="words" delay={180} className="h1 max-w-[6ch]">
          {HERO.title}
        </SplitText>
        <Reveal as="p" kind="copy" delay={310} className="text-lead">
          {HERO.lead}
        </Reveal>
      </div>

      <Reveal
        kind="block"
        delay={1500}
        className="relative z-2 col-span-full row-start-2 grid grid-cols-[1fr_auto_1fr] items-center max-xl:row-start-4 max-md:grid-cols-1 max-md:justify-items-start max-md:gap-y-5"
      >
        <ChamferButton href="#trims" className="col-start-2 row-start-1 max-md:col-start-1">
          Хувилбар сонгох
        </ChamferButton>
        <TextButton href="#specs" className="col-start-1 row-start-1 justify-self-start max-md:row-start-2">
          Үзүүлэлтүүд
        </TextButton>
      </Reveal>

      <Reveal
        kind="block"
        delay={900}
        className="relative z-2 col-start-2 row-start-1 flex flex-col gap-6 self-center max-xl:col-start-1 max-xl:row-start-3 max-xl:grid max-xl:grid-cols-2 max-md:grid-cols-1"
      >
        {HERO.panels.map((stats, i) => (
          <dl key={i} className="relative bg-background/72 p-4">
            {stats.map((stat, j) => (
              <BracketStat key={stat.label} {...stat} className={j > 0 ? "mt-6" : undefined} />
            ))}
            <BracketCorners />
          </dl>
        ))}
      </Reveal>

      <div className="hero-ramp" aria-hidden="true" />
    </StackItem>
  );
}
