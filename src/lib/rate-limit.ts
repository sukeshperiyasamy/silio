import { createHash } from "node:crypto";
import { database } from "./db";
import { analyticsDatabase } from "./worker-context";
export async function allowRequest(
  request: Request,
  scope: string,
  limit: number,
) {
  const d1 = analyticsDatabase();
  const window = Math.floor(Date.now() / 600000);
  const key = createHash("sha256")
    .update(
      `${process.env.ADMIN_SESSION_SECRET}:${scope}:${(d1 ? request.headers.get("cf-connecting-ip") : request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()) || "local"}:${window}`,
    )
    .digest("hex");
  if (d1) {
    const record = await d1
      .prepare(
        `INSERT INTO request_limits (key, count, expires_at)
      VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count`,
      )
      .bind(key, (window + 2) * 600000)
      .first<{ count: number }>();
    if (!record) throw new Error("Rate limit storage unavailable");
    return record.count <= limit;
  }
  const db = await database();
  const record = await db
    .collection<{ _id: string; count: number; expiresAt: Date }>(
      "request_limits",
    )
    .findOneAndUpdate(
      { _id: key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((window + 2) * 600000) },
      },
      { upsert: true, returnDocument: "after" },
    );
  return Number(record?.count || 0) <= limit;
}
