import Link from "next/link";
import { getProblemsByList } from "@/lib/queries/problems";
import { Card, CardContent } from "@/components/ui/card";
import { ProblemRow } from "@/components/ProblemRow";
import { SiteHeader } from "@/components/SiteHeader";
import { PATTERN_META, type Pattern } from "@/lib/patterns";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Blind75Page() {
  const problems = await getProblemsByList("blind75");
  const total = problems.length;
  const solved = problems.filter((p) => p.status !== "NotStarted").length;
  const mastered = problems.filter((p) => p.status === "Mastered").length;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  const byPattern = new Map<Pattern, typeof problems>();
  for (const p of problems) {
    const primary = (p.patterns[0] ?? "ArraysHashing") as Pattern;
    if (!byPattern.has(primary)) byPattern.set(primary, []);
    byPattern.get(primary)!.push(p);
  }

  return (
    <>
    <SiteHeader />
    <main className="container mx-auto max-w-5xl px-4 py-6 md:py-10">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> back
      </Link>

      <header className="mb-8 space-y-2 border-b pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          curated list
        </p>
        <h1 className="font-serif-italic text-4xl font-light tracking-tight md:text-5xl">
          Blind 75<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          The canonical 75. Your first lap.
        </p>
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <span>{solved}/{total} solved · {mastered} mastered</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {Array.from(byPattern.entries()).map(([pattern, items]) => {
          const meta = PATTERN_META[pattern];
          if (!meta) return null;
          return (
            <section key={pattern} className="space-y-2">
              <h2 className="flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span>{meta.name}</span>
                <Link href={`/patterns/${meta.slug}`} className="text-[10px] hover:text-foreground">
                  view all
                </Link>
              </h2>
              <Card>
                <CardContent className="divide-y p-0">
                  {items.map((p) => (
                    <ProblemRow key={p.lcNumber} problem={p} />
                  ))}
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>
    </main>
    </>
  );
}
