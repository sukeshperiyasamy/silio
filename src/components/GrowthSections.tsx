import Link from "next/link";
import type { Lang } from "@/lib/site";

export default function GrowthSections({ lang }: { lang: Lang }) {
  const hi = lang === "hi";
  const industries = hi
    ? [
        [
          "फ़र्नीचर और हस्तशिल्प",
          "अपने प्रोडक्ट दिखाएँ, कैटलॉग साझा करें और ग्राहक की पूछताछ एक जगह पाएँ।",
        ],
        [
          "कपड़े और रिटेल दुकानें",
          "WhatsApp कैटलॉग, स्टॉक शीट और सोशल मीडिया डिज़ाइन से रोज़ का काम आसान करें।",
        ],
        [
          "कैफ़े, होटल और रेस्टोरेंट",
          "मोबाइल मेन्यू, वेबसाइट और सीधी बुकिंग पूछताछ के लिए स्पष्ट रास्ता दें।",
        ],
        [
          "कोचिंग और ट्रेनिंग सेंटर",
          "कोर्स की जानकारी, एडमिशन पूछताछ और उपस्थिति ट्रैकिंग को व्यवस्थित करें।",
        ],
      ]
    : [
        [
          "Furniture & handicrafts",
          "Show your products, share a catalogue and make it easier for buyers to enquire.",
        ],
        [
          "Clothing & retail shops",
          "Keep everyday work moving with WhatsApp catalogues, stock sheets and social creatives.",
        ],
        [
          "Cafés, hotels & restaurants",
          "Offer mobile menus, useful websites and a clear route to direct booking enquiries.",
        ],
        [
          "Coaching & training centres",
          "Organize course information, admission enquiries and attendance records.",
        ],
      ];
  return (
    <>
      <section className="section dark-section">
        <div className="container">
          <div className="section-head">
            <span className="label">
              {hi ? "आपके व्यवसाय के लिए" : "BUILT AROUND YOUR BUSINESS"}
            </span>
            <h2>
              {hi
                ? "आप काम जानते हैं। हम उसे आसान बनाते हैं।"
                : "You know your business. Let’s make the daily work easier."}
            </h2>
          </div>
          <div className="industry-grid">
            {industries.map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="label">
              {hi ? "पहले आज़माएँ" : "SEE WHAT’S POSSIBLE"}
            </span>
            <h2>
              {hi ? "बताने से बेहतर, आज़माकर देखें।" : "A working example says more."}
            </h2>
            <p className="subtitle">
              {hi
                ? "काल्पनिक व्यवसायों के लिए बनाए गए इंटरैक्टिव उदाहरण। ये असली ग्राहक प्रोजेक्ट नहीं हैं।"
                : "Interactive examples built for fictional businesses. These are demonstrations, not client projects."}
            </p>
          </div>
          <div className="demo-teasers">
            {[
              [
                "catalogue",
                "▤",
                hi ? "प्रोडक्ट कैटलॉग" : "Product catalogue",
                hi
                  ? "खोजें, फ़िल्टर करें और पूछताछ देखें।"
                  : "Search, filter and preview an enquiry.",
              ],
              [
                "menu",
                "◒",
                hi ? "डिजिटल मेन्यू" : "Digital menu",
                hi
                  ? "फ़ोन पर एक सरल मेन्यू आज़माएँ।"
                  : "Explore a simple menu for a café.",
              ],
              [
                "excel",
                "▥",
                hi ? "Excel क्लीनअप" : "Excel cleanup",
                hi
                  ? "बिखरे रिकॉर्ड को व्यवस्थित करें।"
                  : "Turn messy records into a clean sheet.",
              ],
            ].map(([id, icon, title, body]) => (
              <Link
                className="demo-teaser"
                key={id}
                href={`/${lang}/demos#${id}`}
              >
                <span className="teaser-icon" aria-hidden="true">
                  {icon}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="text-link">
                  {hi ? "डेमो देखें" : "Try the demo"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container growth-actions">
          <div>
            <span className="label">
              {hi ? "बजट की योजना" : "PLAN YOUR NEXT STEP"}
            </span>
            <h2>{hi ? "कितना खर्च आएगा?" : "What might it cost?"}</h2>
            <p>
              {hi
                ? "सेवा और वैकल्पिक केयर प्लान चुनकर शुरुआती अनुमान पाएँ।"
                : "Choose a service and optional care plan for a transparent starting estimate."}
            </p>
            <Link className="pill" href={`/${lang}/estimate`}>
              {hi ? "खर्च का अनुमान लगाएँ" : "Build your estimate"}
            </Link>
          </div>
          <div>
            <span className="label">
              {hi ? "मुफ़्त वेबसाइट समीक्षा" : "FREE WEBSITE REVIEW"}
            </span>
            <h2>{hi ? "वेबसाइट पहले से है?" : "Already have a website?"}</h2>
            <p>
              {hi
                ? "अपना लिंक साझा करें। मोबाइल अनुभव, कंटेंट और पूछताछ के रास्ते पर संक्षिप्त मानवीय समीक्षा माँगें।"
                : "Share your link for a short human review of mobile usability, content clarity and your enquiry flow."}
            </p>
            <Link className="pill outline" href={`/${lang}/review`}>
              {hi ? "मुफ़्त समीक्षा माँगें" : "Request a free review"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
