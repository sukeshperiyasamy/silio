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
        ? "Silio से जुड़ें | परिचय और संपर्क"
        : "Connect with Silio | About & Contact",
    description:
      lang === "hi"
        ? "Silio के काम करने का तरीका जानें और अपने प्रोजेक्ट पर बातचीत शुरू करें। ऑनलाइन पूछताछ, फ़ोन और WhatsApp से जुड़ें।"
        : "Meet Silio, learn how we work and start a conversation about your project. Connect through our enquiry form, phone or WhatsApp.",
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
          <span className="eyebrow">{t.navConnect} / SILIO</span>
          <h1>
            {lang === "hi"
              ? "आइए, कुछ उपयोगी बनाएँ।"
              : "Let’s build something useful."}
          </h1>
          <p>
            {lang === "hi"
              ? "हमारे काम करने का तरीका जानें और अपने आइडिया पर बातचीत शुरू करें।"
              : "Get to know our approach and start a conversation about your idea."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <h2>
              {lang === "hi" ? "अपना आइडिया बताएँ" : "Tell us about your idea"}
            </h2>
            <InquiryForm lang={lang} />
          </div>
          <aside className="contact-panel">
            <h2>{lang === "hi" ? "Silio का परिचय" : "Meet Silio"}</h2>
            <p>
              {lang === "hi"
                ? "हम आपके लक्ष्य समझकर शुरुआत करते हैं, काम का दायरा साथ तय करते हैं और हर चरण में स्पष्ट बातचीत रखते हैं। हमारा ध्यान आपके काम के लिए उपयोगी डिजिटल अनुभव बनाने पर है।"
                : "We start by understanding your goals, agree the scope together and keep communication clear as we build. Our focus is on practical digital experiences that serve your business."}
            </p>
            <ul className="principles">
              <li>
                {lang === "hi"
                  ? "हिंदी और अंग्रेज़ी में सीधी बातचीत"
                  : "Straightforward communication in Hindi and English"}
              </li>
              <li>
                {lang === "hi"
                  ? "काम, सीमाएँ और लागत पहले स्पष्ट"
                  : "Clear scope, exclusions and costs before work starts"}
              </li>
              <li>
                {lang === "hi"
                  ? "ऑनलाइन और रिमोट सहयोग"
                  : "Online collaboration, wherever you work"}
              </li>
            </ul>
            <h2>{lang === "hi" ? "सीधे संपर्क करें" : "Reach us directly"}</h2>
            <p>
              <strong>
                {lang === "hi" ? "फ़ोन / WhatsApp" : "Phone / WhatsApp"}
              </strong>
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
