import { MongoClient, type Db } from "mongodb";

const dbName = process.env.MONGODB_DB ?? "fluent_in_code";

declare global {
  var __mongoClient: MongoClient | undefined;
  var __mongoIndexesEnsured: boolean | undefined;
}

function getClient(): MongoClient {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 1,
    });
  }
  return global.__mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = getClient();
  if (!global.__mongoIndexesEnsured) {
    await ensureIndexes(client.db(dbName));
    global.__mongoIndexesEnsured = true;
  }
  return client.db(dbName);
}

export function getMongoClient(): MongoClient {
  return getClient();
}

async function ensureIndexes(db: Db) {
  const problems = db.collection("problems");
  await Promise.all([
    problems.createIndex({ lcNumber: 1 }, { unique: true }),
    problems.createIndex({ slug: 1 }, { unique: true }),
    problems.createIndex({ patterns: 1 }),
    problems.createIndex({ lists: 1 }),
    problems.createIndex({ "fsrs.dueAt": 1, status: 1 }),
    problems.createIndex({ status: 1, updatedAt: -1 }),
  ]);

  const attempts = db.collection("attempts");
  await Promise.all([
    attempts.createIndex({ problemId: 1, attemptedAt: -1 }),
    attempts.createIndex({ attemptedAt: -1 }),
    attempts.createIndex({ lcNumber: 1, attemptedAt: -1 }),
  ]);
}
