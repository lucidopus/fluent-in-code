import { cn } from "@/lib/utils";
import { STATUS_LABELS, type ProblemStatus } from "@/lib/schemas/problem";

const STATUS_STYLES: Record<ProblemStatus, string> = {
  NotStarted: "bg-muted text-muted-foreground border-border",
  Solved: "bg-progress/15 text-progress border-progress/30",
  Reviewed: "bg-warning/15 text-warning border-warning/30",
  Mastered: "bg-done/15 text-done border-done/40",
};

export function StatusBadge({ status, className }: { status: ProblemStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        STATUS_STYLES[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const styles = {
    Easy: "text-done border-done/30",
    Medium: "text-progress border-progress/30",
    Hard: "text-destructive border-destructive/30",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        styles[difficulty],
      )}
    >
      {difficulty}
    </span>
  );
}
