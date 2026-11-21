"use client";
import { orderedPackages } from "@/lib/growth";
import { maxModelBytes, modelExtensions } from "@/lib/printing";
import { readCampaign } from "@/components/CampaignCapture";
import { useState, useEffect, type FormEvent } from "react";
import { messages, prices, waLink, type Lang } from "@/lib/site";
export default function InquiryForm({
  lang,
  intent = "project",
  initialService,
}: {
  lang: Lang;
  intent?: "project" | "review" | "print";
  initialService?: string;
}) {
  const t = messages[lang],
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  const [model, setModel] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [fileVersion, setFileVersion] = useState(0);
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service:
      intent === "review"
        ? "Free website review"
        : prices.find((p) => p.id === initialService)?.en || "",
    budget: "",
    message: "",
    website: "",
    projectUrl: "",
  });
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setAttribution(readCampaign());
    const selected = prices.find(
      (p) =>
        p.id === query.get("service") && (intent !== "print" || p.cat === "3d"),
    );
    setForm((f) => ({
      ...f,
      service:
        intent === "review" ? "Free website review" : selected?.en || f.service,
      budget: (query.get("budget") || "").slice(0, 70),
      message: (query.get("message") || "").slice(0, 3000),
    }));
  }, [intent]);
  const is3d =
    intent === "print" ||
    prices.some((p) => p.en === form.service && p.cat === "3d");
  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (fileError && is3d) return;
    setBusy(true);
    setStatus("");
    try {
      const payload = { ...form, purpose: intent, campaign: readCampaign() };
      const multipart = new FormData();
      if (model && is3d) {
        for (const [key, value] of Object.entries(payload))
          multipart.append(
            key,
            typeof value === "string" ? value : JSON.stringify(value),
          );
        multipart.append("model", model);
      }
      const res = await fetch("/api/inquiry", {
        method: "POST",
        ...(model && is3d
          ? { body: multipart }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
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
      setModel(null);
      setFileVersion((v) => v + 1);
      setForm({
        name: "",
        email: "",
        phone: "",
        service:
          intent === "review"
            ? "Free website review"
            : prices.find((p) => p.id === initialService)?.en || "",
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
  const attachmentNote =
    model && is3d
      ? ` Model file: ${model.name}. I will attach it manually in WhatsApp.`
      : "";
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
            {intent !== "print" && (
              <option value="Free website review">
                {lang === "hi" ? "मुफ़्त वेबसाइट समीक्षा" : "Free website review"}
              </option>
            )}
            {orderedPackages
              .filter((p) => intent !== "print" || p.cat === "3d")
              .map((p) => (
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
        {is3d && (
          <div className="field full model-upload">
            <label htmlFor="model">
              {lang === "hi"
                ? "3D मॉडल फ़ाइल (वैकल्पिक)"
                : "3D model file (optional)"}
            </label>
            <input
              key={fileVersion}
              id="model"
              type="file"
              accept=".stl,.step,.stp,.obj,.3mf"
              aria-describedby="model-help model-error"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                const ext = file?.name.split(".").pop()?.toLowerCase() || "";
                const invalid =
                  file &&
                  (!modelExtensions.includes(ext) ||
                    file.size === 0 ||
                    file.size > maxModelBytes);
                setFileError(
                  invalid
                    ? lang === "hi"
                      ? "एक गैर-खाली STL, STEP, STP, OBJ या 3MF फ़ाइल चुनें, अधिकतम 8 MB।"
                      : "Choose one non-empty STL, STEP, STP, OBJ or 3MF file up to 8 MB."
                    : "",
                );
                setModel(invalid ? null : file);
              }}
            />
            <small id="model-help">
              {lang === "hi"
                ? "अधिकतम 8 MB। फ़ॉर्म भेजने पर मॉडल ईमेल के साथ भेजा जाएगा, यदि ईमेल सेवा चालू है। WhatsApp पर फ़ाइल अलग से अटैच करें।"
                : "Up to 8 MB. When email delivery is enabled, the form sends the model as an email attachment. Attach the file manually if using WhatsApp."}
            </small>
            <p
              id="model-error"
              className="field-error"
              role={fileError ? "alert" : undefined}
            >
              {fileError}
            </p>
            <p className="muted">
              {lang === "hi"
                ? "संदेश में माप (mm), मात्रा, मटेरियल, फ़िनिश, डिलीवरी क्षेत्र और इस्तेमाल की जानकारी दें।"
                : "In your message, include dimensions (mm), quantity, material, finish, delivery area and intended use."}
            </p>
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
        <button
          type="submit"
          className="pill"
          disabled={busy || (is3d && !!fileError)}
        >
          {busy ? (lang === "hi" ? "भेज रहे हैं…" : "Sending…") : t.send}
        </button>
        <a
          className="pill outline"
          target="_blank"
          rel="noopener noreferrer"
          href={waLink(whatsappMessage + attachmentNote)}
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
