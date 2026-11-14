"use client";

import { useActionState } from "react";
import { type SignInState, signIn } from "@/lib/admin/actions";
import { fieldError, input, label, primaryButton } from "./ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={label}>
          Имэйл
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          className={input}
          aria-invalid={state.error ? true : undefined}
        />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Нууц үг
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
          aria-invalid={state.error ? true : undefined}
        />
      </div>
      {state.error && (
        <p role="alert" className={fieldError}>
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${primaryButton} mt-2 w-full py-2.5`}>
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
