import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { langValid } from "@/lib/site";
import BusinessDemos from "@/components/BusinessDemos";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, "/demos", {
    title:
      lang === "hi"
        ? "Silio | इंटरैक्टिव बिज़नेस डेमो"
        : "Silio | Interactive business demos",
    description:
      lang === "hi"
        ? "प्रोजेक्ट शुरू करने से पहले काल्पनिक कैटलॉग, रेस्टोरेंट मेन्यू, Excel क्लीनअप और वेबसाइट आज़माएँ।"
        : "Try fictional catalogues, restaurant menus, Excel cleanup and business websites before starting your project.",
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const hi = lang === "hi";
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">SILIO / {hi ? "डेमो" : "DEMOS"}</span>
          <h1>{hi ? "इंटरैक्टिव बिज़नेस डेमो" : "Interactive business demos"}</h1>
          <p>
            {hi
              ? "प्रोजेक्ट शुरू करने से पहले काल्पनिक कैटलॉग, रेस्टोरेंट मेन्यू, Excel क्लीनअप और वेबसाइट आज़माएँ।"
              : "Try fictional catalogues, restaurant menus, Excel cleanup and business websites before starting your project."}
          </p>
        </div>
      </section>
      <BusinessDemos lang={lang} />
    </>
  );
}
