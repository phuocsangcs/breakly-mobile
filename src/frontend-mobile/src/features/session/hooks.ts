// Headless hooks for the break timer, session history and daily streak.
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { queryKeys } from "@/core/query";
import { useAuth } from "@/features/auth";
import { usePreferences } from "@/features/preferences";
import { sessionApi } from "./api";
import { useSessionStore } from "./store";
import { computeLocalStats } from "./streak";

export function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useSessionTimer() {
  const { oneMinuteNoticeEnabled } = usePreferences();
  const s = useSessionStore(
    useShallow((st) => ({
      isActive: st.isActive,
      selectedMinutes: st.selectedMinutes,
      remainingSeconds: st.remainingSeconds,
      isFinalMinute: st.isActive && st.remainingSeconds <= 60,
      showOneMinuteBanner: st.showOneMinuteBanner && oneMinuteNoticeEnabled,
      lastCompleted: st.lastCompleted,
      setSelectedMinutes: st.setSelectedMinutes,
      startOrContinue: st.startOrContinue,
      endSession: st.endSession,
      dismissOneMinuteBanner: st.dismissOneMinuteBanner,
      recordArticleOpened: st.recordArticleOpened,
      recordVideoWatched: st.recordVideoWatched,
    })),
  );
  return { ...s, formattedRemaining: formatMmSs(s.remainingSeconds) };
}

export function useSessionHistory() {
  const { isAuthenticated } = useAuth();
  const localHistory = useSessionStore((s) => s.localHistory);
  const q = useQuery({
    queryKey: queryKeys.sessions,
    queryFn: () => sessionApi.list(0, 30),
    enabled: isAuthenticated,
  });

  return {
    sessions: isAuthenticated && q.data ? q.data.items : localHistory,
    isLoading: isAuthenticated && q.isLoading,
    error: q.error,
    refetch: q.refetch,
  };
}

export function useSessionStats() {
  const { isAuthenticated } = useAuth();
  const localHistory = useSessionStore((s) => s.localHistory);
  const q = useQuery({
    queryKey: queryKeys.sessionStats,
    queryFn: () => sessionApi.stats(),
    enabled: isAuthenticated,
  });

  return {
    stats: isAuthenticated && q.data ? q.data : computeLocalStats(localHistory),
    isLoading: isAuthenticated && q.isLoading,
  };
}

