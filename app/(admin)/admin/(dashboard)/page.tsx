import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/AdminShell";
import { card, secondaryButton } from "@/components/admin/ui";
import { getAdminSession } from "@/lib/admin/auth";
import { ENTITIES } from "@/lib/admin/entities";

export const metadata: Metadata = { title: "Хянах самбар" };

export default async function AdminHomePage() {
  const { supabase, isAdmin, email } = await getAdminSession();
  if (!isAdmin) return null;

  const sections = await Promise.all(
    ENTITIES.map(async (entity) => {
      const { data, error } = await supabase.from(entity.table).select("published");
      const rows = (data ?? []) as { published: boolean }[];
      return { entity, total: rows.length, published: rows.filter((r) => r.published).length, error: error?.message };
    }),
  );

  return (
    <>
      <PageHeader title="Хянах самбар" description={`Сайн байна уу, ${email}`}>
        <a href="/" target="_blank" rel="noreferrer" className={secondaryButton}>
          Сайтыг харах ↗
        </a>
      </PageHeader>

      <ul className="grid gap-4 sm:grid-cols-3">
        {sections.map(({ entity, total, published, error }) => (
          <li key={entity.slug}>
            <Link
              href={`/admin/${entity.slug}`}
              className={`${card} group flex h-full flex-col p-5 transition hover:border-neutral-300 hover:shadow-sm`}
            >
              <span className="text-[13px] font-medium text-neutral-500">{entity.label}</span>
              {error ? (
                <span className="mt-3 text-xs text-red-600">Ачаалж чадсангүй: {error}</span>
              ) : (
                <>
                  <span className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{total}</span>
                  <span className="mt-1 text-xs text-neutral-500">{published} нь сайт дээр харагдаж байна</span>
                </>
              )}
              <span className="mt-5 text-[13px] font-medium text-ink group-hover:underline">Засах →</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className={`${card} mt-8 p-5 leading-relaxed text-neutral-600`}>
        <h2 className="mb-2 font-medium text-ink">Хэрхэн ажилладаг вэ</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Хадгалмагц нүүр хуудас шууд шинэчлэгдэнэ.</li>
          <li>«Сайт дээр харуулах»-ыг унтраавал устгалгүйгээр нууна.</li>
          <li>Дараалал: бага тоотой нь эхэнд харагдана.</li>
        </ul>
      </section>
    </>
  );
}
