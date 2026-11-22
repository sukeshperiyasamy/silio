import { MongoClient } from "mongodb";
const cache = globalThis as typeof globalThis & {
  silioMongo?: Promise<MongoClient>;
};
export async function database() {
  if (!process.env.MONGODB_URI) throw new Error("Database is not configured");
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
