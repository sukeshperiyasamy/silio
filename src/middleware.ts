import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(
    "x-silio-lang",
    request.nextUrl.pathname.split("/")[1] === "hi" ? "hi" : "en",
  );
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
