import Link from "next/link";
import GrowthSections from "@/components/GrowthSections";
import ProjectPreview from "@/components/ProjectPreview";
import { site, messages, langValid, waLink } from "@/lib/site";
import PriceCards from "@/components/PriceCards";
import { notFound } from "next/navigation";
const services = [
  ["▥", "service1", "desc1", "data"],
  ["⌘", "service2", "desc2", "web"],
  ["▯", "service3", "desc3", "shops"],
  ["✳", "service4", "desc4", "support"],
] as const;
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const t = messages[lang];
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Silio",
    url: site.url,
    telephone: `+91${site.phone}`,
    description: t.heroDesc,
    areaServed: [
      { "@type": "City", name: "Jodhpur" },
      { "@type": "AdministrativeArea", name: "Rajasthan" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jodhpur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonld).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>
              {t.heroA}
              <br />
              <em>{t.heroB}</em>
            </h1>
            <p className="lead">{t.heroDesc}</p>
            <div className="button-row">
              <Link href={`/${lang}/contact`} className="pill light">
                {t.heroCta}
              </Link>
              <Link href={`/${lang}/services`} className="pill outline">
                {t.heroAlt}
              </Link>
            </div>
          </div>
          <ProjectPreview lang={lang} />
        </div>
      </section>
      <div className="container trust">
        <span>{t.stats1}</span>
        <span>{t.stats2}</span>
        <span>{t.stats3}</span>
      </div>
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="label">{t.servicesLabel}</span>
            <h2>{t.servicesTitle}</h2>
            <p className="subtitle">{t.servicesDesc}</p>
          </div>
          <div className="cards">
            {services.map(([icon, title, desc, category]) => (
              <article className="card" key={title}>
                <div className="circle">{icon}</div>
                <h3>{t[title]}</h3>
                <p>{t[desc]}</p>
                <Link
                  href={`/${lang}/services#${category}`}
                  aria-label={`${t[title]} details`}
                >
                  {lang === "hi" ? "सेवा देखें" : "Explore service"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="about-section" id="about">
        <div className="container about-grid">
          <div className="about-art" aria-hidden="true">
            <span className="art-word">
              less friction.
              <br />
              <em>more possibility.</em>
            </span>
            <span className="art-star">✳</span>
            <div className="art-bottom">
              <span>THE SILIO APPROACH</span>
              <span>IDEA / BUILD / GROW</span>
            </div>
          </div>
          <div className="about-copy">
            <span className="label">{t.navAbout} / SILIO</span>
            <h2>{t.aboutTitle}</h2>
            <p className="subtitle">{t.aboutBody}</p>
            <ul className="principles">
              <li>
                {lang === "hi"
                  ? "आपकी ज़रूरत के हिसाब से काम"
                  : "Work scoped around what you actually need"}
              </li>
              <li>
                {lang === "hi"
                  ? "काम शुरू होने से पहले स्पष्ट कीमत"
                  : "Clear estimates before the work begins"}
              </li>
              <li>
                {lang === "hi"
                  ? "सीधी बातचीत, हिंदी या अंग्रेज़ी में"
                  : "A direct conversation, in Hindi or English"}
              </li>
            </ul>
            <Link className="text-link" href={`/${lang}/contact`}>
              {lang === "hi"
                ? "अपने आइडिया पर बात करें"
                : "Let’s talk about your idea"}
            </Link>
          </div>
        </div>
      </section>
      <section className="section dark-section" id="prices">
        <div className="container">
          <div className="section-head">
            <span className="label">{t.navPricing}</span>
            <h2>{t.pricingTitle}</h2>
            <p className="subtitle">{t.pricingDesc}</p>
          </div>
          <PriceCards lang={lang} limit={5} />
          <p className="muted" style={{ marginTop: 26, fontSize: 14 }}>
            {t.disclaimer}
          </p>
          <div className="button-row">
            <Link href={`/${lang}/pricing`} className="pill">
              {t.viewAll}
            </Link>
          </div>
        </div>
      </section>
      <GrowthSections lang={lang} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="label">{t.processLabel}</span>
            <h2>{t.processTitle}</h2>
          </div>
          <div className="steps">
            {[1, 2, 3].map((i) => (
              <div className="step" key={i}>
                <span className="label">0{i}</span>
                <h3>{t[`process${i}` as "process1"]}</h3>
                <p>{t[`process${i}Desc` as "process1Desc"]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta">
            <div>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactDesc}</p>
            </div>
            <a
              className="pill"
              href={waLink("Hello Silio, I have a project to discuss.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.contactButton}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
