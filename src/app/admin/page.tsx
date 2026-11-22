import InquiryList from "@/components/InquiryList";
import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { database } from "@/lib/db";
import { trackedPaths } from "@/lib/analytics-paths";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SILIO | Private dashboard",
  robots: { index: false, follow: false },
};
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  if (!(await isAdmin()))
    return (
      <main id="main" className="container admin-login">
        <Link className="brand" href="/en">
          silio✳
        </Link>
        <h1>Private dashboard</h1>
        <p>Sign in to review page analytics and customer enquiries.</p>
        {query.error && (
          <p role="alert">The password was not accepted. Please try again.</p>
        )}
        <form action="/api/admin/session" method="post">
          <div className="field">
            <label htmlFor="admin-password">Admin password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              maxLength={256}
              autoComplete="current-password"
            />
          </div>
          <button className="pill" type="submit">
            Sign in
          </button>
        </form>
      </main>
    );
  const days = [1, 7, 30, 90].includes(Number(query.days))
    ? Number(query.days)
    : 30;
  const path = query.path && trackedPaths.has(query.path) ? query.path : "";
  const page = Math.max(
    0,
    Math.min(10000, Number.parseInt(query.page || "0") || 0),
  );
  const since = new Date(Date.now() - days * 86400000);
  const match = { createdAt: { $gte: since }, ...(path ? { path } : {}) };
  try {
    const db = await database();
    const [pages, sources, daily, leads, leadCount, views, sessions] =
      await Promise.all([
        db
          .collection("page_views")
          .aggregate<{
            path: string;
            views: number;
            sessions: number;
            average: number;
          }>([
            { $match: match },
            {
              $group: {
                _id: "$path",
                views: { $sum: 1 },
                sessions: { $addToSet: "$session" },
                average: { $avg: "$duration" },
              },
            },
            {
              $project: {
                _id: 0,
                path: "$_id",
                views: 1,
                sessions: { $size: "$sessions" },
                average: 1,
              },
            },
            { $sort: { views: -1 } },
          ])
          .toArray(),
        db
          .collection("page_views")
          .aggregate([
            { $match: match },
            { $group: { _id: "$source", views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 15 },
          ])
          .toArray(),
        db
          .collection("page_views")
          .aggregate([
            { $match: match },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                    timezone: "Asia/Kolkata",
                  },
                },
                views: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ])
          .toArray(),
        db
          .collection("inquiries")
          .find(
            { createdAt: { $gte: since } },
            { projection: { "attachment.data": 0 } },
          )
          .sort({ createdAt: -1 })
          .skip(page * 25)
          .limit(25)
          .toArray(),
        db
          .collection("inquiries")
          .countDocuments({ createdAt: { $gte: since } }),
        db.collection("page_views").countDocuments(match),
        db.collection("page_views").distinct("session", match),
      ]);
    const url = (next: number) =>
      `/admin?days=${days}&path=${encodeURIComponent(path)}&page=${next}`;
    return (
      <main id="main" className="container admin-dashboard">
        <header className="admin-heading">
          <div>
            <Link className="brand" href="/en">
              silio✳
            </Link>
            <h1>Your site, page by page.</h1>
            <p>Private analytics and enquiries · dates in India time</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="pill outline">Sign out</button>
          </form>
        </header>
        <nav className="button-row admin-tabs" aria-label="Admin navigation">
          <Link className="pill" href="/admin">
            Analytics
          </Link>
          <Link className="pill outline" href="/admin/enquiries">
            Forms & Enquiries
          </Link>
        </nav>
        <form className="admin-filters" method="get">
          <div className="field">
            <label htmlFor="days">Date range</label>
            <select id="days" name="days" defaultValue={days}>
              {[1, 7, 30, 90].map((n) => (
                <option value={n} key={n}>
                  Last {n} {n === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="path">Page</label>
            <select id="path" name="path" defaultValue={path}>
              <option value="">All pages</option>
              {Array.from(trackedPaths)
                .sort()
                .map((p) => (
                  <option value={p} key={p}>
                    {p}
                  </option>
                ))}
            </select>
          </div>
          <button className="pill">Apply filters</button>
        </form>
        <div className="admin-metrics">
          <article>
            <small>Page views</small>
            <strong>{views}</strong>
          </article>
          <article>
            <small>Anonymous sessions</small>
            <strong>{sessions.length}</strong>
          </article>
          <article>
            <small>Enquiries · all pages</small>
            <strong>{leadCount}</strong>
          </article>
        </div>
        <p className="muted">
          Sessions are browser-tab sessions, not identified people. Time on page
          is elapsed time reported when leaving or hiding a page; zero means no
          timing update was received. Analytics filters apply to the page
          reports; enquiries show the selected date range across all pages.
        </p>
        <section className="admin-section">
          <h2>Page performance</h2>
          <div className="comparison-scroll">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Sessions</th>
                  <th>Average elapsed time</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.path}>
                    <td>
                      <a href={p.path} target="_blank" rel="noreferrer">
                        {p.path}
                      </a>
                    </td>
                    <td>{p.views}</td>
                    <td>{p.sessions}</td>
                    <td>{Math.round(p.average || 0)} seconds</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!pages.length && <p>No page views in this period yet.</p>}
        </section>
        <div className="admin-report-grid">
          <section className="admin-section">
            <h2>Daily views</h2>
            {daily.map((day) => (
              <div className="admin-bar" key={String(day._id)}>
                <span>{String(day._id)}</span>
                <meter
                  min={0}
                  max={Math.max(1, ...daily.map((d) => Number(d.views)))}
                  value={Number(day.views)}
                  aria-label={`Views on ${day._id}`}
                />
                <b>{Number(day.views)}</b>
              </div>
            ))}
            {!daily.length && <p>No daily traffic recorded yet.</p>}
          </section>
          <section className="admin-section">
            <h2>Traffic sources</h2>
            {sources.map((source) => (
              <div className="admin-source" key={String(source._id)}>
                <span>{String(source._id)}</span>
                <b>{Number(source.views)}</b>
              </div>
            ))}
            {!sources.length && <p>No sources recorded yet.</p>}
          </section>
        </div>
        <InquiryList
          leads={leads}
          total={leadCount}
          page={page}
          previous={url(page - 1)}
          next={url(page + 1)}
        />
      </main>
    );
  } catch {
    return (
      <main id="main" className="container admin-login">
        <h1>Dashboard temporarily unavailable</h1>
        <p>
          The database could not be reached. Check server configuration and
          MongoDB network access, then refresh.
        </p>
        <Link className="pill" href="/admin">
          Try again
        </Link>
      </main>
    );
  }
}
