// Domain types for break sessions, usage metrics, paginated history and streak statistics.
export type ServiceType = "MUSIC" | "NEWS" | "VIDEO" | "GAME";
export type EndReason = "COMPLETED" | "ENDED_EARLY";

export interface SessionRecord {
  id?: string;
  clientId: string;
  startedAt: string;
  endedAt: string;
  plannedSeconds: number;
  actualSeconds: number;
  endReason: EndReason;
  musicSeconds: number;
  articlesOpened: number;
  videosWatched: number;
  /** Optional: records saved before the Game Corner existed do not have it. */
  gamesPlayed?: number;
  servicesUsed: ServiceType[];
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

export interface SessionStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
}

