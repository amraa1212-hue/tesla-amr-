import { Button, h1, MediaCover } from "./ui";

export function Hero() {
  return (
    <section className="relative h-[900px] overflow-hidden px-page text-white max-lg:h-[720px] max-md:h-[560px]">
      <MediaCover
        src="/assets/images/hero-model-3.jpg"
        width={1600}
        height={679}
        alt="Мөнгөлөг Tesla Model 3 уулархаг замаар явж байна"
        sizes="100vw"
        preload
      />
      <div className="relative mx-auto flex max-w-[542px] flex-col items-center pt-[60px] text-center">
        <div className="flex flex-col gap-6">
          <h1 className={h1}>Model 3</h1>
          <p className="text-medium">1.99% APR available</p>
        </div>
        <div className="mt-[59px] flex flex-wrap justify-center gap-4 max-md:mt-10">
          <Button href="/model3">Button</Button>
          <Button href="#" variant="secondary">
            Button
          </Button>
        </div>
      </div>
    </section>
  );
}
