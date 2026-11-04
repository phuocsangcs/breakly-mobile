// Headless hooks for the music feature: categories query + player state & controls.
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { queryKeys } from "@/core/query";
import { musicApi } from "./api";
import { useMusicStore } from "./store";
import type { MusicCategory } from "./types";

const FALLBACK_CATEGORIES: MusicCategory[] = [
  { id: "lofi", externalRef: "lounge", title: "Lo-fi", category: "lofi" },
  { id: "piano", externalRef: "piano", title: "Piano", category: "piano" },
  { id: "acoustic", externalRef: "acoustic", title: "Acoustic", category: "acoustic" },
  { id: "nature", externalRef: "ambient", title: "Nature", category: "nature" },
];

export function useMusicCategories() {
  const q = useQuery({
    queryKey: queryKeys.content("MUSIC_CATEGORY"),
    queryFn: musicApi.categories,
  });
  return {
    categories: q.data && q.data.length > 0 ? q.data : FALLBACK_CATEGORIES,
    isLoading: q.isLoading,
    error: q.error,
    refetch: q.refetch,
  };
}

export function useMusicPlayer() {
  return useMusicStore(
    useShallow((s) => ({
      category: s.category,
      currentTrack: s.queue[s.currentIndex] ?? null,
      queue: s.queue,
      isPlaying: s.isPlaying,
      isBuffering: s.isBuffering,
      isLoadingQueue: s.isLoadingQueue,
      error: s.error,
      positionSec: s.positionSec,
      durationSec: s.durationSec,
      volume: s.volume,
      selectCategory: s.selectCategory,
      togglePlay: s.togglePlay,
      pause: s.pause,
      next: s.next,
      stop: s.stop,
      setVolume: s.setVolume,
    })),
  );
}

