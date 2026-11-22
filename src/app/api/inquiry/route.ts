import { trackedPaths } from "@/lib/analytics-paths";
import { database } from "@/lib/db";
import { allowRequest } from "@/lib/rate-limit";
import {
  readInquiryBody,
  InquiryInputError,
  type ModelAttachment,
} from "@/lib/inquiry-body";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
function clean(value: unknown, max = 3000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>, attachment: ModelAttachment | undefined;
  try {
    ({ body, attachment } = await readInquiryBody(req));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof InquiryInputError
            ? error.message
            : "Invalid payload",
      },
      { status: error instanceof InquiryInputError ? error.status : 400 },
    );
  }
  if (clean(body.website)) return NextResponse.json({ ok: true }); // honeypot
  const name = clean(body.name, 100),
    email = clean(body.email, 150),
    phone = clean(body.phone, 20),
    service = clean(body.service, 150),
    budget = clean(body.budget, 70),
    message = clean(body.message, 3000);
  if (
    name.length < 2 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    phone.length < 7 ||
    !service ||
    message.length < 10
  )
    return NextResponse.json({ error: "Invalid form fields" }, { status: 400 });
  const projectUrl = clean(body.projectUrl, 2048);
  if (projectUrl) {
    try {
      const url = new URL(projectUrl);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        throw new Error("Invalid URL");
    } catch {
      return NextResponse.json(
        { error: "Provide a public HTTP or HTTPS website URL." },
        { status: 400 },
      );
    }
  }
  if (
    (body.purpose === "review" || service === "Free website review") &&
    !projectUrl
  )
    return NextResponse.json(
      { error: "Website URL is required for a review." },
      { status: 400 },
    );
  const rawCampaign = body.campaign;
  const campaign =
    rawCampaign &&
    typeof rawCampaign === "object" &&
    !Array.isArray(rawCampaign)
      ? Object.fromEntries(
          [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_content",
            "utm_term",
          ].flatMap((key) => {
            const value = clean(
              (rawCampaign as Record<string, unknown>)[key],
              120,
            );
            return value ? [[key, value]] : [];
          }),
        )
      : {};
  let savedId: string | undefined;
  let savedDb: Awaited<ReturnType<typeof database>> | undefined;
  if (process.env.MONGODB_URI) {
    try {
      if (!(await allowRequest(req, "inquiry", 20)))
        return NextResponse.json(
          { error: "Too many enquiries. Please try again later." },
          { status: 429 },
        );
      savedDb = await database();
      const record = await savedDb
        .collection("inquiries")
        .insertOne({
          page: trackedPaths.has(clean(body.page, 200))
            ? clean(body.page, 200)
            : null,
          name,
          email,
          phone,
          service,
          budget,
          message,
          projectUrl,
          campaign,
          purpose: clean(body.purpose, 30) || "project",
          createdAt: new Date(),
          status: "new",
          emailStatus: "not-configured",
          ...(attachment
            ? {
                attachment: {
                  filename: attachment.filename,
                  data: Buffer.from(attachment.content, "base64"),
                },
              }
            : {}),
        });
      savedId = record.insertedId.toHexString();
    } catch {
      return NextResponse.json(
        {
          error:
            "Unable to save your enquiry. Please try again or use WhatsApp.",
        },
        { status: 503 },
      );
    }
  }
  async function deliveryResult(status: string) {
    if (savedDb && savedId) {
      const { ObjectId } = await import("mongodb");
      await savedDb
        .collection("inquiries")
        .updateOne(
          { _id: new ObjectId(savedId) },
          { $set: { emailStatus: status } },
        )
        .catch(() => {});
    }
  }
  const apiKey = process.env.RESEND_API_KEY,
    to = process.env.INQUIRY_TO_EMAIL,
    from = process.env.INQUIRY_FROM_EMAIL;
  if ((!apiKey || !to || !from) && savedId)
    return NextResponse.json({
      ok: true,
      id: savedId,
      email: "not-configured",
    });
  if (!apiKey || !to || !from)
    return NextResponse.json(
      { error: "Email not configured. Use WhatsApp." },
      { status: 503 },
    );
  const content = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Budget: ${budget}`,
    `Details:\n${message}`,
    `Website: ${projectUrl || "Not provided"}`,
    `Campaign: ${JSON.stringify(campaign)}`,
  ].join("\n\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Silio enquiry: ${service}`,
        text: content,
        reply_to: email,
        ...(attachment ? { attachments: [attachment] } : {}),
      }),
    });
    if (!response.ok) {
      await deliveryResult("failed");
      if (savedId)
        return NextResponse.json({ ok: true, id: savedId, email: "failed" });
      return NextResponse.json(
        { error: "Email delivery failed" },
        { status: 502 },
      );
    }
    await deliveryResult("sent");
    return NextResponse.json({ ok: true, ...(savedId ? { id: savedId } : {}) });
  } catch {
    await deliveryResult("failed");
    if (savedId)
      return NextResponse.json({ ok: true, id: savedId, email: "failed" });
    return NextResponse.json(
      { error: "Email service unavailable" },
      { status: 502 },
    );
  }
}
