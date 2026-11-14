import { CONNECTED } from "@/data/model3";
import { FeatureStrip } from "./FeatureStrip";
import { Section, SectionHeader } from "./ui/Section";

export function ConnectedSection() {
  return (
    <Section surface="dark" dissolve>
      <SectionHeader title={CONNECTED.title} description={CONNECTED.description} />
      <FeatureStrip items={CONNECTED.items} />
    </Section>
  );
}
