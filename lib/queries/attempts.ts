import "server-only";
import { getDb } from "@/lib/mongo";
import type { AttemptDoc } from "@/lib/schemas/problem";
import type { ObjectId } from "mongodb";

export async function getAttemptsByProblem(
  problemId: ObjectId,
  limit = 20,
): Promise<AttemptDoc[]> {
  const db = await getDb();
  return db
    .collection<AttemptDoc>("attempts")
    .find({ problemId })
    .sort({ attemptedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getRecentAttempts(limit = 10): Promise<AttemptDoc[]> {
  const db = await getDb();
  return db
    .collection<AttemptDoc>("attempts")
    .find({})
    .sort({ attemptedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function countAttempts(problemId: ObjectId): Promise<number> {
  const db = await getDb();
  return db.collection<AttemptDoc>("attempts").countDocuments({ problemId });
}
