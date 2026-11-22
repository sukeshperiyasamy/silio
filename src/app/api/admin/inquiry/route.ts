import { adminForm } from "@/lib/request-input";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isAdmin, sameOrigin } from "@/lib/admin-auth";
import { database } from "@/lib/db";
export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return new NextResponse(null, { status: 403 });
  try {
    const form = await adminForm(request);
    if (!form) return new NextResponse(null, { status: 400 });
    const id = form.get("id"),
      status = form.get("status");
    if (
      typeof id !== "string" ||
      !/^[a-f0-9]{24}$/.test(id) ||
      typeof status !== "string" ||
      !["new", "contacted", "quoted", "won", "lost"].includes(status)
    )
      return new NextResponse(null, { status: 400 });
    await (
      await database()
    )
      .collection("inquiries")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } },
      );
    return NextResponse.redirect(new URL("/admin", request.url), 303);
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
