import {
  createHash,
  createHmac,
  timingSafeEqual,
  randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";
export const adminCookie = "silio_admin";
export function passwordMatches(input: string) {
  if (!process.env.ADMIN_PASSWORD) return false;
  return timingSafeEqual(
    createHash("sha256").update(input).digest(),
    createHash("sha256").update(process.env.ADMIN_PASSWORD).digest(),
  );
}
function signature(value: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(value)
    .digest("hex");
}
export function createAdminSession() {
  if (!process.env.ADMIN_SESSION_SECRET)
    throw new Error("Admin session is not configured");
  const value = `${Date.now() + 8 * 60 * 60 * 1000}.${randomBytes(24).toString("hex")}`;
  return `${value}.${signature(value)}`;
}
export function validAdminSession(token: string) {
  if (
    !process.env.ADMIN_SESSION_SECRET ||
    !process.env.ADMIN_PASSWORD ||
    token.length > 300
  )
    return false;
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    !/^\d+$/.test(parts[0]) ||
    !/^[a-f0-9]{64}$/.test(parts[2])
  )
    return false;
  const value = parts.slice(0, 2).join(".");
  return (
    Number(parts[0]) > Date.now() &&
    Number(parts[0]) <= Date.now() + 8 * 60 * 60 * 1000 &&
    timingSafeEqual(
      Buffer.from(parts[2], "hex"),
      Buffer.from(signature(value), "hex"),
    )
  );
}
export async function isAdmin() {
  return validAdminSession((await cookies()).get(adminCookie)?.value || "");
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}
