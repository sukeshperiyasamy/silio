import { isAdmin } from "@/lib/admin-auth";
import { database } from "@/lib/db";
import { enquiryFilters } from "@/lib/enquiry-filters";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function cell(value: unknown) {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response(null, { status: 401 });
  try {
    const { filter } = enquiryFilters(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    const cursor = (await database())
      .collection("inquiries")
      .find(filter, { projection: { "attachment.data": 0 } })
      .sort({ createdAt: -1, _id: -1 });
    const encoder = new TextEncoder();
    let header = false;
    const stream = new ReadableStream({
      async pull(controller) {
        try {
          if (!header) {
            header = true;
            controller.enqueue(
              encoder.encode(
                "\uFEFF" +
                  [
                    "ID",
                    "Received at (UTC)",
                    "Name",
                    "Email",
                    "Phone",
                    "Service",
                    "Budget",
                    "Message",
                    "Website",
                    "Status",
                    "Form page",
                    "Source",
                    "Campaign",
                    "Email status",
                    "Model filename",
                  ]
                    .map(cell)
                    .join(",") +
                  "\r\n",
              ),
            );
            return;
          }
          const lead = await cursor.next();
          if (!lead) {
            await cursor.close();
            controller.close();
            return;
          }
          controller.enqueue(
            encoder.encode(
              [
                lead._id,
                new Date(lead.createdAt).toISOString(),
                lead.name,
                lead.email,
                lead.phone,
                lead.service,
                lead.budget,
                lead.message,
                lead.projectUrl,
                lead.status,
                lead.page,
                lead.campaign?.utm_source,
                lead.campaign?.utm_campaign,
                lead.emailStatus,
                lead.attachment?.filename,
              ]
                .map(cell)
                .join(",") + "\r\n",
            ),
          );
        } catch (error) {
          await cursor.close();
          controller.error(error);
        }
      },
      async cancel() {
        await cursor.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="silio-enquiries.csv"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Export unavailable", { status: 503 });
  }
}
