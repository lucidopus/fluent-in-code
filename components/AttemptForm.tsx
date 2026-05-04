"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { saveDeepLog } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { HURDLE_LABELS, type ImplementationHurdle } from "@/lib/schemas/attempt";

const CodeEditor = dynamic(
  () => import("@/components/CodeEditor").then((m) => m.CodeEditor),
  { ssr: false, loading: () => <Skeleton className="h-80 w-full" /> },
);

const HURDLE_OPTIONS: ImplementationHurdle[] = [
  "None",
  "OffByOne",
  "LogicGate",
  "EdgeCase",
  "Syntax",
  "DataStructureOp",
  "TimeComplexity",
  "Other",
];

const LANGUAGES = ["python", "javascript", "typescript", "java", "cpp", "go", "rust"];

const initial = { ok: false } as const;

export function AttemptForm({ lcNumber, lcTitle }: { lcNumber: number; lcTitle: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveDeepLog, initial);
  const [bruteApplicable, setBruteApplicable] = useState(true);
  const [score, setScore] = useState(7);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && !pending) {
      router.push(`/problems/${lcNumber}`);
    }
  }, [state.ok, pending, lcNumber, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const band = scoreBand(score);

  return (
    <form ref={formRef} action={action} className="space-y-8 pb-24">
      <input type="hidden" name="lcNumber" value={lcNumber} />

      <Section
        title="1. Restate the problem"
        hint="In your own words, like you would to an interviewer. Inputs, outputs, edge cases."
      >
        <div className="space-y-1.5">
          <Label htmlFor="restate" className="text-xs uppercase tracking-wider">
            your restatement
          </Label>
          <Textarea
            id="restate"
            name="restate"
            required
            rows={6}
            className="min-h-40"
            placeholder="Question states that... given an array of integers and a target..."
          />
        </div>
      </Section>

      <Section
        title="2. Brute force"
        hint="What's the dumb solution that obviously works? Articulate it before optimizing."
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="bruteForceApplicable"
            checked={bruteApplicable}
            onCheckedChange={(v) => setBruteApplicable(Boolean(v))}
          />
          <Label htmlFor="bruteForceApplicable" className="text-sm">
            A brute-force approach is applicable here
          </Label>
        </div>
        <input type="hidden" name="bruteForceApplicable" value={String(bruteApplicable)} />
        {bruteApplicable ? (
          <ComplexityFields
            namePrefix="bruteForce"
            descriptionPlaceholder="e.g. nested loop checking every pair, then return the first match"
            timePlaceholder="O(n²)"
            spacePlaceholder="O(1)"
          />
        ) : (
          <>
            <input type="hidden" name="bruteForceApproach" value="N/A — direct construction" />
            <input type="hidden" name="bruteForceTime" value="N/A" />
            <input type="hidden" name="bruteForceSpace" value="N/A" />
            <p className="text-sm text-muted-foreground">
              Marked as not applicable. Some problems have no meaningful naive — we&apos;ll record this on the attempt.
            </p>
          </>
        )}
      </Section>

      <Section
        title="3. Optimal approach"
        hint="The solution you'd actually ship. State the complexity before you've written the code."
      >
        <ComplexityFields
          namePrefix="optimal"
          descriptionPlaceholder="e.g. one pass with hashmap of complement; the insight is that we don't need both numbers, only the complement"
          timePlaceholder="O(n)"
          spacePlaceholder="O(n)"
        />
      </Section>

      <Section
        title="4. Code"
        hint="Paste what you actually wrote. Editor is full Monaco — syntax highlighting, tab indent."
      >
        <div className="space-y-1.5">
          <Label htmlFor="language" className="text-xs uppercase tracking-wider">language</Label>
          <Select name="language" defaultValue="python">
            <SelectTrigger id="language" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider">your code</Label>
          <CodeEditor name="code" language="python" />
        </div>
      </Section>

      <Section title="5. Self-score" hint="1-3 Again · 4-6 Hard · 7-8 Good · 9-10 Easy. Drives FSRS scheduling.">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider">how it went (1-10)</Label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Slider
                min={1}
                max={10}
                step={1}
                value={[score]}
                onValueChange={(v) => setScore(v[0] ?? 7)}
              />
              <ScoreTicks />
            </div>
            <div className="flex w-20 flex-col items-end leading-none">
              <div className={cn("font-serif-italic text-3xl font-light", band.tone)}>{score}</div>
              <div className={cn("font-mono text-[10px] uppercase tracking-wider", band.tone)}>
                {band.label}
              </div>
            </div>
          </div>
        </div>
        <input type="hidden" name="selfScore" value={score} />
      </Section>

      <Section title="6. Optional metadata" hint="Skip any of these if you're in a hurry — they're all optional.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="durationMinutes" className="text-xs uppercase tracking-wider">duration (min)</Label>
            <Input id="durationMinutes" name="durationMinutes" type="number" min={0} placeholder="20" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="implementationHurdle" className="text-xs uppercase tracking-wider">where did you stall?</Label>
            <Select name="implementationHurdle">
              <SelectTrigger id="implementationHurdle">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                {HURDLE_OPTIONS.map((h) => (
                  <SelectItem key={h} value={h}>{HURDLE_LABELS[h]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <div className="space-y-1.5">
            <Label htmlFor="videoTitle" className="text-xs uppercase tracking-wider">
              video title
            </Label>
            <Input
              id="videoTitle"
              name="videoTitle"
              placeholder="Two Sum — walkthrough"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="youtubeUrl" className="text-xs uppercase tracking-wider">
              youtube url
            </Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              placeholder="https://youtu.be/... — record an explainer to lock the pattern in"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="transcript" className="text-xs uppercase tracking-wider">
            think-out-loud transcript (markdown, optional)
          </Label>
          <Textarea
            id="transcript"
            name="transcript"
            rows={8}
            className="min-h-52"
            placeholder="Paste your spoken-aloud reasoning. Useful when re-reading later — replay how you thought, not just what you wrote."
          />
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-4 mt-8 flex items-center gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80">
        <Button type="submit" size="lg" disabled={pending} className="h-11">
          {pending ? "Saving…" : `Log attempt — ${lcTitle}`}
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link href={`/problems/${lcNumber}`}>Cancel</Link>
        </Button>
        <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:inline">
          <kbd className="rounded border bg-muted/50 px-1 py-0.5">⌘</kbd>
          <kbd className="ml-1 rounded border bg-muted/50 px-1 py-0.5">↵</kbd>
          <span className="ml-2">to save</span>
        </span>
        {state.error ? (
          <span className="ml-auto truncate text-xs text-destructive md:ml-4">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}

type ScoreBand = { label: string; tone: string };
export function scoreBand(score: number): ScoreBand {
  if (score <= 3) return { label: "Again", tone: "text-destructive" };
  if (score <= 6) return { label: "Hard", tone: "text-progress" };
  if (score <= 8) return { label: "Good", tone: "text-primary" };
  return { label: "Easy", tone: "text-done" };
}

function ScoreTicks() {
  // Slider range is 1..10. Tick boundaries between bands sit at 3.5, 6.5, 8.5.
  // Convert to percent across the [1,10] range: (val-1)/9 * 100.
  const at = (v: number) => `${((v - 1) / 9) * 100}%`;
  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-1.5 h-1.5">
      {[3.5, 6.5, 8.5].map((v) => (
        <span
          key={v}
          aria-hidden
          className="absolute top-0 h-1.5 w-px bg-muted-foreground/40"
          style={{ left: at(v) }}
        />
      ))}
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-serif-italic text-xl font-light">{title}</h3>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ComplexityFields({
  namePrefix,
  descriptionPlaceholder,
  timePlaceholder,
  spacePlaceholder,
}: {
  namePrefix: "bruteForce" | "optimal";
  descriptionPlaceholder: string;
  timePlaceholder: string;
  spacePlaceholder: string;
}) {
  const descId = `${namePrefix}-approach`;
  const timeId = `${namePrefix}-time`;
  const spaceId = `${namePrefix}-space`;
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={descId} className="text-xs uppercase tracking-wider">
          description
        </Label>
        <Textarea
          id={descId}
          name={`${namePrefix}Approach`}
          placeholder={descriptionPlaceholder}
          rows={6}
          className="min-h-44"
          required
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={timeId} className="text-xs uppercase tracking-wider">
            time complexity
          </Label>
          <Input
            id={timeId}
            name={`${namePrefix}Time`}
            placeholder={timePlaceholder}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={spaceId} className="text-xs uppercase tracking-wider">
            space complexity
          </Label>
          <Input
            id={spaceId}
            name={`${namePrefix}Space`}
            placeholder={spacePlaceholder}
            required
          />
        </div>
      </div>
    </div>
  );
}
