import { NextResponse } from "next/server";
import { adminCookie, sameOrigin } from "@/lib/admin-auth";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new NextResponse(null, { status: 403 });
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(adminCookie, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
