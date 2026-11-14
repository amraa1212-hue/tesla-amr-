import Image from "next/image";
import type { Cta } from "@/data/home";
import { Button, h2, Section } from "./ui";

/** Copy and a button beside an image; stacks below 992px. */
export function CtaCard({ title, text, image }: Cta) {
  return (
    <Section>
      <div className="flex overflow-hidden bg-surface max-lg:flex-col">
        <div className="flex min-w-0 flex-[1_1_0] flex-col items-start justify-center gap-8 p-12 max-lg:p-8">
          <div className="flex flex-col gap-6">
            <h2 className={h2}>{title}</h2>
            <p className="text-medium">{text}</p>
          </div>
          <Button href="#">Дэлгэрэнгүй</Button>
        </div>
        <div className="relative min-w-0 flex-[1_1_0] max-lg:aspect-[4/3] max-lg:flex-none">
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 991px) 100vw, 640px" className="object-cover" />
        </div>
      </div>
    </Section>
  );
}
