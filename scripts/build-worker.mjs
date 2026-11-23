import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { sanitizeWorker } from "./sanitize-worker.mjs";
const cli = fileURLToPath(
  new URL(
    "../node_modules/@opennextjs/cloudflare/dist/cli/index.js",
    import.meta.url,
  ),
);
const result = spawnSync(
  process.execPath,
  [cli, "build", ...process.argv.slice(2)],
  { stdio: "inherit" },
);
// OpenNext copies .env file values into its generated server environment module.
// Runtime secrets belong in Worker bindings, including when a local build fails.
sanitizeWorker();
process.exit(result.status ?? 1);
