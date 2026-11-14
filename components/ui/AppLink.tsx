import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type AppLinkProps = ComponentPropsWithoutRef<"a"> & { href: string };

/** next/link for routes of this app ("/..."), a plain <a> for "#" and external URLs. */
export function AppLink({ href, ...props }: AppLinkProps) {
  if (href.startsWith("/")) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}
