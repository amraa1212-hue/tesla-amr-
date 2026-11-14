import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { SAFETY, SAFETY_URL } from "@/data/model3";
import { Section } from "./ui/Section";
import { SplitRow } from "./ui/SplitRow";
import { TextButton } from "./ui/TextButton";

export function SafetySection() {
  return (
    <Section surface="light" dissolve contour>
      <SplitRow image={SAFETY.image}>
        <SplitText as="h2" mode="words" className="h2 mb-4">
          {SAFETY.title}
        </SplitText>
        {SAFETY.paragraphs.map((text) => (
          <Reveal key={text} as="p" kind="copy" className="max-w-lg text-lead">
            {text}
          </Reveal>
        ))}
        <TextButton href={SAFETY_URL} external>
          Дэлгэрэнгүй
        </TextButton>
      </SplitRow>
    </Section>
  );
}
