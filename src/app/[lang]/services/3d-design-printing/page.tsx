import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { langValid, prices, site } from "@/lib/site";
import { servicePath } from "@/lib/service-pages";
import PrintVisual from "@/components/PrintVisual";
import PrintEstimator from "@/components/PrintEstimator";
import InquiryForm from "@/components/InquiryForm";
import ServicePrice from "@/components/ServicePrice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const title =
      lang === "hi"
        ? "SILIO | 3D डिज़ाइन और प्रिंटिंग"
        : "SILIO | 3D Design & Printing",
    description =
      lang === "hi"
        ? "CAD मॉडलिंग, STL रिपेयर, इलेक्ट्रॉनिक्स एनक्लोज़र और PLA प्रिंटिंग। स्कोप की समीक्षा और अलग-अलग खर्च के साथ कोटेशन माँगें।"
        : "CAD modeling, STL repair, electronics enclosures and PLA printing. Request a reviewed quote with design, print, finishing and delivery costs separated.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/services/3d-design-printing`,
      languages: {
        en: "/en/services/3d-design-printing",
        hi: "/hi/services/3d-design-printing",
      },
    },
    openGraph: {
      title,
      description,
      url: `${site.url}/${lang}/services/3d-design-printing`,
      type: "website",
    },
  };
}
export default async function PrintingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const hi = lang === "hi";
  const packages = prices.filter((p) => p.cat === "3d");
  const faq = hi
    ? [
        [
          "मेरे पास मॉडल नहीं है। क्या आप बना सकते हैं?",
          "हाँ, CAD डिज़ाइन की पूछताछ में स्केच, माप, इकाई और इस्तेमाल की जानकारी दें। स्वीकृत स्कोप के बाद डिज़ाइन और एक्सपोर्ट फ़ॉर्मेट तय होंगे।",
        ],
        [
          "₹5 प्रति ग्राम में क्या शामिल है?",
          "यह सपोर्ट सहित स्लाइस किए PLA वजन का शुरुआती आधार है, न्यूनतम प्रिंट शुल्क ₹299 है। ज्योमेट्री, मशीन समय, फ़िनिशिंग और उपलब्धता के बाद अंतिम कोटेशन तय होगा। डिज़ाइन और डिलीवरी अलग हैं।",
        ],
        [
          "क्या SILIO के पास अपना प्रिंटर है?",
          "यह वेबसाइट अपने इन-हाउस प्रिंटर का दावा नहीं करती। भौतिक उत्पादन की योजना बाहरी प्रिंट प्रदाता से है; ऑर्डर से पहले प्रदाता और डिलीवरी की पुष्टि होगी।",
        ],
        [
          "कौन-सी फ़ाइल भेज सकता हूँ?",
          "STL, STEP, STP, OBJ या 3MF की एक फ़ाइल, अधिकतम 8 MB भेजें। बड़ी फ़ाइल के लिए पहले WhatsApp पर संपर्क करें। फ़ाइल की समीक्षा के बिना कीमत या फ़िट की पुष्टि नहीं होती।",
        ],
        [
          "क्या कार्यशील या प्रमाणित पार्ट बनेंगे?",
          "गैर-महत्वपूर्ण प्रोटोटाइप, डिस्प्ले और शैक्षिक उपयोग की समीक्षा की जा सकती है। बिना अलग इंजीनियरिंग सत्यापन के भार सहने वाले, मेडिकल या प्रमाणित टॉलरेंस वाले पार्ट का वादा नहीं किया जाता।",
        ],
      ]
    : [
        [
          "Can you help if I do not have a model?",
          "Yes. Share sketches, dimensions, units and intended use in a custom design enquiry. We agree on the design scope and export formats before starting.",
        ],
        [
          "What does the ₹5 per gram rate cover?",
          "It is a starting basis for sliced PLA weight including supports, with a ₹299 minimum print charge. Geometry, machine time, finishing and availability are reviewed for the final quote. Design and delivery are separate.",
        ],
        [
          "Does SILIO own an in-house printer?",
          "This website does not claim an in-house printer. Physical production is planned through an external print provider, with the provider and delivery arrangements confirmed before an order.",
        ],
        [
          "Which files can I send?",
          "Send one STL, STEP, STP, OBJ or 3MF file up to 8 MB. For a larger file, contact us on WhatsApp first. Pricing and fit are confirmed only after review.",
        ],
        [
          "Can you supply certified or safety-critical parts?",
          "Non-critical prototypes, display and educational uses can be reviewed. Load-bearing, medical and certified-tolerance parts are not promised without separate engineering validation.",
        ],
      ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: hi ? "3D डिज़ाइन और प्रिंटिंग" : "3D Design & Printing",
    description: hi
      ? "CAD डिज़ाइन और समीक्षा के बाद बाहरी प्रदाता से भौतिक प्रिंटिंग।"
      : "CAD design and reviewed physical printing through an external production provider.",
    provider: { "@type": "Organization", name: "SILIO", url: site.url },
    url: `${site.url}/${lang}/services/3d-design-printing`,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero print-hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">SILIO / 3D DESIGN & PRINTING</span>
            <h1>
              {hi ? "आपके आइडिया से" : "From your idea."}
              <br />
              <em>{hi ? "भौतिक प्रोडक्ट तक।" : "To a physical product."}</em>
            </h1>
            <p className="lead">
              {hi
                ? "छात्रों, स्टार्टअप और व्यवसायों के लिए CAD मॉडल, इलेक्ट्रॉनिक्स एनक्लोज़र, प्रोटोटाइप और समीक्षा के बाद 3D प्रिंटिंग।"
                : "CAD models, electronics enclosures, prototypes and reviewed 3D printing for students, startups and businesses."}
            </p>
            <div className="button-row">
              <a className="pill light" href="#quote">
                {hi ? "3D मॉडल भेजें" : "Send a 3D model"}
              </a>
              <Link
                className="pill outline"
                href={`/${lang}/contact?service=cad-design`}
              >
                {hi ? "कस्टम डिज़ाइन माँगें" : "Request custom design"}
              </Link>
            </div>
            <p className="print-hero-note">
              {hi
                ? "STL · STEP · OBJ · 3MF / उत्पादन उपलब्धता की पुष्टि आवश्यक"
                : "STL · STEP · OBJ · 3MF / Production subject to confirmation"}
            </p>
          </div>
          <PrintVisual lang={lang} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="label">
              {hi
                ? "डिजिटल से भौतिक तक"
                : "DIGITAL IDEAS, PHYSICAL POSSIBILITIES"}
            </span>
            <h2>
              {hi
                ? "आपके अगले प्रोटोटाइप के लिए।"
                : "A practical next step for your prototype."}
            </h2>
            <p className="subtitle">
              {hi
                ? "हर काम का अलग दायरा और स्पष्ट खर्च। पूरी जानकारी, प्रक्रिया और सीमाएँ पढ़ने के लिए सेवा खोलें।"
                : "Each service has its own scope and clear costs. Open a service for the full explanation, process and boundaries."}
            </p>
          </div>
          <div className="price-grid">
            {packages.map((p) => (
              <article className="price-card" key={p.id}>
                <h3>
                  <Link href={servicePath(lang, p.id)!}>
                    {hi ? p.hi : p.en}
                  </Link>
                </h3>
                <small>
                  {p.quoteOnly
                    ? hi
                      ? "ज़रूरत के अनुसार"
                      : "Based on your brief"
                    : hi
                      ? "शुरुआती कीमत"
                      : "Starting at"}
                </small>
                <ServicePrice item={p} lang={lang} />
                <p>{hi ? p.detailHi : p.detailEn}</p>
                <Link className="pill outline" href={servicePath(lang, p.id)!}>
                  {hi ? "पूरी सेवा देखें" : "Explore this service"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark-section">
        <div className="container">
          <PrintEstimator lang={lang} />
        </div>
      </section>
      <section className="section">
        <div className="container demo-split">
          <div className="section-head">
            <span className="label">
              {hi ? "इलेक्ट्रॉनिक्स और IoT" : "ELECTRONICS & IoT"}
            </span>
            <h2>
              {hi
                ? "आपके बोर्ड के लिए सोच-समझकर बनाया बॉक्स।"
                : "Give your electronics a considered home."}
            </h2>
            <p className="subtitle">
              {hi
                ? "Arduino, ESP32, Raspberry Pi या सेंसर के लिए बोर्ड का माप, कनेक्टर, माउंटिंग होल, हवा और क्लियरेंस साझा करें। पहले डिजिटल डिज़ाइन की समीक्षा करें, फिर फ़िट टेस्ट का अलग स्कोप तय करें।"
                : "Share board dimensions, connector positions, mounting holes, ventilation needs and clearances for your Arduino, ESP32, Raspberry Pi or sensor project. Review the digital design first, then agree on a separate fit-test scope."}
            </p>
            <Link
              className="text-link"
              href={servicePath(lang, "enclosure-design")!}
            >
              {hi ? "एनक्लोज़र डिज़ाइन के बारे में" : "Explore enclosure design"}
            </Link>
          </div>
          <div className="scope-note">
            <h3>{hi ? "उत्पादन और गुणवत्ता" : "Production and quality"}</h3>
            <p>
              {hi
                ? "डिजिटल CAD कार्य से शुरू करें। भौतिक प्रिंट की योजना बाहरी प्रदाता से है; उपलब्धता, मटेरियल, प्रिंट की सीमाएँ और डिलीवरी ऑर्डर से पहले तय होंगे।"
                : "Start with digital CAD work. Physical printing is planned through an external provider; availability, material, print limitations and delivery are agreed before an order."}
            </p>
            <p>
              {hi
                ? "डिज़ाइन, प्रिंट मटेरियल, मशीन समय, फ़िनिशिंग और डिलीवरी के खर्च को स्पष्ट रूप से अलग रखा जाएगा।"
                : "Design, print material, machine time, finishing and delivery costs will be clearly separated."}
            </p>
          </div>
        </div>
      </section>
      <section className="section dark-section" id="quote">
        <div className="container">
          <div className="section-head">
            <span className="label">
              {hi ? "प्रोजेक्ट साझा करें" : "LET’S REVIEW YOUR IDEA"}
            </span>
            <h2>
              {hi ? "3D प्रिंटिंग का कोटेशन माँगें।" : "Request a 3D printing quote."}
            </h2>
            <p className="subtitle">
              {hi
                ? "मॉडल हो तो भेजें। नहीं है तो माप, रेफ़रेंस और इस्तेमाल की जानकारी दें। समीक्षा से पहले कोई ऑर्डर या भुगतान नहीं होता।"
                : "Send a model if you have one, or describe the dimensions, references and intended use. This is an enquiry; no order or payment is placed."}
            </p>
          </div>
          <div className="contact-panel">
            <InquiryForm
              lang={lang}
              intent="print"
              initialService="pla-printing"
            />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container faq-container">
          <div className="section-head">
            <span className="label">FAQ</span>
            <h2>
              {hi ? "प्रिंट से पहले स्पष्ट जवाब।" : "Clear answers before a print."}
            </h2>
          </div>
          {faq.map(([q, a]) => (
            <details key={q} className="service-faq">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
