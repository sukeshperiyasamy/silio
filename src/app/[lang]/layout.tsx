import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
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
      lang === "hi" ? "Silio | डिजिटल समाधान" : "Silio | Digital Solutions",
    description:
      lang === "hi"
        ? "वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप डेवलपमेंट। UI/UX, 3D और डेटा की अतिरिक्त सेवाएँ भी उपलब्ध हैं।"
        : "Website, web application and mobile app development, with additional UI/UX, 3D and data services.",
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
      <PageAnalytics />
      <Header lang={lang} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
