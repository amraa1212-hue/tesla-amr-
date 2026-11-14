/** Shared class names of the admin panel. */

export const input =
  "block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-ink shadow-xs outline-none transition placeholder:text-neutral-400 focus:border-ink focus:ring-3 focus:ring-ink/10 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

export const label = "mb-1.5 block text-[13px] font-medium text-neutral-700";

export const hint = "mt-1.5 text-xs text-neutral-500";

export const fieldError = "mt-1.5 text-xs text-red-600";

const button =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-60";

export const primaryButton = `${button} bg-ink text-white hover:bg-neutral-700`;
export const secondaryButton = `${button} border border-neutral-300 bg-white text-ink hover:bg-neutral-100`;
export const dangerButton = `${button} text-red-600 hover:bg-red-50`;

export const card = "rounded-xl border border-neutral-200 bg-white shadow-xs";
