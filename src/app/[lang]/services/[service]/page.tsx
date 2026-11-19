import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { langValid, prices, messages, site } from "@/lib/site";
import { servicePages, serviceFaqs, servicePath } from "@/lib/service-pages";
import { quotePath, demoIds } from "@/lib/growth";
import ServicePrice from "@/components/ServicePrice";
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
  const title = `SILIO | ${lang === "hi" ? page.hi : page.en}`,
    description = lang === "hi" ? page.audienceHi : page.audienceEn;
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/services/${service}`,
      languages: {
        en: `/en/services/${service}`,
        hi: `/hi/services/${service}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${site.url}/${lang}/services/${service}`,
      type: "website",
      locale: lang === "hi" ? "hi_IN" : "en_IN",
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
    t = messages[lang],
    faq = serviceFaqs(page, lang),
    title = hi ? page.hi : page.en;
  const url = `${site.url}/${lang}/services/${page.slug}`;
  const related = prices
    .filter((x) => x.cat === p.cat && x.id !== p.id)
    .slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: title,
        description: hi ? page.audienceHi : page.audienceEn,
        url,
        provider: { "@type": "Organization", name: "SILIO", url: site.url },
        areaServed: [
          { "@type": "City", name: "Jodhpur" },
          { "@type": "Country", name: "India" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: hi ? "होम" : "Home",
            item: `${site.url}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t.navServices,
            item: `${site.url}/${lang}/services`,
          },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="page-head">
        <div className="container">
          <nav
            className="breadcrumbs"
            aria-label={hi ? "पेज का रास्ता" : "Breadcrumb"}
          >
            <Link href={`/${lang}`}>{hi ? "होम" : "Home"}</Link>
            <span>/</span>
            <Link href={`/${lang}/services`}>{t.navServices}</Link>
            <span>/</span>
            <span>{hi ? p.hi : p.en}</span>
          </nav>
          <span className="eyebrow">
            SILIO / {hi ? "जोधपुर और पूरे भारत में" : "JODHPUR & ACROSS INDIA"}
          </span>
          <h1>{title}</h1>
          <p>{hi ? page.audienceHi : page.audienceEn}</p>
          <div className="button-row">
            <Link className="pill" href={quotePath(lang, p.id)}>
              {t.estimate}
            </Link>
            {demoIds[p.id] && (
              <Link
                className="pill outline"
                href={`/${lang}/demos#${demoIds[p.id]}`}
              >
                {hi ? "डेमो देखें" : "See an example"}
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container service-detail-grid">
          <div>
            <span className="label">
              {hi ? "सेवा का दायरा" : "THE SERVICE, EXPLAINED"}
            </span>
            <h2>{hi ? "आपको क्या मिलेगा" : "What we will work on"}</h2>
            <ul className="principles">
              {(hi ? page.outcomesHi : page.outcomesEn).map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
            <div className="detail-block">
              <h3>{hi ? "शुरू करने से पहले" : "Before we begin"}</h3>
              <p>{hi ? page.inputsHi : page.inputsEn}</p>
            </div>
            <div className="detail-block">
              <h3>{hi ? "अलग कोटेशन वाले काम" : "Scope boundaries"}</h3>
              <p>{hi ? page.exclusionsHi : page.exclusionsEn}</p>
            </div>
            {p.cat === "3d" && (
              <div className="scope-note">
                <h3>{hi ? "उत्पादन कैसे होगा?" : "How production is arranged"}</h3>
                <p>
                  {hi
                    ? "डिजिटल CAD डिज़ाइन और भौतिक प्रिंट का कोटेशन अलग है। भौतिक उत्पादन की योजना बाहरी प्रिंट प्रदाता के माध्यम से है; ऑर्डर से पहले प्रदाता, फ़ीज़िबिलिटी, मटेरियल और डिलीवरी की पुष्टि होगी।"
                    : "Digital CAD design and physical printing are quoted separately. Physical production is planned through an external print provider; the provider, feasibility, material and delivery terms are confirmed before an order."}
                </p>
              </div>
            )}
          </div>
          <aside className="price-card service-quote">
            <small>
              {p.quoteOnly
                ? hi
                  ? "ज़रूरत के अनुसार"
                  : "Based on your requirements"
                : t.from}
            </small>
            <ServicePrice item={p} lang={lang} />
            <h3>{hi ? p.hi : p.en}</h3>
            <p>{hi ? p.detailHi : p.detailEn}</p>
            <Link className="pill" href={quotePath(lang, p.id)}>
              {t.estimate}
            </Link>
            <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
              {p.cat === "3d"
                ? hi
                  ? "डिज़ाइन, मटेरियल, प्रिंटिंग, फ़िनिशिंग, टैक्स और डिलीवरी अंतिम कोटेशन में अलग होंगे।"
                  : "Design, material, printing, finishing, taxes and delivery are separated in the final quote."
                : t.disclaimer}
            </p>
          </aside>
        </div>
      </section>
      <section className="section dark-section">
        <div className="container">
          <div className="section-head">
            <span className="label">{hi ? "हमारा तरीका" : "HOW WE WORK"}</span>
            <h2>
              {hi
                ? "पहले स्पष्टता। फिर काम।"
                : "Agree on the details. Then build."}
            </h2>
          </div>
          <div className="steps">
            {[
              [
                hi ? "ज़रूरत साझा करें" : "Share the brief",
                hi ? page.inputsHi : page.inputsEn,
              ],
              [
                hi ? "काम और कीमत तय करें" : "Review scope and quote",
                hi
                  ? "डिलीवरी, समय, कीमत और सीमाएँ लिखित रूप से तय होंगी।"
                  : "Confirm deliverables, timeline, price and exclusions in writing.",
              ],
              [
                hi ? "बनाएँ और समीक्षा करें" : "Build and review",
                hi
                  ? "तय काम की समीक्षा करें और सहमत फ़ॉर्मेट में डिलीवरी पाएँ।"
                  : "Review the agreed work and receive delivery in the agreed format.",
              ],
            ].map(([heading, body], i) => (
              <div className="step" key={heading}>
                <span className="label">0{i + 1}</span>
                <h3>{heading}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container faq-container">
          <div className="section-head">
            <span className="label">FAQ</span>
            <h2>{hi ? "आपके सवालों के जवाब" : "A few useful answers"}</h2>
          </div>
          {faq.map((f) => (
            <details className="service-faq" key={f.question}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
      {related.length > 0 && (
        <section className="section related-section">
          <div className="container">
            <h2>{hi ? "संबंधित सेवाएँ" : "You might also need"}</h2>
            <div className="related-services">
              {related.map((item) => (
                <Link key={item.id} href={servicePath(lang, item.id)!}>
                  <h3>{hi ? item.hi : item.en}</h3>
                  <p>{hi ? item.detailHi : item.detailEn}</p>
                  <span className="text-link">
                    {hi ? "सेवा के बारे में जानें" : "Explore the service"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
