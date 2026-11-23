import { readFileSync } from "node:fs";
import { sanitizeWorker } from "./sanitize-worker.mjs";
sanitizeWorker();
const config = JSON.parse(
  readFileSync("wrangler.jsonc", "utf8").replace(/,\s*([}\]])/g, "$1"),
);
if (
  !config.d1_databases[0].database_id ||
  /^0{8}-/.test(config.d1_databases[0].database_id)
) {
  throw new Error(
    "Create silio-analytics in your Cloudflare account and replace the placeholder database_id in wrangler.jsonc first.",
  );
}
const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost");
if (
  site.protocol !== "https:" ||
  /^(localhost|127\.0\.0\.1)$/.test(site.hostname)
) {
  throw new Error(
    "Set NEXT_PUBLIC_SITE_URL to your actual HTTPS workers.dev address or owned domain before building for deployment.",
  );
}
console.log(
  "Deployment configuration checked. Runtime secrets must be configured separately in Cloudflare.",
);
