import Link from "next/link";
import { notFound } from "next/navigation";
import { PATTERN_META, patternBySlug } from "@/lib/patterns";
import { getProblemsByPattern } from "@/lib/queries/problems";
import { Card, CardContent } from "@/components/ui/card";
import { ProblemRow } from "@/components/ProblemRow";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = patternBySlug(slug);
  if (!pattern) notFound();

  const meta = PATTERN_META[pattern];
  const problems = await getProblemsByPattern(pattern);
  const solved = problems.filter((p) => p.status !== "NotStarted").length;
  const mastered = problems.filter((p) => p.status === "Mastered").length;

  const grouped = {
    Easy: problems.filter((p) => p.difficulty === "Easy"),
    Medium: problems.filter((p) => p.difficulty === "Medium"),
    Hard: problems.filter((p) => p.difficulty === "Hard"),
  };

  return (
    <>
    <SiteHeader />
    <main className="container mx-auto max-w-5xl px-4 py-6 md:py-10">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> all patterns
      </Link>

      <header className="mb-8 space-y-2 border-b pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          pattern
        </p>
        <h1 className="font-serif-italic text-4xl font-light tracking-tight md:text-5xl">
          {meta.name}<span className="text-primary">.</span>
        </h1>
        <p className="text-base italic text-muted-foreground">{meta.signal}</p>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
        <div className="flex items-center gap-3 pt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <span>{solved}/{problems.length} solved</span>
          <span>·</span>
          <span>{mastered} mastered</span>
        </div>
      </header>

      <div className="space-y-8">
        {(["Easy", "Medium", "Hard"] as const).map((diff) =>
          grouped[diff].length === 0 ? null : (
            <section key={diff} className="space-y-2">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {diff}
              </h2>
              <Card>
                <CardContent className="divide-y p-0">
                  {grouped[diff].map((p) => (
                    <ProblemRow key={p.lcNumber} problem={p} />
                  ))}
                </CardContent>
              </Card>
            </section>
          ),
        )}
      </div>
    </main>
    </>
  );
}
