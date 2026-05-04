"use client";

import { useTransition } from "react";
import { updateStatus } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProblemStatus,
  STATUS_LABELS,
  type ProblemStatus as ProblemStatusT,
} from "@/lib/schemas/problem";
import { Check } from "lucide-react";

const ALL: ProblemStatusT[] = ProblemStatus.options;

export function StatusToggle({
  lcNumber,
  current,
}: {
  lcNumber: number;
  current: ProblemStatusT;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={current}
        onValueChange={(value) => {
          const fd = new FormData();
          fd.set("lcNumber", String(lcNumber));
          fd.set("status", value);
          start(() => updateStatus(fd).then(() => undefined));
        }}
        disabled={pending}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALL.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {current === "Mastered" ? (
        <span className="flex items-center gap-1 text-xs text-done">
          <Check className="h-3 w-3" /> retired from queue
        </span>
      ) : null}
    </div>
  );
}

// Mastered = "retire from queue." Showing this on a fragile/warming problem is
// noise — the answer is "not yet." Only render when the user has earned the
// option (≥30d stability) or when un-mastering an already-retired problem.
const MASTER_STABILITY_THRESHOLD_DAYS = 30;

export function MarkAsMasteredButton({
  lcNumber,
  current,
  stability,
}: {
  lcNumber: number;
  current: ProblemStatusT;
  stability: number;
}) {
  const [pending, start] = useTransition();
  if (current === "Mastered") {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => {
          const fd = new FormData();
          fd.set("lcNumber", String(lcNumber));
          fd.set("status", "Reviewed");
          start(() => updateStatus(fd).then(() => undefined));
        }}
      >
        Un-master (re-enter queue)
      </Button>
    );
  }
  if (stability < MASTER_STABILITY_THRESHOLD_DAYS) return null;
  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() => {
        const fd = new FormData();
        fd.set("lcNumber", String(lcNumber));
        fd.set("status", "Mastered");
        start(() => updateStatus(fd).then(() => undefined));
      }}
    >
      <Check className="mr-1 h-3 w-3" /> Mark as mastered
    </Button>
  );
}
