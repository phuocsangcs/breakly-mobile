// Headless hooks for news sources, filtered article feeds and currently selected article.
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { queryKeys } from "@/core/query";
import { newsApi } from "./api";
import type { NewsArticle } from "./types";

interface SelectedArticleState {
  selected: NewsArticle | null;
  select: (article: NewsArticle) => void;
}

export const useSelectedArticleStore = create<SelectedArticleState>((set) => ({
  selected: null,
  select: (selected) => set({ selected }),
}));

export function useNewsSources() {
  const q = useQuery({
    queryKey: queryKeys.content("NEWS_SOURCE"),
    queryFn: newsApi.sources,
  });
  return {
    sources: q.data ?? [],
    isLoading: q.isLoading,
    error: q.error,
    refetch: q.refetch,
  };
}

export function useNewsFeed() {
  const [sourceId, setSourceId] = useState<string | null>(null);
  const sources = useNewsSources();
  const feed = useQuery({
    queryKey: queryKeys.news(sourceId ?? "all"),
    queryFn: () => newsApi.articles(sourceId),
    placeholderData: (prev) => prev, // keep existing list if a refresh fails (FR 5.3)
  });

  return {
    sources: sources.sources,
    selectedSourceId: sourceId,
    selectSource: setSourceId,
    articles: feed.data ?? [],
    isLoading: feed.isLoading,
    isRefetching: feed.isRefetching,
    error: feed.error,
    refresh: feed.refetch,
  };
}

