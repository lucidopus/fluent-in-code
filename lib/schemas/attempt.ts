import { z } from "zod";

export const ImplementationHurdle = z.enum([
  "None",
  "OffByOne",
  "LogicGate",
  "EdgeCase",
  "Syntax",
  "DataStructureOp",
  "TimeComplexity",
  "Other",
]);

export type ImplementationHurdle = z.infer<typeof ImplementationHurdle>;

export const HURDLE_LABELS: Record<ImplementationHurdle, string> = {
  None: "Nothing tripped me up",
  OffByOne: "Off-by-one error",
  LogicGate: "AND/OR logic mix-up",
  EdgeCase: "Edge case I missed",
  Syntax: "Language syntax I forgot",
  DataStructureOp: "Wrong data structure operation",
  TimeComplexity: "Wrong complexity analysis",
  Other: "Something else",
};

export const ComplexitySchema = z.object({
  approach: z.string().min(1, "Describe the approach"),
  time: z.string().min(1, "Time complexity is required"),
  space: z.string().min(1, "Space complexity is required"),
});

export const BruteForceSchema = z.object({
  applicable: z.boolean(),
  approach: z.string(),
  time: z.string(),
  space: z.string(),
});

export const OptimalSchema = ComplexitySchema;

export const QuickLogSchema = z.object({
  lcNumber: z.coerce.number().int().positive(),
  selfScore: z.coerce.number().int().min(1).max(10),
  durationMinutes: z.coerce.number().int().min(0).optional(),
});

export type QuickLogInput = z.infer<typeof QuickLogSchema>;

export const UpdateAttemptSchema = z.object({
  attemptId: z.string().min(1),
  lcNumber: z.coerce.number().int().positive(),
  restate: z.string().min(20, "Restate the problem in your own words (20+ chars)"),
  bruteForce: BruteForceSchema.refine(
    (b) => !b.applicable || (b.approach.length > 0 && b.time.length > 0 && b.space.length > 0),
    { message: "If brute force is applicable, fill in approach + time + space" },
  ),
  optimal: OptimalSchema,
  code: z.string().min(1, "Paste your code"),
  language: z.string().min(1, "Language is required").default("python"),
  selfScore: z.coerce.number().int().min(1).max(10),
  durationMinutes: z.coerce.number().int().min(0).optional(),
  implementationHurdle: ImplementationHurdle.optional(),
  transcript: z.string().optional(),
});

export type UpdateAttemptInput = z.infer<typeof UpdateAttemptSchema>;

export const DeepLogSchema = z.object({
  lcNumber: z.coerce.number().int().positive(),
  restate: z.string().min(20, "Restate the problem in your own words (20+ chars)"),
  bruteForce: BruteForceSchema.refine(
    (b) => !b.applicable || (b.approach.length > 0 && b.time.length > 0 && b.space.length > 0),
    { message: "If brute force is applicable, fill in approach + time + space" },
  ),
  optimal: OptimalSchema,
  code: z.string().min(1, "Paste your code"),
  language: z.string().min(1, "Language is required").default("python"),
  selfScore: z.coerce.number().int().min(1).max(10),
  durationMinutes: z.coerce.number().int().min(0).optional(),
  implementationHurdle: ImplementationHurdle.optional(),
  transcript: z.string().optional(),
  youtubeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  videoTitle: z.string().optional(),
});

export type DeepLogInput = z.infer<typeof DeepLogSchema>;
