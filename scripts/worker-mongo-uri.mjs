import { resolveSrv, resolveTxt } from "node:dns/promises";
// Expand Atlas discovery on the Node.js setup machine. Some Worker DNS runtimes
// reject SRV queries; the resulting standard URI uses the same TLS cluster.
export async function workerMongoUri(uri) {
  if (!uri?.startsWith("mongodb+srv://")) return uri;
  const u = new URL(uri);
  const [records, txt] = await Promise.all([
    resolveSrv("_mongodb._tcp." + u.hostname),
    resolveTxt(u.hostname).catch((e) => {
      if (e.code === "ENODATA") return [];
      throw e;
    }),
  ]);
  if (!records.length) throw new Error("MongoDB discovery returned no hosts");
  const parent = u.hostname.split(".").slice(1).join(".");
  if (records.some((r) => !r.name.endsWith("." + parent)))
    throw new Error("MongoDB discovery returned an unrelated host");
  if (txt.length > 1)
    throw new Error("MongoDB discovery returned multiple TXT records");
  const opts = new URLSearchParams(txt[0]?.join("") || "");
  for (const key of opts.keys())
    if (!["authSource", "replicaSet", "loadBalanced"].includes(key))
      throw new Error("Unsupported MongoDB DNS option");
  for (const [k, v] of u.searchParams) opts.set(k, v);
  opts.delete("srvMaxHosts");
  opts.delete("srvServiceName");
  if (!opts.has("tls") && !opts.has("ssl")) opts.set("tls", "true");
  const auth = u.username
    ? u.username + (u.password ? ":" + u.password : "") + "@"
    : "";
  return (
    "mongodb://" +
    auth +
    records.map((r) => r.name.replace(/\.$/, "") + ":" + r.port).join(",") +
    (u.pathname || "/") +
    "?" +
    opts
  );
}
