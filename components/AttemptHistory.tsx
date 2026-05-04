import { formatRelativeTime } from "@/lib/utils";
import { HURDLE_LABELS } from "@/lib/schemas/attempt";
import type { AttemptDoc } from "@/lib/schemas/problem";

export function AttemptHistory({ attempts }: { attempts: AttemptDoc[] }) {
  if (attempts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No attempts yet. Start by logging one.</p>
    );
  }
  return (
    <ol className="space-y-2 border-l pl-4">
      {attempts.map((a, i) => (
        <li key={String(a._id)} className="relative">
          <span className="absolute left-[-21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {i === 0 ? "latest" : `#${attempts.length - i}`}
            </span>
            <span className="text-sm">{formatRelativeTime(a.attemptedAt)}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              · {a.mode}
            </span>
            <span className="font-serif-italic text-base">
              {a.selfScore}<span className="text-muted-foreground">/10</span>
            </span>
            {a.durationMinutes != null ? (
              <span className="font-mono text-xs text-muted-foreground">{a.durationMinutes}m</span>
            ) : null}
            {a.implementationHurdle && a.implementationHurdle !== "None" ? (
              <span className="rounded-md bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warning">
                {HURDLE_LABELS[a.implementationHurdle]}
              </span>
            ) : null}
          </div>
          {a.optimal?.insight ? (
            <p className="mt-1 text-sm italic text-muted-foreground">
              &ldquo;{a.optimal.insight}&rdquo;
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
