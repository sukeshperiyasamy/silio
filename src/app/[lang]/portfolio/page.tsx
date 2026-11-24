import Icon from "@/components/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { langValid } from "@/lib/site";
import PrintVisual from "@/components/PrintVisual";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "hi"
        ? "SILIO | डेमो पोर्टफ़ोलियो"
        : "SILIO | Demonstration portfolio",
    description:
      lang === "hi"
        ? "काल्पनिक बिज़नेस डेमो और 3D कॉन्सेप्ट देखें; ये ग्राहक प्रोजेक्ट नहीं हैं।"
        : "Explore fictional business demos and an illustrative 3D enclosure concept. These examples are not client projects.",
    alternates: {
      canonical: `/${lang}/portfolio`,
      languages: { en: "/en/portfolio", hi: "/hi/portfolio" },
    },
  };
}
export default async function Portfolio({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const hi = lang === "hi";
  const demos = [
    [
      "website",
      "website",
      hi ? "बिज़नेस वेबसाइट" : "Business website",
      hi
        ? "एक काल्पनिक इंटीरियर स्टूडियो का परिचय और सेवा पेज।"
        : "An introduction and service experience for a fictional interiors studio.",
    ],
    [
      "catalogue",
      "catalogue",
      hi ? "प्रोडक्ट कैटलॉग" : "Product catalogue",
      hi
        ? "फ़र्नीचर और सजावट के सैंपल में खोज और पूछताछ आज़माएँ।"
        : "Try search and enquiry previews for fictional furniture and decor.",
    ],
    [
      "excel",
      "chart",
      hi ? "Excel क्लीनअप" : "Excel cleanup",
      hi
        ? "सैंपल रिकॉर्ड में डुप्लिकेट हटाएँ और नाम व्यवस्थित करें।"
        : "Remove a duplicate and standardize names in a sample dataset.",
    ],
    [
      "menu",
      "menu",
      hi ? "डिजिटल कैफ़े मेन्यू" : "Digital café menu",
      hi
        ? "फ़ोन-अनुकूल मेन्यू में खाने और पेय की श्रेणी चुनें।"
        : "Filter food and drinks in a phone-friendly menu.",
    ],
    [
      "care",
      "care",
      hi ? "वेबसाइट केयर" : "Website care",
      hi
        ? "प्रगति के साथ एक उदाहरण मेंटेनेंस चेकलिस्ट आज़माएँ।"
        : "Try an illustrative maintenance checklist with progress.",
    ],
  ];
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">SILIO / PORTFOLIO</span>
          <h1>
            {hi
              ? "संभावनाएँ देखें। फिर अपना आइडिया बनाएँ।"
              : "Explore the possibilities. Then make them yours."}
          </h1>
          <p>
            {hi
              ? "यह डेमो पोर्टफ़ोलियो है। व्यवसाय, प्रोडक्ट और रिकॉर्ड काल्पनिक हैं। हम इन्हें वास्तविक ग्राहक प्रोजेक्ट या प्रमाणित परिणाम नहीं बताते।"
              : "This is a demonstration portfolio. Businesses, products and records are fictional; these examples are not presented as client projects or verified results."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="demo-teasers">
            {demos.map(([id, icon, title, body]) => (
              <Link
                className="demo-teaser"
                href={`/${lang}/demos#${id}`}
                key={id}
              >
                <span className="label">
                  {hi ? "इंटरैक्टिव डेमो" : "INTERACTIVE DEMO"}
                </span>
                <span className="teaser-icon" aria-hidden="true">
                  <Icon name={icon} />
                </span>
                <h2>{title}</h2>
                <p>{body}</p>
                <span className="text-link">
                  {hi ? "डेमो आज़माएँ" : "Try the demo"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark-section">
        <div className="container demo-split">
          <PrintVisual lang={lang} />
          <div>
            <span className="label">
              {hi ? "3D कॉन्सेप्ट अध्ययन" : "3D CONCEPT STUDY"}
            </span>
            <h2>{hi ? "एक एनक्लोज़र की कल्पना।" : "An enclosure, considered."}</h2>
            <p className="subtitle">
              {hi
                ? "कवर, बॉडी और कनेक्टर कट-आउट का सांकेतिक चित्र। यह कोई बन चुका, फ़िट-जाँचा या प्रमाणित पार्ट नहीं है।"
                : "An illustrative arrangement of a lid, body and connector openings. This is not a manufactured, fit-tested or certified part."}
            </p>
            <Link
              className="pill"
              href={`/${lang}/services/3d-design-printing`}
            >
              {hi ? "3D सेवाएँ देखें" : "Explore 3D services"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
