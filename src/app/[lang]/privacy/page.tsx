import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { langValid, messages, site } from "@/lib/site";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "hi" ? "Silio | गोपनीयता नीति" : "Silio | Privacy",
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { en: "/en/privacy", hi: "/hi/privacy" },
    },
  };
}
export default async function Privacy({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const t = messages[lang],
    hi = lang === "hi";
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">SILIO</span>
          <h1>{t.privacyHeading}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <p>{t.privacyBody}</p>
          <h2 style={{ fontSize: 28 }}>
            {hi ? "कैंपेन जानकारी" : "Campaign information"}
          </h2>
          <p>
            {hi
              ? "अगर आप कैंपेन लिंक से आते हैं, तो उसके UTM टैग आपके ब्राउज़र के इस सत्र में रखे जाते हैं और फ़ॉर्म भेजने पर पूछताछ में जुड़ते हैं। इससे हमें पता चलता है कि आप हम तक कैसे पहुँचे। इस सुविधा के लिए कोई तीसरे पक्ष की ट्रैकिंग स्क्रिप्ट नहीं लगाई गई है।"
              : "If you arrive through a campaign link, its UTM tags are kept in browser session storage and attached when you submit an enquiry. This helps us understand how you found Silio. This feature does not load third-party tracking scripts."}
          </p>
          <h2 style={{ fontSize: 28 }}>
            {hi ? "पूछताछ की जानकारी" : "Enquiry information"}
          </h2>
          <p>
            {hi
              ? "फ़ॉर्म में आपका नाम, ईमेल, फ़ोन, चुनी गई सेवा, बजट, प्रोजेक्ट की जानकारी और समीक्षा के लिए सार्वजनिक वेबसाइट का लिंक लिया जाता है। ईमेल सेवा चालू होने पर पूछताछ Resend के ज़रिए भेजी जाती है।"
              : "The enquiry form collects your name, email, phone number, selected service, optional budget, project description and a public website URL when requesting a review. When email delivery is enabled, enquiries are sent through Resend."}
          </p>
          <h2 style={{ fontSize: 28 }}>
            {hi ? "WhatsApp पर संपर्क" : "Contacting us on WhatsApp"}
          </h2>
          <p>
            {hi
              ? "WhatsApp लिंक खोलने पर आप WhatsApp की सेवा पर जाते हैं। संदेश भेजने से पहले आप उसे देख और बदल सकते हैं। उस सेवा की गोपनीयता शर्तें लागू होती हैं।"
              : "WhatsApp links take you to WhatsApp, where you can review and edit the message before sending it. Use of that service is subject to its own privacy terms."}
          </p>
          <h2 style={{ fontSize: 28 }}>
            {hi ? "अपने डेटा के बारे में संपर्क करें" : "Questions about your data"}
          </h2>
          <p>
            {hi
              ? "अपनी पूछताछ की जानकारी बदलने या हटाने का अनुरोध करने के लिए संपर्क करें:"
              : "To request a correction or deletion of your enquiry details, contact us at:"}{" "}
            <a className="text-link" href={`tel:+91${site.phone}`}>
              +91 {site.phone}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
