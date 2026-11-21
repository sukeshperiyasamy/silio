# Silio

Bilingual digital services website for Silio, based in Jodhpur, Rajasthan. Built with Next.js, React and TypeScript.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. The homepage redirects to `/en`; Hindi is at `/hi`. Run commands from this folder, not a nested package directory.

## Project structure

```text
src/
  app/
    [lang]/            Localized home, service landing pages, pricing, demos, estimator, review and contact
    api/inquiry/       Server-side email enquiry endpoint
    globals.css        Responsive design and styling
    layout.tsx         Document language and global metadata
    robots.ts          Search crawler configuration
    sitemap.ts         Localized sitemap
  components/          Navigation, footer, pricing filters, form and illustrative artwork
  lib/growth.ts        Featured offers, quote links and estimate calculations
  lib/service-pages.ts Dedicated pages for every service
  lib/site.ts          Brand, contact details, all 49 scoped packages and localized copy
  middleware.ts        Locale header for the HTML language attribute
public/                Silio favicon and static assets
tests/                 Estimate and enquiry validation tests
docs/                  Launch roadmap and owner setup tasks
references/            Original design reference
```

## Content

Edit `src/lib/site.ts` for contact details, prices, package scope and translations. Prices are starting estimates with explicit limits. The site includes WhatsApp links with the selected service prefilled. Homepage artwork is a local illustration, not a client portfolio or performance claim.

## Implemented growth features

- Core services: website development, web application development and mobile app development. Featured packages cover one-page websites (₹3,999), five-page websites (₹7,999), web-app MVPs (₹14,999), Android prototypes (₹9,999) and cross-platform MVPs (₹24,999). UI/UX, 3D design/printing and the remaining specialist services are additional offerings.
- 49 scoped packages across websites, shop tools, data, care, business management, marketing, automation, mobile apps and custom projects.
- English/Hindi interactive demos at `/en/demos` and `/hi/demos`. All business names, products and data in the demos are fictional; demo enquiries do not send messages.
- A project estimator at `/en/estimate`, keeping one-time estimates and recurring care separate. Calculations deduplicate selected packages and use the central price list.
- A comparison table on pricing, 49 dedicated Jodhpur-focused service pages, and a free human website review request at `/en/review`.
- Quote buttons prefill the chosen service. Estimator enquiries also prefill the proposed scope and starting budget.
- Allowlisted UTM campaign tags remain in browser session storage and accompany submitted enquiries. No third-party analytics script is added. Privacy copy explains this behaviour.
- Brand naming is recorded in `AGENTS.md`: **Silio**.

The services directory uses a sticky left-hand index of the main service categories and service details in the normal full-page document flow. Selecting a category jumps to its services on the right; normal page scrolling updates the active category. The details column has no internal scrollbar, and the footer follows all services with extra spacing. Mobile uses a sticky localized category selector with normal page scrolling. Category anchors and dedicated service URLs are preserved.

## Dedicated service pages and 3D work

Every advertised package has one dedicated page in each language, with unique use cases, required inputs, scope boundaries, FAQs, related services, canonical/hreflang metadata and Service/Breadcrumb/FAQ structured data. Existing five marketing URLs are preserved. New per-service context is in `src/lib/service-content.ts`; tests enforce complete coverage and unique slugs.

The 3D overview is `/en/services/3d-design-printing` (Hindi: `/hi/services/3d-design-printing`). `/services/3d-design-printing` redirects to the English version. It includes CAD, STL repair, electronics enclosures, PLA printing, prototypes, batches and display/educational models. Seven packages are priced as starting design fees, per-gram print rates or custom quotes, as appropriate. A separate print estimate enforces a ₹299 minimum per order at the proposed ₹5/g PLA basis. It is not a slicer or a confirmed quote.

Physical production is planned through an external provider, confirmed before an order. The site does not claim an in-house printer, certified tolerances or proven safety-critical components. Portfolio examples remain explicitly fictional or illustrative.

Model enquiries support one STL, STEP, STP, OBJ or 3MF file up to 8 MB. The endpoint bounds the streamed body, validates the extension and size, and sends the file as an email attachment when Resend is configured. Files are not placed in the repository or a public upload folder. A [Resend email attachment](https://resend.com/docs/api-reference/emails/send-email) uses filename plus base64 content. Model geometry is not parsed or certified, and the 3D viewer remains future work. WhatsApp users must attach the file manually. Hosts can impose lower request-size limits; use a compatible Node deployment or adjust `maxModelBytes` and the displayed limit together.

## Email enquiries

Copy `.env.example` to `.env.local`, then set:

- `NEXT_PUBLIC_SITE_URL`: your owned production domain. Defaults to `http://localhost:3000` for development; no domain ownership is assumed.
- `RESEND_API_KEY`: your Resend API key.
- `INQUIRY_TO_EMAIL`: the recipient mailbox.
- `INQUIRY_FROM_EMAIL`: a sender on your verified Resend domain.

Restart the server after changing environment variables. Without email configuration, the form displays an honest delivery error and offers WhatsApp. No API key is exposed to the browser. The endpoint validates payloads and includes a honeypot; add deployment-level rate limiting and spam protection before accepting public traffic. Review the privacy copy against your final hosting and data-retention practices before launch.

## Validation and production

```sh
npm test
npm run typecheck
npm run build
npm start
```

Deploy to a host that supports the Next.js Node runtime; static-only hosting cannot run the enquiry endpoint. Set the production URL before building so canonical links, sitemap and structured data use your actual domain.

See `docs/ROADMAP.md` for remaining operational tasks and the future authenticated CRM phase.

The original independent bilingual starter has been integrated and rebranded as Silio. Unused downloaded template code, demo assets and duplicate starter files have been removed. Next.js remains on the supplied version 15 family, updated to its patched release; the PostCSS override keeps its transitive dependency patched.
