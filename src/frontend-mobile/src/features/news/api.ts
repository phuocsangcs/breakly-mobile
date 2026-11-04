// News endpoints: curated RSS sources and parsed article list.
import { apiClient } from "@/core/api";
import type { NewsArticle, NewsSource } from "./types";

export const newsApi = {
  sources: () => apiClient.get<NewsSource[]>("/content", { query: { type: "NEWS_SOURCE" } }),
  articles: (sourceId?: string | null) =>
    apiClient.get<NewsArticle[]>("/news", { query: { sourceId: sourceId || undefined } }),
};

