// Centralized query keys so features invalidate caches consistently.
export const queryKeys = {
  me: ["me"] as const,
  content: (type: string, format?: string) => ["content", type, format ?? "all"] as const,
  musicTracks: (category: string) => ["music", "tracks", category] as const,
  news: (sourceId: string) => ["news", sourceId] as const,
  sessions: ["sessions"] as const,
  sessionStats: ["sessions", "stats"] as const,
  preferences: ["preferences"] as const,
};

