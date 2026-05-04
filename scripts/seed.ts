/**
 * Seeds the `problems` collection with Blind 75 + NeetCode 150.
 * Idempotent: re-running upserts metadata, never touches attempts or fsrs state.
 *
 * Usage: npm run seed
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

const { MongoClient } = await import("mongodb");
const { NEETCODE_150 } = await import("@/lib/data/neetcode150");

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const dbName = process.env.MONGODB_DB ?? "fluent_in_code";
const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const problems = db.collection("problems");

  await problems.createIndex({ lcNumber: 1 }, { unique: true });
  await problems.createIndex({ slug: 1 }, { unique: true });

  let inserted = 0;
  let updated = 0;
  const now = new Date();

  const defaultFsrs = {
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    state: "New" as const,
    lastReviewAt: null,
    dueAt: now,
  };

  for (const seed of NEETCODE_150) {
    const result = await problems.findOneAndUpdate(
      { lcNumber: seed.lcNumber },
      {
        $set: {
          slug: seed.slug,
          title: seed.title,
          difficulty: seed.difficulty,
          leetcodeUrl: seed.leetcodeUrl,
          patterns: seed.patterns,
          lists: seed.lists,
          premium: seed.premium ?? false,
          updatedAt: now,
        },
        $setOnInsert: {
          lcNumber: seed.lcNumber,
          status: "NotStarted",
          diagramUrl: null,
          problemStatement: null,
          latest: null,
          videos: [],
          fsrs: defaultFsrs,
          notes: null,
          createdAt: now,
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    if (result) {
      const wasNew = result.createdAt && result.createdAt.getTime() === now.getTime();
      if (wasNew) inserted++;
      else updated++;
    }
  }

  console.log(`Seed complete. ${inserted} inserted, ${updated} updated.`);
  console.log(`Total in NeetCode 150: ${NEETCODE_150.length}`);
  console.log(`Blind 75 problems also tagged with neetcode150 list.`);
  await client.close();
}

main().catch(async (err) => {
  console.error(err);
  await client.close();
  process.exit(1);
});
