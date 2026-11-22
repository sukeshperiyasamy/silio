import { adminForm } from "@/lib/request-input";
import { NextResponse } from "next/server";
import {
  adminCookie,
  createAdminSession,
  passwordMatches,
  sameOrigin,
} from "@/lib/admin-auth";
import { allowRequest } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET)
    return NextResponse.json(
      { error: "Admin access is not configured" },
      { status: 503 },
    );
  try {
    if (!(await allowRequest(request, "admin-login", 5)))
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 },
      );
    const form = await adminForm(request);
    if (!form) return new NextResponse(null, { status: 400 });
    const password = form.get("password");
    if (
      typeof password !== "string" ||
      password.length > 256 ||
      !passwordMatches(password)
    )
      return NextResponse.redirect(
        new URL("/admin?error=login", request.url),
        303,
      );
    const response = NextResponse.redirect(new URL("/admin", request.url), 303);
    response.cookies.set(adminCookie, createAdminSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 28800,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in. Check the database connection." },
      { status: 503 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
