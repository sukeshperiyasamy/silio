"use client";
import Icon from "@/components/Icon";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { messages, type Lang } from "@/lib/site";
export default function Header({ lang }: { lang: Lang }) {
  const t = messages[lang],
    pathname = usePathname();
  const switchTo = lang === "en" ? "hi" : "en";
  const otherPath = pathname.replace(/^\/(en|hi)(?=\/|$)/, `/${switchTo}`);
  const links = [
    ["", t.navHome],
    ["/services", t.navServices],
    ["/portfolio", lang === "hi" ? "पोर्टफ़ोलियो" : "Portfolio"],
    ["/pricing", t.navPricing],
    ["/about", t.navAbout],
    ["/contact", t.navContact],
  ];
  return (
    <header className="nav">
      <div className="container navinner">
        <Link href={`/${lang}`} className="brand">
          silio
          <Icon name="spark" className="brand-mark" />
        </Link>
        <nav className="navlinks" aria-label="Main navigation">
          {links.map(([p, n]) => (
            <Link
              key={p}
              href={`/${lang}${p}`}
              aria-current={pathname === `/${lang}${p}` ? "page" : undefined}
            >
              {n}
            </Link>
          ))}
        </nav>
        <div className="actions">
          <a
            className="lang"
            href={otherPath}
            lang={switchTo}
            hrefLang={switchTo}
            aria-label={`Switch language to ${switchTo === "hi" ? "Hindi" : "English"}`}
          >
            {switchTo === "hi" ? "हिंदी" : "English"}
          </a>
          <Link className="pill" href={`/${lang}/contact`}>
            {t.estimate}
          </Link>
        </div>
      </div>
      <nav className="container mobile-nav" aria-label="Mobile navigation">
        {links.map(([p, n]) => (
          <Link
            key={p}
            href={`/${lang}${p}`}
            aria-current={pathname === `/${lang}${p}` ? "page" : undefined}
          >
            {n}
          </Link>
        ))}
      </nav>
    </header>
  );
}
