"use client";
import { useState } from "react";
import Link from "next/link";
import EstimateContactForm from "./EstimateContactForm";
import type { Lang } from "@/lib/site";
import { printEstimate } from "@/lib/printing";
export default function PrintEstimator({ lang }: { lang: Lang }) {
  const hi = lang === "hi";
  const [submitting, setSubmitting] = useState(false);
  const [grams, setGrams] = useState("50"),
    [quantity, setQuantity] = useState("1"),
    [design, setDesign] = useState("0");
  const result = printEstimate(Number(grams), Number(quantity), Number(design));
  const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const message = result
    ? `3D printing enquiry: estimated sliced weight ${grams} g per copy including supports, quantity ${quantity}. PLA print starting charge ${money(result.printing)}; design from ${money(result.design)}. Finishing, machine-time adjustments, tax and delivery require confirmation.`
    : "";
  return (
    <div className="print-estimator">
      <div>
        <span className="label">
          {hi ? "सांकेतिक अनुमान" : "INDICATIVE PRINT ESTIMATE"}
        </span>
        <h3>{hi ? "शुरुआती खर्च समझें।" : "Understand the starting cost."}</h3>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="print-weight">
              {hi
                ? "प्रति कॉपी स्लाइस वजन (ग्राम)"
                : "Sliced weight per copy (grams)"}
            </label>
            <input
              id="print-weight"
              disabled={submitting}
              type="number"
              min="1"
              max="10000"
              step="any"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="print-quantity">{hi ? "मात्रा" : "Quantity"}</label>
            <input
              id="print-quantity"
              disabled={submitting}
              type="number"
              min="1"
              max="1000"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="field full">
            <label htmlFor="print-design">
              {hi ? "क्या CAD डिज़ाइन चाहिए?" : "Do you need CAD design?"}
            </label>
            <select
              id="print-design"
              disabled={submitting}
              value={design}
              onChange={(e) => setDesign(e.target.value)}
            >
              <option value="0">{hi ? "तैयार मॉडल है" : "I have a model"}</option>
              <option value="499">
                {hi ? "सरल CAD मॉडल · ₹499 से" : "Simple CAD model · from ₹499"}
              </option>
              <option value="999">
                {hi ? "सरल एनक्लोज़र · ₹999 से" : "Simple enclosure · from ₹999"}
              </option>
            </select>
          </div>
        </div>
        <p className="muted">
          {hi
            ? "वजन में सपोर्ट शामिल करें। यह लाइव स्लाइसर या अंतिम कोटेशन नहीं है। मटेरियल, मशीन समय, फ़िनिशिंग और डिलीवरी की समीक्षा होगी।"
            : "Include supports in the weight. This is not a live slicer or a final quote. Material, machine time, finishing and delivery must be reviewed."}
        </p>
      </div>
      <aside className="print-estimate-summary">
        {result ? (
          <>
            <span>
              {hi
                ? "PLA प्रिंट · ₹5/ग्राम, न्यूनतम ₹299"
                : "PLA print · ₹5/g, minimum ₹299"}
            </span>
            <strong data-testid="print-charge">{money(result.printing)}</strong>
            <p>
              {hi ? "डिज़ाइन की शुरुआती फ़ीस" : "Design starting fee"}{" "}
              <b>{money(result.design)}</b>
            </p>
            <div className="print-subtotal" aria-live="polite">
              {hi ? "शुरुआती उप-योग" : "Starting subtotal"}
              <b data-testid="print-subtotal">{money(result.subtotal)}</b>
            </div>
            <small>
              {hi
                ? "फ़िनिशिंग, अतिरिक्त मशीन समय, टैक्स और डिलीवरी शामिल नहीं हैं।"
                : "Excludes finishing, extra machine time, tax and delivery."}
            </small>
            <a className="pill" href="#print-estimate-contact">
              {hi
                ? "अनुमान भेजें और कॉल का अनुरोध करें"
                : "Send estimate & request a callback"}
            </a>
            <Link
              className="text-link"
              href={`/${lang}/contact?service=pla-printing&budget=${result.subtotal}&message=${encodeURIComponent(message)}`}
            >
              {hi ? "फ़ाइल के साथ पूछताछ करें" : "Enquire with your model"}
            </Link>
          </>
        ) : (
          <p role="alert">
            {hi
              ? "वजन 1–10,000 ग्राम और मात्रा 1–1,000 की पूर्ण संख्या रखें।"
              : "Enter a weight from 1 to 10,000 g and a whole quantity from 1 to 1,000."}
          </p>
        )}
      </aside>
      {result && (
        <EstimateContactForm
          formId="print-estimate-contact"
          lang={lang}
          selection={{
            kind: "printing",
            grams: Number(grams),
            quantity: Number(quantity),
            design: Number(design),
          }}
          summary={message}
          onBusyChange={setSubmitting}
        />
      )}
    </div>
  );
}
