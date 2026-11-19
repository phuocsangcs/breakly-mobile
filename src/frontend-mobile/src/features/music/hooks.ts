// Headless hooks for the music feature: categories query + player state & controls.
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { queryKeys } from "@/core/query";
import { musicApi } from "./api";
import { canKeepOfflineCopies, DOWNLOADED_CATEGORY, useDownloadsStore } from "./downloads";
import { useMusicStore } from "./store";
import type { MusicCategory } from "./types";

const FALLBACK_CATEGORIES: MusicCategory[] = [
  { id: "lofi", externalRef: "lounge", title: "Lo-fi", category: "lofi" },
  { id: "piano", externalRef: "piano", title: "Piano", category: "piano" },
  { id: "acoustic", externalRef: "acoustic", title: "Acoustic", category: "acoustic" },
  { id: "nature", externalRef: "ambient", title: "Nature", category: "nature" },
  { id: "jazz", externalRef: "jazz", title: "Jazz", category: "jazz" },
  { id: "chill", externalRef: "downtempo", title: "Chill", category: "chill" },
  { id: "classical", externalRef: "classical", title: "Classical", category: "classical" },
  { id: "guitar", externalRef: "guitar", title: "Guitar", category: "guitar" },
];

const DOWNLOADED_STATION: MusicCategory = {
  id: DOWNLOADED_CATEGORY, externalRef: DOWNLOADED_CATEGORY, title: "⬇ Downloaded", category: DOWNLOADED_CATEGORY,
};

export function useMusicCategories() {
  const q = useQuery({
    queryKey: queryKeys.content("MUSIC_CATEGORY"),
    queryFn: musicApi.categories,
  });
  const hasDownloads = useDownloadsStore((s) => Object.keys(s.items).length > 0);
  const base = q.data && q.data.length > 0 ? q.data : FALLBACK_CATEGORIES;
  return {
    categories: canKeepOfflineCopies && hasDownloads ? [DOWNLOADED_STATION, ...base] : base,
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
      previous: s.previous,
      playTrackAt: s.playTrackAt,
      stop: s.stop,
      setVolume: s.setVolume,
      seek: s.seek,
    })),
  );
}

