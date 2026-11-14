import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { card } from "@/components/admin/ui";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Нэвтрэх" };

export default function LoginPage() {
  const configured = Boolean(getSupabaseEnv());

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src="/assets/icons/tesla-wordmark.svg" width={140} height={14} alt="Tesla" />
          <span className="rounded-full bg-neutral-200/70 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
            Админ самбар
          </span>
        </div>

        <div className={`${card} p-6 sm:p-8`}>
          <h1 className="text-lg font-semibold tracking-tight">Нэвтрэх</h1>
          <p className="mt-1 mb-6 text-neutral-500">Сайтын агуулгыг засахын тулд нэвтэрнэ үү.</p>
          {configured ? (
            <LoginForm />
          ) : (
            <div className="rounded-lg bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900">
              Supabase тохируулаагүй байна. <code className="font-mono">.env.local</code> файлд{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> болон{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>-г оруулаад серверээ дахин
              асаана уу.
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-neutral-500">
          <Link href="/" className="hover:text-ink">
            ← Сайт руу буцах
          </Link>
        </p>
      </div>
    </main>
  );
}
