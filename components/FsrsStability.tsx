import { formatStability, type FsrsState } from "@/lib/fsrs";
import { cn } from "@/lib/utils";

export function FsrsStability({
  fsrs,
  className,
}: {
  fsrs: FsrsState;
  className?: string;
}) {
  if (!fsrs.lastReviewAt || fsrs.reps === 0) {
    return (
      <div className={cn("font-mono text-[10px] uppercase tracking-wider text-muted-foreground", className)}>
        no attempts yet
      </div>
    );
  }
  const dueIn = fsrs.dueAt ? Math.ceil((new Date(fsrs.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  return (
    <div className={cn("flex flex-col gap-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground", className)}>
      <span>
        stability <span className="text-foreground">{formatStability(fsrs.stability)}</span>
      </span>
      <span>
        reps <span className="text-foreground">{fsrs.reps}</span> · lapses{" "}
        <span className="text-foreground">{fsrs.lapses}</span>
      </span>
      <span>
        {dueIn < 0 ? <span className="text-destructive">{Math.abs(dueIn)}d overdue</span> : dueIn === 0 ? "due today" : `due in ${dueIn}d`}
      </span>
    </div>
  );
}
