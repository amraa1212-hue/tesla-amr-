import { FOOTNOTES, SOURCE_URL } from "@/data/model3";

/** Light band that continues the end CTA. */
export function Footnotes() {
  return (
    <section className="surface-light relative px-gutter pb-20 text-eyebrow leading-[1.4]">
      <div className="relative z-1 mx-auto w-full max-w-page opacity-70">
        <ol className="mb-3 list-decimal pl-[1.4em]">
          {FOOTNOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ol>
        <p>
          Зурагт харуулсан машин нь зөвхөн жишээ бөгөөд бодит загвар өөр байж болно. Эх сурвалж:{" "}
          <a href={SOURCE_URL} target="_blank" rel="noopener" className="underline decoration-accent underline-offset-[.2em]">
            tesla.com/model3
          </a>{" "}
          (2026-11-13).
        </p>
      </div>
    </section>
  );
}
