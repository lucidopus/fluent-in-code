import "server-only";
import { getDb } from "@/lib/mongo";
import type { ProblemDoc, ProblemStatus } from "@/lib/schemas/problem";
import type { Pattern, ListId } from "@/lib/patterns";

export async function getProblemByLc(lcNumber: number): Promise<ProblemDoc | null> {
  const db = await getDb();
  return db.collection<ProblemDoc>("problems").findOne({ lcNumber });
}

export async function getProblemBySlug(slug: string): Promise<ProblemDoc | null> {
  const db = await getDb();
  return db.collection<ProblemDoc>("problems").findOne({ slug });
}

export async function getDueQueue(limit = 20): Promise<ProblemDoc[]> {
  const db = await getDb();
  const now = new Date();
  return db
    .collection<ProblemDoc>("problems")
    .find({
      "fsrs.dueAt": { $lte: now },
      status: { $ne: "Mastered" },
      "fsrs.lastReviewAt": { $ne: null },
    })
    .sort({ "fsrs.dueAt": 1 })
    .limit(limit)
    .toArray();
}

export async function getProblemsByPattern(pattern: Pattern): Promise<ProblemDoc[]> {
  const db = await getDb();
  return db
    .collection<ProblemDoc>("problems")
    .find({ patterns: pattern })
    .sort({ difficulty: 1, lcNumber: 1 })
    .toArray();
}

export async function getProblemsByList(list: ListId): Promise<ProblemDoc[]> {
  const db = await getDb();
  return db
    .collection<ProblemDoc>("problems")
    .find({ lists: list })
    .sort({ patterns: 1, lcNumber: 1 })
    .toArray();
}

export async function getProblemStats(): Promise<{
  total: number;
  notStarted: number;
  solved: number;
  reviewed: number;
  mastered: number;
  due: number;
}> {
  const db = await getDb();
  const collection = db.collection<ProblemDoc>("problems");
  const now = new Date();

  const [statusAgg, due, total] = await Promise.all([
    collection
      .aggregate<{ _id: ProblemStatus; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray(),
    collection.countDocuments({
      "fsrs.dueAt": { $lte: now },
      status: { $ne: "Mastered" },
      "fsrs.lastReviewAt": { $ne: null },
    }),
    collection.countDocuments(),
  ]);

  const map: Record<ProblemStatus, number> = {
    NotStarted: 0,
    Solved: 0,
    Reviewed: 0,
    Mastered: 0,
  };
  for (const row of statusAgg) {
    if (row._id) map[row._id] = row.count;
  }

  return {
    total,
    notStarted: map.NotStarted,
    solved: map.Solved,
    reviewed: map.Reviewed,
    mastered: map.Mastered,
    due,
  };
}

export async function getPatternStats(): Promise<
  Record<Pattern, { total: number; solved: number; mastered: number }>
> {
  const db = await getDb();
  const result = await db
    .collection<ProblemDoc>("problems")
    .aggregate<{
      _id: { pattern: Pattern; status: ProblemStatus };
      count: number;
    }>([
      { $unwind: "$patterns" },
      {
        $group: {
          _id: { pattern: "$patterns", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const stats: Record<string, { total: number; solved: number; mastered: number }> = {};
  for (const row of result) {
    const p = row._id.pattern;
    if (!stats[p]) stats[p] = { total: 0, solved: 0, mastered: 0 };
    stats[p].total += row.count;
    if (row._id.status === "Solved" || row._id.status === "Reviewed" || row._id.status === "Mastered") {
      stats[p].solved += row.count;
    }
    if (row._id.status === "Mastered") {
      stats[p].mastered += row.count;
    }
  }
  return stats as Record<Pattern, { total: number; solved: number; mastered: number }>;
}

export async function searchProblems(q: string, limit = 20): Promise<ProblemDoc[]> {
  const db = await getDb();
  const trimmed = q.trim();
  if (!trimmed) return [];
  const asNum = Number(trimmed);
  if (!Number.isNaN(asNum) && asNum > 0) {
    return db
      .collection<ProblemDoc>("problems")
      .find({ lcNumber: asNum })
      .limit(limit)
      .toArray();
  }
  return db
    .collection<ProblemDoc>("problems")
    .find({ title: { $regex: trimmed, $options: "i" } })
    .limit(limit)
    .toArray();
}
