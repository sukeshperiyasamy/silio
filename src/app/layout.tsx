import "./globals.css";
import { site } from "@/lib/site";
import { headers } from "next/headers";
export const metadata = {
  metadataBase: new URL(site.url),
  title: "Silio | Digital Solutions",
  description:
    "Website, web application and mobile app development. UI/UX, 3D design and printing, and data services are available as additional services.",
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
