// Shared TanStack Query client with mobile-friendly defaults (retry only transient failures).
import { QueryClient } from "@tanstack/react-query";
import { isRetryable } from "@/core/api/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: (failureCount, error) => failureCount < 2 && isRetryable(error),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

