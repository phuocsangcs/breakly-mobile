// Headless preferences hook for screens.
import { useShallow } from "zustand/react/shallow";
import { usePreferencesStore } from "./store";

export function usePreferences() {
  return usePreferencesStore(
    useShallow((s) => ({
      themeId: s.themeId,
      oneMinuteNoticeEnabled: s.oneMinuteNoticeEnabled,
      defaultDurationMinutes: s.defaultDurationMinutes,
      musicVolume: s.musicVolume,
      setTheme: s.setTheme,
      setOneMinuteNotice: s.setOneMinuteNotice,
      setDefaultDuration: s.setDefaultDuration,
      setMusicVolume: s.setMusicVolume,
    })),
  );
}

