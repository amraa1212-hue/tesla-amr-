import { Reveal } from "@/components/motion/Reveal";
import { Slider } from "@/components/ui/Slider";
import { MEET, type Card } from "@/data/model3";
import { StackItem } from "./StackItem";
import { Plate } from "./ui/Plate";
import { Container, SectionHeader } from "./ui/Section";

function GalleryCard({ title, text, image }: Card) {
  return (
    <Reveal
      as="article"
      kind="item"
      className="flex flex-[0_0_22rem] snap-start flex-col gap-3 transition-opacity duration-700 ease-plate group-hover/track:not-hover:opacity-30 max-md:basis-[78vw]"
    >
      <Plate {...image} sizes="(max-width: 767px) 78vw, (max-width: 1279px) 352px, 25vw" aspect="aspect-[6/7]" className="mb-3" />
      <h3 className="text-title leading-none font-bold">{title}</h3>
      <p>{text}</p>
    </Reveal>
  );
}

export function MeetSection() {
  return (
    <StackItem surface="dark" dissolve innerClassName="px-gutter py-section">
      <Container>
        <SectionHeader eyebrow={MEET.eyebrow} title={MEET.title} description={MEET.description} />
        <Slider variant="model3" label="Model 3-ийн онцлогууд">
          {MEET.cards.map((card) => (
            <GalleryCard key={card.title} {...card} />
          ))}
        </Slider>
      </Container>
    </StackItem>
  );
}
