import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { parseEnv } from "node:util";
export function sanitizeWorker() {
  const envFile = ".open-next/cloudflare/next-env.mjs";
  if (existsSync(envFile)) {
    const source = readFileSync(envFile, "utf8");
    const clean = ["production", "development", "test"]
      .map((mode) => {
        const raw = source.match(
          new RegExp("export const " + mode + " = (.*);"),
        )?.[1];
        const values = raw ? JSON.parse(raw) : {};
        return (
          "export const " +
          mode +
          " = " +
          JSON.stringify(
            Object.fromEntries(
              Object.entries(values)
                .filter(([k]) => k.startsWith("NEXT_PUBLIC_"))
                .map(([k, v]) => [k, process.env[k] ?? v]),
            ),
          ) +
          ";"
        );
      })
      .join("\n");
    writeFileSync(envFile, clean + "\n");
  }
  const privateValues = [];
  for (const name of [".env.local", ".env.production.local", ".dev.vars"]) {
    if (!existsSync(name)) continue;
    const vars = parseEnv(readFileSync(name, "utf8"));
    for (const [k, v] of Object.entries(vars))
      if (v && /PASSWORD|SECRET|MONGODB_URI|API_KEY/.test(k))
        privateValues.push(v);
  }
  function scan(dir) {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const path = dir + "/" + e.name;
      if (e.isDirectory()) scan(path);
      else if (e.name.startsWith(".env")) {
        throw new Error(
          "Environment file found in Worker output; refusing deployment.",
        );
      } else if (/\.(m?js|json|html|txt)$/.test(e.name)) {
        const text = readFileSync(path, "utf8");
        if (privateValues.some((v) => text.includes(v)))
          throw new Error(
            "Configured secret remains in Worker output; refusing deployment.",
          );
      }
    }
  }
  scan(".open-next");
  console.log("Worker output checked: private local values excluded.");
}
