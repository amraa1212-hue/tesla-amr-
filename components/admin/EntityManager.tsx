import type { Entity, Row } from "@/lib/admin/entities";
import { PageHeader } from "./AdminShell";
import { RowForm } from "./RowForm";
import { card } from "./ui";

function Chevron() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="size-4 shrink-0 text-neutral-400 transition group-open:rotate-180"
      aria-hidden
    >
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Нийтлэгдсэн
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
      <span className="size-1.5 rounded-full bg-neutral-400" />
      Нуусан
    </span>
  );
}

const str = (value: unknown) => (typeof value === "string" ? value : "");

/** List of rows that expand into edit forms, plus a form for a new row. */
export function EntityManager({ entity, rows, error }: { entity: Entity; rows: Row[]; error?: string }) {
  return (
    <>
      <PageHeader title={entity.label} description={entity.description}>
        <p className="text-neutral-500 tabular-nums">
          {rows.filter((row) => row.published).length} / {rows.length} нийтлэгдсэн
        </p>
      </PageHeader>

      {error && (
        <p role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          Ачаалж чадсангүй: {error}
        </p>
      )}

      <details className={`${card} group mb-8 border-dashed`}>
        <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 font-medium select-none">
          <span className="flex size-6 items-center justify-center rounded-md bg-ink text-white" aria-hidden>
            +
          </span>
          <span className="flex-1">Шинэ {entity.singular} нэмэх</span>
          <Chevron />
        </summary>
        <div className="border-t border-neutral-200 px-5 py-6">
          <RowForm entity={entity} />
        </div>
      </details>

      {rows.length === 0 && !error ? (
        <p className="rounded-xl border border-neutral-200 bg-white px-5 py-10 text-center text-neutral-500">
          Одоогоор {entity.singular} алга. Дээрх товчоор нэмнэ үү.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => {
            const title = str(row[entity.titleField]);
            const subtitle = entity.subtitleField ? str(row[entity.subtitleField]) : "";
            const image = entity.imageField ? str(row[entity.imageField]) : "";
            return (
              <li key={row.id}>
                <details className={`${card} group`}>
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-3 select-none sm:px-5">
                    {entity.imageField && (
                      <span className="h-11 w-18 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        {image && <img src={image} alt="" className="size-full object-cover" />}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{title || "(гарчиггүй)"}</span>
                      {subtitle && <span className="block truncate text-neutral-500">{subtitle}</span>}
                    </span>
                    <StatusBadge published={row.published} />
                    <span className="hidden w-10 text-right text-xs text-neutral-400 tabular-nums sm:block">
                      #{row.position}
                    </span>
                    <Chevron />
                  </summary>
                  <div className="border-t border-neutral-200 px-4 py-6 sm:px-5">
                    <RowForm entity={entity} row={row} />
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
