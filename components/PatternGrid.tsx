import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PATTERN_META, PATTERN_ORDER } from "@/lib/patterns";
import { getPatternStats } from "@/lib/queries/problems";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export async function PatternGrid() {
  const stats = await getPatternStats();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PATTERN_ORDER.map((p) => {
        const meta = PATTERN_META[p];
        const s = stats[p] ?? { total: 0, solved: 0, mastered: 0 };
        const pct = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
        const Icon = meta.icon;
        return (
          <Link key={p} href={`/patterns/${meta.slug}`} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                        meta.accentSoft,
                      )}
                    >
                      <Icon className={cn("h-4 w-4", meta.accent)} />
                    </span>
                    <div className="space-y-2">
                      <h3 className="font-serif-italic text-lg font-light leading-tight">
                        {meta.name}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {meta.signal}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.solved}/{s.total} solved · {s.mastered} mastered
                  </span>
                  <span className="font-mono text-xs">
                    {pct}
                    <span className="text-muted-foreground">%</span>
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full transition-all", meta.accentBar)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
