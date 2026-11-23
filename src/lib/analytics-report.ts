import { database } from "./db";
import { analyticsDatabase } from "./worker-context";
export interface PageReport {
  path: string;
  views: number;
  sessions: number;
  average: number;
}
interface CountReport {
  _id: string;
  views: number;
}
export async function analyticsReport(since: Date, path: string) {
  const d1 = analyticsDatabase();
  if (d1) {
    const where = "created_at >= ?" + (path ? " AND path = ?" : "");
    const values: unknown[] = [since.getTime(), ...(path ? [path] : [])];
    const [pages, sources, daily, summary] = await Promise.all([
      d1
        .prepare(
          `SELECT path, COUNT(*) AS views, COUNT(DISTINCT session) AS sessions,
       AVG(duration) AS average FROM page_views WHERE ${where} GROUP BY path ORDER BY views DESC`,
        )
        .bind(...values)
        .all<PageReport>(),
      d1
        .prepare(
          `SELECT source AS _id, COUNT(*) AS views FROM page_views WHERE ${where}
       GROUP BY source ORDER BY views DESC LIMIT 15`,
        )
        .bind(...values)
        .all<CountReport>(),
      d1
        .prepare(
          `SELECT strftime('%Y-%m-%d', created_at / 1000, 'unixepoch', '+05:30') AS _id,
       COUNT(*) AS views FROM page_views WHERE ${where} GROUP BY _id ORDER BY _id`,
        )
        .bind(...values)
        .all<CountReport>(),
      d1
        .prepare(
          `SELECT COUNT(*) AS views, COUNT(DISTINCT session) AS sessions FROM page_views WHERE ${where}`,
        )
        .bind(...values)
        .first<{ views: number; sessions: number }>(),
    ]);
    return {
      pages: pages.results,
      sources: sources.results,
      daily: daily.results,
      views: summary?.views || 0,
      sessions: summary?.sessions || 0,
      storage: "Cloudflare D1",
    };
  }
  const db = await database();
  const match = { createdAt: { $gte: since }, ...(path ? { path } : {}) };
  const [pages, sources, daily, views, sessions] = await Promise.all([
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
    db.collection("page_views").countDocuments(match),
    db.collection("page_views").distinct("session", match),
  ]);
  return {
    pages,
    sources: sources as unknown as CountReport[],
    daily: daily as unknown as CountReport[],
    views,
    sessions: sessions.length,
    storage: "MongoDB (local/Node.js)",
  };
}
