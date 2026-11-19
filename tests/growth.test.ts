import { test } from "node:test";
import assert from "node:assert/strict";
import { estimatePackages, featuredIds } from "../src/lib/growth";
import { prices } from "../src/lib/site";

test("one-time packages and monthly care stay separate", () => {
  assert.deepEqual(
    estimatePackages(
      ["landing", "whatsapp-catalogue", "qr-menu"],
      "maintenance",
    ),
    { oneTime: 6997, monthly: 999 },
  );
});
test("duplicates and unknown package IDs cannot inflate an estimate", () => {
  assert.deepEqual(estimatePackages(["landing", "landing", "unknown"]), {
    oneTime: 3999,
    monthly: 0,
  });
});
test("monthly plans never become one-time charges", () => {
  assert.deepEqual(estimatePackages(["maintenance", "care-plus"], "landing"), {
    oneTime: 0,
    monthly: 0,
  });
  assert.deepEqual(estimatePackages(["cleaning"], "care-plus"), {
    oneTime: 499,
    monthly: 2999,
  });
});
test("all featured packages exist and package IDs are unique", () => {
  assert.equal(featuredIds.length, 5);
  assert.equal(new Set(prices.map((p) => p.id)).size, prices.length);
  for (const id of featuredIds) assert.ok(prices.some((p) => p.id === id));
});
