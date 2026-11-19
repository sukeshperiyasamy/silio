import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "hi"
        ? "Silio कीमतें | किफ़ायती डिजिटल सेवाएँ"
        : "Silio Pricing | Affordable Freelance Digital Services",
    alternates: {
      canonical: `/${lang}/pricing`,
      languages: { en: "/en/pricing", hi: "/hi/pricing" },
    },
  };
}
import { notFound } from "next/navigation";
import PackageComparison from "@/components/PackageComparison";
import Link from "next/link";
import PriceCards from "@/components/PriceCards";
import { langValid, messages } from "@/lib/site";
export default async function Pricing({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const t = messages[lang];
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">{t.navPricing}</span>
          <h1>{t.pricingPageTitle}</h1>
          <p>{t.pricingPageDesc}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>
              {lang === "hi"
                ? "पाँच आसान शुरुआती पैकेज"
                : "Five practical starting points"}
            </h2>
          </div>
          <PackageComparison lang={lang} />
          <div className="button-row">
            <Link className="pill" href={`/${lang}/estimate`}>
              {lang === "hi" ? "अपना अनुमान बनाएँ" : "Build your estimate"}
            </Link>
          </div>
          <div className="section-head" style={{ marginTop: 70 }}>
            <h2>
              {lang === "hi" ? "सभी सेवाएँ देखें" : "Explore the full catalogue"}
            </h2>
          </div>
          <PriceCards lang={lang} />
          <p className="muted" style={{ marginTop: 24 }}>
            {t.disclaimer}
          </p>
        </div>
      </section>
    </>
  );
}
