# Silio project instructions

- The company name is **Silio**. Always use Silio (or SILIO / silio in visual branding and identifiers), never Cilio.
- Preserve English and Hindi routes and localize new visitor-facing features in both languages.
- Package prices are starting estimates with explicit scope limits. Keep monthly care separate from one-time project costs.
- Label fictional demonstration work clearly; do not invent client testimonials or business outcomes.
- Keep secrets, real enquiries, node_modules and generated builds out of Git.
- When the user types `/graphify`, use the installed graphify skill at `~/.Codex/skills/graphify/SKILL.md` before doing anything else.

- Every advertised service needs a dedicated English/Hindi page with service-specific scope, preparation, exclusions, FAQs, metadata and enquiry links. Preserve existing marketing URLs.
- 3D printing is planned through an external provider; do not claim an in-house printer or validated engineering tolerances. Keep per-gram rates, minimum print charges and design costs distinct.

- Primary services are website development, web application development and mobile app development. UI/UX design, 3D design/printing and other specialist services are secondary. Keep navigation, featured offers and marketing copy consistent with this priority.

- Keep public copy and SEO metadata location-neutral. Do not target only Jodhpur or Rajasthan. Preserve existing marketing URLs while removing geographic restrictions from visible text and structured data.

- Use SVG icons for branding and interface decoration. Do not use emoji characters on the site; icons must render consistently on mobile and desktop.

- Keep the short company introduction and contact form together on the Connect page (`/en/contact` and `/hi/contact`). Navigation uses Connect / जुड़ें; legacy About URLs redirect permanently to the matching contact page.

- Estimator leads must save contact details and a server-calculated estimate snapshot before showing success. Keep WhatsApp optional, record explicit permission for estimate follow-up, and never collect contact details merely from browsing or adjusting estimates.

- Keep public SEO metadata in `src/lib/seo.ts` consistent with each page, using bilingual canonical/alternate links and sharing images. Never invent addresses, client proof, reviews or ranking guarantees. Search Console ownership verification needs the owner-provided public token; deploying metadata does not verify or index the site automatically.

- Services is the main service-and-price catalogue. Do not recreate a separate Pricing page or navigation item. Legacy `/en/pricing` and `/hi/pricing` URLs redirect permanently to the matching Services page.
