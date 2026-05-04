import { Suspense } from "react";
import Link from "next/link";
import { PatternGrid } from "@/components/PatternGrid";
import { DueQueue } from "@/components/DueQueue";
import { Heatmap } from "@/components/Heatmap";
import { SiteHeader } from "@/components/SiteHeader";
import { getDueQueue, getProblemStats } from "@/lib/queries/problems";
import { getHeatmap } from "@/lib/queries/heatmap";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Flame, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dueQueue, heatmap, stats] = await Promise.all([
    getDueQueue(20),
    getHeatmap(),
    getProblemStats(),
  ]);

  const todayCount = heatmap[heatmap.length - 1]?.count ?? 0;

  return (
    <>
    <SiteHeader />
    <main className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="mb-10 flex items-end justify-between border-b pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            personal dsa tracker
          </p>
          <h1 className="mt-2 font-serif-italic text-4xl font-light tracking-tight md:text-5xl">
            fluent <span className="text-primary">in code.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Blind 75, NeetCode 150, and beyond. One pattern at a time.
          </p>
        </div>
        <div className="flex gap-3 text-right">
          <Card className="px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Target className="h-3 w-3" />
              solved
            </div>
            <div className="mt-1 font-serif-italic text-2xl font-light">
              {stats.solved + stats.reviewed + stats.mastered} / {stats.total}
            </div>
          </Card>
          <Card className="px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Flame className="h-3 w-3" />
              today
            </div>
            <div className="mt-1 font-serif-italic text-2xl font-light">
              {todayCount}
            </div>
          </Card>
        </div>
      </header>

      <section className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif-italic text-2xl font-light">Due today</h2>
          <Link
            href="/lists/blind-75"
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            blind 75 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <Suspense fallback={<Card className="p-6 text-sm text-muted-foreground">Loading…</Card>}>
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
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            neetcode 150 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <PatternGrid />
      </section>
    </main>
    </>
  );
}
