// User preferences domain types (theme, one-minute notice, default duration, music volume).
export type ThemeId = "cozy-room" | "garden";

export interface UserPreferences {
  themeId: ThemeId;
  oneMinuteNoticeEnabled: boolean;
  defaultDurationMinutes: 10 | 20 | 30;
  musicVolume: number;
  updatedAt?: string;
}

