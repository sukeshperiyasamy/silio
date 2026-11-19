import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { langValid, prices, messages } from "@/lib/site";
import { servicePages } from "@/lib/service-pages";
import { quotePath, demoIds } from "@/lib/growth";
export function generateStaticParams() {
  return servicePages.map((p) => ({ service: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; service: string }>;
}): Promise<Metadata> {
  const { lang, service } = await params;
  const page = servicePages.find((p) => p.slug === service);
  if (!page || !langValid(lang)) return {};
  return {
    title: `Silio | ${lang === "hi" ? page.hi : page.en}`,
    description: lang === "hi" ? page.audienceHi : page.audienceEn,
    alternates: {
      canonical: `/${lang}/services/${service}`,
      languages: {
        en: `/en/services/${service}`,
        hi: `/hi/services/${service}`,
      },
    },
  };
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ lang: string; service: string }>;
}) {
  const { lang, service } = await params;
  const page = servicePages.find((p) => p.slug === service);
  if (!langValid(lang) || !page) notFound();
  const hi = lang === "hi",
    p = prices.find((p) => p.id === page.id)!,
    t = messages[lang];
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">
            SILIO / {hi ? "जोधपुर और पूरे भारत में" : "JODHPUR & ACROSS INDIA"}
          </span>
          <h1>{hi ? page.hi : page.en}</h1>
          <p>{hi ? page.audienceHi : page.audienceEn}</p>
        </div>
      </section>
      <section className="section">
        <div className="container demo-split">
          <div>
            <h2>
              {hi ? "आपके रोज़ के काम के लिए।" : "Made for your everyday work."}
            </h2>
            <ul className="principles">
              {(hi ? page.outcomesHi : page.outcomesEn).map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
            <p className="muted">
              {hi
                ? "पहले अपनी ज़रूरत और उपलब्ध कंटेंट साझा करें। काम, समय और अंतिम कीमत तय होने के बाद प्रोजेक्ट शुरू होगा।"
                : "Share your requirements and available content first. We agree on the scope, timeline and final price before starting."}
            </p>
            <Link
              className="text-link"
              href={`/${lang}/demos#${demoIds[p.id]}`}
            >
              {hi ? "इंटरैक्टिव उदाहरण देखें" : "Try the interactive example"}
            </Link>
          </div>
          <aside className="price-card">
            <small>{t.from}</small>
            <div className="amount">
              ₹{p.price.toLocaleString("en-IN")}
              {p.monthly ? (
                <span className="price-period">{hi ? " / माह" : " / mo"}</span>
              ) : null}
            </div>
            <h3>{hi ? p.hi : p.en}</h3>
            <p>{hi ? p.detailHi : p.detailEn}</p>
            <Link className="pill" href={quotePath(lang, p.id)}>
              {t.estimate}
            </Link>
            <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
              {t.disclaimer}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
