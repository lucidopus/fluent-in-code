"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveQuickLog } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DifficultyBadge } from "@/components/StatusBadge";
import { scoreBand } from "@/components/AttemptForm";
import { formatDueDate, cn } from "@/lib/utils";
import { ArrowUpRight, Zap } from "lucide-react";

export type DueRowItem = {
  lcNumber: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  dueAt: string;
  reps: number;
};

export function DueQueueRow({ item }: { item: DueRowItem }) {
  const [logging, setLogging] = useState(false);
  const [score, setScore] = useState(7);
  const [pending, start] = useTransition();
  const [hidden, setHidden] = useState(false);
  const router = useRouter();
  const band = scoreBand(score);

  if (hidden) return null;

  function commit() {
    const fd = new FormData();
    fd.set("lcNumber", String(item.lcNumber));
    fd.set("selfScore", String(score));
    start(async () => {
      const res = await saveQuickLog({ ok: false }, fd);
      if (!res.ok) {
        toast.error(res.error ?? "Save failed — try again.");
        return;
      }
      setHidden(true);
      toast.success(`Logged #${item.lcNumber} · ${score}/10 — re-scheduled.`);
      router.refresh();
    });
  }

  if (logging) {
    return (
      <div className="space-y-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="w-12 font-mono text-xs text-muted-foreground">
            #{item.lcNumber}
          </span>
          <div className="flex-1 truncate text-sm font-medium">{item.title}</div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            quick log
          </span>
        </div>
        <div className="flex items-center gap-4 pl-12">
          <Slider
            min={1}
            max={10}
            step={1}
            value={[score]}
            onValueChange={(v) => setScore(v[0] ?? 7)}
            className="flex-1"
          />
          <div className="flex w-20 flex-col items-end leading-none">
            <span className={cn("font-serif-italic text-2xl font-light", band.tone)}>
              {score}
            </span>
            <span className={cn("font-mono text-[10px] uppercase tracking-wider", band.tone)}>
              {band.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-12">
          <Button
            size="sm"
            onClick={commit}
            disabled={pending}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
            }}
          >
            {pending ? "Saving…" : "Save"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setLogging(false);
              setScore(7);
            }}
            disabled={pending}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
      <Link
        href={`/problems/${item.lcNumber}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <span className="w-12 font-mono text-xs text-muted-foreground">
          #{item.lcNumber}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{item.title}</div>
          <div className="text-xs text-muted-foreground">
            {formatDueDate(item.dueAt)} · reps {item.reps}
          </div>
        </div>
      </Link>
      <DifficultyBadge difficulty={item.difficulty} />
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          setLogging(true);
        }}
        className="h-7 px-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        aria-label="Quick log"
      >
        <Zap className="mr-1 h-3 w-3" /> log
      </Button>
      <Link
        href={`/problems/${item.lcNumber}`}
        aria-label={`Open ${item.title}`}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
