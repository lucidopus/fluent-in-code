"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveQuickLog } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { scoreBand } from "@/components/AttemptForm";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export function QuickLogButton({ lcNumber }: { lcNumber: number }) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(7);
  const [pending, start] = useTransition();
  const band = scoreBand(score);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Zap className="mr-1 h-3 w-3" /> Quick log
      </Button>
    );
  }

  function commit() {
    const fd = new FormData();
    fd.set("lcNumber", String(lcNumber));
    fd.set("selfScore", String(score));
    start(async () => {
      const res = await saveQuickLog({ ok: false }, fd);
      if (!res.ok) {
        toast.error(res.error ?? "Save failed — try again.");
        return;
      }
      toast.success(`Logged ${score}/10 — re-scheduled.`);
      setOpen(false);
    });
  }

  return (
    <div
      className="space-y-3 rounded-md border bg-muted/30 p-3"
      onKeyDown={(e) => {
        if (e.key === "Enter" && !pending) {
          e.preventDefault();
          commit();
        } else if (e.key === "Escape" && !pending) {
          setOpen(false);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <Slider
          min={1}
          max={10}
          step={1}
          value={[score]}
          onValueChange={(v) => setScore(v[0] ?? 7)}
          className="flex-1"
        />
        <div className="flex w-16 flex-col items-end leading-none">
          <span className={cn("font-serif-italic text-2xl font-light", band.tone)}>{score}</span>
          <span className={cn("font-mono text-[10px] uppercase tracking-wider", band.tone)}>
            {band.label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={pending} onClick={commit}>
          {pending ? "Logging…" : "Save"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
          Cancel
        </Button>
        <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
          <kbd className="rounded border bg-background px-1">↵</kbd>
          <span className="ml-1">save</span>
        </span>
      </div>
    </div>
  );
}
