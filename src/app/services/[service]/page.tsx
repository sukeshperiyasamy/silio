import { redirect, notFound } from "next/navigation";
import { servicePages } from "@/lib/service-pages";
export default async function ServiceRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ service: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { service } = await params;
  if (
    service !== "3d-design-printing" &&
    !servicePages.some((p) => p.slug === service)
  )
    notFound();
  const query = await searchParams;
  const campaign = new URLSearchParams();
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const value = query[key];
    if (typeof value === "string") campaign.set(key, value.slice(0, 120));
  }
  redirect(
    `/en/services/${service}${campaign.size ? "?" + campaign.toString() : ""}`,
  );
}
