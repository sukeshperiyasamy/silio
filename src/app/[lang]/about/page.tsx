import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { langValid, messages } from "@/lib/site";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "hi" ? "SILIO | हमारे बारे में" : "SILIO | About our approach",
    description:
      lang === "hi"
        ? "जोधपुर से डिजिटल सेवाएँ, CAD डिज़ाइन और समीक्षा के बाद भौतिक प्रोटोटाइप।"
        : "Practical digital services, CAD design and reviewed physical prototyping from Jodhpur.",
    alternates: {
      canonical: `/${lang}/about`,
      languages: { en: "/en/about", hi: "/hi/about" },
    },
  };
}
export default async function About({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const hi = lang === "hi",
    t = messages[lang];
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">ABOUT SILIO</span>
          <h1>
            {hi
              ? "आपके काम को समझकर, उपयोगी समाधान।"
              : "Useful work starts with understanding your business."}
          </h1>
          <p>
            {hi
              ? "जोधपुर से, स्थानीय दुकानों, संस्थापकों, मेकर्स और पूरे भारत की टीमों के लिए।"
              : "From Jodhpur, for local shops, founders, makers and teams across India."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container demo-split">
          <div>
            <h2>{t.aboutTitle}</h2>
            <p className="subtitle">{t.aboutBody}</p>
            <p>
              {hi
                ? "वेबसाइट और डेटा से लेकर CAD मॉडल तक, हमारा तरीका है पहले ज़रूरत समझना, फिर स्पष्ट दायरे में काम बनाना। 3D प्रिंटिंग की योजना बाहरी उत्पादन प्रदाता से है, जिसकी पुष्टि ऑर्डर से पहले होगी।"
                : "From websites and data to CAD models, our approach is to understand the need first and build within an agreed scope. Physical 3D printing is planned through an external production provider, confirmed before an order."}
            </p>
            <Link className="pill" href={`/${lang}/contact`}>
              {hi ? "अपनी ज़रूरत बताएँ" : "Tell us what you need"}
            </Link>
          </div>
          <div className="scope-note">
            <h3>{hi ? "हम कैसे काम करते हैं" : "Our working principles"}</h3>
            <ul className="principles">
              <li>
                {hi
                  ? "हिंदी और अंग्रेज़ी में सीधी बातचीत"
                  : "Direct communication in Hindi and English"}
              </li>
              <li>
                {hi
                  ? "काम, सीमाएँ और शुरुआती कीमत पहले स्पष्ट"
                  : "Clear scope, exclusions and starting prices"}
              </li>
              <li>
                {hi
                  ? "डेमो और वास्तविक ग्राहक कार्य में स्पष्ट अंतर"
                  : "A clear distinction between demos and real client work"}
              </li>
              <li>
                {hi
                  ? "डिज़ाइन और भौतिक उत्पादन का अलग कोटेशन"
                  : "Separate quotes for design and physical production"}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
