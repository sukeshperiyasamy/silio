import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { langValid } from "@/lib/site";
import ProjectEstimator from "@/components/ProjectEstimator";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, "/estimate", {
    title:
      lang === "hi"
        ? "वेबसाइट और ऐप खर्च का अनुमान | Silio"
        : "Website & App Cost Estimator | Silio",
    description:
      lang === "hi"
        ? "ज़रूरी पैकेज चुनें। एक बार के प्रोजेक्ट और मासिक केयर का खर्च अलग देखें।"
        : "Choose the packages you need. Keep one-time work and monthly care clearly separate.",
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
          <span className="eyebrow">SILIO / {hi ? "अनुमान" : "ESTIMATE"}</span>
          <h1>
            {hi
              ? "आपके बजट के लिए एक शुरुआती अनुमान।"
              : "A useful starting point for your budget."}
          </h1>
          <p>
            {hi
              ? "ज़रूरी पैकेज चुनें। एक बार के प्रोजेक्ट और मासिक केयर का खर्च अलग देखें।"
              : "Choose the packages you need. Keep one-time work and monthly care clearly separate."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProjectEstimator lang={lang} />
        </div>
      </section>
    </>
  );
}
