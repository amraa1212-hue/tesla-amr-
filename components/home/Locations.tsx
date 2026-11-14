import { CHARGING_STATS } from "@/data/home";
import { Button, h2, Section } from "./ui";

/** "My location": copy and actions beside the charger counts. */
export function Locations() {
  return (
    <Section containerClassName="flex items-center gap-20 max-lg:flex-col max-lg:items-stretch max-lg:gap-12">
      <div className="flex min-w-0 flex-[0_1_616px] flex-col items-start gap-8 max-lg:flex-none">
        <div className="flex flex-col gap-6">
          <h2 className={h2}>Миний байршил</h2>
          <p className="text-medium">Таны ойролцоох Tesla Supercharger болон Destination Charger-ийн сүлжээг үзээрэй.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Button href="#" variant="secondary">
            Очих газрын цэнэглэгч
          </Button>
          <Button href="#" variant="link">
            Дэлгэрэнгүй
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_0] flex-col gap-12">
        {CHARGING_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 border-l border-border pl-8 max-md:pl-6">
            <p className="font-alt text-stat leading-[1.3] font-bold">{stat.value}</p>
            <p className="font-heading text-h6 leading-[1.4] tracking-[-0.01em]">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
