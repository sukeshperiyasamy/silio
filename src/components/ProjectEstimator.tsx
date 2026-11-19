"use client";
import { useState } from "react";
import Link from "next/link";
import { prices, type Lang, waLink } from "@/lib/site";
import { estimatePackages } from "@/lib/growth";

export default function ProjectEstimator({ lang }: { lang: Lang }) {
  const hi = lang === "hi";
  const [base, setBase] = useState("landing"),
    [extras, setExtras] = useState<string[]>([]),
    [care, setCare] = useState("");
  const selectedIds = [base, ...extras.filter((id) => id !== base)];
  const total = estimatePackages(selectedIds, care);
  const title = (id: string) => {
    const p = prices.find((p) => p.id === id);
    return p ? (hi ? p.hi : p.en) : "";
  };
  const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const summary = `Hello Silio, please review this starting estimate. Packages: ${selectedIds.map(title).join(", ")}. One-time: ${money(total.oneTime)}. Monthly care: ${money(total.monthly)}. Please confirm the scope, timeline and final quote.`;
  return (
    <div className="estimator">
      <div>
        <div className="field">
          <label htmlFor="estimate-base">
            {hi ? "किस काम से शुरू करें?" : "What would you like to start with?"}
          </label>
          <select
            id="estimate-base"
            value={base}
            onChange={(e) => setBase(e.target.value)}
          >
            {[
              "landing",
              "business",
              "whatsapp-catalogue",
              "qr-menu",
              "cleaning",
              "dashboard",
              "inventory",
            ].map((id) => (
              <option key={id} value={id}>
                {title(id)} · {money(prices.find((p) => p.id === id)!.price)}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="estimate-options">
          <legend>{hi ? "और क्या चाहिए?" : "Anything else you need?"}</legend>
          {["whatsapp-catalogue", "qr-menu", "charts"]
            .filter((id) => id !== base)
            .map((id) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={extras.includes(id)}
                  onChange={(e) =>
                    setExtras(
                      e.target.checked
                        ? [...extras, id]
                        : extras.filter((x) => x !== id),
                    )
                  }
                />
                <span>{title(id)}</span>
                <b>{money(prices.find((p) => p.id === id)!.price)}</b>
              </label>
            ))}
        </fieldset>
        <div className="field">
          <label htmlFor="estimate-care">
            {hi ? "वैकल्पिक मासिक केयर" : "Optional monthly care"}
          </label>
          <select
            id="estimate-care"
            value={care}
            onChange={(e) => setCare(e.target.value)}
          >
            <option value="">{hi ? "अभी नहीं" : "No monthly plan"}</option>
            {prices
              .filter((p) => p.monthly)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {title(p.id)} · {money(p.price)}
                </option>
              ))}
          </select>
        </div>
      </div>
      <aside className="estimate-summary">
        <span className="label">
          {hi ? "आपका शुरुआती अनुमान" : "YOUR STARTING ESTIMATE"}
        </span>
        <div aria-live="polite" aria-atomic="true">
          <small>{hi ? "एक बार का प्रोजेक्ट खर्च" : "One-time project work"}</small>
          <strong className="estimate-total" data-testid="estimate-total">
            {money(total.oneTime)}
          </strong>
          <div className="monthly-total">
            {hi ? "मासिक केयर" : "Monthly care"}
            <b data-testid="estimate-monthly">
              {money(total.monthly)}
              {hi ? " / माह" : " / mo"}
            </b>
          </div>
        </div>
        <p>
          {hi
            ? "यह अंतिम कोटेशन नहीं है। पैकेज की सीमाएँ लागू हैं। डोमेन, होस्टिंग, विज्ञापन खर्च, API और टैक्स अलग हैं।"
            : "This is a starting estimate, subject to package limits and scope review. Domain, hosting, ad spend, APIs and taxes are extra."}
        </p>
        <a
          className="pill light"
          href={waLink(summary)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {hi ? "WhatsApp पर अनुमान भेजें" : "Discuss this estimate"}
        </a>
        <Link
          className="text-link"
          href={`/${lang}/contact?service=${base}&budget=${total.oneTime}&message=${encodeURIComponent(summary)}`}
        >
          {hi ? "या पूछताछ फ़ॉर्म भरें" : "Or send a project enquiry"}
        </Link>
      </aside>
    </div>
  );
}
