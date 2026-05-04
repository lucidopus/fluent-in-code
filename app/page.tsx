import { Suspense } from "react";
import Link from "next/link";
import { PatternGrid } from "@/components/PatternGrid";
import { DueQueue } from "@/components/DueQueue";
import { Heatmap } from "@/components/Heatmap";
import { SiteHeader } from "@/components/SiteHeader";
import { getDueQueue, getProblemStats } from "@/lib/queries/problems";
import { getHeatmap } from "@/lib/queries/heatmap";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

function computeStreak(cells: { date: string; count: number }[]): number {
  let streak = 0;
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].count > 0) streak++;
    else break;
  }
  return streak;
}

export default async function HomePage() {
  const [dueQueue, heatmap, stats] = await Promise.all([
    getDueQueue(20),
    getHeatmap(),
    getProblemStats(),
  ]);

  const todayCount = heatmap[heatmap.length - 1]?.count ?? 0;
  const solved = stats.solved + stats.reviewed + stats.mastered;
  const streak = computeStreak(heatmap);

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              personal dsa tracker
            </p>
            <h1 className="mt-1 font-serif-italic text-4xl font-light tracking-tight md:text-5xl">
              fluent <span className="text-primary">in code.</span>
            </h1>
          </div>
          <div className="flex items-baseline gap-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <Stat label="solved" value={`${solved}/${stats.total}`} />
            <Stat label="due" value={String(stats.due)} highlight={stats.due > 0} />
            <Stat label="today" value={String(todayCount)} highlight={todayCount > 0} />
            <Stat label="streak" value={streak > 0 ? `${streak}d` : "—"} highlight={streak > 0} />
          </div>
        </header>

        <section className="mb-10">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif-italic text-2xl font-light">Due today</h2>
            {stats.due > 0 ? (
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {stats.due} queued
              </span>
            ) : null}
          </div>
          <Suspense
            fallback={
              <Card className="p-6 text-sm text-muted-foreground">Loading…</Card>
            }
          >
            <DueQueue items={dueQueue} />
          </Suspense>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 font-serif-italic text-2xl font-light">Activity</h2>
          <Card>
            <CardContent className="p-4 md:p-6">
              <Heatmap data={heatmap} />
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif-italic text-2xl font-light">Patterns</h2>
            <Link
              href="/lists/neetcode-150"
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              full neetcode 150 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <PatternGrid />
        </section>
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <span className="flex flex-col items-end leading-none">
      <span
        className={
          highlight
            ? "font-serif-italic text-2xl font-light not-italic text-foreground"
            : "font-serif-italic text-2xl font-light not-italic text-muted-foreground"
        }
      >
        {value}
      </span>
      <span className="mt-1 text-[10px]">{label}</span>
    </span>
  );
}
