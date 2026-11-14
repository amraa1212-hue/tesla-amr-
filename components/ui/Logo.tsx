import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <Link href="/" aria-label="Нүүр хуудас" className={cn("inline-flex h-9 items-center", className)}>
      <img className={imgClassName} src="/assets/icons/tesla-wordmark.svg" width={120} height={12} alt="" />
    </Link>
  );
}
