import { site, type Lang } from "@/lib/site";
export default function ContactEmail({ lang }: { lang: Lang }) {
  const placeholder = site.email.endsWith(".example");
  return (
    <div className="contact-email">
      {placeholder ? (
        <span className="contact-email-address">{site.email}</span>
      ) : (
        <a className="contact-email-address" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      )}
      {placeholder && (
        <small>
          {lang === "hi"
            ? "नमूना ईमेल — अभी सक्रिय नहीं है"
            : "Placeholder email — not active yet"}
        </small>
      )}
    </div>
  );
}
