// Music endpoints: curated categories and Jamendo track proxy.
import { apiClient } from "@/core/api";
import type { MusicCategory, Track } from "./types";

export const musicApi = {
  categories: () => apiClient.get<MusicCategory[]>("/content", { query: { type: "MUSIC_CATEGORY" } }),
  tracks: (category: string, limit = 20) =>
    apiClient.get<Track[]>("/music/tracks", { query: { category, limit } }),
};

