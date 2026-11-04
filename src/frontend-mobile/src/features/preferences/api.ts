// Preferences REST endpoints (require authentication; guests persist locally).
import { apiClient } from "@/core/api";
import type { UserPreferences } from "./types";

export const preferencesApi = {
  get: () => apiClient.get<UserPreferences>("/preferences"),
  update: (prefs: Omit<UserPreferences, "updatedAt">) =>
    apiClient.put<UserPreferences>("/preferences", prefs),
};

