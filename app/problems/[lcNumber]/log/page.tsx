import Link from "next/link";
import { notFound } from "next/navigation";
import { getProblemByLc } from "@/lib/queries/problems";
import { AttemptForm } from "@/components/AttemptForm";
import { DifficultyBadge } from "@/components/StatusBadge";
import { SiteHeader } from "@/components/SiteHeader";
import { ProblemStatementPanel } from "@/components/ProblemStatementPanel";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LogPage({
  params,
}: {
  params: Promise<{ lcNumber: string }>;
}) {
  const { lcNumber: lcNumberStr } = await params;
  const lcNumber = Number(lcNumberStr);
  if (Number.isNaN(lcNumber)) notFound();

  const problem = await getProblemByLc(lcNumber);
  if (!problem) notFound();

  return (
    <>
    <SiteHeader />
    <main className="container mx-auto max-w-3xl px-4 py-6 md:py-10">
      <Link
        href={`/problems/${problem.lcNumber}`}
        className="mb-4 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> back to {problem.title}
      </Link>

      <header className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            #{problem.lcNumber}
          </span>
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm">{problem.title}</span>
        </div>
        <h1 className="font-serif-italic text-3xl font-light tracking-tight md:text-4xl">
          Deep log<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          The interview answer shape. Restate · brute · optimal · code · score. Walk it like
          you would walk an interviewer.
        </p>
      </header>

      <div className="mb-8">
        <ProblemStatementPanel
          lcNumber={problem.lcNumber}
          leetcodeUrl={problem.leetcodeUrl}
          defaultValue={problem.problemStatement}
          defaultExpanded
        />
      </div>

      <AttemptForm lcNumber={problem.lcNumber} lcTitle={problem.title} />
    </main>
    </>
  );
}
