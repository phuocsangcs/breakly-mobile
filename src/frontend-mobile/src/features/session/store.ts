// Session lifecycle store: timestamp-based countdown (accurate across backgrounding, FR 2.4),
// one-minute notice (FR 2.5), usage tracker, local history & offline upload queue (FR 7.2).
import { create } from "zustand";
import { queryClient, queryKeys } from "@/core/query";
import { kv, StorageKeys } from "@/core/storage/kv";
import { onSignedIn, useAuthStore } from "@/features/auth";
import { onMusicPlayingSecond, useMusicStore } from "@/features/music";
import { sessionApi } from "./api";
import type { EndReason, ServiceType, SessionRecord } from "./types";

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

interface SessionState {
  isActive: boolean;
  selectedMinutes: 10 | 20 | 30;
  startedAtMs: number | null;
  plannedSeconds: number;
  remainingSeconds: number;
  oneMinuteFired: boolean;
  showOneMinuteBanner: boolean;
  musicSeconds: number;
  articlesOpened: number;
  videosWatched: number;
  servicesUsed: ServiceType[];
  lastCompleted: SessionRecord | null;
  localHistory: SessionRecord[];
  setSelectedMinutes: (minutes: 10 | 20 | 30) => void;
  startOrContinue: (initialService?: ServiceType) => void;
  tick: () => void;
  endSession: (reason: EndReason) => Promise<SessionRecord | null>;
  dismissOneMinuteBanner: () => void;
  markServiceUsed: (service: ServiceType) => void;
  recordArticleOpened: () => void;
  recordVideoWatched: () => void;
  hydrate: () => Promise<void>;
  flushSyncQueue: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => {
  onMusicPlayingSecond(() => {
    if (!get().isActive) return;
    const used = get().servicesUsed.includes("MUSIC") ? get().servicesUsed : [...get().servicesUsed, "MUSIC" as const];
    set({ musicSeconds: get().musicSeconds + 1, servicesUsed: used });
  });

  const enqueueAndFlush = async (record: SessionRecord) => {
    const history = [record, ...get().localHistory.filter((r) => r.clientId !== record.clientId)].slice(0, 100);
    set({ localHistory: history });
    await kv.set(StorageKeys.sessionHistory, history);

    const queue = (await kv.get<SessionRecord[]>(StorageKeys.sessionSyncQueue)) ?? [];
    if (!queue.some((q) => q.clientId === record.clientId)) {
      queue.push(record);
      await kv.set(StorageKeys.sessionSyncQueue, queue);
    }
    await get().flushSyncQueue();
  };

  return {
    isActive: false,
    selectedMinutes: 20,
    startedAtMs: null,
    plannedSeconds: 20 * 60,
    remainingSeconds: 20 * 60,
    oneMinuteFired: false,
    showOneMinuteBanner: false,
    musicSeconds: 0,
    articlesOpened: 0,
    videosWatched: 0,
    servicesUsed: [],
    lastCompleted: null,
    localHistory: [],

    setSelectedMinutes: (minutes) => {
      if (get().isActive) return; // FR 2.1: cannot change while active
      set({ selectedMinutes: minutes, plannedSeconds: minutes * 60, remainingSeconds: minutes * 60 });
    },

    startOrContinue: (initialService) => {
      if (get().isActive) {
        if (initialService) get().markServiceUsed(initialService);
        return;
      }
      const planned = get().selectedMinutes * 60;
      const now = Date.now();
      set({
        isActive: true,
        startedAtMs: now,
        plannedSeconds: planned,
        remainingSeconds: planned,
        oneMinuteFired: false,
        showOneMinuteBanner: false,
        musicSeconds: 0,
        articlesOpened: 0,
        videosWatched: 0,
        servicesUsed: initialService ? [initialService] : [],
      });
    },

    tick: () => {
      const { isActive, startedAtMs, plannedSeconds, oneMinuteFired } = get();
      if (!isActive || !startedAtMs) return;
      const elapsed = Math.floor((Date.now() - startedAtMs) / 1000);
      const remaining = Math.max(0, plannedSeconds - elapsed);
      const hittingOneMin = !oneMinuteFired && remaining <= 60 && remaining > 0;
      set({
        remainingSeconds: remaining,
        oneMinuteFired: oneMinuteFired || hittingOneMin,
        showOneMinuteBanner: hittingOneMin ? true : get().showOneMinuteBanner,
      });
      if (remaining === 0) {
        void get().endSession("COMPLETED");
      }
    },

    endSession: async (reason) => {
      const s = get();
      if (!s.isActive || !s.startedAtMs) return null;
      useMusicStore.getState().stop(); // FR 2.6: stop playback when session ends
      const endedAtMs = Date.now();
      const actualSeconds = Math.min(s.plannedSeconds, Math.max(1, Math.round((endedAtMs - s.startedAtMs) / 1000)));
      const record: SessionRecord = {
        clientId: uuid(),
        startedAt: new Date(s.startedAtMs).toISOString(),
        endedAt: new Date(endedAtMs).toISOString(),
        plannedSeconds: s.plannedSeconds,
        actualSeconds,
        endReason: reason,
        musicSeconds: s.musicSeconds,
        articlesOpened: s.articlesOpened,
        videosWatched: s.videosWatched,
        servicesUsed: s.servicesUsed,
      };
      set({
        isActive: false,
        startedAtMs: null,
        remainingSeconds: s.selectedMinutes * 60,
        showOneMinuteBanner: false,
        lastCompleted: record,
      });
      await enqueueAndFlush(record);
      return record;
    },

    dismissOneMinuteBanner: () => set({ showOneMinuteBanner: false }),

    markServiceUsed: (service) => {
      const cur = get().servicesUsed;
      if (!cur.includes(service)) set({ servicesUsed: [...cur, service] });
    },

    recordArticleOpened: () => {
      if (!get().isActive) return;
      get().markServiceUsed("NEWS");
      set({ articlesOpened: get().articlesOpened + 1 });
    },

    recordVideoWatched: () => {
      if (!get().isActive) return;
      get().markServiceUsed("VIDEO");
      set({ videosWatched: get().videosWatched + 1 });
    },

    hydrate: async () => {
      const history = (await kv.get<SessionRecord[]>(StorageKeys.sessionHistory)) ?? [];
      set({ localHistory: history });
      await get().flushSyncQueue();
    },

    flushSyncQueue: async () => {
      if (useAuthStore.getState().status !== "authenticated") return;
      const queue = (await kv.get<SessionRecord[]>(StorageKeys.sessionSyncQueue)) ?? [];
      if (queue.length === 0) return;
      const remaining: SessionRecord[] = [];
      for (const item of queue) {
        try {
          await sessionApi.record(item);
        } catch {
          remaining.push(item);
        }
      }
      await kv.set(StorageKeys.sessionSyncQueue, remaining);
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessionStats });
    },
  };
});

onSignedIn(() => {
  void useSessionStore.getState().flushSyncQueue();
});

