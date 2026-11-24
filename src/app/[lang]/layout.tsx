import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageAnalytics from "@/components/PageAnalytics";
import CampaignCapture from "@/components/CampaignCapture";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { langValid } from "@/lib/site";
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
  return pageMetadata(lang, "", {
    title:
      lang === "hi"
        ? "वेबसाइट, वेब ऐप और मोबाइल ऐप डेवलपमेंट | Silio"
        : "Website, Web App & Mobile App Development | Silio",
    description:
      lang === "hi"
        ? "वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप डेवलपमेंट। UI/UX, 3D और डेटा की अतिरिक्त सेवाएँ भी उपलब्ध हैं।"
        : "Website, web application and mobile app development, with additional UI/UX, 3D and data services.",
  });
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
