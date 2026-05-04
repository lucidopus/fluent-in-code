"use client";

import { useMemo } from "react";
import type { HeatmapCell } from "@/lib/queries/heatmap";
import { cn } from "@/lib/utils";

const LEVELS = [0, 1, 2, 4, 7];

function levelFor(count: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (count >= LEVELS[i]) return i;
  }
  return 0;
}

const LEVEL_CLASSES = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

export function Heatmap({ data }: { data: HeatmapCell[] }) {
  const grid = useMemo(() => {
    if (data.length === 0) return [] as HeatmapCell[][];
    const today = new Date(data[data.length - 1].date);
    const startDay = today.getDay();
    const padFront: HeatmapCell[] = [];
    for (let i = 0; i < 6 - startDay; i++) {
      padFront.push({ date: "", count: 0 });
    }
    const all = [...data, ...padFront];
    const weeks: HeatmapCell[][] = [];
    for (let i = 0; i < all.length; i += 7) {
      weeks.push(all.slice(i, i + 7));
    }
    return weeks;
  }, [data]);

  const total = data.reduce((acc, d) => acc + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
        <span>
          <span className="font-mono text-foreground">{total}</span> attempts in the last {data.length} days
          · <span className="font-mono text-foreground">{activeDays}</span> active days
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider">less</span>
          {LEVEL_CLASSES.map((cls, i) => (
            <span key={i} className={cn("h-2.5 w-2.5 rounded-sm", cls)} />
          ))}
          <span className="text-[10px] uppercase tracking-wider">more</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={cell.date ? `${cell.date}: ${cell.count} attempt${cell.count === 1 ? "" : "s"}` : ""}
                  className={cn(
                    "h-2.5 w-2.5 rounded-sm",
                    cell.date ? LEVEL_CLASSES[levelFor(cell.count)] : "bg-transparent",
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
