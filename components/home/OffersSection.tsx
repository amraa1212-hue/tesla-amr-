import { Slider } from "@/components/ui/Slider";
import type { Offer } from "@/data/home";
import { h2, MediaCover, Section } from "./ui";

function OfferCard({ image, tag, quote, title, subtitle, logo }: Offer) {
  const copy = "relative font-alt text-medium leading-normal";
  return (
    <article className="relative flex h-[560px] flex-[0_0_608px] snap-start flex-col justify-end gap-6 overflow-hidden p-8 text-white max-lg:h-[480px] max-lg:basis-[min(608px,80vw)] max-md:h-[420px] max-md:basis-[85vw] max-md:p-6">
      <MediaCover {...image} sizes="(max-width: 767px) 85vw, 608px" />
      {tag ? <p className={`${copy} mb-auto`}>{tag}</p> : <p className={copy}>{quote}</p>}
      <div className="relative flex items-end gap-6">
        <div className="min-w-0 flex-[1_1_0]">
          <h3 className="text-regular leading-normal font-semibold">{title}</h3>
          <p>{subtitle}</p>
        </div>
        <img className="shrink-0" src={logo} width={120} height={48} alt="" />
      </div>
    </article>
  );
}

export function OffersSection({ offers }: { offers: Offer[] }) {
  if (!offers.length) return null;
  return (
    <Section>
      <div className="mb-20 flex max-w-[768px] flex-col gap-6 max-lg:mb-12">
        <h2 className={h2}>Одоогийн урамшуулал</h2>
        <p className="text-medium">Tesla машинуудын хязгаартай хугацааны урамшууллуудтай танилцаарай.</p>
      </div>
      <Slider variant="home" label="Урамшууллууд">
        {offers.map((offer, i) => (
          <OfferCard key={i} {...offer} />
        ))}
      </Slider>
    </Section>
  );
}
