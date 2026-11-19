"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const campaignKey = "silio-campaign";
const keys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
export function readCampaign(): Record<string, string> {
  try {
    const value = JSON.parse(sessionStorage.getItem(campaignKey) || "{}");
    return value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(
          Object.entries(value)
            .filter(
              ([key, v]) =>
                keys.includes(key as (typeof keys)[number]) &&
                typeof v === "string",
            )
            .map(([key, v]) => [key, String(v).slice(0, 120)]),
        )
      : {};
  } catch {
    return {};
  }
}
export default function CampaignCapture() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const query = new URLSearchParams(window.location.search);
      const campaign = Object.fromEntries(
        keys.flatMap((key) => {
          const value = query.get(key);
          return value ? [[key, value.slice(0, 120)]] : [];
        }),
      );
      if (Object.keys(campaign).length)
        sessionStorage.setItem(campaignKey, JSON.stringify(campaign));
    } catch {
      /* Enquiries still work if browser storage is disabled. */
    }
  }, [pathname]);
  return null;
}
