"use client";

import { useState, useTransition } from "react";
import { saveQuickLog } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Zap } from "lucide-react";

export function QuickLogButton({ lcNumber }: { lcNumber: number }) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(7);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Zap className="mr-1 h-3 w-3" /> Quick log
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border bg-muted/30 p-3">
      <div className="flex items-center gap-3">
        <Slider
          min={1}
          max={10}
          step={1}
          value={[score]}
          onValueChange={(v) => setScore(v[0] ?? 7)}
          className="flex-1"
        />
        <div className="w-8 text-center font-mono text-lg">{score}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={pending}
          onClick={() => {
            setError(null);
            const fd = new FormData();
            fd.set("lcNumber", String(lcNumber));
            fd.set("selfScore", String(score));
            start(async () => {
              const res = await saveQuickLog({ ok: false }, fd);
              if (!res.ok) {
                setError(res.error ?? "Failed");
                return;
              }
              setOpen(false);
            });
          }}
        >
          {pending ? "Logging…" : "Save"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
