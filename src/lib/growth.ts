import { prices, type Lang } from "./site";

export const featuredIds = [
  "landing",
  "business",
  "webapp",
  "android",
  "cross-platform",
];
export const primaryCategoryIds = ["web", "webapps", "mobile"];
export const categories = {
  web: ["Website Development", "वेबसाइट डेवलपमेंट"],
  webapps: ["Web Application Development", "वेब एप्लिकेशन डेवलपमेंट"],
  mobile: ["Mobile App Development", "मोबाइल ऐप डेवलपमेंट"],
  design: ["UI/UX Design", "UI/UX डिज़ाइन"],
  "3d": ["3D Design & Printing", "3D डिज़ाइन और प्रिंटिंग"],
  shops: ["Shops & restaurants", "दुकान और रेस्टोरेंट"],
  data: ["Excel & data", "Excel और डेटा"],
  support: ["Website care", "वेबसाइट केयर"],
  business: ["Business tools", "बिज़नेस टूल"],
  marketing: ["Digital marketing", "डिजिटल मार्केटिंग"],
  automation: ["AI & automation", "AI और ऑटोमेशन"],
  other: ["Other custom projects", "अन्य कस्टम प्रोजेक्ट"],
} as const;
export const orderedPackages = Object.keys(categories).flatMap((cat) =>
  prices.filter((p) => p.cat === cat),
);
export const demoIds: Record<string, string> = {
  landing: "website",
  "whatsapp-catalogue": "catalogue",
  cleaning: "excel",
  "qr-menu": "menu",
  maintenance: "care",
};
export function quotePath(lang: Lang, id: string) {
  return `/${lang}/contact?service=${encodeURIComponent(id)}`;
}
export function estimatePackages(ids: readonly string[], careId = "") {
  const selected = [...new Set(ids)]
    .map((id) => prices.find((p) => p.id === id))
    .filter((p) => p && !p.monthly && !p.quoteOnly && !p.unit);
  const care = prices.find((p) => p.id === careId && p.monthly);
  return {
    oneTime: selected.reduce((sum, p) => sum + (p?.price ?? 0), 0),
    monthly: care?.price ?? 0,
  };
}
