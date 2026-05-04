"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { updateAttempt } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scoreBand } from "@/components/AttemptForm";
import { cn } from "@/lib/utils";
import { HURDLE_LABELS, type ImplementationHurdle } from "@/lib/schemas/attempt";

const CodeEditor = dynamic(
  () => import("@/components/CodeEditor").then((m) => m.CodeEditor),
  { ssr: false, loading: () => <Skeleton className="h-72 w-full" /> },
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

export type EditDefaults = {
  attemptId: string;
  restate: string;
  bruteForce: {
    applicable: boolean;
    approach: string;
    time: string;
    space: string;
  };
  optimal: { approach: string; time: string; space: string };
  code: string;
  language: string;
  selfScore: number;
  durationMinutes: number | null;
  implementationHurdle: ImplementationHurdle | null;
  transcript: string | null;
};

export function AttemptEditForm({
  lcNumber,
  defaults,
  onCancel,
  onSaved,
}: {
  lcNumber: number;
  defaults: EditDefaults;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateAttempt, initial);
  const [bruteApplicable, setBruteApplicable] = useState(defaults.bruteForce.applicable);
  const [score, setScore] = useState(defaults.selfScore);
  const formRef = useRef<HTMLFormElement>(null);
  const band = scoreBand(score);

  useEffect(() => {
    if (state.ok && !pending) {
      router.refresh();
      onSaved();
    }
  }, [state.ok, pending, router, onSaved]);

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

  return (
    <form ref={formRef} action={action} className="space-y-6">
      <input type="hidden" name="attemptId" value={defaults.attemptId} />
      <input type="hidden" name="lcNumber" value={lcNumber} />

      <Field label="Your restatement">
        <Textarea
          id="restate"
          name="restate"
          required
          rows={4}
          className="min-h-32"
          defaultValue={defaults.restate}
        />
      </Field>

      <fieldset className="space-y-3">
        <legend className="font-serif-italic text-base font-light">Brute force</legend>
        <div className="flex items-center gap-2">
          <Checkbox
            id="brute-applicable"
            checked={bruteApplicable}
            onCheckedChange={(v) => setBruteApplicable(Boolean(v))}
          />
          <Label htmlFor="brute-applicable" className="text-sm">
            Applicable
          </Label>
        </div>
        <input type="hidden" name="bruteForceApplicable" value={String(bruteApplicable)} />
        {bruteApplicable ? (
          <>
            <Field label="Description">
              <Textarea
                name="bruteForceApproach"
                rows={4}
                className="min-h-32"
                defaultValue={defaults.bruteForce.approach}
                required
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Time complexity">
                <Input name="bruteForceTime" defaultValue={defaults.bruteForce.time} required />
              </Field>
              <Field label="Space complexity">
                <Input name="bruteForceSpace" defaultValue={defaults.bruteForce.space} required />
              </Field>
            </div>
          </>
        ) : (
          <>
            <input type="hidden" name="bruteForceApproach" value="N/A — direct construction" />
            <input type="hidden" name="bruteForceTime" value="N/A" />
            <input type="hidden" name="bruteForceSpace" value="N/A" />
          </>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-serif-italic text-base font-light">Optimal</legend>
        <Field label="Description">
          <Textarea
            name="optimalApproach"
            rows={4}
            className="min-h-32"
            defaultValue={defaults.optimal.approach}
            required
          />
        </Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Time complexity">
            <Input name="optimalTime" defaultValue={defaults.optimal.time} required />
          </Field>
          <Field label="Space complexity">
            <Input name="optimalSpace" defaultValue={defaults.optimal.space} required />
          </Field>
        </div>
      </fieldset>

      <Field label="Language">
        <Select name="language" defaultValue={defaults.language || "python"}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Code">
        <CodeEditor name="code" defaultValue={defaults.code} language={defaults.language || "python"} />
      </Field>

      <Field label="How it went (1-10)">
        <div className="flex items-center gap-4">
          <Slider
            min={1}
            max={10}
            step={1}
            value={[score]}
            onValueChange={(v) => setScore(v[0] ?? defaults.selfScore)}
            className="flex-1"
          />
          <div className="flex w-20 flex-col items-end leading-none">
            <span className={cn("font-serif-italic text-3xl font-light", band.tone)}>
              {score}
            </span>
            <span className={cn("font-mono text-[10px] uppercase tracking-wider", band.tone)}>
              {band.label}
            </span>
          </div>
        </div>
        <input type="hidden" name="selfScore" value={score} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Duration (min)">
          <Input
            name="durationMinutes"
            type="number"
            min={0}
            defaultValue={defaults.durationMinutes ?? ""}
          />
        </Field>
        <Field label="Where did you stall?">
          <Select
            name="implementationHurdle"
            defaultValue={defaults.implementationHurdle ?? undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent>
              {HURDLE_OPTIONS.map((h) => (
                <SelectItem key={h} value={h}>{HURDLE_LABELS[h]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Transcript (markdown, optional)">
        <Textarea
          name="transcript"
          rows={6}
          className="min-h-44"
          defaultValue={defaults.transcript ?? ""}
        />
      </Field>

      {state.error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 border-t pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:inline">
          <kbd className="rounded border bg-muted/50 px-1 py-0.5">⌘</kbd>
          <kbd className="ml-1 rounded border bg-muted/50 px-1 py-0.5">↵</kbd>
          <span className="ml-2">to save</span>
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider">{label}</Label>
      {children}
    </div>
  );
}
