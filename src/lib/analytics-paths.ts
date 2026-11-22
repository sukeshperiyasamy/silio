import { servicePages } from "./service-pages";
export const trackedPaths = new Set(
  ["en", "hi"].flatMap((lang) =>
    [
      "",
      "/services",
      "/pricing",
      "/contact",
      "/review",
      "/estimate",
      "/demos",
      "/about",
      "/portfolio",
      "/privacy",
      "/services/3d-design-printing",
      ...servicePages.map((p) => `/services/${p.slug}`),
    ].map((path) => `/${lang}${path}`),
  ),
);
