import Link from "next/link";
import { DifficultyBadge, StatusBadge } from "@/components/StatusBadge";
import { formatStability } from "@/lib/fsrs";
import { ArrowUpRight, Video } from "lucide-react";
import type { ProblemDoc } from "@/lib/schemas/problem";

export function ProblemRow({ problem }: { problem: ProblemDoc }) {
  const dueIn = problem.fsrs.dueAt
    ? Math.ceil((new Date(problem.fsrs.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const overdue = dueIn !== null && dueIn < 0 && problem.status !== "Mastered" && problem.fsrs.lastReviewAt;

  return (
    <Link
      href={`/problems/${problem.lcNumber}`}
      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
    >
      <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
        #{problem.lcNumber}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 truncate">
          <span className="truncate font-medium">{problem.title}</span>
          {problem.videos.length > 0 ? (
            <Video className="h-3 w-3 shrink-0 text-muted-foreground" aria-label="has video" />
          ) : null}
          {problem.premium ? (
            <span className="rounded-md border border-warning/30 bg-warning/10 px-1.5 py-0 font-mono text-[9px] uppercase tracking-wider text-warning">
              premium
            </span>
          ) : null}
        </div>
        {problem.fsrs.reps > 0 ? (
          <div className="text-xs text-muted-foreground">
            stability {formatStability(problem.fsrs.stability)} · reps {problem.fsrs.reps}
            {overdue ? <span className="ml-1 text-destructive">· overdue</span> : null}
          </div>
        ) : null}
      </div>
      <DifficultyBadge difficulty={problem.difficulty} />
      <StatusBadge status={problem.status} className="hidden md:inline-flex" />
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
    </Link>
  );
}
