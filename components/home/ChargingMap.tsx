import Image from "next/image";
import { cn } from "@/lib/cn";
import { h1 } from "./ui";

export function ChargingMap() {
  return (
    <section className="overflow-hidden bg-background">
      <div className="px-gutter py-section-lg">
        <div className="mx-auto w-full max-w-page">
          <h2 className={cn(h1, "max-w-[768px]")}>Цэнэглэх цэг</h2>
        </div>
      </div>
      <Image
        className="aspect-[1440/810] h-auto w-full object-cover"
        src="/assets/images/charging-map.png"
        width={2560}
        height={1012}
        alt="АНУ дахь Tesla цэнэглэх цэгүүдийн газрын зураг"
        sizes="100vw"
      />
    </section>
  );
}
