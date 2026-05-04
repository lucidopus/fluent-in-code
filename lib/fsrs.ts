/**
 * FSRS-4.5 spaced-repetition scheduler.
 * Vendored implementation — no library. Tuned with default weights from the
 * open-source spec at https://github.com/open-spaced-repetition/fsrs4anki.
 *
 * Inputs: current FSRS state + rating (1=Again, 2=Hard, 3=Good, 4=Easy).
 * Outputs: next state with computed stability, difficulty, lapses, and dueAt.
 */

export type FsrsState = {
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  state: "New" | "Learning" | "Review" | "Relearning";
  lastReviewAt: Date | null;
  dueAt: Date;
};

export type FsrsRating = 1 | 2 | 3 | 4;

const W = [
  0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616, 0.1544,
  1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466,
];

const REQUEST_RETENTION = 0.9;
const DECAY = -0.5;
const FACTOR = Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function initStability(rating: FsrsRating): number {
  return Math.max(W[rating - 1], 0.1);
}

function initDifficulty(rating: FsrsRating): number {
  const d = W[4] - Math.exp(W[5] * (rating - 1)) + 1;
  return clamp(d, 1, 10);
}

function meanReversion(initVal: number, currentVal: number): number {
  return W[7] * initVal + (1 - W[7]) * currentVal;
}

function nextDifficulty(d: number, rating: FsrsRating): number {
  const dprime = d - W[6] * (rating - 3);
  return clamp(meanReversion(W[4], dprime), 1, 10);
}

function nextStabilitySuccess(
  d: number,
  s: number,
  r: number,
  rating: 2 | 3 | 4,
): number {
  const hardPenalty = rating === 2 ? W[15] : 1;
  const easyBonus = rating === 4 ? W[16] : 1;
  const factor =
    Math.exp(W[8]) *
    (11 - d) *
    Math.pow(s, -W[9]) *
    (Math.exp((1 - r) * W[10]) - 1) *
    hardPenalty *
    easyBonus;
  return s * (1 + factor);
}

function nextStabilityFail(d: number, s: number, r: number): number {
  return W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp((1 - r) * W[14]);
}

function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * elapsedDays) / stability, DECAY);
}

function nextInterval(stability: number): number {
  const interval = (stability / FACTOR) * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1);
  return Math.max(Math.round(Math.max(interval, 1)), 1);
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * MS_PER_DAY);
}

export function schedule(state: FsrsState, rating: FsrsRating, now: Date = new Date()): FsrsState {
  if (state.state === "New" || state.lastReviewAt === null) {
    const s = initStability(rating);
    const d = initDifficulty(rating);
    const isLapse = rating === 1;
    return {
      stability: s,
      difficulty: d,
      reps: 1,
      lapses: isLapse ? 1 : 0,
      state: isLapse ? "Learning" : "Review",
      lastReviewAt: now,
      dueAt: isLapse ? addDays(now, 1) : addDays(now, nextInterval(s)),
    };
  }

  const elapsedDays = (now.getTime() - state.lastReviewAt.getTime()) / MS_PER_DAY;
  const r = retrievability(elapsedDays, state.stability);
  const newD = nextDifficulty(state.difficulty, rating);

  let newS: number;
  let lapses = state.lapses;
  let nextState: FsrsState["state"];

  if (rating === 1) {
    newS = nextStabilityFail(newD, state.stability, r);
    lapses += 1;
    nextState = "Relearning";
  } else {
    newS = nextStabilitySuccess(newD, state.stability, r, rating);
    nextState = "Review";
  }

  return {
    stability: newS,
    difficulty: newD,
    reps: state.reps + 1,
    lapses,
    state: nextState,
    lastReviewAt: now,
    dueAt: rating === 1 ? addDays(now, 1) : addDays(now, nextInterval(newS)),
  };
}

/**
 * Map a self-score 1-10 to an FSRS rating 1-4.
 *   1-3 → Again (struggled, needs immediate re-attempt)
 *   4-6 → Hard  (got it but felt hard)
 *   7-8 → Good  (clean solve)
 *   9-10 → Easy (instant, no doubt)
 */
export function selfScoreToRating(score: number): FsrsRating {
  if (score <= 3) return 1;
  if (score <= 6) return 2;
  if (score <= 8) return 3;
  return 4;
}

export function defaultFsrsState(now: Date = new Date()): FsrsState {
  return {
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    state: "New",
    lastReviewAt: null,
    dueAt: now,
  };
}

/**
 * Format a stability (in days) for display next to "Mark as Mastered."
 */
export function formatStability(stability: number): string {
  if (stability < 1) return "<1 day";
  if (stability < 30) return `${Math.round(stability)} days`;
  if (stability < 365) return `${(stability / 30).toFixed(1)} months`;
  return `${(stability / 365).toFixed(1)} years`;
}
