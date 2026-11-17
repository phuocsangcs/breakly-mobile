// Session History screen synchronized with Figma "07 · History" (grouped SessionRows, summary stats, floating BottomBar).
import React, { useMemo } from "react";
import { AppText as Text } from "@/components/ui/AppText";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { BottomBar, type BottomBarTabKey } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SessionRow } from "@/components/ui/SessionRow";
import { FontFamilies, getThemeColors, Spacing, Typography } from "@/constants/theme";
import { useMusicPlayer } from "@/features/music";
import { usePreferences } from "@/features/preferences";
import {
  useSessionHistory,
  useSessionStats,
  type ServiceType,
  type SessionRecord,
} from "@/features/session";

const SERVICE_LABEL: Record<ServiceType, string> = {
  MUSIC: "Music",
  NEWS: "News",
  VIDEO: "Videos",
  GAME: "Games",
};

function formatDurationTotal(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h} h ${m} m` : `${h} h`;
}

function formatTimeRange(startedAt: string, endedAt: string): string {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getDateGroupLabel(iso: string): string {
  const target = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(target).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return target.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const { currentTrack } = useMusicPlayer();
  const { stats } = useSessionStats();
  const { sessions, isLoading, error, refetch } = useSessionHistory();

  const sections = useMemo(() => {
    const map = new Map<string, SessionRecord[]>();
    for (const s of sessions) {
      const key = getDateGroupLabel(s.startedAt);
      const list = map.get(key) ?? [];
      list.push(s);
      map.set(key, list);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [sessions]);

  const handleTabPress = (tab: BottomBarTabKey) => {
    if (tab === "room") router.replace("/");
    if (tab === "profile") router.replace("/settings");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
          paddingTop: Math.max(insets.top + 17, 64),
        },
      ]}
    >
      {/* Editorial Header */}
      <View style={styles.headerBlock}>
        <Text style={[styles.title, { color: palette.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          Every break you finished.
        </Text>
      </View>

      {/* 3-Column Metrics Card matching Figma ui_19 */}
      <View style={styles.statsWrap}>
        <Card theme={themeId} style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, { color: palette.text }]}>
              {stats.totalSessions}
            </Text>
            <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
              breaks total
            </Text>
          </View>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, { color: palette.text }]}>
              {formatDurationTotal(stats.totalMinutes)}
            </Text>
            <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
              total break time
            </Text>
          </View>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, { color: palette.text }]}>
              {stats.currentStreak} {stats.currentStreak === 1 ? "day" : "days"}
            </Text>
            <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
              streak
            </Text>
          </View>
        </Card>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.error, { color: palette.danger }]}>
            Could not load session history
          </Text>
          <Button
            label="Retry"
            size="md"
            theme={themeId}
            onPress={() => void refetch()}
          />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.emptyTitle, { color: palette.text }]}>
            No completed breaks yet
          </Text>
          <Text style={[styles.emptySub, { color: palette.textSecondary }]}>
            Start a mindful pause from your Home Space to build your streak.
          </Text>
          <Button
            label="Go to Room"
            size="md"
            theme={themeId}
            onPress={() => router.replace("/")}
          />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.clientId}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: currentTrack ? 180 : 112 },
          ]}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: palette.textSecondary }]}>
              {title}
            </Text>
          )}
          renderItem={({ item }) => {
            const mins = Math.max(1, Math.round(item.actualSeconds / 60));
            const servicesText =
              item.servicesUsed.length > 0
                ? item.servicesUsed.map((s) => SERVICE_LABEL[s] ?? s).join(" · ")
                : item.endReason === "ENDED_EARLY"
                  ? "Ended early"
                  : "Mindful pause";

            return (
              <SessionRow
                durationMinutes={mins}
                timeRange={formatTimeRange(item.startedAt, item.endedAt)}
                subtitle={servicesText}
                theme={themeId}
                style={styles.rowGap}
              />
            );
          }}
        />
      )}

      {/* Floating MiniPlayer + BottomBar */}
      <View
        style={[
          styles.bottomDock,
          { paddingBottom: Math.max(insets.bottom - 6, 28) },
        ]}
        pointerEvents="box-none"
      >
        <MiniPlayer theme={themeId} />
        <BottomBar
          activeTab="history"
          theme={themeId}
          onTabPress={handleTabPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBlock: {
    paddingHorizontal: 24,
    gap: 4,
    paddingBottom: 20,
  },
  title: {
    ...Typography.presets.h1,
  },
  subtitle: {
    fontSize: 15,
  },
  statsWrap: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  statsCard: {
    borderRadius: 20,
    borderWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  statCol: {
    flex: 1,
    gap: 3,
  },
  statValue: {
    fontFamily: FontFamilies.display,
    fontSize: 20,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginTop: 14,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  rowGap: {
    marginBottom: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    paddingBottom: 90,
  },
  emptyTitle: {
    ...Typography.presets.title,
    textAlign: "center",
  },
  emptySub: {
    fontSize: Typography.sizes.sm,
    textAlign: "center",
  },
  error: {
    fontSize: Typography.sizes.sm,
  },
  bottomDock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    gap: 10,
  },
});
