"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb, getMongoClient } from "@/lib/mongo";
import { requireAuth } from "@/lib/session";
import { schedule, selfScoreToRating, type FsrsState } from "@/lib/fsrs";
import {
  DeepLogSchema,
  QuickLogSchema,
  UpdateAttemptSchema,
  type DeepLogInput,
  type QuickLogInput,
} from "@/lib/schemas/attempt";
import {
  AddVideoSchema,
  UpdateDiagramSchema,
  UpdateNotesSchema,
  UpdateProblemStatementSchema,
  UpdateStatusSchema,
  type ProblemDoc,
  type AttemptDoc,
} from "@/lib/schemas/problem";

type ActionState = { ok: boolean; error?: string };

export async function saveDeepLog(prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAuth();

  const raw = {
    lcNumber: formData.get("lcNumber"),
    restate: formData.get("restate"),
    bruteForce: {
      applicable: formData.get("bruteForceApplicable") === "true",
      approach: String(formData.get("bruteForceApproach") ?? ""),
      time: String(formData.get("bruteForceTime") ?? ""),
      space: String(formData.get("bruteForceSpace") ?? ""),
    },
    optimal: {
      approach: formData.get("optimalApproach"),
      time: formData.get("optimalTime"),
      space: formData.get("optimalSpace"),
    },
    code: formData.get("code"),
    language: formData.get("language") || "python",
    selfScore: formData.get("selfScore"),
    durationMinutes: formData.get("durationMinutes") || undefined,
    implementationHurdle: formData.get("implementationHurdle") || undefined,
    transcript: formData.get("transcript") || undefined,
    youtubeUrl: formData.get("youtubeUrl") || undefined,
    videoTitle: formData.get("videoTitle") || undefined,
  };

  const parsed = DeepLogSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await persistAttempt({ mode: "deep", payload: parsed.data });
  revalidatePath(`/problems/${parsed.data.lcNumber}`);
  revalidatePath(`/`);
  return { ok: true };
}

export async function updateAttempt(prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAuth();

  const raw = {
    attemptId: formData.get("attemptId"),
    lcNumber: formData.get("lcNumber"),
    restate: formData.get("restate"),
    bruteForce: {
      applicable: formData.get("bruteForceApplicable") === "true",
      approach: String(formData.get("bruteForceApproach") ?? ""),
      time: String(formData.get("bruteForceTime") ?? ""),
      space: String(formData.get("bruteForceSpace") ?? ""),
    },
    optimal: {
      approach: formData.get("optimalApproach"),
      time: formData.get("optimalTime"),
      space: formData.get("optimalSpace"),
    },
    code: formData.get("code"),
    language: formData.get("language") || "python",
    selfScore: formData.get("selfScore"),
    durationMinutes: formData.get("durationMinutes") || undefined,
    implementationHurdle: formData.get("implementationHurdle") || undefined,
    transcript: formData.get("transcript") || undefined,
  };

  const parsed = UpdateAttemptSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const db = await getDb();
  const client = getMongoClient();

  let attemptObjectId: ObjectId;
  try {
    attemptObjectId = new ObjectId(data.attemptId);
  } catch {
    return { ok: false, error: "Invalid attempt id" };
  }

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const attempt = await db
        .collection<AttemptDoc>("attempts")
        .findOne({ _id: attemptObjectId }, { session });
      if (!attempt) throw new Error("Attempt not found");

      await db.collection<AttemptDoc>("attempts").updateOne(
        { _id: attemptObjectId },
        {
          $set: {
            mode: "deep",
            durationMinutes: data.durationMinutes ?? null,
            selfScore: data.selfScore,
            restate: data.restate,
            bruteForce: data.bruteForce,
            optimal: data.optimal,
            code: data.code,
            language: data.language,
            implementationHurdle: data.implementationHurdle ?? null,
            transcript: data.transcript ?? null,
          },
        },
        { session },
      );

      // If this is the most recent attempt for the problem, sync problem.latest.
      const latest = await db
        .collection<AttemptDoc>("attempts")
        .find({ problemId: attempt.problemId })
        .sort({ attemptedAt: -1 })
        .limit(1)
        .toArray();
      if (latest[0]?._id.equals(attemptObjectId)) {
        await db.collection<ProblemDoc>("problems").updateOne(
          { _id: attempt.problemId },
          {
            $set: {
              latest: {
                restate: data.restate,
                bruteForce: data.bruteForce,
                optimal: data.optimal,
                code: data.code,
                language: data.language,
                transcript: data.transcript ?? null,
              },
              updatedAt: new Date(),
            },
          },
          { session },
        );
      }
    });
  } finally {
    await session.endSession();
  }

  revalidatePath(`/problems/${data.lcNumber}`);
  revalidatePath(`/`);
  return { ok: true };
}

export async function deleteAttempt(formData: FormData): Promise<ActionState> {
  await requireAuth();
  const attemptIdRaw = String(formData.get("attemptId") ?? "");
  const lcNumber = Number(formData.get("lcNumber"));
  if (!attemptIdRaw || !lcNumber) return { ok: false, error: "Missing fields" };

  let attemptObjectId: ObjectId;
  try {
    attemptObjectId = new ObjectId(attemptIdRaw);
  } catch {
    return { ok: false, error: "Invalid attempt id" };
  }

  const db = await getDb();
  const client = getMongoClient();

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const attempt = await db
        .collection<AttemptDoc>("attempts")
        .findOne({ _id: attemptObjectId }, { session });
      if (!attempt) throw new Error("Attempt not found");

      await db
        .collection<AttemptDoc>("attempts")
        .deleteOne({ _id: attemptObjectId }, { session });

      // If we just deleted the most recent deep attempt, rebuild problem.latest
      // from the new newest deep attempt (or null if none remain).
      const newLatestDeep = await db
        .collection<AttemptDoc>("attempts")
        .find({ problemId: attempt.problemId, mode: "deep" })
        .sort({ attemptedAt: -1 })
        .limit(1)
        .toArray();

      const latest = newLatestDeep[0];
      const newLatestField = latest
        ? {
            restate: latest.restate ?? "",
            bruteForce: latest.bruteForce,
            optimal: latest.optimal,
            code: latest.code ?? "",
            language: latest.language ?? "python",
            transcript: latest.transcript,
          }
        : null;

      // Also: if no attempts remain at all, reset status to NotStarted.
      const anyRemaining = await db
        .collection<AttemptDoc>("attempts")
        .countDocuments({ problemId: attempt.problemId }, { session });

      const update: Record<string, unknown> = {
        latest: newLatestField,
        updatedAt: new Date(),
      };
      if (anyRemaining === 0) {
        update.status = "NotStarted";
      }

      await db.collection<ProblemDoc>("problems").updateOne(
        { _id: attempt.problemId },
        { $set: update },
        { session },
      );
    });
  } finally {
    await session.endSession();
  }

  revalidatePath(`/problems/${lcNumber}`);
  revalidatePath(`/`);
  return { ok: true };
}

export async function saveQuickLog(prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAuth();

  const parsed = QuickLogSchema.safeParse({
    lcNumber: formData.get("lcNumber"),
    selfScore: formData.get("selfScore"),
    durationMinutes: formData.get("durationMinutes") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await persistAttempt({ mode: "quick", payload: parsed.data });
  revalidatePath(`/problems/${parsed.data.lcNumber}`);
  revalidatePath(`/`);
  return { ok: true };
}

async function persistAttempt(args:
  | { mode: "deep"; payload: DeepLogInput }
  | { mode: "quick"; payload: QuickLogInput }
): Promise<void> {
  const db = await getDb();
  const client = getMongoClient();
  const { mode, payload } = args;

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      // Read inside the transaction so concurrent writes (e.g., double-submit)
      // see each other's effects via Mongo's MVCC snapshot.
      const problem = await db
        .collection<ProblemDoc>("problems")
        .findOne({ lcNumber: payload.lcNumber }, { session });
      if (!problem) throw new Error(`Problem ${payload.lcNumber} not found`);

      const rating = selfScoreToRating(payload.selfScore);
      const now = new Date();
      const newFsrs = schedule(problem.fsrs as FsrsState, rating, now);

      const attemptDoc: AttemptDoc = {
        _id: new ObjectId(),
        problemId: problem._id,
        lcNumber: problem.lcNumber,
        attemptedAt: now,
        mode,
        durationMinutes: payload.durationMinutes ?? null,
        selfScore: payload.selfScore,
        restate: mode === "deep" ? payload.restate : null,
        bruteForce: mode === "deep" ? payload.bruteForce : null,
        optimal: mode === "deep" ? payload.optimal : null,
        code: mode === "deep" ? payload.code : null,
        language: mode === "deep" ? payload.language : null,
        implementationHurdle: mode === "deep" ? (payload.implementationHurdle ?? null) : null,
        transcript: mode === "deep" ? (payload.transcript ?? null) : null,
        fsrsRating: rating,
        fsrsAfter: {
          stability: newFsrs.stability,
          difficulty: newFsrs.difficulty,
          dueAt: newFsrs.dueAt,
        },
        submissionUrl: null,
      };

      await db.collection<AttemptDoc>("attempts").insertOne(attemptDoc, { session });

      const update: Record<string, unknown> = {
        fsrs: newFsrs,
        updatedAt: now,
      };

      if (mode === "deep") {
        update.latest = {
          restate: payload.restate,
          bruteForce: payload.bruteForce,
          optimal: payload.optimal,
          code: payload.code,
          language: payload.language,
          transcript: payload.transcript ?? null,
        };
      }

      // Auto-promote status upward; never demote on attempt save.
      const promotion = (() => {
        if (problem.status === "NotStarted") return "Solved";
        if (problem.status === "Solved" && newFsrs.reps >= 2) return "Reviewed";
        return null;
      })();
      if (promotion) update.status = promotion;

      // Optional YouTube video attached to this attempt — push to videos array.
      const youtubeUrl =
        mode === "deep" && payload.youtubeUrl ? payload.youtubeUrl : null;
      const operations: Record<string, unknown> = { $set: update };
      if (youtubeUrl) {
        const titleFromForm =
          mode === "deep" && payload.videoTitle ? payload.videoTitle.trim() : "";
        operations.$push = {
          videos: {
            _id: new ObjectId(),
            youtubeUrl,
            title: titleFromForm || `${problem.title} — walkthrough`,
            type: "explainer",
            recordedAt: now,
          },
        };
      }

      await db.collection<ProblemDoc>("problems").updateOne(
        { _id: problem._id },
        operations,
        { session },
      );
    });
  } finally {
    await session.endSession();
  }
}

export async function updateStatus(formData: FormData): Promise<ActionState> {
  await requireAuth();
  const parsed = UpdateStatusSchema.safeParse({
    lcNumber: formData.get("lcNumber"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid status" };

  const db = await getDb();
  await db.collection<ProblemDoc>("problems").updateOne(
    { lcNumber: parsed.data.lcNumber },
    { $set: { status: parsed.data.status, updatedAt: new Date() } },
  );
  revalidatePath(`/problems/${parsed.data.lcNumber}`);
  revalidatePath(`/`);
  return { ok: true };
}

export async function addVideo(formData: FormData): Promise<ActionState> {
  await requireAuth();
  const parsed = AddVideoSchema.safeParse({
    lcNumber: formData.get("lcNumber"),
    youtubeUrl: formData.get("youtubeUrl"),
    title: formData.get("title"),
    type: formData.get("type") || "explainer",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid video" };
  }

  const db = await getDb();
  await db.collection<ProblemDoc>("problems").updateOne(
    { lcNumber: parsed.data.lcNumber },
    {
      $push: {
        videos: {
          _id: new ObjectId(),
          youtubeUrl: parsed.data.youtubeUrl,
          title: parsed.data.title,
          type: parsed.data.type,
          recordedAt: new Date(),
        },
      },
      $set: { updatedAt: new Date() },
    },
  );
  revalidatePath(`/problems/${parsed.data.lcNumber}`);
  return { ok: true };
}

export async function deleteVideo(formData: FormData): Promise<ActionState> {
  await requireAuth();
  const lcNumber = Number(formData.get("lcNumber"));
  const videoId = String(formData.get("videoId"));
  if (!lcNumber || !videoId) return { ok: false, error: "Missing fields" };

  const db = await getDb();
  await db.collection<ProblemDoc>("problems").updateOne(
    { lcNumber },
    {
      $pull: { videos: { _id: new ObjectId(videoId) } },
      $set: { updatedAt: new Date() },
    },
  );
  revalidatePath(`/problems/${lcNumber}`);
  return { ok: true };
}

export async function updateNotes(formData: FormData): Promise<ActionState> {
  await requireAuth();
  const parsed = UpdateNotesSchema.safeParse({
    lcNumber: formData.get("lcNumber"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid notes" };

  const db = await getDb();
  await db.collection<ProblemDoc>("problems").updateOne(
    { lcNumber: parsed.data.lcNumber },
    { $set: { notes: parsed.data.notes, updatedAt: new Date() } },
  );
  revalidatePath(`/problems/${parsed.data.lcNumber}`);
  return { ok: true };
}

export async function updateDiagram(formData: FormData): Promise<ActionState> {
  await requireAuth();
  const parsed = UpdateDiagramSchema.safeParse({
    lcNumber: formData.get("lcNumber"),
    diagramUrl: formData.get("diagramUrl"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid diagram URL" };

  const db = await getDb();
  await db.collection<ProblemDoc>("problems").updateOne(
    { lcNumber: parsed.data.lcNumber },
    { $set: { diagramUrl: parsed.data.diagramUrl || null, updatedAt: new Date() } },
  );
  revalidatePath(`/problems/${parsed.data.lcNumber}`);
  return { ok: true };
}

export async function updateProblemStatement(formData: FormData): Promise<ActionState> {
  await requireAuth();
  const parsed = UpdateProblemStatementSchema.safeParse({
    lcNumber: formData.get("lcNumber"),
    problemStatement: formData.get("problemStatement"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid problem statement" };

  const db = await getDb();
  await db.collection<ProblemDoc>("problems").updateOne(
    { lcNumber: parsed.data.lcNumber },
    {
      $set: {
        problemStatement: parsed.data.problemStatement.trim() || null,
        updatedAt: new Date(),
      },
    },
  );
  revalidatePath(`/problems/${parsed.data.lcNumber}`);
  revalidatePath(`/problems/${parsed.data.lcNumber}/log`);
  return { ok: true };
}
