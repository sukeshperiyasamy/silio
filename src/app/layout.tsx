import "./globals.css";
import { site } from "@/lib/site";
import { headers } from "next/headers";
export const metadata = {
  metadataBase: new URL(site.url),
  title: "Silio | Digital Solutions in Jodhpur",
  description:
    "Affordable Excel data work, websites, web apps, mobile apps, UI/UX and AI solutions in Jodhpur, Rajasthan.",
  icons: { icon: "/favicon.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = (await headers()).get("x-silio-lang") === "hi" ? "hi" : "en";
  return (
    <html lang={lang}>
      <body>
        <a className="skip-link" href="#main">
          {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to content"}
        </a>
        {children}
      </body>
    </html>
  );
}
