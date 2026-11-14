import { AUTONOMY } from "@/data/model3";
import { FeatureItem } from "./ui/FeatureItem";
import { Section, SectionHeader } from "./ui/Section";

export function AutonomySection() {
  return (
    <Section surface="light" contour>
      <SectionHeader title={AUTONOMY.title} description={AUTONOMY.description} />
      <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
        {AUTONOMY.items.map((item) => (
          <FeatureItem key={item.title} {...item} className="p-6" />
        ))}
      </div>
    </Section>
  );
}
