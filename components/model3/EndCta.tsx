import { ContourCanvas } from "@/components/motion/ContourCanvas";
import { DissolveCanvas } from "@/components/motion/DissolveCanvas";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { END_CTA, ORDER_URL } from "@/data/model3";
import { TEST_DRIVE_LABEL, TEST_DRIVE_URL } from "@/data/nav";
import { ChamferButton } from "./ui/ChamferButton";
import { Plate } from "./ui/Plate";

export function EndCta() {
  return (
    <section className="surface-light relative grid grid-cols-[1fr_1.6fr] grid-rows-[1fr_auto_auto_auto_1fr] gap-x-16 overflow-clip px-[max(var(--spacing-gutter),calc((100%_-_var(--container-page))_/_2))] py-section max-xl:grid-cols-1 max-xl:grid-rows-none max-xl:gap-y-0">
      <DissolveCanvas surface="light" />
      <ContourCanvas />
      <Plate
        {...END_CTA.image}
        sizes="(max-width: 1279px) 100vw, 60vw"
        reveal="figure"
        className="z-1 col-start-2 row-[1/-1] max-xl:col-start-1 max-xl:row-[4] max-xl:mt-12"
      />
      <SplitText as="h2" mode="words" className="h1 h1-dot relative z-1 col-start-1 row-start-2 max-xl:row-start-1">
        {END_CTA.title}
      </SplitText>
      <Reveal as="p" kind="copy" className="relative z-1 col-start-1 row-start-3 mt-5 text-lead max-xl:row-start-2">
        {END_CTA.lead}
      </Reveal>
      <Reveal kind="block" className="relative z-1 col-start-1 row-start-4 mt-10 flex flex-wrap gap-4 max-xl:row-start-3">
        <ChamferButton href={ORDER_URL} external>
          Өөрийнхөөрөө тохируулах
        </ChamferButton>
        <ChamferButton href={TEST_DRIVE_URL} external ghost>
          {TEST_DRIVE_LABEL}
        </ChamferButton>
      </Reveal>
    </section>
  );
}
