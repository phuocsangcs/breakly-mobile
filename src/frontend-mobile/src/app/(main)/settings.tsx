// Profile & Settings screen synchronized with Figma "08 · Profile" (ui_20_profile_dark).
// Composes profile stats card, grouped SettingRows, content credits, account actions, and floating BottomBar.
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { BottomBar, type BottomBarTabKey } from "@/components/ui/BottomBar";
import { Card } from "@/components/ui/Card";
import { SettingRow } from "@/components/ui/SettingRow";
import { FontFamilies, getThemeColors, Typography } from "@/constants/theme";
import { useAuth } from "@/features/auth";
import { useMusicPlayer } from "@/features/music";
import { usePreferences } from "@/features/preferences";
import { useSessionStats } from "@/features/session";

const DURATION_CYCLE: (10 | 20 | 30)[] = [10, 20, 30];
const VOLUME_CYCLE = [40, 60, 80, 100];

function getInitials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "Breakly Guest";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function formatTotalHours(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h} h ${m} m` : `${h} h`;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user, signOut } = useAuth();
  const {
    themeId,
    oneMinuteNoticeEnabled,
    defaultDurationMinutes,
    musicVolume,
    setOneMinuteNotice,
    setDefaultDuration,
    setMusicVolume,
  } = usePreferences();
  const { currentTrack } = useMusicPlayer();
  const { stats } = useSessionStats();

  const palette = getThemeColors(themeId);

  const cycleDefaultDuration = () => {
    const idx = DURATION_CYCLE.indexOf(defaultDurationMinutes);
    const next = DURATION_CYCLE[(idx + 1) % DURATION_CYCLE.length];
    setDefaultDuration(next);
  };

  const cycleVolume = () => {
    const idx = VOLUME_CYCLE.indexOf(musicVolume);
    const next = idx >= 0 ? VOLUME_CYCLE[(idx + 1) % VOLUME_CYCLE.length] : 80;
    setMusicVolume(next);
  };

  const handleTabPress = (tab: BottomBarTabKey) => {
    if (tab === "room") router.replace("/");
    if (tab === "history") router.replace("/history");
  };

  const displayName = isAuthenticated
    ? user?.displayName || "Breakly Member"
    : "Guest Mode";
  const subtitle = isAuthenticated
    ? user?.email || "Synced across devices"
    : "Sessions sync once you sign in";

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 17, 64),
            paddingBottom: currentTrack ? 185 : 120,
          },
        ]}
      >
        <Text style={[styles.pageTitle, { color: palette.text }]}>Profile</Text>

        {/* User Profile & Stats Card matching Figma ui_20 */}
        <Card theme={themeId} style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarCircle, { backgroundColor: palette.accent }]}>
              <Text style={[styles.avatarInitials, { color: palette.onAccent }]}>
                {getInitials(user?.displayName, user?.email)}
              </Text>
            </View>
            <View style={styles.userInfoCol}>
              <Text style={[styles.userName, { color: palette.text }]} numberOfLines={1}>
                {displayName}
              </Text>
              <Text
                style={[styles.userEmail, { color: palette.textSecondary }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            </View>
          </View>

          <View style={styles.profileStatsRow}>
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: palette.text }]}>
                {stats.totalSessions}
              </Text>
              <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
                breaks
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
            <View style={styles.statCol}>
              <Text style={[styles.statValue, { color: palette.text }]}>
                {formatTotalHours(stats.totalMinutes)}
              </Text>
              <Text style={[styles.statLabel, { color: palette.textSecondary }]}>
                total
              </Text>
            </View>
          </View>
        </Card>

        {/* Break Settings Group */}
        <View style={styles.groupSection}>
          <Text style={[styles.groupTitle, { color: palette.textSecondary }]}>
            Break settings
          </Text>
          <View
            style={[
              styles.groupBox,
              { backgroundColor: palette.surface, borderColor: palette.line },
            ]}
          >
            <SettingRow
              label="Default break length"
              type="value"
              value={`${defaultDurationMinutes} min`}
              theme={themeId}
              onPress={cycleDefaultDuration}
              style={styles.groupedRow}
            />
            <View style={[styles.divider, { backgroundColor: palette.line }]} />
            <SettingRow
              label="Room theme"
              type="value"
              value={themeId === "garden" ? "Normal" : "Cozy chill room"}
              theme={themeId}
              onPress={() => router.push("/themes")}
              style={styles.groupedRow}
            />
            <View style={[styles.divider, { backgroundColor: palette.line }]} />
            <SettingRow
              label="1-minute warning"
              type="toggle"
              toggleValue={oneMinuteNoticeEnabled}
              onToggleChange={setOneMinuteNotice}
              theme={themeId}
              style={styles.groupedRow}
            />
            <View style={[styles.divider, { backgroundColor: palette.line }]} />
            <SettingRow
              label="Radio volume"
              type="value"
              value={`${musicVolume}%`}
              theme={themeId}
              onPress={cycleVolume}
              style={styles.groupedRow}
            />
          </View>
        </View>

        {/* Content Credits Group (FR 7.6) */}
        <View style={styles.groupSection}>
          <Text style={[styles.groupTitle, { color: palette.textSecondary }]}>
            Content credits
          </Text>
          <Card theme={themeId} style={styles.creditsCard}>
            <Text style={[styles.creditLine, { color: palette.textSecondary }]}>
              • Music: Jamendo (Creative Commons artists)
            </Text>
            <Text style={[styles.creditLine, { color: palette.textSecondary }]}>
              • News: VnExpress RSS feeds
            </Text>
            <Text style={[styles.creditLine, { color: palette.textSecondary }]}>
              • Videos: YouTube official embedded player
            </Text>
          </Card>
        </View>

        {/* Account Group */}
        <View style={styles.groupSection}>
          <Text style={[styles.groupTitle, { color: palette.textSecondary }]}>
            Account
          </Text>
          <View
            style={[
              styles.groupBox,
              { backgroundColor: palette.surface, borderColor: palette.line },
            ]}
          >
            {isAuthenticated ? (
              <SettingRow
                label="Sign out"
                type="danger"
                theme={themeId}
                onPress={() => void signOut()}
                style={styles.groupedRow}
              />
            ) : (
              <SettingRow
                label="Sign in / Create account"
                type="value"
                value="Sync breaks"
                theme={themeId}
                onPress={() => router.push("/sign-in")}
                style={styles.groupedRow}
              />
            )}
          </View>
        </View>
      </ScrollView>

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
          activeTab="profile"
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
  scrollContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  pageTitle: {
    ...Typography.presets.h1,
  },
  profileCard: {
    borderWidth: 0,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: FontFamilies.display,
    fontSize: 20,
    fontWeight: "600",
  },
  userInfoCol: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: Typography.weights.semibold,
  },
  userEmail: {
    fontSize: Typography.sizes.caption,
  },
  profileStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCol: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontFamily: FontFamilies.display,
    fontSize: 20,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
  },
  groupSection: {
    gap: 8,
  },
  groupTitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    paddingHorizontal: 4,
  },
  groupBox: {
    borderRadius: 22,
    borderWidth: 0,
    overflow: "hidden",
  },
  groupedRow: {
    borderRadius: 0,
  },
  divider: {
    height: 1,

  },
  creditsCard: {
    gap: 6,
  },
  creditLine: {
    fontSize: Typography.sizes.caption,
    lineHeight: 18,
  },
  bottomDock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    gap: 10,
  },
});
