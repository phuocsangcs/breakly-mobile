// Type definitions for break timer sessions, status, and summary metrics.
export type SessionStatus = "idle" | "running" | "paused" | "completed";

export interface BreakSession {
  id: string;
  durationSeconds: number;
  mood?: string;
  themeId: string;
  startedAt: string;
  endedAt?: string;
}

