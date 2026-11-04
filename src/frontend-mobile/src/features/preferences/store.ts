// Local-first preferences store with automatic background sync when authenticated.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { StorageKeys, zustandStorage } from "@/core/storage/kv";
import { onSignedIn, useAuthStore } from "@/features/auth";
import { useMusicStore } from "@/features/music";
import { preferencesApi } from "./api";
import type { ThemeId, UserPreferences } from "./types";

interface PreferencesState extends UserPreferences {
  setTheme: (themeId: ThemeId) => void;
  setOneMinuteNotice: (enabled: boolean) => void;
  setDefaultDuration: (minutes: 10 | 20 | 30) => void;
  setMusicVolume: (volume: number) => void;
  syncFromServer: () => Promise<void>;
}

const pushIfAuthenticated = (s: UserPreferences) => {
  if (useAuthStore.getState().status !== "authenticated") return;
  void preferencesApi
    .update({
      themeId: s.themeId,
      oneMinuteNoticeEnabled: s.oneMinuteNoticeEnabled,
      defaultDurationMinutes: s.defaultDurationMinutes,
      musicVolume: s.musicVolume,
    })
    .catch(() => undefined);
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      themeId: "cozy-room",
      oneMinuteNoticeEnabled: true,
      defaultDurationMinutes: 20,
      musicVolume: 80,

      setTheme: (themeId) => {
        set({ themeId });
        pushIfAuthenticated(get());
      },
      setOneMinuteNotice: (oneMinuteNoticeEnabled) => {
        set({ oneMinuteNoticeEnabled });
        pushIfAuthenticated(get());
      },
      setDefaultDuration: (defaultDurationMinutes) => {
        set({ defaultDurationMinutes });
        pushIfAuthenticated(get());
      },
      setMusicVolume: (musicVolume) => {
        set({ musicVolume });
        useMusicStore.getState().setVolume(musicVolume);
        pushIfAuthenticated(get());
      },
      syncFromServer: async () => {
        if (useAuthStore.getState().status !== "authenticated") return;
        try {
          const remote = await preferencesApi.get();
          const dur = (remote.defaultDurationMinutes === 10 || remote.defaultDurationMinutes === 30
            ? remote.defaultDurationMinutes
            : 20) as 10 | 20 | 30;
          const themeId: ThemeId = remote.themeId === "garden" ? "garden" : "cozy-room";
          set({
            themeId,
            oneMinuteNoticeEnabled: remote.oneMinuteNoticeEnabled,
            defaultDurationMinutes: dur,
            musicVolume: remote.musicVolume,
            updatedAt: remote.updatedAt,
          });
          useMusicStore.getState().setVolume(remote.musicVolume);
        } catch {
          // Offline → keep local cache
        }
      },
    }),
    {
      name: StorageKeys.preferences,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

onSignedIn(() => {
  void usePreferencesStore.getState().syncFromServer();
});

