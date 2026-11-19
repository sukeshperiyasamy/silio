import { test } from "node:test";
import assert from "node:assert/strict";
import { prices } from "../src/lib/site";
import {
  servicePages,
  servicePath,
  serviceFaqs,
} from "../src/lib/service-pages";
import { printEstimate } from "../src/lib/printing";
import { estimatePackages } from "../src/lib/growth";

test("every advertised service has one unique dedicated page in both languages", () => {
  assert.equal(prices.length, 49);
  assert.equal(servicePages.length, prices.length);
  assert.equal(new Set(servicePages.map((p) => p.id)).size, prices.length);
  assert.equal(new Set(servicePages.map((p) => p.slug)).size, prices.length);
  for (const p of prices) {
    for (const lang of ["en", "hi"] as const) {
      assert.ok(servicePath(lang, p.id));
      const page = servicePages.find((page) => page.id === p.id)!;
      const faq = serviceFaqs(page, lang);
      assert.equal(faq.length, 4);
      assert.ok(
        faq.every((f) => f.question.length > 5 && f.answer.length > 20),
      );
    }
  }
});
test("existing marketing URLs remain stable", () => {
  assert.equal(
    servicePath("en", "landing"),
    "/en/services/business-websites-jodhpur",
  );
  assert.equal(
    servicePath("hi", "cleaning"),
    "/hi/services/excel-services-jodhpur",
  );
  assert.equal(servicePath("en", "unknown"), null);
});
test("print minimum applies per order and CAD design stays separate", () => {
  assert.deepEqual(printEstimate(10, 1), {
    printing: 299,
    design: 0,
    subtotal: 299,
  });
  assert.deepEqual(printEstimate(50, 2, 499), {
    printing: 500,
    design: 499,
    subtotal: 999,
  });
  assert.deepEqual(printEstimate(80, 1, 999), {
    printing: 400,
    design: 999,
    subtotal: 1399,
  });
});
test("invalid print estimates are rejected instead of returning misleading totals", () => {
  for (const [weight, quantity, design] of [
    [0, 1, 0],
    [0.5, 1, 0],
    [10001, 1, 0],
    [50, 0, 0],
    [50, 1.5, 0],
    [50, 1001, 0],
    [50, 1, 123],
    [Infinity, 1, 0],
  ])
    assert.equal(printEstimate(weight, quantity, design), null);
});
test("per-gram and custom-quote services do not become fixed-price project estimates", () => {
  assert.deepEqual(
    estimatePackages([
      "pla-printing",
      "batch-printing",
      "architectural-models",
      "cad-design",
    ]),
    { oneTime: 499, monthly: 0 },
  );
});
