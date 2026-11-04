// Pure streak calculation shared by guest mode and offline fallback (matches backend SessionService).
import type { SessionRecord, SessionStats } from "./types";

function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return dayKey(dt.toISOString());
}

export function computeLocalStats(records: SessionRecord[]): SessionStats {
  const days = new Set(records.map((r) => dayKey(r.startedAt)));
  const sorted = Array.from(days).sort();

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev && shiftDay(prev, 1) === d ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = d;
  }

  const today = dayKey(new Date().toISOString());
  let cursor = days.has(today) ? today : shiftDay(today, -1);
  let current = 0;
  while (days.has(cursor)) {
    current++;
    cursor = shiftDay(cursor, -1);
  }

  const totalMinutes = Math.floor(records.reduce((acc, r) => acc + r.actualSeconds, 0) / 60);
  return { currentStreak: current, longestStreak: longest, totalSessions: records.length, totalMinutes };
}

