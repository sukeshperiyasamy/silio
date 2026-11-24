import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { langValid, messages, site } from "@/lib/site";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, "/privacy", {
    title: lang === "hi" ? "Silio | गोपनीयता नीति" : "Silio | Privacy",
  });
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
            {hi
              ? "पूछताछ और अपनी साइट के आँकड़े"
              : "Enquiries and first-party analytics"}
          </h2>
          <p>
            {hi
              ? "पूछताछ की जानकारी और वैकल्पिक मॉडल फ़ाइल MongoDB में रखी जाती हैं, ताकि हमारी अधिकृत टीम जवाब दे सके। अनुमान भेजने पर चुनी हुई सेवाएँ, शुरुआती खर्च और उसी अनुमान पर फ़ोन, ईमेल या WhatsApp से संपर्क की आपकी अनुमति भी रखी जाती है। केवल अनुमान देखने से आपकी संपर्क जानकारी सबमिट नहीं होती। ईमेल सेवा चालू होने पर उसकी एक कॉपी ईमेल से भी भेजी जा सकती है।"
              : "Enquiry details and optional model attachments are stored in MongoDB for our authorized team to respond. When you submit an estimate, we also save your selected services, starting costs and permission to follow up by phone, email or WhatsApp about that estimate. Viewing an estimate alone does not submit your contact details. When email delivery is enabled, a copy may also be sent by email."}
          </p>
          <p>
            {hi
              ? "हम पेज के नाम, आने के स्रोत, कैंपेन और पेज पर बीते समय के अनुमान को अपने सिस्टम में रिकॉर्ड करते हैं। Cloudflare पर ये आँकड़े D1 में और पूछताछ MongoDB में रखी जाती है। ब्राउज़र के एक टैब के लिए एक अनाम सत्र पहचान रखी जाती है; पूरे URL के क्वेरी पैरामीटर, विज्ञापन पहचान या विज़िटर का कच्चा IP पता पेज आँकड़ों में नहीं रखा जाता। Do Not Track का सम्मान किया जाता है। पेज आँकड़े लगभग 90 दिन रखे जाते हैं।"
              : "We record page paths, traffic sources, campaigns and approximate elapsed time in our own analytics system. On Cloudflare, these analytics are stored in D1 while enquiries remain in MongoDB. An anonymous session identifier lasts for a browser-tab session. Full URL queries, advertising identifiers and raw visitor IP addresses are not stored in page analytics. We honor Do Not Track. Page analytics are retained for approximately 90 days."}
          </p>
          <h2 style={{ fontSize: 28 }}>
            {hi ? "3D मॉडल फ़ाइलें" : "3D model files"}
          </h2>
          <p>
            {hi
              ? "अगर आप मॉडल अटैच करते हैं, तो ईमेल सेवा चालू होने पर वह पूछताछ के साथ भेजा जाता है। फ़ाइल आपकी पूछताछ के साथ निजी रूप से रखी जाती है और सिर्फ़ अधिकृत एडमिन को उपलब्ध है, सार्वजनिक गैलरी में नहीं। केवल वही फ़ाइल भेजें जिसे साझा करने का अधिकार आपके पास है। WhatsApp पर फ़ाइल अलग से भेजनी होगी।"
              : "If you attach a model, it is sent with your enquiry when email delivery is enabled. Files are stored privately with your enquiry and are available only to authorized admins, not in a public gallery. Send only files you have the right to share. WhatsApp attachments must be sent separately."}
          </p>
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
