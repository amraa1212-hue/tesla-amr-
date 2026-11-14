import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { COMPARE_URL, ORDER_URL, TRIMS_TITLE, VARIANTS, type Variant } from "@/data/model3";
import { StackItem } from "./StackItem";
import { BracketStat } from "./ui/Bracket";
import { ChamferButton } from "./ui/ChamferButton";
import { Plate } from "./ui/Plate";
import { Container, SectionHeader } from "./ui/Section";
import { TabList, TabPanel, Tabs } from "./ui/Tabs";

function TrimPanel({ trim }: { trim: Variant["trim"] }) {
  return (
    <>
      <Plate {...trim.image} sizes="(max-width: 1440px) 100vw, 67vw" reveal="figure" aspect="aspect-[16/5.5]" className="w-full" />
      <div className="flex flex-col items-center gap-4">
        <SplitText as="h3" mode="words" className="h3">
          {trim.name}
        </SplitText>
        <Reveal as="p" kind="copy" className="text-lead">
          {trim.price}
          <sup>1</sup>
        </Reveal>
      </div>
      <dl className="grid grid-cols-[repeat(3,13.625rem)] gap-6 text-left max-xl:grid-cols-[repeat(3,minmax(0,13.625rem))] max-md:w-full max-md:grid-cols-1">
        {trim.stats.map((stat) => (
          <BracketStat key={stat.label} {...stat} panel />
        ))}
      </dl>
      <Reveal kind="block" className="flex flex-wrap justify-center gap-5">
        <ChamferButton href={ORDER_URL} external>
          Захиалах
        </ChamferButton>
        <ChamferButton href={COMPARE_URL} external ghost>
          Загвар харьцуулах
        </ChamferButton>
      </Reveal>
    </>
  );
}

export function TrimsSection() {
  return (
    <StackItem id="trims" surface="light" dissolve contour="light" innerClassName="px-gutter py-section">
      <Container>
        <Tabs idPrefix="trim" defaultValue={VARIANTS[0].id}>
          <SectionHeader title={TRIMS_TITLE} center>
            <TabList label="Хувилбар" reveal="block" tabs={VARIANTS.map((v) => ({ value: v.id, label: v.tab }))} />
          </SectionHeader>
          {VARIANTS.map((v) => (
            <TabPanel key={v.id} value={v.id} className="flex flex-col items-center gap-10 text-center">
              <TrimPanel trim={v.trim} />
            </TabPanel>
          ))}
        </Tabs>
      </Container>
    </StackItem>
  );
}
