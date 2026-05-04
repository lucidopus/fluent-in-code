"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import { AttemptEditForm, type EditDefaults } from "@/components/AttemptEditForm";
import { deleteAttempt } from "@/app/problems/[lcNumber]/actions";
import { HURDLE_LABELS, type ImplementationHurdle } from "@/lib/schemas/attempt";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Clock, Maximize2, Pencil, Sparkles, Trash2, Zap } from "lucide-react";

type Attempt = {
  _id: string;
  attemptedAt: Date | string;
  mode: "quick" | "deep";
  durationMinutes: number | null;
  selfScore: number;
  restate: string | null;
  bruteForce: { applicable: boolean; approach: string; time: string; space: string } | null;
  optimal: { approach: string; time: string; space: string; insight?: string } | null;
  code: string | null;
  language: string | null;
  implementationHurdle:
    | "None"
    | "OffByOne"
    | "LogicGate"
    | "EdgeCase"
    | "Syntax"
    | "DataStructureOp"
    | "TimeComplexity"
    | "Other"
    | null;
  transcript: string | null;
};

const SCORE_TONE: Record<string, string> = {
  low: "text-destructive",
  mid: "text-progress",
  high: "text-done",
};

function scoreTone(score: number): string {
  if (score <= 4) return SCORE_TONE.low;
  if (score <= 7) return SCORE_TONE.mid;
  return SCORE_TONE.high;
}

export function AttemptCard({
  attempt,
  index,
  total,
  lcNumber,
  expanded = false,
}: {
  attempt: Attempt;
  index: number;
  total: number;
  lcNumber: number;
  expanded?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pendingDelete, startDelete] = useTransition();
  const router = useRouter();
  const isLatest = index === 0;
  const ordinal = total - index;
  const isDeep = attempt.mode === "deep";
  const showInline = expanded && isDeep;

  const editDefaults: EditDefaults = {
    attemptId: attempt._id,
    restate: attempt.restate ?? "",
    bruteForce: attempt.bruteForce ?? {
      applicable: true,
      approach: "",
      time: "",
      space: "",
    },
    optimal: attempt.optimal
      ? {
          approach: attempt.optimal.approach,
          time: attempt.optimal.time,
          space: attempt.optimal.space,
        }
      : { approach: "", time: "", space: "" },
    code: attempt.code ?? "",
    language: attempt.language ?? "python",
    selfScore: attempt.selfScore,
    durationMinutes: attempt.durationMinutes,
    implementationHurdle: attempt.implementationHurdle as ImplementationHurdle | null,
    transcript: attempt.transcript,
  };

  function handleDelete() {
    const fd = new FormData();
    fd.set("attemptId", attempt._id);
    fd.set("lcNumber", String(lcNumber));
    startDelete(async () => {
      const res = await deleteAttempt(fd);
      if (!res.ok) {
        toast.error(res.error ?? "Delete failed — try again.");
        return;
      }
      setConfirmingDelete(false);
      setOpen(false);
      router.refresh();
    });
  }

  const meta = (
    <>
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {isLatest ? "latest" : `attempt #${ordinal}`}
      </span>
      <ModeBadge mode={attempt.mode} />
      {attempt.implementationHurdle && attempt.implementationHurdle !== "None" ? (
        <span className="rounded-md border border-warning/30 bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warning">
          {HURDLE_LABELS[attempt.implementationHurdle]}
        </span>
      ) : null}
    </>
  );

  if (showInline) {
    return (
      <>
        <Card className={cn("border-primary/50", isLatest && "shadow-sm")}>
          <CardContent className="space-y-5 p-5 md:p-6">
            <div className="flex items-start gap-4">
              <div className={cn("font-serif-italic text-4xl font-light leading-none", scoreTone(attempt.selfScore))}>
                {attempt.selfScore}
                <span className="text-base text-muted-foreground">/10</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">{meta}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatRelativeTime(attempt.attemptedAt)}</span>
                  {attempt.durationMinutes != null ? (
                    <span className="inline-flex items-center gap-1 font-mono text-xs">
                      <Clock className="h-3 w-3" /> {attempt.durationMinutes}m
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(true)}
                  aria-label="Open full record"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {attempt.optimal && attempt.optimal.insight && attempt.optimal.insight.trim().length > 0 ? (
              <p className="border-l-2 border-primary/50 pl-3 font-serif-italic text-base italic text-foreground/90">
                {attempt.optimal.insight}
              </p>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              {attempt.restate ? (
                <InlineSection title="Restate">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{attempt.restate}</p>
                </InlineSection>
              ) : null}

              {attempt.optimal ? (
                <InlineSection title="Optimal">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{attempt.optimal.approach}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ComplexityChip label="time" value={attempt.optimal.time} />
                    <ComplexityChip label="space" value={attempt.optimal.space} />
                  </div>
                </InlineSection>
              ) : null}
            </div>

            {attempt.code ? (
              <InlineSection title="Code">
                <CodeBlock code={attempt.code} language={attempt.language ?? "python"} height="320px" />
              </InlineSection>
            ) : null}
          </CardContent>
        </Card>

        {renderDialog()}
      </>
    );
  }

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "cursor-pointer transition-colors hover:border-primary/40",
          isLatest && "border-primary/50",
        )}
      >
        <CardContent className="flex items-center gap-4 p-4 md:p-5">
          <div className={cn("font-serif-italic text-4xl font-light", scoreTone(attempt.selfScore))}>
            {attempt.selfScore}
            <span className="text-base text-muted-foreground">/10</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">{meta}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{formatRelativeTime(attempt.attemptedAt)}</span>
              {attempt.durationMinutes != null ? (
                <span className="inline-flex items-center gap-1 font-mono text-xs">
                  <Clock className="h-3 w-3" /> {attempt.durationMinutes}m
                </span>
              ) : null}
            </div>
            {attempt.restate ? (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {attempt.restate}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {renderDialog()}
    </>
  );

  function renderDialog() {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditing(false);
            setConfirmingDelete(false);
          }
        }}
      >
        <DialogContent className="max-h-[90dvh] w-[95vw] max-w-5xl! overflow-y-auto sm:w-full">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="flex items-center gap-3 font-serif-italic text-2xl font-light">
                  <span className={scoreTone(attempt.selfScore)}>
                    {attempt.selfScore}<span className="text-sm text-muted-foreground">/10</span>
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {isLatest ? "latest" : `attempt #${ordinal}`}
                  </span>
                  <ModeBadge mode={attempt.mode} />
                </DialogTitle>
                <DialogDescription className="mt-1 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider">
                  <span>{formatRelativeTime(attempt.attemptedAt)}</span>
                  {attempt.durationMinutes != null ? (
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" /> {attempt.durationMinutes}m
                    </span>
                  ) : null}
                  {attempt.implementationHurdle && attempt.implementationHurdle !== "None" ? (
                    <span className="rounded-md border border-warning/30 bg-warning/10 px-2 py-0.5 font-mono text-warning">
                      stalled: {HURDLE_LABELS[attempt.implementationHurdle]}
                    </span>
                  ) : null}
                </DialogDescription>
              </div>
              {!editing ? (
                <div className="flex shrink-0 items-center gap-1 pr-8">
                  {isDeep && !confirmingDelete ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      disabled={pendingDelete}
                    >
                      <Pencil className="mr-1 h-3 w-3" /> Edit
                    </Button>
                  ) : null}
                  {confirmingDelete ? (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={pendingDelete}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        {pendingDelete ? "Deleting…" : "Confirm delete"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmingDelete(false)}
                        disabled={pendingDelete}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmingDelete(true)}
                      disabled={pendingDelete}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </DialogHeader>

          {editing ? (
            <div className="py-2">
              <AttemptEditForm
                lcNumber={lcNumber}
                defaults={editDefaults}
                onCancel={() => setEditing(false)}
                onSaved={() => {
                  setEditing(false);
                  setOpen(false);
                }}
              />
            </div>
          ) : attempt.mode === "quick" ? (
            <div className="space-y-2 py-4">
              <p className="text-sm italic text-muted-foreground">
                Quick log — no walkthrough captured. Just a self-score and re-schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              {attempt.restate ? (
                <DialogSection title="Restate" icon={<Sparkles className="h-4 w-4" />}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{attempt.restate}</p>
                </DialogSection>
              ) : null}

              {attempt.bruteForce ? (
                <DialogSection title="Brute force">
                  {attempt.bruteForce.applicable ? (
                    <ComplexityBlock
                      approach={attempt.bruteForce.approach}
                      time={attempt.bruteForce.time}
                      space={attempt.bruteForce.space}
                    />
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Not applicable — direct construction.
                    </p>
                  )}
                </DialogSection>
              ) : null}

              {attempt.optimal ? (
                <DialogSection title="Optimal">
                  <ComplexityBlock
                    approach={attempt.optimal.approach}
                    time={attempt.optimal.time}
                    space={attempt.optimal.space}
                    insight={attempt.optimal.insight}
                  />
                </DialogSection>
              ) : null}

              {attempt.code ? (
                <DialogSection title="Code">
                  <CodeBlock code={attempt.code} language={attempt.language ?? "python"} height="320px" />
                </DialogSection>
              ) : null}

              {attempt.transcript ? (
                <DialogSection title="Transcript">
                  <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm leading-relaxed">
                    {attempt.transcript}
                  </pre>
                </DialogSection>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

function ModeBadge({ mode }: { mode: "quick" | "deep" }) {
  if (mode === "deep") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
        <Sparkles className="h-2.5 w-2.5" /> deep log
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-progress/30 bg-progress/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-progress">
      <Zap className="h-2.5 w-2.5" /> quick log
    </span>
  );
}

function DialogSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-1.5 font-serif-italic text-lg font-light">
        {icon}
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}

function InlineSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <div>{children}</div>
    </section>
  );
}

function ComplexityChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-md border bg-muted/30 px-2 py-0.5 font-mono text-xs">
      {label} <span className="text-foreground">{value}</span>
    </span>
  );
}

function ComplexityBlock({
  approach,
  time,
  space,
  insight,
}: {
  approach: string;
  time: string;
  space: string;
  insight?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{approach}</p>
      <div className="flex flex-wrap gap-2">
        <ComplexityChip label="time" value={time} />
        <ComplexityChip label="space" value={space} />
      </div>
      {insight && insight.trim().length > 0 ? (
        <p className="border-l-2 border-primary/40 pl-3 text-xs italic text-muted-foreground">
          {insight}
        </p>
      ) : null}
    </div>
  );
}
