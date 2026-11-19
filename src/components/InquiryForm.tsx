"use client";
import { readCampaign } from "@/components/CampaignCapture";
import { useState, useEffect, type FormEvent } from "react";
import { messages, prices, waLink, type Lang } from "@/lib/site";
export default function InquiryForm({
  lang,
  intent = "project",
}: {
  lang: Lang;
  intent?: "project" | "review";
}) {
  const t = messages[lang],
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: intent === "review" ? "Free website review" : "",
    budget: "",
    message: "",
    website: "",
    projectUrl: "",
  });
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setAttribution(readCampaign());
    const selected = prices.find((p) => p.id === query.get("service"));
    setForm((f) => ({
      ...f,
      service:
        intent === "review" ? "Free website review" : selected?.en || f.service,
      budget: (query.get("budget") || "").slice(0, 70),
      message: (query.get("message") || "").slice(0, 3000),
    }));
  }, [intent]);
  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          purpose: intent,
          campaign: readCampaign(),
        }),
      });
      if (!res.ok) {
        setStatus(
          res.status === 503
            ? t.submitFail
            : lang === "hi"
              ? "पूछताछ भेजी नहीं जा सकी। कृपया जानकारी जाँचें या WhatsApp पर संपर्क करें।"
              : "Your enquiry could not be sent. Please check your details or contact us on WhatsApp.",
        );
        return;
      }
      setStatus(t.submitSuccess);
      setForm({
        name: "",
        email: "",
        phone: "",
        service: intent === "review" ? "Free website review" : "",
        budget: "",
        message: "",
        website: "",
        projectUrl: "",
      });
    } catch {
      setStatus(
        lang === "hi"
          ? "कनेक्शन में समस्या है। फिर से कोशिश करें या WhatsApp पर संपर्क करें।"
          : "There was a connection problem. Please try again or contact us on WhatsApp.",
      );
    } finally {
      setBusy(false);
    }
  }
  const whatsappMessage = `Hello Silio, my name is ${form.name || "a prospective client"}. Service: ${form.service || "General enquiry"}. Budget: ${form.budget || "not specified"}. Details: ${form.message || "I would like to discuss a project."}. Phone: ${form.phone}. Website: ${form.projectUrl || "not provided"}. ${
    Object.keys(attribution).length
      ? "Source: " +
        Object.entries(attribution)
          .map(([key, value]) => key + "=" + value)
          .join(", ")
      : ""
  }`;
  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="clientName">{t.name} *</label>
          <input
            id="clientName"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="email">{t.email} *</label>
          <input
            id="email"
            autoComplete="email"
            required
            type="email"
            maxLength={150}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">{t.phone} *</label>
          <input
            id="phone"
            autoComplete="tel"
            required
            minLength={7}
            type="tel"
            maxLength={20}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="service">{t.service} *</label>
          <select
            id="service"
            disabled={intent === "review"}
            required
            value={form.service}
            onChange={(e) => set("service", e.target.value)}
          >
            <option value="">—</option>
            <option value="Free website review">
              {lang === "hi" ? "मुफ़्त वेबसाइट समीक्षा" : "Free website review"}
            </option>
            {prices.map((p) => (
              <option key={p.id} value={p.en}>
                {lang === "hi" ? p.hi : p.en}
              </option>
            ))}
          </select>
        </div>
        {(intent === "review" || form.service === "Free website review") && (
          <div className="field full">
            <label htmlFor="projectUrl">
              {lang === "hi"
                ? "आपकी सार्वजनिक वेबसाइट का लिंक"
                : "Your public website URL"}{" "}
              *
            </label>
            <input
              id="projectUrl"
              required
              type="url"
              maxLength={2048}
              placeholder="https://your-business.com"
              value={form.projectUrl}
              onChange={(e) => set("projectUrl", e.target.value)}
            />
            <small className="muted">
              {lang === "hi"
                ? "सिर्फ़ सार्वजनिक पेज साझा करें; पासवर्ड न भेजें।"
                : "Public pages only. Do not include passwords or private access links."}
            </small>
          </div>
        )}
        <div className="field full">
          <label htmlFor="budget">{t.budget}</label>
          <input
            id="budget"
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
            maxLength={70}
          />
        </div>
        <div className="field full">
          <label htmlFor="message">
            {intent === "review"
              ? lang === "hi"
                ? "आप क्या सुधारना चाहते हैं?"
                : "What would you like us to look at?"
              : t.message}{" "}
            *
          </label>
          <textarea
            id="message"
            required
            minLength={10}
            maxLength={3000}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </div>
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
      </div>
      <p className="form-privacy">
        {lang === "hi"
          ? "हम इस जानकारी का इस्तेमाल आपकी पूछताछ का जवाब देने के लिए करते हैं।"
          : "We use these details to respond to your enquiry."}{" "}
        <a className="text-link" href={`/${lang}/privacy`}>
          {t.privacy}
        </a>
      </p>
      <div className="button-row">
        <button type="submit" className="pill" disabled={busy}>
          {busy ? (lang === "hi" ? "भेज रहे हैं…" : "Sending…") : t.send}
        </button>
        <a
          className="pill outline"
          target="_blank"
          rel="noopener noreferrer"
          href={waLink(whatsappMessage)}
        >
          {t.waDirect}
        </a>
      </div>
      {status && (
        <p role="status" className="muted" style={{ marginTop: 12 }}>
          {status}
        </p>
      )}
    </form>
  );
}
