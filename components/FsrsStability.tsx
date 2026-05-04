import { formatStability, type FsrsState } from "@/lib/fsrs";
import { cn } from "@/lib/utils";

type Bucket = {
  label: string;
  filled: number;
  tone: string;
};

function confidenceBucket(stabilityDays: number): Bucket {
  if (stabilityDays < 7) return { label: "fragile", filled: 1, tone: "text-destructive" };
  if (stabilityDays < 30) return { label: "warming", filled: 2, tone: "text-progress" };
  if (stabilityDays < 90) return { label: "stable", filled: 3, tone: "text-primary" };
  if (stabilityDays < 365) return { label: "confident", filled: 4, tone: "text-done" };
  return { label: "locked in", filled: 5, tone: "text-done" };
}

export function FsrsStability({
  fsrs,
  className,
}: {
  fsrs: FsrsState;
  className?: string;
}) {
  if (!fsrs.lastReviewAt || fsrs.reps === 0) {
    return (
      <div
        className={cn(
          "font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
          className,
        )}
        title="No attempts logged. Save a Quick or Deep log to start the FSRS schedule."
      >
        no attempts yet
      </div>
    );
  }

  const dueIn = fsrs.dueAt
    ? Math.ceil((new Date(fsrs.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  const bucket = confidenceBucket(fsrs.stability);
  const tooltip = `stability ${formatStability(fsrs.stability)} · reps ${fsrs.reps} · lapses ${fsrs.lapses}`;

  const dueLabel =
    dueIn < 0
      ? `${Math.abs(dueIn)}d overdue`
      : dueIn === 0
        ? "due today"
        : dueIn === 1
          ? "due tomorrow"
          : `next in ${dueIn}d`;

  return (
    <div
      title={tooltip}
      className={cn("flex items-center gap-2", className)}
    >
      <div className="flex items-center gap-1" aria-label={`confidence ${bucket.label}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-2 rounded-full",
              i < bucket.filled
                ? cn(bucket.tone, "bg-current")
                : "border border-muted-foreground/40",
            )}
          />
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <span className={cn("font-mono text-[10px] uppercase tracking-wider", bucket.tone)}>
          {bucket.label}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-wider",
            dueIn < 0 ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {dueLabel}
        </span>
      </div>
    </div>
  );
}
