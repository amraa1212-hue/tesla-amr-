import type { ReactNode } from "react";
import { Button, h2, MediaCover, Section } from "./ui";

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 flex-[1_1_0] flex-col gap-2">
      <p className="font-heading text-h2 leading-[1.2] tracking-[-0.01em]">{value}</p>
      {/* Keeps both labels on the same baseline when the values wrap differently */}
      <p className="mt-auto">{label}</p>
    </div>
  );
}

/** Full Self-Driving: stats beside a video lightbox. */
export function FsdFeature() {
  return (
    <Section containerClassName="grid grid-cols-2 items-center gap-20 max-lg:grid-cols-1 max-lg:gap-12">
      <div className="flex flex-col items-start gap-8">
        <h2 className={h2}>Бүрэн бие даасан жолоодлого (хяналттай)</h2>

        <div className="flex w-full gap-6 py-2 max-md:flex-col">
          <Stat value="7x" label="Бага мөргөлдөөн" />
          <Stat
            value={
              <>
                17,034,842,
                <wbr />
                565
              </>
            }
            label="Миль туулсан"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Button href="#" variant="secondary">
            Туршилт товлох
          </Button>
          <Button href="#" variant="link">
            Дэлгэрэнгүй
          </Button>
        </div>
      </div>

      <button
        type="button"
        aria-label="Видео тоглуулах"
        className="group relative grid aspect-[600/640] w-full place-items-center overflow-hidden"
      >
        <MediaCover
          as="span"
          src="/assets/images/fsd-video.png"
          width={1440}
          height={1440}
          alt=""
          sizes="(max-width: 991px) 100vw, 50vw"
        />
        <img
          className="relative transition-transform duration-200 ease-[ease] group-hover:scale-[1.08]"
          src="/assets/icons/play-button.svg"
          width={64}
          height={64}
          alt=""
        />
      </button>
    </Section>
  );
}
