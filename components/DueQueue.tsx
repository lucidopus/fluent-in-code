import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/StatusBadge";
import { formatDueDate } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ProblemDoc } from "@/lib/schemas/problem";

export function DueQueue({ items }: { items: ProblemDoc[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-2 p-6 text-center">
          <p className="font-serif-italic text-xl font-light">All clear.</p>
          <p className="text-sm text-muted-foreground">
            Nothing due right now. Pick a new problem from the patterns below, or skim the Blind 75 list.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="divide-y p-0">
        {items.map((p) => (
          <Link
            key={p.lcNumber}
            href={`/problems/${p.lcNumber}`}
            className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
          >
            <span className="w-12 font-mono text-xs text-muted-foreground">
              #{p.lcNumber}
            </span>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">
                {formatDueDate(p.fsrs.dueAt)} · reps {p.fsrs.reps}
              </div>
            </div>
            <DifficultyBadge difficulty={p.difficulty} />
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
