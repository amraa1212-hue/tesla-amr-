"use client";

import { type FormEvent, startTransition, useActionState, useId, useMemo, useState, useTransition } from "react";
import { deleteRow, type SaveState, saveRow } from "@/lib/admin/actions";
import type { Entity, Field, Row } from "@/lib/admin/entities";
import { ImageField } from "./ImageField";
import { dangerButton, fieldError, hint, input, label, primaryButton } from "./ui";

const INITIAL: SaveState = { status: "idle" };

/** Edits `row`, or creates a new row when it is omitted. */
export function RowForm({ entity, row }: { entity: Entity; row?: Row }) {
  const action = useMemo(() => saveRow.bind(null, entity.slug), [entity.slug]);
  const [state, formAction, saving] = useActionState(action, INITIAL);
  const [deleting, startDelete] = useTransition();
  const [deleteError, setDeleteError] = useState<string>();
  const uid = useId();

  // Submitting through a transition skips React's automatic form reset, so
  // input survives a failed save.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  function onDelete() {
    if (!row) return;
    const name = String(row[entity.titleField] ?? "").trim();
    if (!confirm(name ? `«${name}»-г устгах уу?` : "Энэ мөрийг устгах уу?")) return;
    setDeleteError(undefined);
    startDelete(async () => {
      const { error } = await deleteRow(entity.slug, row.id);
      if (error) setDeleteError(error);
    });
  }

  const values = row ?? entity.defaults;
  const message = deleteError ?? state.message;
  const failed = Boolean(deleteError) || state.status === "error";

  return (
    <form onSubmit={onSubmit}>
      {row && <input type="hidden" name="id" value={row.id} />}

      {/* A new-row form starts empty again after each successful save */}
      <div key={row ? "row" : (state.savedAt ?? 0)} className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {entity.fields.map((field) => (
          <FieldControl
            key={field.name}
            field={field}
            id={`${uid}-${field.name}`}
            value={values[field.name]}
            error={state.fieldErrors?.[field.name]}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-5">
        <button type="submit" disabled={saving || deleting} className={primaryButton}>
          {saving ? "Хадгалж байна…" : row ? "Хадгалах" : "Нэмэх"}
        </button>
        {message && (
          <p role="status" className={failed ? "text-[13px] text-red-600" : "text-[13px] text-emerald-700"}>
            {message}
          </p>
        )}
        {row && (
          <button type="button" onClick={onDelete} disabled={saving || deleting} className={`${dangerButton} ml-auto`}>
            {deleting ? "Устгаж байна…" : "Устгах"}
          </button>
        )}
      </div>
    </form>
  );
}

function FieldControl({ field, id, value, error }: { field: Field; id: string; value: unknown; error?: string }) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = (error ? errorId : field.hint && hintId) || undefined;
  const common = {
    id,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  } as const;

  if (field.type === "checkbox") {
    return (
      <div className="flex items-center sm:col-span-2">
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3 select-none">
          <input id={id} name={field.name} type="checkbox" defaultChecked={value === true} className="peer sr-only" />
          <span className="relative h-5 w-9 shrink-0 rounded-full bg-neutral-300 transition peer-checked:bg-ink peer-focus-visible:ring-3 peer-focus-visible:ring-ink/20 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-4" />
          <span className="font-medium text-neutral-700">{field.label}</span>
        </label>
      </div>
    );
  }

  const str = typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
  let control;
  switch (field.type) {
    case "image":
      control = (
        <ImageField
          id={id}
          name={field.name}
          defaultValue={str}
          required={field.required}
          invalid={Boolean(error)}
          describedBy={describedBy}
        />
      );
      break;
    case "textarea":
      control = <textarea {...common} rows={4} defaultValue={str} className={`${input} resize-y`} />;
      break;
    case "number":
      control = <input {...common} type="number" step={1} inputMode="numeric" defaultValue={str} className={input} />;
      break;
    case "select":
      control = (
        <select {...common} defaultValue={str} className={input}>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    default:
      control = <input {...common} type="text" defaultValue={str} className={input} />;
  }

  return (
    <div className={field.wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className={label}>
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      {control}
      {field.hint && !error && (
        <p id={hintId} className={hint}>
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={fieldError}>
          {error}
        </p>
      )}
    </div>
  );
}
