import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { langValid } from "@/lib/site";
import InquiryForm from "@/components/InquiryForm";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "hi"
        ? "Silio | आपकी वेबसाइट पर एक नई नज़र।"
        : "Silio | A fresh pair of eyes on your website.",
    description:
      lang === "hi"
        ? "तीन सार्वजनिक पेज तक मोबाइल अनुभव, स्पष्टता और संपर्क के तरीकों पर मुफ़्त मानवीय समीक्षा माँगें। खरीदारी ज़रूरी नहीं।"
        : "Request a free human review of up to three public pages: mobile usability, clarity and ways for customers to contact you. No purchase required.",
    alternates: {
      canonical: `/${lang}/review`,
      languages: { en: "/en/review", hi: "/hi/review" },
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const hi = lang === "hi";
  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">
            SILIO / {hi ? "मुफ़्त समीक्षा" : "REVIEW"}
          </span>
          <h1>
            {hi
              ? "आपकी वेबसाइट पर एक नई नज़र।"
              : "A fresh pair of eyes on your website."}
          </h1>
          <p>
            {hi
              ? "तीन सार्वजनिक पेज तक मोबाइल अनुभव, स्पष्टता और संपर्क के तरीकों पर मुफ़्त मानवीय समीक्षा माँगें। खरीदारी ज़रूरी नहीं।"
              : "Request a free human review of up to three public pages: mobile usability, clarity and ways for customers to contact you. No purchase required."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <InquiryForm lang={lang} intent="review" />
          </div>
          <aside className="contact-panel">
            <h2>{hi ? "क्या शामिल है?" : "What’s included?"}</h2>
            <ul className="principles">
              <li>
                {hi
                  ? "तीन सार्वजनिक पेज तक की समीक्षा"
                  : "A review of up to three public pages"}
              </li>
              <li>
                {hi
                  ? "मोबाइल अनुभव और स्पष्टता पर सुझाव"
                  : "Suggestions on mobile usability and clarity"}
              </li>
              <li>
                {hi
                  ? "संपर्क और पूछताछ के रास्ते की जाँच"
                  : "A look at contact and enquiry paths"}
              </li>
            </ul>
            <p className="muted">
              {hi
                ? "यह मानवीय समीक्षा है, ऑटोमेटेड स्कैन या सुरक्षा ऑडिट नहीं। पासवर्ड या निजी पेज न भेजें। ज़रूरी सुधारों पर अलग कोटेशन मिलेगा।"
                : "This is a human review, not an automated scan or security audit. Please share public URLs only, without passwords. Implementation of improvements is quoted separately."}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
