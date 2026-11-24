import { createHash } from "node:crypto";
import {
  normalizeEstimate,
  estimateDescription,
  type EstimateSnapshot,
} from "@/lib/estimate-lead";
import { sameOrigin } from "@/lib/admin-auth";
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
  let estimate: EstimateSnapshot | undefined;
  let estimateRequestId: string | undefined;
  if (body.purpose === "estimate") {
    if (!sameOrigin(req))
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    if (
      body.contactPermission !== true ||
      typeof body.estimateRequestId !== "string" ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
        body.estimateRequestId,
      )
    )
      return NextResponse.json(
        { error: "Contact permission and a request ID are required" },
        { status: 400 },
      );
    try {
      estimate = normalizeEstimate(body.estimate);
    } catch {
      return NextResponse.json(
        { error: "Invalid estimate selections" },
        { status: 400 },
      );
    }
    estimateRequestId = body.estimateRequestId;
    if (!process.env.MONGODB_URI)
      return NextResponse.json(
        { error: "Estimate storage unavailable" },
        { status: 503 },
      );
  }
  const name = clean(body.name, 100),
    email = clean(body.email, 150),
    phone = estimate
      ? clean(body.phone, 32).replace(/[\s()-]/g, "")
      : clean(body.phone, 20),
    service = estimate
      ? estimate.kind === "printing"
        ? "3D printing estimate"
        : "Project estimate: " + estimate.items[0].name
      : clean(body.service, 150),
    budget = estimate
      ? `INR ${estimate.oneTime} one-time; INR ${estimate.monthly}/month`
      : clean(body.budget, 70),
    message = estimate
      ? estimateDescription(estimate) +
        (clean(body.message, 1500)
          ? "\nCustomer notes: " + clean(body.message, 1500)
          : "")
      : clean(body.message, 3000);
  if (estimate && !/^\+[1-9]\d{7,14}$/.test(phone))
    return NextResponse.json(
      { error: "Include a valid mobile country code" },
      { status: 400 },
    );
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
      const record = {
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
        ...(estimate
          ? {
              estimate,
              estimateRequestId,
              estimateFingerprint: createHash("sha256")
                .update(
                  JSON.stringify({ name, email, phone, estimate, message }),
                )
                .digest("hex"),
              language: body.language === "hi" ? "hi" : "en",
              contactPermission: {
                purpose: "estimate-follow-up",
                channels: ["phone", "email", "whatsapp"],
                acceptedAt: new Date(),
                noticeVersion: "estimate-v1",
              },
            }
          : {}),
        ...(attachment
          ? {
              attachment: {
                filename: attachment.filename,
                data: Buffer.from(attachment.content, "base64"),
              },
            }
          : {}),
      };
      if (estimate) {
        const result = await savedDb
          .collection("inquiries")
          .findOneAndUpdate(
            { estimateRequestId },
            { $setOnInsert: record },
            {
              upsert: true,
              returnDocument: "after",
              includeResultMetadata: true,
            },
          );
        if (!result.value) throw new Error("Estimate was not stored");
        if (result.value.estimateFingerprint !== record.estimateFingerprint)
          return NextResponse.json(
            { error: "Request ID already used; refresh and retry" },
            { status: 409 },
          );
        savedId = result.value._id.toString();
        if (result.lastErrorObject?.updatedExisting)
          return NextResponse.json({ ok: true, id: savedId });
      } else {
        const result = await savedDb.collection("inquiries").insertOne(record);
        savedId = result.insertedId.toHexString();
      }
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
