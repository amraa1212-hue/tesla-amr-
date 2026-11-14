import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityManager } from "@/components/admin/EntityManager";
import { getAdminSession } from "@/lib/admin/auth";
import { getEntity, type Row } from "@/lib/admin/entities";

type Props = { params: Promise<{ entity: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { entity } = await params;
  return { title: getEntity(entity)?.label ?? "Олдсонгүй" };
}

export default async function EntityPage({ params }: Props) {
  const entity = getEntity((await params).entity);
  if (!entity) notFound();

  const { supabase, isAdmin } = await getAdminSession();
  if (!isAdmin) return null;

  const { data, error } = await supabase
    .from(entity.table)
    .select("*")
    .order("position")
    .order("created_at");

  return <EntityManager entity={entity} rows={(data ?? []) as Row[]} error={error?.message} />;
}
