"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { readCampaign } from "./CampaignCapture";
export default function PageAnalytics() {
  const path = usePathname();
  const visit = useRef<{ path: string; id: string; start: number } | null>(
    null,
  );
  useEffect(() => {
    if (
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl
    )
      return;
    let session: string;
    try {
      session = sessionStorage.getItem("silio-session") || crypto.randomUUID();
      sessionStorage.setItem("silio-session", session);
    } catch {
      return;
    }
    if (visit.current?.path !== path)
      visit.current = { path, id: crypto.randomUUID(), start: Date.now() };
    const { id, start } = visit.current;
    const campaign = readCampaign();
    let source = campaign.utm_source || "direct";
    if (source === "direct" && document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.origin !== location.origin) source = ref.hostname;
      } catch {}
    }
    const send = (data: object) =>
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    void send({
      type: "view",
      id,
      session,
      path,
      source,
      campaign: campaign.utm_campaign || "",
    });
    const duration = () => {
      void send({
        type: "duration",
        id,
        session,
        path,
        duration: Math.round((Date.now() - start) / 1000),
      });
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") duration();
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", duration);
    return () => {
      duration();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", duration);
    };
  }, [path]);
  return null;
}
