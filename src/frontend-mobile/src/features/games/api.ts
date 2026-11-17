// Game Corner endpoints: per-user list (signed in), public catalog (guests) and idempotent daily play recording.
import { apiClient } from "@/core/api";
import type { Game, GameContentItem, GamePlayResponse } from "./types";

export const gamesApi = {
  list: (tz: string) => apiClient.get<Game[]>("/games", { query: { tz } }),
  catalog: async (): Promise<Omit<Game, "playedToday" | "currentStreak">[]> => {
    const items = await apiClient.get<GameContentItem[]>("/content", { query: { type: "GAME" }, auth: false });
    return items.map((it) => ({
      id: it.id,
      title: it.title,
      description: it.description,
      url: it.externalRef,
      category: it.category,
      provider: it.author,
      thumbnailUrl: it.thumbnailUrl,
    }));
  },
  recordPlay: (gameId: string, playDate: string) =>
    apiClient.post<GamePlayResponse>(`/games/${gameId}/plays`, { playDate }),
};
