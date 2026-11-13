// Home Space screen synchronized with Figma "03 · Home Space – Cozy chill room" & "03b · Home Space – Normal".
// Composes header (breakly wordmark, StreakChip, ThemeSwitch), duration / active break card,
// interactive SpaceView room, floating MiniPlayer and floating BottomBar.
import React, { useEffect } from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { SpaceView } from "@/components/SpaceView";
import {
  BottomBar,
  type BottomBarTabKey,
} from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";
import { DurationSelector } from "@/components/ui/DurationSelector";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StreakChip } from "@/components/ui/StreakChip";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { FontFamilies, getThemeColors, Typography } from "@/constants/theme";
import { useMusicPlayer } from "@/features/music";
import { usePreferences } from "@/features/preferences";
import { useSessionStats, useSessionTimer, type ServiceType } from "@/features/session";

export default function HomeSpaceScreen() {
  const insets = useSafeAreaInsets();
  const { themeId, defaultDurationMinutes, setTheme } = usePreferences();
  const {
    isActive,
    selectedMinutes,
    remainingSeconds,
    formattedRemaining,
    setSelectedMinutes,
    startOrContinue,
    endSession,
  } = useSessionTimer();
  const { stats } = useSessionStats();
  const { isPlaying } = useMusicPlayer();

  // Keep selected break length synced with user's default preference when idle
  useEffect(() => {
    if (!isActive) {
      setSelectedMinutes(defaultDurationMinutes);
    }
  }, [defaultDurationMinutes, isActive, setSelectedMinutes]);

  const palette = getThemeColors(themeId);
  const isLight = themeId === "garden";

  const plannedSeconds = selectedMinutes * 60;
  const elapsedProgress =
    plannedSeconds > 0
      ? Math.max(0.03, Math.min(1, (plannedSeconds - remainingSeconds) / plannedSeconds))
      : 0;

  const handleOpenService = (service: ServiceType) => {
    startOrContinue(service);
    if (service === "MUSIC") router.push("/radio");
    if (service === "NEWS") router.push("/news");
    if (service === "VIDEO") router.push("/tv");
  };

  const confirmEndEarly = () => {
    Alert.alert("End break early?", "Your break progress up to now will be saved.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End break",
        style: "destructive",
        onPress: () => void endSession("ENDED_EARLY"),
      },
    ]);
  };

  const handleTabPress = (tab: BottomBarTabKey) => {
    if (tab === "history") router.push("/history");
    if (tab === "profile") router.push("/settings");
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      {/* Interactive Room Background & Hotspots */}
      <View style={styles.sceneWrapper}>
        <SpaceView
          themeId={themeId}
          musicPlaying={isPlaying}
          onSelectObject={handleOpenService}
        />
      </View>

      {/* Top Overlay: Header + Duration / Active Timer Card */}
      <View
        style={[
          styles.topOverlay,
          { paddingTop: Math.max(insets.top + 7, 54) },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.brandWordmark,
              { color: isLight ? palette.accent : palette.text },
            ]}
          >
            breakly
          </Text>

          <View style={styles.headerActions}>
            <StreakChip days={stats.currentStreak} theme={themeId} />
            <ThemeSwitch
              value={themeId}
              onChange={(_, nextThemeId) => setTheme(nextThemeId)}
            />
          </View>
        </View>

        <View
          style={[
            styles.controlCard,
            {
              backgroundColor: isLight
                ? "rgba(255, 255, 255, 0.85)"
                : "rgba(255, 246, 232, 0.1)",
              borderColor: isLight ? "rgba(255,255,255,0.6)" : "rgba(255,246,232,0.22)",
            },
          ]}
        >
          {isActive ? (
            <View style={styles.activeCardInner}>
              <View style={styles.activeTopRow}>
                <View style={styles.activeClockCol}>
                  <Text
                    style={[
                      styles.cardSubLabel,
                      { color: palette.textSecondary },
                    ]}
                  >
                    Break in progress
                  </Text>
                  <Text
                    style={[styles.activeCountdown, { color: palette.text }]}
                  >
                    {formattedRemaining}
                  </Text>
                </View>

                <Button
                  label="End break"
                  variant="secondary"
                  size="md"
                  theme={themeId}
                  onPress={confirmEndEarly}
                />
              </View>

              <ProgressBar
                type="break"
                progress={elapsedProgress}
                theme={themeId}
              />

              <Text style={[styles.cardSub, { color: palette.textSecondary }]}>
                left of {selectedMinutes} min. Tap the radio, newspaper or TV to switch.
              </Text>
            </View>
          ) : (
            <View style={styles.idleCardInner}>
              <Text style={[styles.cardTitle, { color: palette.text }]}>
                How long is your break?
              </Text>
              <Text style={[styles.cardSub, { color: palette.textSecondary }]}>
                Pick a length, then tap something in the room.
              </Text>
              <DurationSelector
                options={[10, 20, 30]}
                value={selectedMinutes}
                onChange={(m) => setSelectedMinutes(m as 10 | 20 | 30)}
                theme={themeId}
                style={styles.durationSelector}
              />
            </View>
          )}
        </View>
      </View>

      {/* Bottom Floating Stack: MiniPlayer + BottomBar */}
      <View
        style={[
          styles.bottomDock,
          { paddingBottom: Math.max(insets.bottom - 6, 28) },
        ]}
        pointerEvents="box-none"
      >
        <MiniPlayer theme={themeId} />
        <BottomBar
          activeTab="room"
          theme={themeId}
          onTabPress={handleTabPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sceneWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

  },
  topOverlay: {
    paddingHorizontal: 20,
    gap: 16,
  },
  headerRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandWordmark: {
    fontFamily: FontFamilies.display,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,

  },
  idleCardInner: {
    gap: 4,
  },
  cardTitle: {
    fontFamily: FontFamilies.display,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
  },
  cardSub: {
    fontSize: 14,
    lineHeight: 20,
  },
  durationSelector: {
    marginTop: 10,
    justifyContent: "space-between",
  },
  activeCardInner: {
    gap: 12,
  },
  activeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeClockCol: {
    gap: 2,
  },
  cardSubLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
  },
  activeCountdown: {
    fontFamily: FontFamilies.display,
    fontSize: 38,
    lineHeight: 46,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  bottomDock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    gap: 12,
  },
});
