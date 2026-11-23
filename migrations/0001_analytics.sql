-- Customer enquiries and model attachments remain exclusively in MongoDB.
CREATE TABLE IF NOT EXISTS page_views (
  event_id TEXT PRIMARY KEY, session TEXT NOT NULL, path TEXT NOT NULL,
  source TEXT NOT NULL, campaign TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL, duration INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS page_views_path_created_at ON page_views(path, created_at);
CREATE TABLE IF NOT EXISTS request_limits (
  key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS request_limits_expiry ON request_limits(expires_at);
