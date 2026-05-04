import { Card, CardContent } from "@/components/ui/card";
import { DueQueueRow, type DueRowItem } from "@/components/DueQueueRow";
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
  const rows: DueRowItem[] = items.map((p) => ({
    lcNumber: p.lcNumber,
    title: p.title,
    difficulty: p.difficulty,
    dueAt: p.fsrs.dueAt instanceof Date ? p.fsrs.dueAt.toISOString() : String(p.fsrs.dueAt),
    reps: p.fsrs.reps,
  }));
  return (
    <Card>
      <CardContent className="divide-y p-0">
        {rows.map((p) => (
          <DueQueueRow key={p.lcNumber} item={p} />
        ))}
      </CardContent>
    </Card>
  );
}
