import { z } from "zod";

export const ProblemStatus = z.enum(["NotStarted", "Solved", "Reviewed", "Mastered"]);
export type ProblemStatus = z.infer<typeof ProblemStatus>;

export const STATUS_LABELS: Record<ProblemStatus, string> = {
  NotStarted: "Not Started",
  Solved: "Solved",
  Reviewed: "Reviewed",
  Mastered: "Mastered",
};

export const STATUS_PROGRESS: Record<ProblemStatus, number> = {
  NotStarted: 0,
  Solved: 1,
  Reviewed: 2,
  Mastered: 3,
};

export const VideoType = z.enum(["explainer", "speed", "alternate"]);
export type VideoType = z.infer<typeof VideoType>;

export const AddVideoSchema = z.object({
  lcNumber: z.coerce.number().int().positive(),
  youtubeUrl: z.string().url(),
  title: z.string().min(1).max(200),
  type: VideoType.default("explainer"),
});

export const UpdateStatusSchema = z.object({
  lcNumber: z.coerce.number().int().positive(),
  status: ProblemStatus,
});

export const UpdateNotesSchema = z.object({
  lcNumber: z.coerce.number().int().positive(),
  notes: z.string().max(10000),
});

export const UpdateDiagramSchema = z.object({
  lcNumber: z.coerce.number().int().positive(),
  diagramUrl: z.string().url().or(z.literal("")),
});

export const UpdateProblemStatementSchema = z.object({
  lcNumber: z.coerce.number().int().positive(),
  problemStatement: z.string().max(20000),
});

export type ProblemDoc = {
  _id: import("mongodb").ObjectId;
  lcNumber: number;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  patterns: string[];
  lists: string[];
  premium?: boolean;
  status: ProblemStatus;
  diagramUrl: string | null;
  problemStatement: string | null;
  latest: {
    restate: string;
    bruteForce: { applicable: boolean; approach: string; time: string; space: string } | null;
    optimal: { approach: string; time: string; space: string; insight?: string };
    code: string;
    language: string;
    transcript: string | null;
  } | null;
  videos: Array<{
    _id: import("mongodb").ObjectId;
    youtubeUrl: string;
    title: string;
    type: VideoType;
    recordedAt: Date;
  }>;
  fsrs: {
    stability: number;
    difficulty: number;
    reps: number;
    lapses: number;
    state: "New" | "Learning" | "Review" | "Relearning";
    lastReviewAt: Date | null;
    dueAt: Date;
  };
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AttemptDoc = {
  _id: import("mongodb").ObjectId;
  problemId: import("mongodb").ObjectId;
  lcNumber: number;
  attemptedAt: Date;
  mode: "quick" | "deep";
  durationMinutes: number | null;
  selfScore: number;
  restate: string | null;
  bruteForce: { applicable: boolean; approach: string; time: string; space: string } | null;
  optimal: { approach: string; time: string; space: string; insight?: string } | null;
  code: string | null;
  language: string | null;
  implementationHurdle: import("./attempt").ImplementationHurdle | null;
  transcript: string | null;
  fsrsRating: 1 | 2 | 3 | 4;
  fsrsAfter: { stability: number; difficulty: number; dueAt: Date };
  submissionUrl: string | null;
};
