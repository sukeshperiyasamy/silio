import Icon from "@/components/Icon";
import Link from "next/link";
import { site, messages, type Lang, waLink } from "@/lib/site";
export default function Footer({ lang }: { lang: Lang }) {
  const t = messages[lang];
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link className="brand" href={`/${lang}`}>
                silio
                <Icon name="spark" className="brand-mark" />
              </Link>
              <p>{t.footer}</p>
              <small>
                {lang === "hi" ? "ऑनलाइन और रिमोट सहयोग" : site.location}
              </small>
            </div>
            <div className="footer-services">
              <strong>{t.navServices}</strong>
              <nav className="footer-service-links" aria-label={t.navServices}>
                <Link href={`/${lang}/services`}>{t.navServices}</Link>
                <Link href={`/${lang}/services/3d-design-printing`}>
                  {lang === "hi"
                    ? "3D डिज़ाइन और प्रिंटिंग"
                    : "3D Design & Printing"}
                </Link>
                <Link href={`/${lang}/portfolio`}>
                  {lang === "hi" ? "डेमो पोर्टफ़ोलियो" : "Demo portfolio"}
                </Link>
                <Link href={`/${lang}/estimate`}>
                  {lang === "hi" ? "खर्च का अनुमान" : "Project estimator"}
                </Link>
                <Link href={`/${lang}/pricing`}>{t.navPricing}</Link>
                <Link href={`/${lang}/contact`}>{t.navContact}</Link>
                <Link href={`/${lang}/demos`}>
                  {lang === "hi" ? "डेमो" : "Demos"}
                </Link>
                <Link href={`/${lang}/review`}>
                  {lang === "hi" ? "मुफ़्त वेबसाइट समीक्षा" : "Free website review"}
                </Link>
                <Link href={`/${lang}/privacy`}>{t.privacy}</Link>
              </nav>
            </div>
            <div>
              <strong>{t.navContact}</strong>
              <a href={`tel:+91${site.phone}`}>+91 {site.phone}</a>
              <a
                href={waLink("Hello Silio, I have a project enquiry.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <small>
                {lang === "hi" ? "ऑनलाइन पूछताछ" : "Online enquiries"}
              </small>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} Silio. {t.rights} · {t.disclaimer}
          </div>
        </div>
      </footer>
      <a
        className="wa-float"
        href={waLink("Hello Silio, I would like to discuss a project.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Silio on WhatsApp"
      >
        WhatsApp
      </a>
    </>
  );
}
