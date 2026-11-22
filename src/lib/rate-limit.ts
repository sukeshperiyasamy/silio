import { createHash } from "node:crypto";
import { database } from "./db";
export async function allowRequest(
  request: Request,
  scope: string,
  limit: number,
) {
  const db = await database();
  const window = Math.floor(Date.now() / 600000);
  const key = createHash("sha256")
    .update(
      `${process.env.ADMIN_SESSION_SECRET}:${scope}:${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"}:${window}`,
    )
    .digest("hex");
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
