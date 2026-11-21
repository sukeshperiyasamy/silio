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
        ? "Silio से संपर्क करें"
        : "Contact Silio | Web, App & Excel Projects",
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { en: "/en/contact", hi: "/hi/contact" },
    },
  };
}
import { notFound } from "next/navigation";
import InquiryForm from "@/components/InquiryForm";
import { langValid, messages, site, waLink } from "@/lib/site";
export default async function Contact({
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
          <span className="eyebrow">{t.navContact}</span>
          <h1>{t.contactPageTitle}</h1>
          <p>{t.contactPageDesc}</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <InquiryForm lang={lang} />
          </div>
          <aside className="contact-panel">
            <h2>{t.navContact}</h2>
            <p>{t.areas}</p>
            <p>
              <strong>Phone / WhatsApp</strong>
              <br />
              <a href={`tel:+91${site.phone}`}>+91 {site.phone}</a>
            </p>
            <p>
              <strong>{lang === "hi" ? "सहयोग" : "Collaboration"}</strong>
              <br />
              {lang === "hi" ? "ऑनलाइन और रिमोट सहयोग" : site.location}
            </p>
            <p className="muted">{t.response}</p>
            <a
              className="pill light"
              href={waLink("Hello Silio, I have a project enquiry.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
