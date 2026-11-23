import type { AnalyticsDatabase } from "./worker-context";
export async function cleanupAnalytics(
  db: AnalyticsDatabase,
  now = Date.now(),
) {
  await db.batch([
    db
      .prepare("DELETE FROM page_views WHERE created_at < ?")
      .bind(now - 90 * 86400000),
    db.prepare("DELETE FROM request_limits WHERE expires_at < ?").bind(now),
  ]);
}
