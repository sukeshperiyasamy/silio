import { MongoClient } from "mongodb";
import { workerScope } from "./worker-context";
const cache = globalThis as typeof globalThis & {
  silioMongo?: Promise<MongoClient>;
};
export async function database() {
  if (!process.env.MONGODB_URI) throw new Error("Database is not configured");
  const scope = workerScope.getStore();
  if (scope) {
    // Workers cannot reuse TCP clients from a different invocation.
    scope.mongo ??= new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    }).connect();
    return (await scope.mongo).db(process.env.MONGODB_DB || "silio");
  }
  if (!cache.silioMongo)
    cache.silioMongo = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    })
      .connect()
      .catch((error) => {
        cache.silioMongo = undefined;
        throw error;
      });
  return (await cache.silioMongo).db(process.env.MONGODB_DB || "silio");
}
