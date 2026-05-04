import Link from "next/link";
import { notFound } from "next/navigation";
import { getProblemByLc } from "@/lib/queries/problems";
import { getAttemptsByProblem } from "@/lib/queries/attempts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, DifficultyBadge } from "@/components/StatusBadge";
import { AttemptCard } from "@/components/AttemptCard";
import { FsrsStability } from "@/components/FsrsStability";
import { VideoList } from "@/components/VideoList";
import { QuickLogButton } from "@/components/QuickLogButton";
import { StatusToggle, MarkAsMasteredButton } from "@/components/StatusToggle";
import { NotesEditor } from "@/components/NotesEditor";
import { DiagramField } from "@/components/DiagramField";
import { SiteHeader } from "@/components/SiteHeader";
import { ProblemStatementPanel } from "@/components/ProblemStatementPanel";
import { PATTERN_META } from "@/lib/patterns";
import { ArrowLeft, ExternalLink, FileText, Sparkles } from "lucide-react";
import type { Pattern } from "@/lib/patterns";

export const dynamic = "force-dynamic";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ lcNumber: string }>;
}) {
  const { lcNumber: lcNumberStr } = await params;
  const lcNumber = Number(lcNumberStr);
  if (Number.isNaN(lcNumber)) notFound();

  const problem = await getProblemByLc(lcNumber);
  if (!problem) notFound();

  const attempts = await getAttemptsByProblem(problem._id, 30);

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

      <header className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            #{problem.lcNumber}
          </span>
          <DifficultyBadge difficulty={problem.difficulty} />
          <StatusBadge status={problem.status} />
          {problem.premium ? (
            <span className="inline-flex items-center rounded-md border border-warning/30 bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warning">
              premium
            </span>
          ) : null}
        </div>
        <h1 className="font-serif-italic text-4xl font-light tracking-tight md:text-5xl">
          {problem.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {problem.patterns.map((p) => {
            const meta = PATTERN_META[p as Pattern];
            if (!meta) return null;
            return (
              <Link
                key={p}
                href={`/patterns/${meta.slug}`}
                className="rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {meta.name}
              </Link>
            );
          })}
        </div>
      </header>

      <Card className="mb-8">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" /> Open on LeetCode
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href={`/problems/${problem.lcNumber}/log`}>
                <FileText className="mr-1 h-3 w-3" /> Deep log
              </Link>
            </Button>
            <QuickLogButton lcNumber={problem.lcNumber} />
          </div>
          <div className="flex items-center gap-3">
            <FsrsStability fsrs={problem.fsrs} />
            <StatusToggle lcNumber={problem.lcNumber} current={problem.status} />
            <MarkAsMasteredButton lcNumber={problem.lcNumber} current={problem.status} />
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <ProblemStatementPanel
          lcNumber={problem.lcNumber}
          leetcodeUrl={problem.leetcodeUrl}
          defaultValue={problem.problemStatement}
        />
      </div>

      {attempts.length > 0 ? (
        <Section title="Attempts" icon={<Sparkles className="h-4 w-4" />}>
          <p className="mb-4 text-sm text-muted-foreground">
            Click any card to open the full record — restate, brute force, optimal, code, transcript.
          </p>
          <div className="space-y-3">
            {attempts.map((a, i) => (
              <AttemptCard
                key={String(a._id)}
                lcNumber={problem.lcNumber}
                attempt={{
                  _id: String(a._id),
                  attemptedAt: a.attemptedAt,
                  mode: a.mode,
                  durationMinutes: a.durationMinutes,
                  selfScore: a.selfScore,
                  restate: a.restate,
                  bruteForce: a.bruteForce,
                  optimal: a.optimal,
                  code: a.code,
                  language: a.language,
                  implementationHurdle: a.implementationHurdle,
                  transcript: a.transcript,
                }}
                index={i}
                total={attempts.length}
              />
            ))}
          </div>
        </Section>
      ) : (
        <Card>
          <CardContent className="space-y-3 p-8 text-center">
            <p className="font-serif-italic text-2xl font-light">No attempts yet.</p>
            <p className="text-sm text-muted-foreground">
              Solve it on LeetCode, then click <strong>Deep log</strong> above to capture the interview-shape walkthrough.
            </p>
          </CardContent>
        </Card>
      )}

      <Separator className="my-12" />

      <div className="grid gap-10 md:grid-cols-2">
        <Section title="Diagram">
          <DiagramField lcNumber={problem.lcNumber} defaultValue={problem.diagramUrl} />
        </Section>

        <Section title="Notes">
          <NotesEditor lcNumber={problem.lcNumber} defaultValue={problem.notes} />
        </Section>
      </div>

      <Separator className="my-12" />

      <Section title="Videos">
        <VideoList
          lcNumber={problem.lcNumber}
          videos={problem.videos.map((v) => ({ ...v, _id: String(v._id) }))}
        />
      </Section>
    </main>
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 font-serif-italic text-2xl font-light">
        {icon}
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

