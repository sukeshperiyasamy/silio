# Silio: search visibility and client enquiries

## What the website now handles

Public pages have page-specific titles/descriptions, matching canonical and Open Graph URLs, English/Hindi alternatives with an English x-default, and branded sharing images. Primary service titles describe website development, web application MVPs and mobile app prototypes. Services retain their existing marketing URLs. The home page identifies Silio as an Organization and WebSite; service pages retain Service, breadcrumb and on-page FAQ structured data. No fictional address, ratings, clients or business outcomes are added. Structured data does not guarantee a rich search result.

The sitemap lists canonical public pages in both languages. Legacy About URLs redirect to Connect and are omitted from the sitemap. Admin pages remain noindex and API/admin paths are excluded from robots crawling. Query-string campaigns and estimates share the clean page canonical. Public social-card SVGs are the source artwork; PNGs are the sharing assets.

## Required owner step: Google Search Console

1. Open https://search.google.com/search-console and add a **URL-prefix property**: `https://silio.m24im1007.workers.dev/`.
2. Choose HTML-tag verification. Copy only the `content` value from the supplied `google-site-verification` tag.
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to that public verification value for the production build, rebuild and deploy. This is a public HTML token, not a Google password or private API credential. The code supports the tag; no ownership verification has been completed automatically.
4. Click Verify in Search Console. Then submit `sitemap.xml` under Sitemaps.
5. Use URL Inspection on the English home, primary website/web-app/mobile pages and useful Hindi equivalents. Request indexing for the most important pages. Check Page Indexing for errors; indexing requests and a sitemap do not guarantee inclusion or rankings.
6. Review Performance weekly: search queries, impressions, clicks and landing pages. Compare this with actual enquiries and estimate callback requests in `/admin/enquiries`. Existing analytics are indicative; referrers may be missing, and the lead archive is not automatically joined to Search Console.

Google guide: https://developers.google.com/search/docs/monitor-debug/search-console-start/

If adopting an owned domain, first connect it to Cloudflare, update `NEXT_PUBLIC_SITE_URL` during the build, redirect the old host to the new one and verify the new Search Console property. An owned domain supports a consistent brand and business email; buying a keyword domain does not guarantee better rankings. Do not change domains repeatedly.

## Focus the offer before expanding the site

Silio already has many specialist pages. Prioritize the three core offers instead of creating more thin pages:

| Buyer need | Existing page | Example search intent to investigate |
| --- | --- | --- |
| A clear business website | `/en/services/business-websites-jodhpur` | One-page business website development |
| A larger company website | `/en/services/business-website-development-jodhpur` | Small business website development |
| A scoped web workflow/MVP | `/en/services/custom-web-app-prototypes-jodhpur` | Web application MVP development |
| An Android prototype | `/en/services/android-app-prototypes-jodhpur` | Android app prototype development |
| An Android/iOS MVP | `/en/services/android-ios-mvp-jodhpur` | Cross-platform app MVP development |

These are topic ideas, not measured search-volume or ranking claims. Validate demand using actual Search Console queries and customer conversations. Legacy URL names do not limit the location-neutral service offer; keep existing links working. Monthly care remains distinct from project costs.

## First four weeks

**Week 1:** Verify Search Console and submit the sitemap. Pick one buyer group you understand, such as small business owners needing a website or founders validating one workflow. Check the primary service page answers scope, inputs, exclusions, starting cost and next steps. Link to the estimator and callback form.

**Week 2:** Publish one useful walkthrough of an existing demo with screenshots, the problem it illustrates, features, limits and how an equivalent paid project would be scoped. Clearly label it as demonstration work. When genuine client work is available, obtain permission and publish a factual case study. Use measured outcomes only when evidence exists.

**Week 3:** Share a relevant service page or walkthrough through your existing professional network and business communities that permit promotion. Explain the specific problem you solve. Offer the existing free website review to interested people; do not send bulk unsolicited messages. Ask contacts for introductions to people with a real requirement.

**Week 4:** Review search queries, useful page visits and actual qualified enquiries. Improve the one page getting relevant interest. Follow up on submitted estimates using the recorded permission. Track enquiry status (new, contacted, quoted, won/lost) so you can see whether visits lead to business.

Useful links for posts can carry UTM tags, for example:
`https://silio.m24im1007.workers.dev/en/review?utm_source=linkedin&utm_medium=social&utm_campaign=website-review`
Use only public campaign labels; never put names, phone numbers or emails in campaign URLs.

## Content that earns trust

Explain how a customer prepares content, what the quoted scope includes, how revisions work and which costs are separate. Keep clear paths to Services, Connect and the estimate form. Answer real questions from enquiries in the most relevant service page rather than repeating the same article everywhere. Avoid keyword stuffing, fabricated testimonials, purchased link schemes and near-duplicate city pages.

If Silio actually meets customers face to face, review Google Business Profile eligibility. Online-only businesses are not eligible; do not invent an office or address for Maps. Official eligibility: https://support.google.com/business/answer/13763036

SEO builds discovery over time. Search engines decide crawling, indexing and ranking. No code change can promise a ranking position, a fixed number of leads or immediate clients. Use useful content, genuine proof, referrals and timely follow-up alongside technical SEO.

Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
