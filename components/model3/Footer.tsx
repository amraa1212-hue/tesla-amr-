import { ContourCanvas } from "@/components/motion/ContourCanvas";
import { SplitText } from "@/components/motion/SplitText";
import { AppLink } from "@/components/ui/AppLink";
import { Logo } from "@/components/ui/Logo";
import { COPYRIGHT, FOOTER_LINKS, LEGAL_LINKS } from "@/data/nav";

export function Footer() {
  return (
    <footer className="bg-accent p-[1.1111cqw] @container">
      <div className="surface-dark relative overflow-hidden px-gutter pt-20 pb-10">
        <ContourCanvas variant="dark" />
        <div className="relative z-1 mx-auto flex w-full max-w-page flex-col gap-24">
          <div className="grid grid-cols-[1fr_auto] items-start gap-8 max-md:grid-cols-1">
            <Logo
              className="col-start-2 row-start-1 justify-self-end max-md:col-start-1 max-md:justify-self-start"
              imgClassName="w-30 invert"
            />
            <ul className="col-start-1 row-start-1 flex flex-col gap-[.35rem] font-display text-display leading-[.95] font-bold max-md:row-start-2 max-md:text-[2.25rem]">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <AppLink href={link.href} className="transition-colors duration-150 ease-entrance hover:text-accent">
                    <SplitText mode="chars">{link.label}</SplitText>
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <img className="h-px w-full opacity-50 invert" src="/assets/icons/divider.svg" width={1280} height={1} alt="" />
            <div className="flex justify-between gap-6 text-eyebrow max-md:flex-col-reverse">
              <p className="text-on-dark-faint">{COPYRIGHT}</p>
              <ul className="flex flex-wrap gap-6">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition-colors duration-150 ease-entrance hover:text-accent">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
