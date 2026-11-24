import type { Metadata } from "next";
import { site } from "./site";
const descriptions: Record<string, [string, string]> = {
  "/services": [
    "Explore website, web application and mobile app development services. Compare starting prices, scope and preparation, then request a project estimate.",
    "वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप डेवलपमेंट सेवाएँ देखें। शुरुआती कीमत, काम का दायरा और तैयारी समझकर प्रोजेक्ट का अनुमान माँगें।",
  ],
  "/privacy": [
    "Learn how Silio handles enquiry details, estimate callback requests, optional model files and first-party page analytics, and how to request data correction or deletion.",
    "जानें कि Silio पूछताछ, अनुमान के लिए संपर्क जानकारी, मॉडल फ़ाइल और अपनी साइट के आँकड़ों का उपयोग कैसे करता है और सुधार या हटाने का अनुरोध कैसे करें।",
  ],
};
export function pageMetadata(
  lang: string,
  path: string,
  meta: Metadata,
): Metadata {
  const hi = lang === "hi",
    locale = hi ? "hi" : "en";
  const title =
    typeof meta.title === "string"
      ? meta.title
      : "Silio | Website & App Development";
  const description =
    meta.description ||
    descriptions[path]?.[hi ? 1 : 0] ||
    (hi
      ? "Silio के साथ अपना डिजिटल प्रोजेक्ट शुरू करें। सेवाएँ और काम का दायरा जानें, फिर अपनी ज़रूरत बताएँ।"
      : "Start your digital project with Silio. Explore practical services, clear scope and starting prices, then discuss your requirements.");
  const url = `${site.url}/${locale}${path}`;
  const images = [
    {
      url: `${site.url}/social-card${hi ? "-hi" : ""}.png`,
      width: 1200,
      height: 630,
      alt: hi
        ? "Silio — वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप डेवलपमेंट"
        : "Silio — Website, Web Application & Mobile App Development",
    },
  ];
  return {
    ...meta,
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${site.url}/en${path}`,
        hi: `${site.url}/hi${path}`,
        "x-default": `${site.url}/en${path}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Silio",
      title,
      description,
      url,
      locale: hi ? "hi_IN" : "en_IN",
      alternateLocale: hi ? ["en_IN"] : ["hi_IN"],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [images[0].url],
    },
  };
}
export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: "Silio",
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    description:
      "Website, web application and mobile app development, with supporting digital and design services.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+91${site.phone}`,
      contactType: "sales",
      ...(!site.email.endsWith(".example") ? { email: site.email } : {}),
      availableLanguage: ["English", "Hindi"],
    },
  };
}

const primaryTitles: Record<string, [string, string]> = {
  landing: [
    "One-Page Business Website Development",
    "वन-पेज बिज़नेस वेबसाइट डेवलपमेंट",
  ],
  business: ["Business Website Development", "बिज़नेस वेबसाइट डेवलपमेंट"],
  webapp: ["Web Application MVP Development", "वेब ऐप MVP डेवलपमेंट"],
  android: ["Android App Prototype Development", "Android ऐप प्रोटोटाइप डेवलपमेंट"],
  "cross-platform": [
    "Android & iOS App MVP Development",
    "Android और iOS ऐप MVP डेवलपमेंट",
  ],
};
export function serviceSeoTitle(id: string, lang: string, fallback: string) {
  return `${primaryTitles[id]?.[lang === "hi" ? 1 : 0] || fallback} | Silio`;
}
