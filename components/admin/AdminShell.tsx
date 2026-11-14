import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/lib/admin/actions";
import { ENTITIES } from "@/lib/admin/entities";
import { NavLinks } from "./NavLinks";
import { secondaryButton } from "./ui";

const NAV = [{ href: "/admin", label: "Хянах самбар" }, ...ENTITIES.map((e) => ({ href: `/admin/${e.slug}`, label: e.label }))];

/** Sidebar on large screens, a top bar with scrolling tabs below 1024px. */
export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:flex">
      <aside className="sticky top-0 z-10 border-b border-neutral-200 bg-white lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-3 lg:px-5 lg:pt-6 lg:pb-6">
          <Link href="/admin" className="flex items-center gap-2.5" aria-label="Админ самбар">
            <img src="/assets/icons/tesla-wordmark.svg" width={96} height={10} alt="" />
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              Админ
            </span>
          </Link>
          <form action={signOut} className="lg:hidden">
            <button type="submit" className="text-neutral-500 hover:text-ink">
              Гарах
            </button>
          </form>
        </div>

        <nav aria-label="Админ цэс" className="px-3 pb-3 lg:flex-1">
          <NavLinks items={NAV} />
        </nav>

        <div className="hidden border-t border-neutral-200 p-4 lg:block">
          <p className="truncate text-xs text-neutral-500" title={email}>
            {email}
          </p>
          <div className="mt-3 flex gap-2">
            <a href="/" target="_blank" rel="noreferrer" className={`${secondaryButton} flex-1 px-3`}>
              Сайт ↗
            </a>
            <form action={signOut} className="flex-1">
              <button type="submit" className={`${secondaryButton} w-full px-3`}>
                Гарах
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1.5 text-neutral-500">{description}</p>}
      </div>
      {children}
    </header>
  );
}
