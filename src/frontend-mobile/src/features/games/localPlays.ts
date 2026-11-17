// Local "played on day X" log for guests and offline use, plus pure date/streak helpers (match backend GameService).
import { kv, StorageKeys } from "@/core/storage/kv";

type PlayLog = Record<string, string[]>; // gameId -> YYYY-MM-DD days

/** Today's calendar day in the device's time zone, formatted YYYY-MM-DD. */
export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh";
  } catch {
    return "Asia/Ho_Chi_Minh";
  }
}

function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return localDay(new Date(y, m - 1, d + delta));
}

/** Consecutive days ending today (or yesterday, so a streak survives until the user plays today). */
export function currentStreak(days: Iterable<string>, today = localDay()): number {
  const set = new Set(days);
  let cursor = set.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

export async function readPlayLog(): Promise<PlayLog> {
  return (await kv.get<PlayLog>(StorageKeys.gamePlays)) ?? {};
}

export async function rememberPlay(gameId: string, day: string): Promise<void> {
  const log = await readPlayLog();
  const days = log[gameId] ?? [];
  if (days.includes(day)) return;
  log[gameId] = [day, ...days].slice(0, 400);
  await kv.set(StorageKeys.gamePlays, log);
}
