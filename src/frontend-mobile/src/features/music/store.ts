// Global music store: category, queue, current track, play/pause/next/volume.
import { create } from "zustand";
import { mediaFocus } from "@/core/media/mediaFocus";
import { musicApi } from "./api";
import { musicPlayer } from "./player";
import type { Track } from "./types";

interface MusicState {
  category: string;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  isLoadingQueue: boolean;
  error: string | null;
  positionSec: number;
  durationSec: number;
  volume: number; // 0..100
  selectCategory: (category: string, autoPlay?: boolean) => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => void;
  next: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

type SecondTickListener = () => void;
const playSecondListeners = new Set<SecondTickListener>();

/** Subscribed by the session tracker to count elapsed seconds of active music playback. */
export function onMusicPlayingSecond(listener: SecondTickListener): () => void {
  playSecondListeners.add(listener);
  return () => playSecondListeners.delete(listener);
}

export const useMusicStore = create<MusicState>((set, get) => {
  let lastWholeSec = -1;

  musicPlayer.subscribe((s) => {
    const sec = Math.floor(s.currentTime);
    if (s.playing && sec !== lastWholeSec) {
      lastWholeSec = sec;
      playSecondListeners.forEach((l) => l());
    }
    set({
      isPlaying: s.playing,
      isBuffering: s.isBuffering,
      positionSec: s.currentTime,
      durationSec: s.duration || (get().queue[get().currentIndex]?.durationSeconds ?? 0),
    });
    if (s.didJustFinish) {
      get().next();
    }
  });

  mediaFocus.registerMusic({
    isPlaying: () => get().isPlaying,
    pause: () => musicPlayer.pause(),
    resume: () => musicPlayer.play(),
  });

  const startIndex = (index: number) => {
    const { queue, volume } = get();
    const track = queue[index];
    if (!track) return;
    lastWholeSec = -1;
    set({ currentIndex: index, positionSec: 0, durationSec: track.durationSeconds });
    musicPlayer.loadAndPlay(track.streamUrl, volume / 100);
  };

  return {
    category: "lofi",
    queue: [],
    currentIndex: 0,
    isPlaying: false,
    isBuffering: false,
    isLoadingQueue: false,
    error: null,
    positionSec: 0,
    durationSec: 0,
    volume: 80,

    selectCategory: async (category, autoPlay = true) => {
      set({ category, isLoadingQueue: true, error: null });
      try {
        const tracks = await musicApi.tracks(category);
        set({ queue: tracks, currentIndex: 0, isLoadingQueue: false });
        if (autoPlay && tracks.length > 0) startIndex(0);
      } catch (e) {
        set({ isLoadingQueue: false, error: e instanceof Error ? e.message : "Failed to load tracks" });
      }
    },

    togglePlay: async () => {
      const { isPlaying, queue, category, selectCategory } = get();
      mediaFocus.clearVideoHold();
      if (isPlaying) {
        musicPlayer.pause();
        return;
      }
      if (queue.length === 0) {
        await selectCategory(category, true);
        return;
      }
      if (get().positionSec === 0 && !get().isBuffering) {
        startIndex(get().currentIndex);
      } else {
        musicPlayer.play();
      }
    },

    pause: () => {
      mediaFocus.clearVideoHold();
      musicPlayer.pause();
    },

    next: () => {
      const { queue, currentIndex } = get();
      if (queue.length === 0) return;
      startIndex((currentIndex + 1) % queue.length);
    },

    stop: () => {
      mediaFocus.clearVideoHold();
      musicPlayer.stop();
      set({ isPlaying: false, positionSec: 0 });
    },

    setVolume: (v) => {
      const clamped = Math.max(0, Math.min(100, Math.round(v)));
      set({ volume: clamped });
      musicPlayer.setVolume(clamped / 100);
    },
  };
});

