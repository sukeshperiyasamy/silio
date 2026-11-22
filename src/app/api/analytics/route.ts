import { boundedText } from "@/lib/request-input";
import { NextResponse } from "next/server";
import { database } from "@/lib/db";
import { sameOrigin } from "@/lib/admin-auth";
import { trackedPaths } from "@/lib/analytics-paths";
import { allowRequest } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 2048)
    return new NextResponse(null, { status: 413 });
  try {
    const text = await boundedText(request, 2048);
    if (text === null) return new NextResponse(null, { status: 413 });
    const body = JSON.parse(text);
    if (
      !body ||
      !trackedPaths.has(body.path) ||
      !["view", "duration"].includes(body.type) ||
      ![body.id, body.session].every(
        (v) =>
          typeof v === "string" &&
          /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
            v,
          ),
      )
    )
      return new NextResponse(null, { status: 400 });
    if (!(await allowRequest(request, "analytics", 300)))
      return new NextResponse(null, { status: 429 });
    const db = await database();
    if (body.type === "view") {
      await db.collection("page_views").updateOne(
        { eventId: body.id },
        {
          $setOnInsert: {
            eventId: body.id,
            session: body.session,
            path: body.path,
            source:
              typeof body.source === "string"
                ? body.source.slice(0, 80)
                : "direct",
            campaign:
              typeof body.campaign === "string"
                ? body.campaign.slice(0, 120)
                : "",
            createdAt: new Date(),
            duration: 0,
          },
        },
        { upsert: true },
      );
    } else {
      const duration = Number(body.duration);
      if (!Number.isFinite(duration) || duration < 0)
        return new NextResponse(null, { status: 400 });
      await db
        .collection("page_views")
        .updateOne(
          { eventId: body.id, session: body.session, path: body.path },
          { $max: { duration: Math.min(1800, Math.round(duration)) } },
        );
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
