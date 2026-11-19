import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/inquiry/route";

const envKeys = [
  "RESEND_API_KEY",
  "INQUIRY_TO_EMAIL",
  "INQUIRY_FROM_EMAIL",
] as const;
const originalEnv = Object.fromEntries(
  envKeys.map((key) => [key, process.env[key]]),
);
const valid = {
  name: "Local Test",
  email: "qa@example.com",
  phone: "9999999999",
  service: "One-page business website",
  message: "A local test enquiry only.",
};
const request = (data: unknown) =>
  new NextRequest("http://localhost/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
beforeEach(() => {
  for (const key of envKeys) delete process.env[key];
});
afterEach(() => {
  mock.restoreAll();
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

test("rejects malformed objects and incomplete enquiries", async () => {
  for (const data of [null, [], {}, { ...valid, email: "invalid" }])
    assert.equal((await POST(request(data))).status, 400);
});
test("rejects oversized enquiries before sending", async () => {
  assert.equal(
    (await POST(request({ ...valid, message: "x".repeat(13000) }))).status,
    413,
  );
});
test("a review requires a valid HTTP website URL", async () => {
  assert.equal(
    (await POST(request({ ...valid, purpose: "review" }))).status,
    400,
  );
  assert.equal(
    (
      await POST(
        request({
          ...valid,
          purpose: "review",
          projectUrl: "javascript:alert(1)",
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await POST(
        request({
          ...valid,
          purpose: "review",
          projectUrl: "https://user:secret@example.com",
        }),
      )
    ).status,
    400,
  );
});
test("unconfigured delivery returns an honest unavailable status", async () => {
  assert.equal((await POST(request(valid))).status, 503);
});
test("honeypot submissions do not contact an email provider", async () => {
  const spy = mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected network call");
  });
  assert.equal(
    (await POST(request({ ...valid, website: "spam" }))).status,
    200,
  );
  assert.equal(spy.mock.callCount(), 0);
});
test("email includes review URL and only allowlisted, bounded campaign tags", async () => {
  process.env.RESEND_API_KEY = "test-only-key";
  process.env.INQUIRY_TO_EMAIL = "owner@example.com";
  process.env.INQUIRY_FROM_EMAIL = "test@example.com";
  let payload: Record<string, string> = {};
  mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, options: RequestInit) => {
      payload = JSON.parse(String(options.body));
      return Response.json({ id: "local-test" });
    },
  );
  const result = await POST(
    request({
      ...valid,
      purpose: "review",
      projectUrl: "https://example.com",
      campaign: {
        utm_source: "instagram",
        utm_campaign: "x".repeat(150),
        ignored: "do-not-send",
      },
    }),
  );
  assert.equal(result.status, 200);
  assert.match(payload.text, /Website: https:\/\/example.com/);
  assert.match(payload.text, /instagram/);
  assert.ok(!payload.text.includes("do-not-send"));
  assert.ok(!payload.text.includes("x".repeat(121)));
  assert.match(payload.subject, /^Silio enquiry:/);
});
test("provider failure does not report a successful delivery", async () => {
  process.env.RESEND_API_KEY = "test-only-key";
  process.env.INQUIRY_TO_EMAIL = "owner@example.com";
  process.env.INQUIRY_FROM_EMAIL = "test@example.com";
  mock.method(globalThis, "fetch", async () =>
    Response.json({ error: "Unavailable" }, { status: 500 }),
  );
  assert.equal((await POST(request(valid))).status, 502);
});

function modelRequest(
  filename: string,
  content: BlobPart = "solid sample\nendsolid sample",
) {
  const form = new FormData();
  for (const [key, value] of Object.entries(valid)) form.set(key, value);
  form.set("service", "PLA FDM 3D printing");
  form.set("campaign", JSON.stringify({ utm_source: "3d-demo" }));
  form.set("model", new File([content], filename));
  return new NextRequest("http://localhost/api/inquiry", {
    method: "POST",
    body: form,
  });
}
test("a multipart model is forwarded as a bounded email attachment", async () => {
  process.env.RESEND_API_KEY = "test-only-key";
  process.env.INQUIRY_TO_EMAIL = "owner@example.com";
  process.env.INQUIRY_FROM_EMAIL = "test@example.com";
  let sent: {
    attachments?: { filename: string; content: string }[];
    text?: string;
  } = {};
  mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, options: RequestInit) => {
      sent = JSON.parse(String(options.body));
      return Response.json({ id: "local-test" });
    },
  );
  assert.equal((await POST(modelRequest("enclosure.stl"))).status, 200);
  assert.equal(sent.attachments?.[0].filename, "enclosure.stl");
  assert.equal(
    Buffer.from(sent.attachments![0].content, "base64").toString(),
    "solid sample\nendsolid sample",
  );
  assert.match(sent.text!, /3d-demo/);
});
test("unsupported, empty and oversized model attachments are rejected", async () => {
  assert.equal((await POST(modelRequest("script.exe"))).status, 400);
  assert.equal((await POST(modelRequest("empty.stl", ""))).status, 400);
  assert.equal(
    (await POST(modelRequest("large.stl", new Uint8Array(8 * 1024 * 1024 + 1))))
      .status,
    413,
  );
});
test("model uploads do not claim success when email is unconfigured", async () => {
  assert.equal((await POST(modelRequest("part.STEP"))).status, 503);
});
