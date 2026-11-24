import Icon from "@/components/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { database } from "@/lib/db";
import { enquiryFilters } from "@/lib/enquiry-filters";
import InquiryList from "@/components/InquiryList";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SILIO | Forms & Enquiries",
  robots: { index: false, follow: false },
};
export default async function Enquiries({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isAdmin())) redirect("/admin");
  const query = await searchParams;
  const { q, status, days, page, filter } = enquiryFilters(query);
  const params = new URLSearchParams({ q, status, days: String(days) }),
    url = (n: number) => `/admin/enquiries?${params}&page=${n}`;
  try {
    const db = await database();
    const [leads, total] = await Promise.all([
      db
        .collection("inquiries")
        .find(filter, { projection: { "attachment.data": 0 } })
        .sort({ createdAt: -1, _id: -1 })
        .skip(page * 25)
        .limit(25)
        .toArray(),
      db.collection("inquiries").countDocuments(filter),
    ]);
    return (
      <main id="main" className="container admin-dashboard">
        <header className="admin-heading">
          <div>
            <Link className="brand" href="/en">
              silio
              <Icon name="spark" className="brand-mark" />
            </Link>
            <h1>Forms & Enquiries</h1>
            <p>
              Your private enquiry archive. All-time records are shown by
              default.
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="pill outline">Sign out</button>
          </form>
        </header>
        <nav className="button-row admin-tabs" aria-label="Admin navigation">
          <Link className="pill outline" href="/admin">
            Analytics
          </Link>
          <Link className="pill" href="/admin/enquiries">
            Forms & Enquiries
          </Link>
        </nav>
        <div className="scope-note">
          <h2>Long-term records</h2>
          <p>
            Enquiries and model attachments have no automatic expiry. The 90-day
            analytics cleanup does not apply to these records. For durable
            long-term ownership, maintain database backups and periodic exports.
            Keep customer data only for your stated business purpose and honor
            valid correction or deletion requests.
          </p>
          <a
            className="pill outline"
            href={`/api/admin/enquiries/export?${params}`}
          >
            Export matching records (CSV)
          </a>
          <p className="muted">
            CSV includes contact details and messages; model files remain
            available through their protected download links. CSV exports are
            not a replacement for database backups that include attachments.
          </p>
        </div>
        <form method="get" className="admin-archive-filters">
          <div className="field">
            <label htmlFor="enquiry-search">Search enquiries</label>
            <input
              id="enquiry-search"
              name="q"
              defaultValue={q}
              maxLength={120}
              placeholder="Name, email, phone, service or message"
            />
          </div>
          <div className="field">
            <label htmlFor="archive-status">Status</label>
            <select id="archive-status" name="status" defaultValue={status}>
              <option value="">All statuses</option>
              {["new", "contacted", "quoted", "won", "lost"].map((s) => (
                <option value={s} key={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="archive-days">Date range</label>
            <select id="archive-days" name="days" defaultValue={days}>
              <option value="0">All time</option>
              {[7, 30, 90, 365].map((n) => (
                <option value={n} key={n}>
                  Last {n} days
                </option>
              ))}
            </select>
          </div>
          <button className="pill">Apply filters</button>
        </form>
        <InquiryList
          leads={leads}
          total={total}
          page={page}
          previous={url(page - 1)}
          next={url(page + 1)}
        />
      </main>
    );
  } catch {
    return (
      <main id="main" className="container admin-login">
        <h1>Enquiry archive unavailable</h1>
        <p>
          Check the database connection and try again. No records have been
          removed.
        </p>
        <Link className="pill" href="/admin/enquiries">
          Try again
        </Link>
      </main>
    );
  }
}
