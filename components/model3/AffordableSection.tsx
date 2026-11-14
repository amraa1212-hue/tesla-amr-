import { Reveal } from "@/components/motion/Reveal";
import { AFFORDABLE } from "@/data/model3";
import { Plate } from "./ui/Plate";
import { Section, SectionHeader } from "./ui/Section";

export function AffordableSection() {
  return (
    // Sits above the sticky stack it scrolls over
    <Section surface="dark" dissolve className="z-20">
      <SectionHeader title={AFFORDABLE.title} description={AFFORDABLE.description} />
      <Plate {...AFFORDABLE.image} sizes="(max-width: 1440px) 100vw, 67vw" reveal="figure" aspect="aspect-[2/1]" className="mb-16 w-full" />
      <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
        {AFFORDABLE.cards.map((card) => (
          <Reveal key={card.title} as="article" kind="item" className="flex flex-col gap-3">
            <Plate {...card.image} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className="mb-3" />
            <h3 className="text-title leading-none font-bold">{card.title}</h3>
            <p>{card.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
