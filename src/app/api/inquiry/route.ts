import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
function clean(value: unknown, max = 3000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
export async function POST(req: NextRequest) {
  const len = Number(req.headers.get("content-length") || "0");
  if (len > 12000)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 12000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("Invalid payload");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
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
  const apiKey = process.env.RESEND_API_KEY,
    to = process.env.INQUIRY_TO_EMAIL,
    from = process.env.INQUIRY_FROM_EMAIL;
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
      }),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Email delivery failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Email service unavailable" },
      { status: 502 },
    );
  }
}
