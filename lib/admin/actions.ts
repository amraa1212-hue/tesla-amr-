"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { type Entity, type Field, getEntity } from "@/lib/admin/entities";
import { isAllowedImageUrl, isAllowedLinkUrl } from "@/lib/admin/urls";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { ADMIN_HOME, LOGIN_PATH } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";

/* Auth ------------------------------------------------------------------------ */

export type SignInState = { error?: string; email?: string };

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Имэйл болон нууц үгээ оруулна уу.", email };
  if (!getSupabaseEnv()) return { error: "Supabase тохируулаагүй байна.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const message =
      error.code === "invalid_credentials"
        ? "Имэйл эсвэл нууц үг буруу байна."
        : error.code === "email_not_confirmed"
          ? "Имэйл хаяг баталгаажаагүй байна."
          : `Нэвтэрч чадсангүй: ${error.message}`;
    return { error: message, email };
  }
  redirect(ADMIN_HOME);
}

export async function signOut() {
  if (getSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect(LOGIN_PATH);
}

/* Content ----------------------------------------------------------------------- */

export type SaveState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Changes on every successful save, so forms can react to it. */
  savedAt?: number;
};

const MAX_TEXT = 300;
const MAX_LONG_TEXT = 2000;

function parseField(field: Field, formData: FormData): { value: string | number | boolean; error?: string } {
  const raw = formData.get(field.name);

  if (field.type === "checkbox") return { value: raw === "on" };
  if (field.type === "number") {
    const n = Number.parseInt(typeof raw === "string" ? raw : "", 10);
    if (Number.isNaN(n)) return { value: 0, error: "Тоо оруулна уу." };
    return { value: Math.max(-100000, Math.min(100000, n)) };
  }

  const value = typeof raw === "string" ? raw.trim() : "";
  if (field.required && !value) return { value, error: "Заавал бөглөнө." };
  const max = field.type === "textarea" ? MAX_LONG_TEXT : MAX_TEXT;
  if (value.length > max) return { value, error: `${max} тэмдэгтээс ихгүй байна.` };
  if (field.type === "image" && value && !isAllowedImageUrl(value)) {
    return { value, error: "Зургийг оруулах товчоор нэмнэ үү, эсвэл /assets/... замыг бичнэ үү." };
  }
  if (field.type === "link" && value && !isAllowedLinkUrl(value)) {
    return { value, error: "#, /зам эсвэл https://… хэлбэртэй байна." };
  }
  if (field.type === "select" && !field.options?.some((option) => option.value === value)) {
    return { value, error: "Жагсаалтаас сонгоно уу." };
  }
  return { value: field.type === "link" && !value ? "#" : value };
}

function revalidateContent() {
  revalidatePath("/");
  revalidatePath(ADMIN_HOME, "layout");
}

async function authorize(slug: string) {
  const entity = getEntity(slug);
  if (!entity) return { ok: false, error: "Тодорхойгүй төрөл." } as const;
  const session = await getAdminSession();
  if (!session.isAdmin) return { ok: false, error: "Танд админ эрх алга." } as const;
  return { ok: true, entity, supabase: session.supabase } as const;
}

/** Inserts a row when the form has no id, updates it otherwise. RLS re-checks admin rights. */
export async function saveRow(slug: string, prev: SaveState, formData: FormData): Promise<SaveState> {
  // Errors keep the last savedAt, so a form keyed on it is not reset.
  const fail = (message: string, fieldErrors?: Record<string, string>): SaveState => ({
    status: "error",
    message,
    fieldErrors,
    savedAt: prev.savedAt,
  });

  const auth = await authorize(slug);
  if (!auth.ok) return fail(auth.error);
  const { entity, supabase } = auth;

  const values: Record<string, string | number | boolean> = {};
  const fieldErrors: Record<string, string> = {};
  for (const field of entity.fields) {
    const { value, error } = parseField(field, formData);
    values[field.name] = value;
    if (error) fieldErrors[field.name] = error;
  }
  if (Object.keys(fieldErrors).length) return fail("Улаанаар тэмдэглэсэн талбаруудыг засна уу.", fieldErrors);

  const id = String(formData.get("id") ?? "");
  const { error } = id
    ? await supabase.from(entity.table).update(values).eq("id", id).select("id").single()
    : await supabase.from(entity.table).insert(values).select("id").single();
  if (error) return fail(describeDbError(entity, error.message));

  revalidateContent();
  return { status: "success", message: id ? "Хадгалагдлаа." : "Нэмэгдлээ.", savedAt: Date.now() };
}

export async function deleteRow(slug: string, id: string): Promise<{ error?: string }> {
  const auth = await authorize(slug);
  if (!auth.ok) return { error: auth.error };
  if (!id) return { error: "Мөр сонгогдоогүй." };

  const { data, error } = await auth.supabase.from(auth.entity.table).delete().eq("id", id).select("id");
  if (error) return { error: `Устгаж чадсангүй: ${error.message}` };
  if (!data.length) return { error: `Энэ ${auth.entity.singular} олдсонгүй, эсвэл устгах эрхгүй байна.` };

  revalidateContent();
  return {};
}

function describeDbError(entity: Entity, message: string) {
  // .single() on zero rows: the row is gone or RLS hid it.
  if (message.includes("0 rows") || message.includes("JSON object requested")) {
    return `Энэ ${entity.singular} олдсонгүй, эсвэл засах эрхгүй байна.`;
  }
  return `Хадгалж чадсангүй: ${message}`;
}
