import { test } from "node:test";
import assert from "node:assert/strict";
import { boundedText, adminForm } from "../src/lib/request-input";
test("body limits apply even without a content-length header", async () => {
  const request = new Request("http://localhost", {
    method: "POST",
    body: "x".repeat(5000),
  });
  assert.equal(request.headers.has("content-length"), false);
  assert.equal(await boundedText(request, 4096), null);
});
test("admin forms accept only bounded URL-encoded input", async () => {
  const form = await adminForm(
    new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "password=example%20value",
    }),
  );
  assert.equal(form?.get("password"), "example value");
  assert.equal(
    await adminForm(
      new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }),
    ),
    null,
  );
});
