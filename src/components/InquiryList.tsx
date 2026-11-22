import Link from "next/link";
import type { Document } from "mongodb";
export default function InquiryList({
  leads,
  total,
  page,
  previous,
  next,
}: {
  leads: Document[];
  total: number;
  page: number;
  previous: string;
  next: string;
}) {
  return (
    <section className="admin-section">
      <h2>Customer enquiries</h2>
      <p>
        Showing {leads.length ? page * 25 + 1 : 0}–{page * 25 + leads.length} of{" "}
        {total}. Refresh this page to see new submissions.
      </p>
      {leads.map((lead) => (
        <article className="admin-lead" key={lead._id.toString()}>
          <div className="admin-lead-heading">
            <h3>{String(lead.name)}</h3>
            <small>
              {new Date(lead.createdAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </small>
          </div>
          <p>
            <a href={`mailto:${lead.email}`}>{String(lead.email)}</a> ·{" "}
            {String(lead.phone)}
          </p>
          <p>
            <b>{String(lead.service)}</b> · Budget:{" "}
            {String(lead.budget || "Not specified")}
          </p>
          {lead.projectUrl && <p>Website: {String(lead.projectUrl)}</p>}
          <p className="admin-message">{String(lead.message)}</p>
          <small>
            Form page: {String(lead.page || "not recorded")} · Email:{" "}
            {String(lead.emailStatus || "unknown")} · Source:{" "}
            {String(lead.campaign?.utm_source || "direct")} · Campaign:{" "}
            {String(lead.campaign?.utm_campaign || "none")}
          </small>
          {lead.attachment?.filename && (
            <p>
              <a
                className="text-link"
                href={`/api/admin/attachment/${lead._id}`}
              >
                Download model: {String(lead.attachment.filename)}
              </a>
            </p>
          )}
          <form
            className="admin-status"
            action="/api/admin/inquiry"
            method="post"
          >
            <input type="hidden" name="returnTo" value="/admin/enquiries" />
            <input type="hidden" name="id" value={lead._id.toString()} />
            <label>
              Status{" "}
              <select name="status" defaultValue={lead.status || "new"}>
                {["new", "contacted", "quoted", "won", "lost"].map((s) => (
                  <option value={s} key={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <button className="pill outline">Save status</button>
          </form>
        </article>
      ))}
      {!leads.length && <p>No enquiries match these filters.</p>}
      <div className="button-row">
        {page > 0 && (
          <Link className="pill outline" href={previous}>
            Previous enquiries
          </Link>
        )}
        {(page + 1) * 25 < total && (
          <Link className="pill outline" href={next}>
            Next enquiries
          </Link>
        )}
      </div>
    </section>
  );
}
