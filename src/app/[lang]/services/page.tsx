import Link from "next/link";
import { categories, quotePath } from "@/lib/growth";
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
        ? "Silio सेवाएँ | जोधपुर में वेबसाइट, डेटा और ऐप"
        : "Silio Services | Excel, Websites, Mobile Apps in Jodhpur",
    alternates: {
      canonical: `/${lang}/services`,
      languages: { en: "/en/services", hi: "/hi/services" },
    },
  };
}
import { notFound } from "next/navigation";
import { langValid, messages, prices } from "@/lib/site";
export default async function Services({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const t = messages[lang];
  const groups = Object.keys(categories);
  const labels = Object.values(categories).map(
    (labels) => labels[lang === "hi" ? 1 : 0],
  );
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">{t.navServices}</span>
          <h1>{t.servicesPageTitle}</h1>
          <p>{t.servicesPageDesc}</p>
        </div>
      </section>
      {groups.map((g, i) => (
        <section
          id={g}
          key={g}
          className={`section ${i % 2 ? "dark-section" : ""}`}
        >
          <div className="container">
            <div className="section-head">
              <h2>{labels[i]}</h2>
            </div>
            <div className="price-grid">
              {prices
                .filter((p) => p.cat === g)
                .map((p) => (
                  <div className="price-card" key={p.id}>
                    <h3>{lang === "hi" ? p.hi : p.en}</h3>
                    <div className="amount">
                      ₹{p.price.toLocaleString("en-IN")}
                      <span className="price-period">
                        {p.monthly ? (lang === "hi" ? " / माह" : " / mo") : "+"}
                      </span>
                    </div>
                    <p>{lang === "hi" ? p.detailHi : p.detailEn}</p>
                    <Link className="pill outline" href={quotePath(lang, p.id)}>
                      {t.estimate}
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
