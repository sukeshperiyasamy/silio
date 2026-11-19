import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CampaignCapture from "@/components/CampaignCapture";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site, langValid, messages } from "@/lib/site";
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hi" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!langValid(lang)) return {};
  return {
    title:
      lang === "hi"
        ? "Silio | जोधपुर में डिजिटल समाधान"
        : "Silio | Digital Solutions in Jodhpur",
    description:
      lang === "hi"
        ? "जोधपुर में वेबसाइट, ऐप, एक्सेल डेटा और सॉफ्टवेयर सेवाएँ।"
        : "Affordable website development, Excel data services, mobile app and SaaS prototypes in Jodhpur, Rajasthan.",
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", hi: "/hi", "x-default": "/en" },
    },
    openGraph: {
      title: "Silio Digital Solutions",
      description: messages[lang].heroDesc,
      url: `${site.url}/${lang}`,
      type: "website",
    },
  };
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  return (
    <>
      <CampaignCapture />
      <Header lang={lang} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
