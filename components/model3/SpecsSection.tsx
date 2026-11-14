import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { SPECS_TITLE, VARIANTS, type Variant } from "@/data/model3";
import { Plate } from "./ui/Plate";
import { Section } from "./ui/Section";
import { SpecList } from "./ui/SpecList";
import { StatPlate } from "./ui/StatPlate";
import { TabList, TabPanel, Tabs } from "./ui/Tabs";

function SpecGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal kind="item" className="flex flex-col gap-5 border-t border-border-on-dark py-8 first:border-t-0 first:pt-0">
      <h3 className="text-title leading-none font-bold">{title}</h3>
      {children}
    </Reveal>
  );
}

function SpecPanel({ specs }: { specs: Variant["specs"] }) {
  return (
    <>
      <Plate
        {...specs.image}
        sizes="(max-width: 1279px) 100vw, 50vw"
        contain
        reveal="figure"
        position="sticky max-xl:relative"
        aspect="aspect-[16/7.5]"
        className="top-8 max-xl:top-auto"
      />
      <div className="flex flex-col">
        {specs.groups.map((group) => (
          <SpecGroup key={group.title} title={group.title}>
            <SpecList items={group.items} />
          </SpecGroup>
        ))}
        <Reveal kind="item" className="flex flex-col items-end gap-5 py-8">
          <h3 className="text-eyebrow leading-none font-medium text-accent">Баталгаа</h3>
          <StatPlate>
            <SpecList items={specs.warranty} plate />
          </StatPlate>
        </Reveal>
      </div>
    </>
  );
}

export function SpecsSection() {
  return (
    <Section id="specs" surface="dark" dissolve>
      <Tabs idPrefix="spec" defaultValue={VARIANTS[0].id}>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <SplitText as="h2" mode="words" className="h2 mb-0">
            {SPECS_TITLE}
          </SplitText>
          <TabList label="Хувилбарын үзүүлэлт" reveal="block" tabs={VARIANTS.map((v) => ({ value: v.id, label: v.tab }))} />
        </div>
        {VARIANTS.map((v) => (
          <TabPanel
            key={v.id}
            value={v.id}
            className="grid grid-cols-[1.1fr_1fr] items-start gap-20 max-xl:grid-cols-1 max-xl:gap-10"
          >
            <SpecPanel specs={v.specs} />
          </TabPanel>
        ))}
      </Tabs>
    </Section>
  );
}
