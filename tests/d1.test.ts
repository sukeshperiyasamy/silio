import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import {
  workerScope,
  type AnalyticsDatabase,
  type Statement,
} from "../src/lib/worker-context";
import { allowRequest } from "../src/lib/rate-limit";
import { POST } from "../src/app/api/analytics/route";
import { analyticsReport } from "../src/lib/analytics-report";
import { cleanupAnalytics } from "../src/lib/analytics-cleanup";
function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync("migrations/0001_analytics.sql", "utf8"));
  const db: AnalyticsDatabase = {
    prepare(sql) {
      let values: unknown[] = [];
      const statement: Statement = {
        bind(...v) {
          values = v;
          return statement;
        },
        async run() {
          return sqlite.prepare(sql).run(...(values as never[]));
        },
        async first<T>() {
          return (sqlite.prepare(sql).get(...(values as never[])) as T) || null;
        },
        async all<T>() {
          return {
            results: sqlite.prepare(sql).all(...(values as never[])) as T[],
          };
        },
      };
      return statement;
    },
    async batch(statements) {
      return Promise.all(statements.map((s) => s.run()));
    },
  };
  return { sqlite, db };
}
test("D1 analytics deduplicates events, bounds duration and reports India dates", async () => {
  const { sqlite, db } = fixture();
  try {
    await workerScope.run({ analytics: db }, async () => {
      const body = {
        id: "11111111-1111-4111-8111-111111111111",
        session: "22222222-2222-4222-8222-222222222222",
        path: "/en",
        type: "view",
        source: "direct",
      };
      const send = (value: object) =>
        POST(
          new Request("http://localhost/api/analytics", {
            method: "POST",
            headers: {
              Origin: "http://localhost",
              "Content-Type": "application/json",
              "cf-connecting-ip": "192.0.2.1",
            },
            body: JSON.stringify(value),
          }),
        );
      assert.equal((await send(body)).status, 204);
      assert.equal((await send(body)).status, 204);
      assert.equal(
        (await send({ ...body, type: "duration", duration: 9999 })).status,
        204,
      );
      await send({ ...body, type: "duration", duration: 10 });
      // 20:00 UTC is the next day in India.
      sqlite
        .prepare("UPDATE page_views SET created_at = ?")
        .run(Date.parse("2026-11-22T20:00:00Z"));
      const report = await analyticsReport(new Date("2026-11-22"), "/en");
      assert.equal(report.views, 1);
      assert.equal(report.sessions, 1);
      assert.equal(report.pages[0].average, 1800);
      assert.equal(report.daily[0]._id, "2026-11-23");
      assert.equal(
        (await analyticsReport(new Date("2026-11-22"), "/hi")).views,
        0,
      );
      assert.equal(
        (
          await send({
            ...body,
            type: "duration",
            session: "33333333-3333-4333-8333-333333333333",
            duration: 900,
          })
        ).status,
        204,
      );
      assert.equal(
        sqlite.prepare("SELECT duration FROM page_views").get()!.duration,
        1800,
      );
    });
  } finally {
    sqlite.close();
  }
});
test("D1 rate limits are atomic, use trusted Cloudflare IP and isolate scopes", async () => {
  const { sqlite, db } = fixture();
  try {
    await workerScope.run({ analytics: db }, async () => {
      const request = (forwarded: string, ip = "192.0.2.2") =>
        new Request("http://localhost", {
          headers: { "cf-connecting-ip": ip, "x-forwarded-for": forwarded },
        });
      assert.equal(await allowRequest(request("spoof-1"), "login", 1), true);
      assert.equal(await allowRequest(request("spoof-2"), "login", 1), false);
      assert.equal(await allowRequest(request("spoof-1"), "inquiry", 1), true);
      assert.equal(
        await allowRequest(request("spoof-1", "192.0.2.3"), "login", 1),
        true,
      );
      assert.ok(
        !JSON.stringify(
          sqlite.prepare("SELECT * FROM request_limits").all(),
        ).includes("192.0.2"),
      );
    });
  } finally {
    sqlite.close();
  }
});
test("D1 cleanup removes expired analytics and limits, without customer tables", async () => {
  const { sqlite, db } = fixture();
  try {
    sqlite.exec(
      "CREATE TABLE inquiries (name TEXT); INSERT INTO inquiries VALUES ('retained');",
    );
    sqlite
      .prepare("INSERT INTO page_views VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run("old", "s", "/en", "direct", "", 0, 0);
    sqlite
      .prepare("INSERT INTO page_views VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run("recent", "s", "/en", "direct", "", Date.now(), 0);
    sqlite.exec("INSERT INTO request_limits VALUES ('old',1,0)");
    await cleanupAnalytics(db);
    assert.equal(
      sqlite.prepare("SELECT COUNT(*) AS n FROM page_views").get()!.n,
      1,
    );
    assert.equal(
      sqlite.prepare("SELECT COUNT(*) AS n FROM request_limits").get()!.n,
      0,
    );
    assert.equal(
      sqlite.prepare("SELECT COUNT(*) AS n FROM inquiries").get()!.n,
      1,
    );
  } finally {
    sqlite.close();
  }
});
