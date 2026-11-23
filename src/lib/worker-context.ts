import { AsyncLocalStorage } from "node:async_hooks";
import type { MongoClient } from "mongodb";
export interface Statement {
  bind(...values: unknown[]): Statement;
  run(): Promise<unknown>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}
export interface AnalyticsDatabase {
  prepare(sql: string): Statement;
  batch(statements: Statement[]): Promise<unknown>;
}
export interface WorkerScope {
  analytics: AnalyticsDatabase;
  mongo?: Promise<MongoClient>;
}
// The custom Worker and Next.js server bundles must share one request-local store.
const shared = globalThis as typeof globalThis & {
  silioWorkerScope?: AsyncLocalStorage<WorkerScope>;
};
export const workerScope = (shared.silioWorkerScope ??=
  new AsyncLocalStorage<WorkerScope>());
export function analyticsDatabase() {
  return workerScope.getStore()?.analytics;
}
