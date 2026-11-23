// @ts-ignore OpenNext generates this module during the Worker build.
import handler from "./.open-next/worker.js";
import {
  workerScope,
  type WorkerScope,
  type AnalyticsDatabase,
} from "./src/lib/worker-context";
import { cleanupAnalytics } from "./src/lib/analytics-cleanup";
interface Env {
  ANALYTICS_DB: AnalyticsDatabase;
}
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: { waitUntil(promise: Promise<unknown>): void },
  ) {
    if (!env.ANALYTICS_DB)
      return new Response("Analytics database binding is missing", {
        status: 503,
      });
    const scope: WorkerScope = { analytics: env.ANALYTICS_DB };
    return workerScope.run(scope, async () => {
      const close = async () => {
        if (scope.mongo)
          await scope.mongo.then((c) => c.close()).catch(() => {});
      };
      try {
        const response: Response = await handler.fetch(request, env, ctx);
        if (!scope.mongo) return response;
        if (!response.body) {
          await close();
          return response;
        }
        // Keep the request's MongoDB client alive until streamed CSV/HTML finishes.
        const { readable, writable } = new TransformStream();
        ctx.waitUntil(
          response.body
            .pipeTo(writable)
            .catch(() => {})
            .finally(close),
        );
        return new Response(readable, response);
      } catch (error) {
        await close();
        throw error;
      }
    });
  },
  async scheduled(_event: unknown, env: Env) {
    await cleanupAnalytics(env.ANALYTICS_DB);
  },
};
