import { pageMetadata } from "@/lib/seo";
import ServiceExplorer from "@/components/ServiceExplorer";
import ServicePrice from "@/components/ServicePrice";
import { servicePath } from "@/lib/service-pages";
import Link from "next/link";
import { categories, primaryCategoryIds, quotePath } from "@/lib/growth";
import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, "/services", {
    title:
      lang === "hi"
        ? "Silio सेवाएँ | वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप"
        : "Silio Services | Websites, Web Applications & Mobile Apps",
  });
}
import { notFound } from "next/navigation";
import { langValid, messages, prices } from "@/lib/site";
export default async function Services({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!langValid(lang)) notFound();
  const t = messages[lang];
  const groups = Object.keys(categories);
  const labels = Object.values(categories).map(
    (labels) => labels[lang === "hi" ? 1 : 0],
  );
  const directory = groups.map((id, i) => ({
    id,
    name: labels[i],
    primary: primaryCategoryIds.includes(id),
  }));
  return (
    <>
      <section className="page-head service-directory-head">
        <div className="container">
          <span className="eyebrow">{t.navServices}</span>
          <h1>{t.servicesPageTitle}</h1>
          <p>{t.servicesPageDesc}</p>
        </div>
      </section>
      <ServiceExplorer groups={directory} lang={lang}>
        {groups.map((group, i) => (
          <section
            id={group}
            data-service-category={group}
            className="service-directory-group"
            key={group}
          >
            <div className="service-group-title">
              <span className="label">
                {primaryCategoryIds.includes(group)
                  ? lang === "hi"
                    ? "मुख्य सेवा"
                    : "CORE SERVICE"
                  : lang === "hi"
                    ? "अतिरिक्त सेवा"
                    : "ADDITIONAL SERVICE"}
              </span>
              <h2>{labels[i]}</h2>
              {group === "3d" && (
                <Link
                  className="text-link"
                  href={`/${lang}/services/3d-design-printing`}
                >
                  {lang === "hi" ? "3D सेवाओं का परिचय" : "3D services overview"}
                </Link>
              )}
            </div>
            {prices
              .filter((p) => p.cat === group)
              .map((p) => (
                <article
                  id={`service-${p.id}`}
                  data-service-id={p.id}
                  className="service-directory-item"
                  key={p.id}
                >
                  <div className="service-directory-copy">
                    <span className="label">{labels[i]}</span>
                    <h3>
                      <Link href={servicePath(lang, p.id)!}>
                        {lang === "hi" ? p.hi : p.en}
                      </Link>
                    </h3>
                    <p>{lang === "hi" ? p.detailHi : p.detailEn}</p>
                    <div className="button-row">
                      <Link className="pill" href={servicePath(lang, p.id)!}>
                        {lang === "hi" ? "पूरी सेवा देखें" : "Explore this service"}
                      </Link>
                      <Link className="text-link" href={quotePath(lang, p.id)}>
                        {t.estimate}
                      </Link>
                    </div>
                  </div>
                  <div className="service-directory-price">
                    <small>
                      {p.quoteOnly
                        ? lang === "hi"
                          ? "ज़रूरत के अनुसार"
                          : "Based on your brief"
                        : t.from}
                    </small>
                    <ServicePrice item={p} lang={lang} />
                  </div>
                </article>
              ))}
          </section>
        ))}
      </ServiceExplorer>
    </>
  );
}
