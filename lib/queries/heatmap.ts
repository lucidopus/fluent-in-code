import "server-only";
import { getDb } from "@/lib/mongo";

export type HeatmapCell = {
  date: string; // yyyy-mm-dd in target timezone
  count: number;
};

const TZ = process.env.NEXT_PUBLIC_TIMEZONE || "America/New_York";

/**
 * Returns the UTC instant corresponding to local-midnight in the given timezone.
 * Used so the $match cutoff aligns with the $dateToString TZ bucketing.
 */
function tzMidnightAt(date: Date, tz: string): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const local = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
  const localMs = Date.parse(`${local}Z`);
  const offsetMs = date.getTime() - localMs;
  // Midnight in target tz, expressed as UTC
  return new Date(localMs - (localMs % (24 * 60 * 60 * 1000)) + offsetMs);
}

export async function getHeatmap(days = 365): Promise<HeatmapCell[]> {
  const db = await getDb();
  const todayMidnightTz = tzMidnightAt(new Date(), TZ);
  const since = new Date(todayMidnightTz.getTime() - (days - 1) * 24 * 60 * 60 * 1000);

  const rows = await db
    .collection("attempts")
    .aggregate<{ _id: string; count: number }>([
      { $match: { attemptedAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$attemptedAt",
              format: "%Y-%m-%d",
              timezone: TZ,
            },
          },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const byDate = new Map(rows.map((r) => [r._id, r.count]));

  const out: HeatmapCell[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = formatTzDate(d, TZ);
    out.push({ date: key, count: byDate.get(key) ?? 0 });
  }
  return out;
}

function formatTzDate(d: Date, tz: string): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d);
}
