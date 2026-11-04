// Session REST endpoints (authenticated users).
import { apiClient } from "@/core/api";
import type { PageResponse, SessionRecord, SessionStats } from "./types";

export const sessionApi = {
  record: (session: SessionRecord) => apiClient.post<SessionRecord>("/sessions", session),
  list: (page = 0, size = 30) =>
    apiClient.get<PageResponse<SessionRecord>>("/sessions", { query: { page, size } }),
  stats: (tz?: string) =>
    apiClient.get<SessionStats>("/sessions/stats", {
      query: { tz: tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Asia/Ho_Chi_Minh" },
    }),
};

