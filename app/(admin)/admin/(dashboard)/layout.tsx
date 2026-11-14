import type { ReactNode } from "react";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/admin/auth";

/** proxy.ts lets only signed-in users through; this also requires admin rights. */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { email, isAdmin, checkError } = await getAdminSession();
  if (!isAdmin) return <AccessDenied email={email} detail={checkError} />;
  return <AdminShell email={email}>{children}</AdminShell>;
}
