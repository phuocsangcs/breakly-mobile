// Home Space screen composing duration selector (10/20/30m), virtual space hotspots, streak badge and navigation.
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { MiniPlayer } from "@/components/MiniPlayer";
import { SpaceView } from "@/components/SpaceView";
import { Button } from "@/components/ui/Button";
import { Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth";
import { usePreferences } from "@/features/preferences";
import { useSessionStats, useSessionTimer, type ServiceType } from "@/features/session";

const DURATIONS: (10 | 20 | 30)[] = [10, 20, 30];

export default function HomeSpaceScreen() {
  const { isAuthenticated, user } = useAuth();
  const { themeId } = usePreferences();
  const { isActive, selectedMinutes, setSelectedMinutes, startOrContinue } = useSessionTimer();
  const { stats } = useSessionStats();

  const handleOpenService = (service: ServiceType) => {
    startOrContinue(service);
    if (service === "MUSIC") router.push("/radio");
    if (service === "NEWS") router.push("/news");
    if (service === "VIDEO") router.push("/tv");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.streak}>🔥 {stats.currentStreak}-day streak</Text>
        <View style={styles.durations}>
          {DURATIONS.map((m) => (
            <Button
              key={m}
              label={`${m}m`}
              variant={selectedMinutes === m ? "primary" : "secondary"}
              onPress={isActive ? undefined : () => setSelectedMinutes(m)}
            />
          ))}
        </View>
      </View>

      <SpaceView themeId={themeId} onSelectObject={handleOpenService} />

      <MiniPlayer />

      <View style={styles.bottomNav}>
        <Button label="Themes" variant="secondary" onPress={() => router.push("/themes")} />
        <Button label="History" variant="secondary" onPress={() => router.push("/history")} />
        <Button label="Settings" variant="secondary" onPress={() => router.push("/settings")} />
        <Button
          label={isAuthenticated ? (user?.displayName || "Account") : "Sign In"}
          variant="ghost"
          onPress={() => router.push(isAuthenticated ? "/settings" : "/sign-in")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    paddingTop: 52,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.dark.surface,
  },
  streak: { color: Colors.dark.text, fontWeight: "700", fontSize: 14 },
  durations: { flexDirection: "row", gap: Spacing.xs },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderColor: Colors.dark.border,
  },
});
