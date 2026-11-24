"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import { type Lang, waLink } from "@/lib/site";
import type { EstimateSelection } from "@/lib/estimate-lead";
import { readCampaign } from "./CampaignCapture";
export default function EstimateContactForm({
  lang,
  selection,
  summary,
  onBusyChange,
  formId,
}: {
  formId: string;
  lang: Lang;
  selection: EstimateSelection;
  summary: string;
  onBusyChange: (busy: boolean) => void;
}) {
  const hi = lang === "hi",
    id = useId();
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    website: "",
    consent: false,
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [saved, setSaved] = useState<{
    fingerprint: string;
    whatsapp: string;
  } | null>(null);
  const request = useRef<{ fingerprint: string; id: string } | null>(null);
  const fingerprint = JSON.stringify({ selection, contact });
  const currentSaved = saved?.fingerprint === fingerprint ? saved : null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || currentSaved) return;
    setError("");
    setBusy(true);
    onBusyChange(true);
    try {
      if (request.current?.fingerprint !== fingerprint)
        request.current = { fingerprint, id: crypto.randomUUID() };
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: "estimate",
          estimate: selection,
          estimateRequestId: request.current.id,
          contactPermission: contact.consent,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: contact.notes,
          website: contact.website,
          language: lang,
          page: window.location.pathname,
          campaign: readCampaign(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.id)
        throw new Error(String(response.status));
      setSaved({
        fingerprint,
        whatsapp: `${summary}\nName: ${contact.name}\nMobile: ${contact.phone}\nEmail: ${contact.email}\n${contact.notes}`,
      });
    } catch (failure) {
      setError(
        failure instanceof Error && failure.message === "429"
          ? hi
            ? "बहुत सारे अनुरोध मिले हैं। थोड़ी देर बाद फिर कोशिश करें।"
            : "Too many requests. Please try again shortly."
          : hi
            ? "आपके अनुरोध के सेव होने की पुष्टि नहीं हो सकी। जानकारी यहीं है; फिर कोशिश करें या WhatsApp पर संपर्क करें।"
            : "We couldn’t confirm your request was saved. Your details are still here; please retry or contact us on WhatsApp.",
      );
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }
  return (
    <form id={formId} className="estimate-lead-form" onSubmit={submit}>
      <h3>{hi ? "इस अनुमान पर हमसे बात करें" : "Let’s discuss your estimate"}</h3>
      <p>
        {hi
          ? "अपनी जानकारी भेजें। हम आपके प्रोजेक्ट पर संपर्क करेंगे—WhatsApp लॉगिन ज़रूरी नहीं है।"
          : "Send your details and we’ll follow up about your project. No WhatsApp login needed."}
      </p>
      <fieldset className="estimate-contact-fields" disabled={busy}>
        <div className="field">
          <label htmlFor={id + "-name"}>
            {hi ? "आपका नाम" : "Your name"} *
          </label>
          <input
            id={id + "-name"}
            name="name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={id + "-phone"}>
            {hi
              ? "मोबाइल नंबर (देश कोड सहित)"
              : "Mobile number (with country code)"}{" "}
            *
          </label>
          <input
            id={id + "-phone"}
            name="phone"
            autoComplete="tel"
            type="tel"
            required
            pattern={"\\+[0-9\\s\\-\\(\\)]{8,24}"}
            maxLength={25}
            placeholder="+91 98765 43210"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={id + "-email"}>
            {hi ? "ईमेल" : "Email address"} *
          </label>
          <input
            id={id + "-email"}
            name="email"
            autoComplete="email"
            type="email"
            required
            maxLength={150}
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={id + "-notes"}>
            {hi
              ? "कुछ और बताना चाहेंगे? (वैकल्पिक)"
              : "Anything else we should know? (optional)"}
          </label>
          <textarea
            id={id + "-notes"}
            name="notes"
            maxLength={1500}
            rows={3}
            value={contact.notes}
            onChange={(e) => setContact({ ...contact, notes: e.target.value })}
          />
        </div>
        <div hidden aria-hidden="true">
          <label htmlFor={id + "-website"}>Website</label>
          <input
            id={id + "-website"}
            tabIndex={-1}
            autoComplete="off"
            value={contact.website}
            onChange={(e) =>
              setContact({ ...contact, website: e.target.value })
            }
          />
        </div>
        <label className="estimate-consent">
          <input
            type="checkbox"
            name="contactPermission"
            required
            checked={contact.consent}
            onChange={(e) =>
              setContact({ ...contact, consent: e.target.checked })
            }
          />
          <span>
            {hi
              ? "Silio इस अनुमान के बारे में फ़ोन, ईमेल या WhatsApp से मुझसे संपर्क कर सकता है।"
              : "Silio may contact me by phone, email or WhatsApp about this estimate."}
          </span>
        </label>
        <a className="text-link" href={`/${lang}/privacy`}>
          {hi ? "हम आपकी जानकारी का उपयोग कैसे करते हैं" : "How we use your details"}
        </a>
        <button
          type="submit"
          className="pill light"
          disabled={busy || !!currentSaved}
        >
          {busy
            ? hi
              ? "भेज रहे हैं…"
              : "Sending…"
            : currentSaved
              ? hi
                ? "अनुरोध सेव हो गया"
                : "Request saved"
              : hi
                ? "अनुमान भेजें और कॉल का अनुरोध करें"
                : "Send estimate & request a callback"}
        </button>
      </fieldset>
      {currentSaved && (
        <div className="estimate-saved" role="status">
          <p>
            {hi
              ? "आपका अनुमान और संपर्क जानकारी सेव हो गई है। Silio आपकी ज़रूरत, प्रक्रिया और अगले कदमों पर आपसे संपर्क करेगा।"
              : "Your estimate and contact details are saved. Silio will contact you to discuss your requirements, the process and next steps."}
          </p>
          <a
            className="pill outline"
            href={waLink(currentSaved.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hi
              ? "चाहें तो WhatsApp पर बात जारी रखें"
              : "Continue on WhatsApp (optional)"}
          </a>
        </div>
      )}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <a
            className="text-link"
            href={waLink(summary)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hi ? "WhatsApp पर संपर्क करें" : "Contact us on WhatsApp"}
          </a>
        </div>
      )}
    </form>
  );
}
