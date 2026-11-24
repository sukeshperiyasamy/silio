import { test, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/inquiry/route";
import { normalizeEstimate } from "../src/lib/estimate-lead";
const envKeys = [
  "MONGODB_URI",
  "RESEND_API_KEY",
  "INQUIRY_TO_EMAIL",
  "INQUIRY_FROM_EMAIL",
];
const original = Object.fromEntries(envKeys.map((k) => [k, process.env[k]]));
const cache = globalThis as typeof globalThis & {
  silioMongo?: Promise<MongoClient>;
};
afterEach(() => {
  mock.restoreAll();
  delete cache.silioMongo;
  for (const k of envKeys) {
    if (original[k] === undefined) delete process.env[k];
    else process.env[k] = original[k];
  }
});
const selection = {
  kind: "project",
  packageIds: ["landing", "whatsapp-catalogue", "qr-menu"],
  careId: "maintenance",
};
const valid = {
  purpose: "estimate",
  estimate: selection,
  estimateRequestId: "11111111-1111-4111-8111-111111111111",
  contactPermission: true,
  name: "Estimate QA",
  email: "qa@example.invalid",
  phone: "+91 99999 99999",
  message: "",
  language: "hi",
  page: "/hi/estimate",
};
function request(body: object, origin = "http://localhost") {
  return new NextRequest("http://localhost/api/inquiry", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
function fixture(fail = false) {
  const records = new Map<string, Record<string, unknown>>();
  process.env.MONGODB_URI = "mongodb://unused-test-host";
  for (const k of envKeys.slice(1)) delete process.env[k];
  mock.method(globalThis, "fetch", async () => {
    throw Error("No real external messages in tests");
  });
  cache.silioMongo = Promise.resolve({
    db: () => ({
      collection: (name: string) => ({
        findOneAndUpdate: async (
          filter: { estimateRequestId: string },
          update: { $setOnInsert: Record<string, unknown> },
        ) => {
          if (name === "request_limits") return { count: 1 };
          if (fail) throw Error("Storage unavailable");
          const existing = records.get(filter.estimateRequestId);
          const value = existing || {
            _id: new ObjectId(),
            ...update.$setOnInsert,
          };
          records.set(filter.estimateRequestId, value);
          return { value, lastErrorObject: { updatedExisting: !!existing } };
        },
        updateOne: async () => ({}),
      }),
    }),
  } as unknown as MongoClient);
  return records;
}
test("estimate leads save contacts, permission and canonical costs; retry saves once", async () => {
  const records = fixture();
  const first = await POST(
    request({
      ...valid,
      service: "spoofed",
      budget: "1",
      estimate: { ...selection, oneTime: 1, monthly: 1 },
    }),
  );
  assert.equal(first.status, 200);
  const id = (await first.json()).id;
  assert.ok(id);
  assert.equal((await POST(request(valid))).status, 200);
  assert.equal(records.size, 1);
  const record = [...records.values()][0];
  assert.equal(record.phone, "+919999999999");
  assert.equal(record.language, "hi");
  const estimate = record.estimate as ReturnType<typeof normalizeEstimate>;
  assert.equal(estimate.oneTime, 6997);
  assert.equal(estimate.monthly, 999);
  assert.equal(estimate.items.length, 3);
  assert.ok(String(record.message).includes("Monthly care: INR 999"));
  assert.deepEqual(
    (record.contactPermission as { channels: string[] }).channels,
    ["phone", "email", "whatsapp"],
  );
  assert.equal(
    (await POST(request({ ...valid, email: "other@example.invalid" }))).status,
    409,
  );
});
test("estimate collection requires origin, contacts, explicit permission and valid packages", async () => {
  fixture();
  assert.equal(
    (await POST(request(valid, "https://other.example"))).status,
    403,
  );
  for (const changed of [
    { contactPermission: false },
    { email: "" },
    { phone: "9999999999" },
    { estimateRequestId: "bad" },
    { estimate: { ...selection, packageIds: ["maintenance"] } },
  ])
    assert.equal((await POST(request({ ...valid, ...changed }))).status, 400);
});
test("estimate save cannot report success with unavailable storage", async () => {
  fixture(true);
  assert.equal((await POST(request(valid))).status, 503);
  delete process.env.MONGODB_URI;
  assert.equal((await POST(request(valid))).status, 503);
});
test("printing snapshots separate per-gram minimum and design; invalid selections are rejected", () => {
  const print = normalizeEstimate({
    kind: "printing",
    grams: 1,
    quantity: 1,
    design: 499,
  });
  assert.equal(print.printing?.printCharge, 299);
  assert.equal(print.printing?.design, 499);
  assert.equal(print.oneTime, 798);
  assert.equal(print.monthly, 0);
  for (const bad of [
    { kind: "project", packageIds: ["unknown"], careId: "" },
    { ...selection, careId: "landing" },
    { kind: "printing", grams: 1, quantity: 1, design: 1 },
  ])
    assert.throws(() => normalizeEstimate(bad));
  const dedup = normalizeEstimate({
    ...selection,
    packageIds: ["landing", "landing"],
  });
  assert.equal(dedup.oneTime, 3999);
});
