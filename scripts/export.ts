/**
 * Dumps the entire fluent_in_code database to a timestamped JSON file in /backups.
 * Cheap insurance against schema mistakes early on.
 *
 * Usage: npm run export
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";

config({ path: resolve(process.cwd(), ".env.local") });

const { MongoClient } = await import("mongodb");

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const dbName = process.env.MONGODB_DB ?? "fluent_in_code";
const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();
  const db = client.db(dbName);

  const [problems, attempts] = await Promise.all([
    db.collection("problems").find({}).toArray(),
    db.collection("attempts").find({}).toArray(),
  ]);

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = resolve(process.cwd(), "backups");
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `${stamp}.json`);

  await writeFile(
    outFile,
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        database: dbName,
        counts: { problems: problems.length, attempts: attempts.length },
        problems,
        attempts,
      },
      null,
      2,
    ),
  );

  console.log(`Wrote ${outFile}`);
  console.log(`  ${problems.length} problems, ${attempts.length} attempts.`);
  await client.close();
}

main().catch(async (err) => {
  console.error(err);
  await client.close();
  process.exit(1);
});
