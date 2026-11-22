import { test, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/inquiry/route";
const cache = globalThis as typeof globalThis & {
  silioMongo?: Promise<MongoClient>;
};
const original = process.env.MONGODB_URI;
afterEach(() => {
  mock.restoreAll();
  delete cache.silioMongo;
  if (original === undefined) delete process.env.MONGODB_URI;
  else process.env.MONGODB_URI = original;
});
test("an enquiry is retained when MongoDB is configured without email", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new Error("No external email in unit tests");
  });
  const records: Record<string, unknown>[] = [];
  process.env.MONGODB_URI = "mongodb://unused-test-host";
  cache.silioMongo = Promise.resolve({
    db: () => ({
      collection: () => ({
        findOneAndUpdate: async () => ({ count: 1 }),
        insertOne: async (data: Record<string, unknown>) => {
          records.push(data);
          return { insertedId: new ObjectId() };
        },
        updateOne: async () => ({}),
      }),
    }),
  } as unknown as MongoClient);
  const result = await POST(
    new NextRequest("http://localhost/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Local Test",
        email: "qa@example.com",
        phone: "9999999999",
        service: "Website",
        message: "Local database persistence verification.",
        page: "/en/contact",
      }),
    }),
  );
  assert.equal(result.status, 200);
  assert.equal(records.length, 1);
  assert.equal(records[0].page, "/en/contact");
  assert.equal(records[0].status, "new");
  assert.equal((await result.json()).ok, true);
});
