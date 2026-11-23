import { parseEnv } from "node:util";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { workerMongoUri } from "./worker-mongo-uri.mjs";
const local = existsSync(".env.local")
  ? parseEnv(readFileSync(".env.local", "utf8"))
  : {};
const input = { ...local, ...process.env };
for (const k of ["MONGODB_URI", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"])
  if (!input[k]) throw new Error("Missing server configuration: " + k);
const values = {
  MONGODB_URI: await workerMongoUri(input.MONGODB_URI),
  MONGODB_DB: input.MONGODB_DB || "silio",
  ADMIN_PASSWORD: input.ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET: input.ADMIN_SESSION_SECRET,
};
if (process.argv.includes("--preview")) {
  values.MONGODB_DB = "silio_worker_verification";
  writeFileSync(
    ".dev.vars",
    Object.entries(values)
      .map(([k, v]) => k + "=" + JSON.stringify(v))
      .join("\n") + "\n",
  );
  console.log(
    "Prepared ignored .dev.vars with an isolated verification database. No secrets displayed.",
  );
} else {
  // MONGODB_DB is a non-secret Wrangler variable, not a secret binding.
  delete values.MONGODB_DB;
  for (const k of ["RESEND_API_KEY", "INQUIRY_TO_EMAIL", "INQUIRY_FROM_EMAIL"])
    if (input[k]) values[k] = input[k];
  const result = spawnSync(
    process.execPath,
    ["node_modules/wrangler/bin/wrangler.js", "secret", "bulk"],
    { input: JSON.stringify(values), stdio: ["pipe", "inherit", "inherit"] },
  );
  process.exit(result.status ?? 1);
}
