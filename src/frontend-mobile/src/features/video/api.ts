// Video endpoints: curated short and long YouTube video lists.
import { apiClient } from "@/core/api";
import type { VideoFormat, VideoItem } from "./types";

export const videoApi = {
  list: (format: VideoFormat) =>
    apiClient.get<VideoItem[]>("/content", { query: { type: "VIDEO", format } }),
};

