import { test, after } from "node:test";
import assert from "node:assert/strict";
import {
  createAdminSession,
  validAdminSession,
  passwordMatches,
} from "../src/lib/admin-auth";
const oldPassword = process.env.ADMIN_PASSWORD,
  oldSecret = process.env.ADMIN_SESSION_SECRET;
after(() => {
  if (oldPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = oldPassword;
  if (oldSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
  else process.env.ADMIN_SESSION_SECRET = oldSecret;
});
test("admin access fails closed without credentials", () => {
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(validAdminSession("anything"), false);
  assert.equal(passwordMatches("anything"), false);
});
test("signed admin tokens reject tampering and credential rotation", () => {
  process.env.ADMIN_PASSWORD = "local-test-password";
  process.env.ADMIN_SESSION_SECRET = "local-test-secret-".repeat(4);
  const token = createAdminSession();
  assert.equal(validAdminSession(token), true);
  assert.equal(passwordMatches("wrong"), false);
  assert.equal(passwordMatches("local-test-password"), true);
  assert.equal(validAdminSession(token + "x"), false);
  assert.equal(
    validAdminSession("0." + token.split(".").slice(1).join(".")),
    false,
  );
  process.env.ADMIN_SESSION_SECRET = "rotated-test-secret";
  assert.equal(validAdminSession(token), false);
});
