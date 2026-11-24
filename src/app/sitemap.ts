import type { MetadataRoute } from "next";
import { servicePages } from "@/lib/service-pages";
import { site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["en", "hi"].flatMap((lang) =>
    [
      "",
      "/services",
      "/pricing",
      "/contact",
      "/privacy",
      "/demos",
      "/estimate",
      "/review",
      "/portfolio",
      "/services/3d-design-printing",
      ...servicePages.map((p) => `/services/${p.slug}`),
    ].map((path) => ({
      url: `${site.url}/${lang}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: {
          en: `${site.url}/en${path}`,
          hi: `${site.url}/hi${path}`,
          "x-default": `${site.url}/en${path}`,
        },
      },
    })),
  );
}
