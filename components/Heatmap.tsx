"use client";

import { useEffect, useMemo, useRef } from "react";
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const todayKey = data[data.length - 1]?.date;

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

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [data.length]);

  if (total === 0) {
    return (
      <div className="flex flex-col items-start gap-2 py-2 text-sm">
        <p className="font-serif-italic text-xl font-light">No activity yet.</p>
        <p className="text-muted-foreground">
          Pick a problem from below, solve it on LeetCode, then capture the walkthrough here. Your daily streak starts the first time you log.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
        <span>
          <span className="font-mono text-foreground">{total}</span> attempts in the last{" "}
          {data.length} days · <span className="font-mono text-foreground">{activeDays}</span> active days
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider">less</span>
          {LEVEL_CLASSES.map((cls, i) => (
            <span key={i} className={cn("h-2.5 w-2.5 rounded-sm", cls)} />
          ))}
          <span className="font-mono text-[10px] uppercase tracking-wider">more</span>
        </div>
      </div>
      <div ref={scrollerRef} className="overflow-x-auto">
        <div className="flex gap-1">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell, di) => {
                const isToday = cell.date && cell.date === todayKey;
                return (
                  <div
                    key={`${wi}-${di}`}
                    title={
                      cell.date
                        ? `${cell.date}: ${cell.count} attempt${cell.count === 1 ? "" : "s"}${isToday ? " (today)" : ""}`
                        : ""
                    }
                    className={cn(
                      "h-2.5 w-2.5 rounded-sm",
                      cell.date ? LEVEL_CLASSES[levelFor(cell.count)] : "bg-transparent",
                      isToday && "outline-1 outline-offset-1 outline-primary",
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
