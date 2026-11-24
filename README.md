# Silio

Bilingual digital services website for Silio, built for businesses and teams. Built with Next.js, React and TypeScript.

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
- A comparison table on pricing, 49 dedicated service pages with location-neutral copy, and a free human website review request at `/en/review`.
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

Restart the server after changing environment variables. With MongoDB configured, forms are saved even without email delivery. If neither storage nor email is configured, the form reports that delivery is unavailable and offers WhatsApp. No API key is exposed to the browser. The endpoint validates payloads and includes a honeypot; add deployment-level rate limiting and spam protection before accepting public traffic. Review the privacy copy against your final hosting and data-retention practices before launch.

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

Public copy and metadata are location-neutral. Original service URL slugs remain unchanged to preserve existing marketing links.

## Private enquiries and first-party analytics

Set server-only `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Local values are in the ignored `.env.local`; never commit this file or share its contents. Node.js 22+ is required. Initialize indexes with `npm run db:setup`. MongoDB Atlas must allow the server network address.

Open `/admin` and sign in with `ADMIN_PASSWORD`. The dashboard shows page views, anonymous browser-tab sessions, approximate elapsed time, daily traffic, sources, and paginated enquiries. Filters cover 1, 7, 30 or 90 days and individual pages. Enquiry statuses can be updated and model files downloaded after authentication. The admin area is not linked publicly or indexed. Sessions last eight hours in signed HttpOnly cookies; set a strong password and rotate the session secret to invalidate sessions. Login, analytics and enquiry endpoints have database-backed request limits; configure trusted proxy headers and deployment-level rate limiting for public production use.

Forms are saved in MongoDB before optional email delivery. If email fails after storage succeeds, the enquiry is still accepted and its delivery state is visible to the admin. Models are stored privately with their enquiry, not in public assets. Back up and manage retention of enquiries and files according to your business policy; no automatic enquiry deletion is configured.

Page analytics use first-party requests, strip query strings and store no raw IP address, fingerprint or advertising identifier. A random session ID lasts for the browser tab. Do Not Track and Global Privacy Control disable browser analytics. Page events expire after approximately 90 days: MongoDB uses a TTL index for local/Node.js hosting; Cloudflare D1 uses a daily scheduled cleanup. Traffic counts are indicative rather than billing-grade. Background elapsed time can be included, and missing exit events appear as zero seconds. Browser blockers or disabled storage may prevent measurement. Set these environment variables and run index setup on the hosting environment too: GitHub source alone does not configure production secrets or deploy the site.

## Long-term forms and enquiry archive

`/admin/enquiries` is the protected all-time archive. It supports literal-text search, status and date filters, pagination, model downloads, status updates and authenticated CSV exports. Enquiry records and model files have no automatic expiry; only page analytics and rate-limit records use TTL cleanup. CSV exports omit model bytes; back up the MongoDB database including binary attachments for full recovery. Retention does not guarantee permanent durability: configure Atlas backups or maintain verified database backups and periodically test restoration. Enquiry data is private and must not be committed to Git.


## Cloudflare Workers deployment

See [docs/cloudflare-deployment.md](docs/cloudflare-deployment.md) for setup, commands, secrets, D1 migrations and acceptance checks. The Worker uses D1 for analytics/rate limits and MongoDB for enquiries/attachments. `npm run dev` retains the existing MongoDB-only local workflow. Existing MongoDB analytics are not copied to D1 automatically. A Cloudflare account, actual D1 database ID and production site URL are required before deployment; the tracked placeholder prevents accidental deployment to an unconfigured database.


## Estimate callback requests

Both the project and print estimators offer an inline contact step. A customer explicitly submits their name, international mobile number, email, optional notes and permission for phone/email/WhatsApp follow-up about that estimate. Viewing or adjusting an estimate does not collect contact details. On success, WhatsApp is an optional continuation; no WhatsApp account or login is needed to submit the request.

`/api/inquiry` validates estimate selections and recalculates all costs from the catalogue. The stored snapshot separates one-time costs, monthly care, printing minimums, per-gram charges and design fees. Only successful MongoDB persistence produces a saved state. Request IDs and the `estimate_request_unique` sparse unique index make retries idempotent; apply indexes with `npm run db:setup` before deploying this change. Identical retries return the existing record without repeating email delivery. All standard enquiry protections remain active.

In `/admin/enquiries`, estimate leads show selected services, scope, totals and the contact permission. Phone/email links and an explicit WhatsApp follow-up link let the team respond manually. CSV exports include estimate amounts, items and permission timestamps. No automatic WhatsApp message is sent. Enquiry retention and backups follow the same policy as other leads.


## Search visibility

Public metadata is centralized in `src/lib/seo.ts`, including canonical/language links, page-specific social metadata and bilingual branded sharing cards. See [docs/seo-and-client-plan.md](docs/seo-and-client-plan.md) for Search Console verification, sitemap submission and a practical client-enquiry plan. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional and public; ownership verification, indexing and rankings are not performed or guaranteed by deploying this code.
