// Headless hooks for the Game Corner: game list (server data when signed in, local log for guests) and play recording.
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, queryKeys } from "@/core/query";
import { useAuthStore } from "@/features/auth";
import { gamesApi } from "./api";
import { currentStreak, deviceTimeZone, localDay, readPlayLog, rememberPlay } from "./localPlays";
import type { Game } from "./types";

export function useGames() {
  const status = useAuthStore((s) => s.status);
  const signedIn = status === "authenticated";
  const q = useQuery({
    queryKey: queryKeys.games(signedIn ? "user" : "guest"),
    enabled: status !== "loading",
    queryFn: async (): Promise<Game[]> => {
      if (signedIn) return gamesApi.list(deviceTimeZone());
      const [catalog, log] = await Promise.all([gamesApi.catalog(), readPlayLog()]);
      const today = localDay();
      return catalog.map((g) => {
        const days = log[g.id] ?? [];
        return { ...g, playedToday: days.includes(today), currentStreak: currentStreak(days, today) };
      });
    },
  });
  return {
    games: q.data ?? [],
    isLoading: status === "loading" || q.isLoading,
    error: q.error,
    refetch: q.refetch,
  };
}

/** Marks a game as played today. Always kept locally; also sent to the backend when signed in. */
export function useRecordGamePlay() {
  return useMutation({
    mutationFn: async (gameId: string) => {
      const day = localDay();
      await rememberPlay(gameId, day);
      if (useAuthStore.getState().status === "authenticated") {
        await gamesApi.recordPlay(gameId, day);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.gamesRoot }),
  });
}

/** Game emoji tile used while games have no artwork. */
export function gameEmoji(game: Pick<Game, "title" | "category">): string {
  const t = game.title.toLowerCase();
  if (t.includes("wordle")) return "🟩";
  if (t.includes("connections")) return "🔗";
  if (t.includes("strands")) return "🧵";
  if (t.includes("pips")) return "🎲";
  return game.category === "logic" ? "🧠" : "🧩";
}
