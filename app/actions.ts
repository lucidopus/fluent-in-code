"use server";

import { requireAuth } from "@/lib/session";
import { searchProblems } from "@/lib/queries/problems";

export async function searchAction(query: string) {
  await requireAuth();
  const results = await searchProblems(query, 10);
  return results.map((p) => ({
    lcNumber: p.lcNumber,
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty,
  }));
}
