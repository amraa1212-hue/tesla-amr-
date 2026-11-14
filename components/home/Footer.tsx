import { AppLink } from "@/components/ui/AppLink";
import { Logo } from "@/components/ui/Logo";
import { COPYRIGHT, FOOTER_LINKS, LEGAL_LINKS } from "@/data/nav";

export function Footer() {
  return (
    <footer className="bg-background px-gutter py-section-md">
      <div className="mx-auto flex w-full max-w-page flex-col items-center gap-20 max-md:gap-12">
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          <Logo className="justify-center" imgClassName="h-auto w-[120px]" />
          <ul className="flex flex-wrap justify-center gap-8 text-small font-semibold">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <AppLink href={link.href} className="hover:opacity-70">
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col gap-8">
          <img className="h-px w-full" src="/assets/icons/divider.svg" width={1280} height={1} alt="" />
          <div className="flex justify-between gap-6 text-small max-md:flex-col-reverse max-md:items-center max-md:text-center">
            <p>{COPYRIGHT}</p>
            <ul className="flex flex-wrap gap-6 max-md:justify-center">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="underline hover:opacity-70">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
