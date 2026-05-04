import "server-only";

type Bucket = {
  attempts: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function checkRateLimit(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { attempts: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }

  if (bucket.attempts >= MAX_ATTEMPTS) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.attempts += 1;
  return { ok: true, retryAfterSec: 0 };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
