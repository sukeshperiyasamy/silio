"use client";
import { servicePath } from "@/lib/service-pages";
import Link from "next/link";
import { categories, featuredIds, demoIds, quotePath } from "@/lib/growth";
import { useState } from "react";
import { prices, messages, type Lang } from "@/lib/site";
export default function PriceCards({
  lang,
  limit,
}: {
  lang: Lang;
  limit?: number;
}) {
  const [filter, setFilter] = useState("all");
  const t = messages[lang];
  const categoryNames: Record<string, string> = {
    all: lang === "hi" ? "सभी" : "All",
    ...Object.fromEntries(
      Object.entries(categories).map(([id, labels]) => [
        id,
        labels[lang === "hi" ? 1 : 0],
      ]),
    ),
  };
  const items = (
    limit
      ? featuredIds
          .map((id) => prices.find((p) => p.id === id)!)
          .slice(0, limit)
      : prices
  ).filter((item) => filter === "all" || item.cat === filter);
  return (
    <>
      <div className="filters">
        {!limit &&
          Object.entries(categoryNames).map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={`filter ${filter === id ? "active" : ""}`}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
            >
              {label}
            </button>
          ))}
      </div>
      <div className="price-grid">
        {items.map((x) => (
          <article className="price-card" key={x.id}>
            <h3>
              {servicePath(lang, x.id) ? (
                <Link href={servicePath(lang, x.id)!}>
                  {lang === "hi" ? x.hi : x.en}
                </Link>
              ) : lang === "hi" ? (
                x.hi
              ) : (
                x.en
              )}
            </h3>
            <small>{t.from}</small>
            <div className="amount">
              ₹{x.price.toLocaleString("en-IN")}
              {x.monthly ? (
                <span className="price-period">
                  {lang === "hi" ? " / माह" : " / mo"}
                </span>
              ) : null}
            </div>
            <p>{lang === "hi" ? x.detailHi : x.detailEn}</p>
            <Link className="pill outline" href={quotePath(lang, x.id)}>
              {t.estimate}
            </Link>
            {demoIds[x.id] && (
              <Link
                className="price-demo"
                href={`/${lang}/demos#${demoIds[x.id]}`}
              >
                {lang === "hi" ? "डेमो देखें" : "See demo"}
              </Link>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
