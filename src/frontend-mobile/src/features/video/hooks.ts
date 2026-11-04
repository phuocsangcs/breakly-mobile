// Headless hooks for short/long video feeds, pager state (max 10 clips + end card, FR 6.1–6.3) and media focus (FR 4.5).
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mediaFocus } from "@/core/media/mediaFocus";
import { queryKeys } from "@/core/query";
import { videoApi } from "./api";
import type { VideoFormat, VideoItem } from "./types";

const MAX_SHORT_CLIPS = 10;

export function useVideoMediaFocus() {
  useEffect(() => {
    mediaFocus.enterVideo();
    return () => mediaFocus.exitVideo();
  }, []);
}

export function useVideoFeed(format: VideoFormat) {
  const q = useQuery({
    queryKey: queryKeys.content("VIDEO", format),
    queryFn: () => videoApi.list(format),
  });
  const raw = q.data ?? [];
  const items = format === "SHORT" ? raw.slice(0, MAX_SHORT_CLIPS) : raw;
  return {
    items,
    isLoading: q.isLoading,
    error: q.error,
    refetch: q.refetch,
  };
}

export function useShortsPager(clips: VideoItem[]) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);

  const totalSlots = clips.length + (clips.length > 0 ? 1 : 0); // last slot = end card
  const isEndCard = clips.length > 0 && index >= clips.length;
  const currentClip = isEndCard ? null : (clips[index] ?? null);

  return {
    index,
    totalClips: clips.length,
    totalSlots,
    isEndCard,
    currentClip,
    playing: playing && !isEndCard,
    muted,
    setIndex: (next: number) => {
      const clamped = Math.max(0, Math.min( Math.max(0, totalSlots - 1), next));
      setIndex(clamped);
      setPlaying(clamped < clips.length);
    },
    togglePlay: () => setPlaying((p) => !p),
    toggleMute: () => setMuted((m) => !m),
  };
}

