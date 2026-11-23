# Deploy Silio on Cloudflare Workers

Cloudflare uses D1 for new analytics and hashed request-limit counters. MongoDB Atlas keeps enquiries, statuses and model attachments. Enquiries are not duplicated into D1. Existing MongoDB analytics are not imported automatically: the Cloudflare dashboard reports new D1 traffic from cutover onward. Ordinary `npm run dev` and Node.js hosting retain the MongoDB-only workflow.

## Account setup

1. Use Node.js 22.13+ (24 LTS recommended). Run `npm ci`.
2. Sign in with `npx wrangler login`, then check `npx wrangler whoami`.
3. Run `npx wrangler d1 create silio-analytics`. Replace the all-zero `database_id` in `wrangler.jsonc` with the ID returned by your account. Keep the binding `ANALYTICS_DB`. Database IDs are configuration, not passwords.
4. Run `npm run d1:migrate:remote` to create analytics tables. This never changes MongoDB or enquiry data.
5. Load the private local configuration into Cloudflare using `npm run worker:secrets`. This uses `.env.local` (or existing shell environment variables), expands Atlas SRV/TXT records into a standard TLS connection string and sends secrets to Wrangler through stdin. Values are never printed or placed in shell arguments. The same MongoDB cluster and credentials are used. Rerun after a credential rotation or cluster topology change.

The command sets `MONGODB_URI`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and any configured optional email values (`RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`). Without email credentials, successfully stored enquiries are still accepted. Some Worker runtimes reject SRV discovery queries; this setup resolves discovery on the Node.js setup machine instead. If setting secrets manually, use the Atlas **standard** `mongodb://` TLS connection string, not the SRV URI that failed local Worker DNS verification. Never put credentials in Git/config files or public frontend variables.

`MONGODB_DB=silio` is a non-secret variable in `wrangler.jsonc`; change it there if you intentionally use another database.

Atlas Network Access must permit Worker connections. Workers do not have one fixed outbound IP. Choose an appropriate Atlas access policy for this deployment; never disable authentication. These scripts do not modify Atlas access rules.

## Build and deploy

Find your workers.dev subdomain in Cloudflare. The Worker name is `silio`; replace the example with your real HTTPS address or custom domain:

```powershell
$env:NEXT_PUBLIC_SITE_URL = "https://silio.YOUR-SUBDOMAIN.workers.dev"
npm run deploy
```

This validates the database ID and site URL, builds Next.js with OpenNext and deploys the custom Worker. The actual URL must be present during the build for canonical links, sitemap and metadata. Changing a runtime variable alone does not change previously built public metadata. Do not deploy the example hostname. An account-free local build is available using `npm run build:worker`. The build wrapper strips private `.env` values from OpenNext's generated environment module and checks the Worker output before it can be deployed; runtime secrets must come from Cloudflare bindings.

No R2 bucket, paid image product or other paid binding is configured. The current app has no ISR/revalidation requirement. Stay on your chosen Cloudflare plan and monitor Workers CPU/requests, D1 and Atlas quotas. Build success does not certify Free-plan CPU capacity.

## GitHub automatic deployments

After account setup and committing the actual D1 database ID:

- For an existing `silio` Worker, open Settings > Builds > Connect and select GitHub repository `sukeshperiyasamy/silio`, branch `main`. If no Worker exists yet, use Workers & Pages > Create application > GitHub.
- Worker name: `silio`; repository root: `/`.
- Build command: `npm run build:worker`.
- Deploy command: `npm run deploy:worker`.
- Build variable: `NEXT_PUBLIC_SITE_URL` set to your real production HTTPS URL. Use Node.js 24 (`NODE_VERSION=24` if required by the build settings).
- Add runtime secrets separately under Worker Settings > Variables and Secrets. They are not automatically copied from `.env.local` or the build environment.
- Bind `ANALYTICS_DB` to the production D1 database. Apply new migrations deliberately before deploying code that requires them.

Do not give untrusted preview branches production bindings or secrets.

## Local Worker verification

```powershell
npm run worker:preview-env
npm run d1:migrate:local
npm run build:worker
npm run preview:worker
```

Wrangler emulates D1 locally without touching your remote D1 database. Open `http://localhost:8787` (use the same hostname for forms and the page origin). For full MongoDB/admin tests, run `npm run worker:preview-env` first. It creates ignored `.dev.vars` with the standard connection URI and an isolated `silio_worker_verification` database. It overwrites previous preview settings deliberately and omits email delivery. `.env.local` is used by Next.js development/builds; `.dev.vars` supplies Worker-preview runtime secrets. Never commit either file. Missing D1 fails closed instead of silently switching storage on Cloudflare.

With the preview running, `npm run test:worker` performs synthetic HTTP checks against `http://localhost:8787`, including actual MongoDB writes to `silio_worker_verification`, protected downloads and CSV streaming. It deletes only its uniquely tagged enquiry fixtures afterward. Run only after preparing the isolated preview environment; the test does not send email.

## Acceptance checks

- Open English/Hindi home, services, pricing and a dedicated service page. Check production canonical URLs and sitemap.
- Submit a clearly synthetic enquiry from each form type/language. Verify `/admin/enquiries`, status updates and authenticated CSV export.
- Upload/download a harmless supported model. Anonymous model downloads and CSV exports must fail.
- Verify wrong-password rejection, valid login, dashboard and logout.
- Visit two public pages and check D1 views/durations in `/admin`. DNT/GPC disables tracking. Raw IPs are not saved; trusted `CF-Connecting-IP` is salted/hashed for rate limits.
- Verify separate requests can query MongoDB without cross-request I/O errors. Each Worker request owns its client, closed after its response stream finishes.
- The daily cron deletes D1 events older than approximately 90 days and expired rate counters. It never deletes enquiries or models. Keep the cron enabled.
- Monitor CPU/resource errors after deployment; local preview cannot certify production Free-plan capacity.

MongoDB enquiries have no automatic expiry. Configure independent backups including attachments and test restoration. D1 is not a backup of enquiries. Keep private exports and backups out of Git.

References: https://opennext.js.org/cloudflare/get-started, https://opennext.js.org/cloudflare/howtos/custom-worker, https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb/, https://developers.cloudflare.com/d1/get-started/
