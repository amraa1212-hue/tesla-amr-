import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { INTERIOR } from "@/data/model3";
import { Section, SectionHeader } from "./ui/Section";
import { SplitRow } from "./ui/SplitRow";

export function InteriorSection() {
  return (
    <Section surface="light" dissolve contour>
      <SectionHeader title={INTERIOR.title} description={INTERIOR.description} />
      <div className="flex flex-col gap-24">
        {INTERIOR.rows.map((row, i) => (
          <SplitRow key={row.title} image={row.image} reverse={i % 2 === 1}>
            <SplitText as="h3" mode="words" className="h3">
              {row.title}
            </SplitText>
            <Reveal as="p" kind="copy" className="max-w-lg text-lead">
              {row.text}
            </Reveal>
          </SplitRow>
        ))}
      </div>
    </Section>
  );
}
