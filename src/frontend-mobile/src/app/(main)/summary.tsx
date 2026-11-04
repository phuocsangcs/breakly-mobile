// Session Summary screen displaying total break time, music minutes, articles opened and videos watched (FR 7.1).
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors, Spacing } from "@/constants/theme";
import { formatMmSs, useSessionTimer } from "@/features/session";

export default function SummaryScreen() {
  const { lastCompleted } = useSessionTimer();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Break Complete 🎉</Text>
        {lastCompleted ? (
          <>
            <Text style={styles.stat}>Total time: {formatMmSs(lastCompleted.actualSeconds)}</Text>
            <Text style={styles.stat}>Music listened: {formatMmSs(lastCompleted.musicSeconds)}</Text>
            <Text style={styles.stat}>Articles opened: {lastCompleted.articlesOpened}</Text>
            <Text style={styles.stat}>Videos watched: {lastCompleted.videosWatched}</Text>
            <Text style={styles.muted}>
              Services: {lastCompleted.servicesUsed.length > 0 ? lastCompleted.servicesUsed.join(", ") : "None"}
            </Text>
          </>
        ) : (
          <Text style={styles.muted}>No recent session found.</Text>
        )}
        <Button label="Done" onPress={() => router.replace("/")} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, padding: Spacing.lg, justifyContent: "center" },
  card: { gap: Spacing.md },
  title: { color: Colors.dark.text, fontSize: 22, fontWeight: "700" },
  stat: { color: Colors.dark.text, fontSize: 16 },
  muted: { color: Colors.dark.textMuted, fontSize: 13 },
});
