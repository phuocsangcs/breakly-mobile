// History screen showing streak stats and past break sessions from newest to oldest (FR 7.3–7.4).
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors, Spacing } from "@/constants/theme";
import { formatMmSs, useSessionHistory, useSessionStats } from "@/features/session";

export default function HistoryScreen() {
  const { stats } = useSessionStats();
  const { sessions, isLoading, error, refetch } = useSessionHistory();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button label="← Space" variant="ghost" onPress={() => router.back()} />
        <Text style={styles.title}>Session History</Text>
      </View>

      <Card style={styles.statsCard}>
        <Text style={styles.stat}>🔥 Current streak: {stats.currentStreak} days</Text>
        <Text style={styles.muted}>
          Longest: {stats.longestStreak}d · Sessions: {stats.totalSessions} · Total: {stats.totalMinutes}m
        </Text>
      </Card>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Could not load session history</Text>
          <Button label="Retry" onPress={() => void refetch()} />
        </View>
      ) : sessions.length === 0 ? (
        <Text style={styles.empty}>No completed sessions yet. Start a break from the Home Space!</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(s) => s.clientId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.row}>
              <Text style={styles.stat}>
                {new Date(item.startedAt).toLocaleString()} · {formatMmSs(item.actualSeconds)}
              </Text>
              <Text style={styles.muted}>
                Services: {item.servicesUsed.join(", ") || "—"} · Articles: {item.articlesOpened} · Videos:{" "}
                {item.videosWatched}
              </Text>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingTop: 44, paddingHorizontal: Spacing.md, gap: Spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  title: { color: Colors.dark.text, fontSize: 20, fontWeight: "700" },
  statsCard: { gap: Spacing.xs },
  list: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  row: { gap: Spacing.xs },
  stat: { color: Colors.dark.text, fontWeight: "600" },
  muted: { color: Colors.dark.textMuted, fontSize: 12 },
  empty: { color: Colors.dark.textMuted, textAlign: "center", marginTop: Spacing.xl },
  center: { alignItems: "center", gap: Spacing.sm },
  error: { color: "#F87171" },
});
