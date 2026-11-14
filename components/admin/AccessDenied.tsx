import { signOut } from "@/lib/admin/actions";
import { card, secondaryButton } from "./ui";

/** Signed in, but the database does not list this user as an admin. */
export function AccessDenied({ email, detail }: { email: string; detail?: string }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className={`${card} w-full max-w-md p-6 sm:p-8`}>
        <h1 className="text-lg font-semibold tracking-tight">Хандах эрхгүй</h1>
        <p className="mt-2 leading-relaxed text-neutral-600">
          <span className="font-medium text-ink">{email || "Энэ хэрэглэгч"}</span> админ эрхгүй байна. Админ эрх
          зөвхөн баталгаажсан, зөвшөөрөгдсөн имэйлтэй хэрэглэгчид олгогдоно.
        </p>
        {detail && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            Эрх шалгаж чадсангүй: {detail}. Supabase migration ажилласан эсэхийг шалгана уу.
          </p>
        )}
        <form action={signOut} className="mt-6">
          <button type="submit" className={secondaryButton}>
            Өөр хэрэглэгчээр нэвтрэх
          </button>
        </form>
      </div>
    </main>
  );
}
