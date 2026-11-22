import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "silio");
  await db.command({ ping: 1 });
  await Promise.all([
    db.collection("inquiries").createIndex({ createdAt: -1 }),
    db.collection("page_views").createIndex({ eventId: 1 }, { unique: true }),
    db
      .collection("page_views")
      .createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }),
    db.collection("page_views").createIndex({ path: 1, createdAt: -1 }),
    db
      .collection("request_limits")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
  console.log(
    "MongoDB connected; enquiry, analytics and rate-limit indexes ready.",
  );
} catch (error) {
  console.log(
    "MongoDB connection failed:",
    error.codeName || error.code || error.name,
  );
  process.exitCode = 1;
} finally {
  await client.close();
}
