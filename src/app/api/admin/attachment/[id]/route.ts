import { ObjectId, Binary } from "mongodb";
import { isAdmin } from "@/lib/admin-auth";
import { database } from "@/lib/db";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) return new Response(null, { status: 401 });
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new Response(null, { status: 400 });
  try {
    const lead = await (
      await database()
    )
      .collection("inquiries")
      .findOne({ _id: new ObjectId(id) }, { projection: { attachment: 1 } });
    if (!lead?.attachment) return new Response(null, { status: 404 });
    const data = lead.attachment.data;
    return new Response(
      new Uint8Array(data instanceof Binary ? data.buffer : data),
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${String(lead.attachment.filename).replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch {
    return new Response(null, { status: 503 });
  }
}
