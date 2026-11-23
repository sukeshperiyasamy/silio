import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
const preview = parseEnv(readFileSync(".dev.vars", "utf8"));
assert.equal(
  preview.MONGODB_DB,
  "silio_worker_verification",
  "Prepare the isolated preview environment before running this check",
);
assert.ok(!preview.RESEND_API_KEY, "Verification must not send real email");
import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";
const base = "http://localhost:8787";
const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});
const name = "SILIO_WORKER_QA_" + randomUUID();
const db = client.db("silio_worker_verification");
try {
  for (const path of [
    "/en",
    "/hi",
    "/en/services",
    "/hi/services",
    "/en/services/3d-design-printing",
  ]) {
    const res = await fetch(base + path);
    assert.equal(res.status, 200, path);
    await res.text();
  }
  const login = await fetch(base + "/api/admin/session", {
    method: "POST",
    headers: {
      Origin: base,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ password: process.env.ADMIN_PASSWORD }),
    redirect: "manual",
  });
  assert.equal(login.status, 303, "Worker admin login");
  assert.ok(login.headers.get("set-cookie")?.includes("HttpOnly"));
  const headers = { Cookie: login.headers.get("set-cookie").split(";")[0] };
  const event = {
    id: randomUUID(),
    session: randomUUID(),
    type: "view",
    path: "/en",
    source: "worker-verification",
  };
  const analytics = await fetch(base + "/api/analytics", {
    method: "POST",
    headers: { Origin: base, "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  assert.equal(analytics.status, 204, "D1 view");
  for (const page of ["/en/contact", "/hi/contact"]) {
    const result = await fetch(base + "/api/inquiry", {
      method: "POST",
      headers: { Origin: base, "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: "qa@example.invalid",
        phone: "9999999999",
        service: "Website",
        message: "Synthetic Worker deployment verification.",
        page,
      }),
    });
    assert.equal(result.status, 200, "Worker enquiry");
  }
  const form = new FormData();
  for (const [k, v] of Object.entries({
    name,
    email: "qa@example.invalid",
    phone: "9999999999",
    service: "PLA FDM 3D printing",
    message: "Synthetic model upload verification.",
    page: "/en/services/3d-design-printing",
  }))
    form.set(k, v);
  form.set("model", new File(["solid qa\nendsolid qa"], "worker-qa.stl"));
  assert.equal(
    (
      await fetch(base + "/api/inquiry", {
        method: "POST",
        headers: { Origin: base },
        body: form,
      })
    ).status,
    200,
    "Worker model enquiry",
  );
  await client.connect();
  const records = await db.collection("inquiries").find({ name }).toArray();
  assert.equal(records.length, 3, "MongoDB retained records");
  const model = records.find((r) => r.attachment);
  assert.ok(model);
  assert.equal(
    (await fetch(base + "/api/admin/attachment/" + model._id)).status,
    401,
  );
  const file = await fetch(base + "/api/admin/attachment/" + model._id, {
    headers,
  });
  assert.equal(file.status, 200);
  assert.equal(await file.text(), "solid qa\nendsolid qa");
  const change = await fetch(base + "/api/admin/inquiry", {
    method: "POST",
    headers: {
      ...headers,
      Origin: base,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id: String(model._id),
      status: "quoted",
      returnTo: "/admin/enquiries",
    }),
    redirect: "manual",
  });
  assert.equal(change.status, 303);
  const csv = await fetch(base + "/api/admin/enquiries/export?q=" + name, {
    headers,
  });
  assert.equal(csv.status, 200);
  assert.ok((await csv.text()).includes(name), "streamed CSV");
  const archive = await fetch(base + "/admin/enquiries?q=" + name, { headers });
  assert.equal(archive.status, 200);
  assert.ok((await archive.text()).includes(name));
  const report = await fetch(base + "/admin", { headers });
  assert.equal(report.status, 200);
  assert.ok((await report.text()).includes("Cloudflare D1"), "D1 dashboard");
  assert.equal((await fetch(base + "/api/admin/enquiries/export")).status, 401);
  console.log(
    "PASS: Worker English/Hindi pages, D1 event/report, login, 3 independent MongoDB saves, status, streamed CSV and protected model download.",
  );
} finally {
  await client.connect();
  await db
    .collection("inquiries")
    .deleteMany({ name, email: "qa@example.invalid" });
  await client.close();
}
