import { FigmaImage } from "@/components/ui/FigmaImage";
import { ScreenGlow } from "@/components/ui/ScreenGlow";
// Session Summary & Time's Up screens synchronized with Figma "09 · Time's Up" (ui_17) & "10 · Summary" (ui_18).
// Shows teardown confirmation on natural completion, then breakdown bars, streak dots, and navigation actions (FR 7.1).
import React, { useState } from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FontFamilies, getThemeColors, Typography } from "@/constants/theme";
import { usePreferences } from "@/features/preferences";
import { formatMmSs, useSessionStats, useSessionTimer } from "@/features/session";

const WEEK_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

function formatSessionTimeRange(startedAt: string, endedAt: string, actualSeconds: number): string {
  const s = new Date(startedAt);
  const e = new Date(endedAt);
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const mins = Math.max(1, Math.round(actualSeconds / 60));
  return `Today · ${fmt(s)} – ${fmt(e)} · ${mins} min`;
}

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const { lastCompleted } = useSessionTimer();
  const { stats } = useSessionStats();

  const [dismissedCompletionId, setDismissedCompletionId] = useState<string | null>(null);
  const showTeardown = lastCompleted?.endReason === "COMPLETED" && lastCompleted.clientId !== dismissedCompletionId;

  // --- VIEW 1: TIME'S UP TEARDOWN SCREEN (Figma ui_17) ---
  if (showTeardown && lastCompleted) {
    return (
      <View
        style={[
          styles.teardownRoot,
          {
            backgroundColor: palette.background,
            paddingTop: Math.max(insets.top + 16, 56),
            paddingBottom: Math.max(insets.bottom + 16, 32),
          },
        ]}
      >
        <ScreenGlow light={themeId === "garden"} />
        <View style={styles.teardownCenter}>
          <View style={{ width: 230, height: 230, alignItems: "center", justifyContent: "center" }}>
            <FigmaImage name={themeId === "garden" ? "12-1167-imgGroup" : "10-2-imgGroup"} style={{ position: "absolute", left: 6, top: 6 }} />
            <FigmaImage name={themeId === "garden" ? "12-1167-imgGroup1" : "10-2-imgGroup1"} style={{ position: "absolute", left: 6, top: 26 }} />
            <FigmaImage name="10-2-imgClock" />
          </View>

          <Text style={[styles.teardownTitle, { color: palette.text }]}>
            Time&apos;s up
          </Text>

          <Text style={[styles.quoteText, { color: palette.text }]}>
            “Time is what we want most, but what we use worst.”
          </Text>
          <Text style={[styles.quoteAuthor, { color: palette.accent }]}>
            — William Penn
          </Text>

          {/* Teardown Checklist Card */}
          <Card theme={themeId} style={styles.teardownCard}>
            <View style={styles.teardownRow}>
              <View style={[styles.teardownIconCircle, { backgroundColor: palette.surface2 }]}>
                <FigmaImage name={themeId === "garden" ? "12-1167-imgMusic" : "10-2-imgMusic"} />
              </View>
              <View style={styles.teardownMeta}>
                <Text style={[styles.teardownItemTitle, { color: palette.text }]}>
                  Music stopped
                </Text>
                <Text style={[styles.teardownItemSub, { color: palette.textSecondary }]}>
                  {lastCompleted.musicSeconds > 0
                    ? `${formatMmSs(lastCompleted.musicSeconds)} played in session`
                    : "Audio engine paused"}
                </Text>
              </View>
              <FigmaImage name={themeId === "garden" ? "12-1167-imgIconCheck" : "10-2-imgIconCheck"} />
            </View>

            <View style={styles.teardownRow}>
              <View style={[styles.teardownIconCircle, { backgroundColor: palette.surface2 }]}>
                <FigmaImage name={themeId === "garden" ? "12-1167-imgNews" : "10-2-imgNews"} />
              </View>
              <View style={styles.teardownMeta}>
                <Text style={[styles.teardownItemTitle, { color: palette.text }]}>
                  News page closed
                </Text>
                <Text style={[styles.teardownItemSub, { color: palette.textSecondary }]}>
                  vnexpress.net · {lastCompleted.articlesOpened} opened
                </Text>
              </View>
              <FigmaImage name={themeId === "garden" ? "12-1167-imgIconCheck" : "10-2-imgIconCheck"} />
            </View>

            <View style={styles.teardownRow}>
              <View style={[styles.teardownIconCircle, { backgroundColor: palette.surface2 }]}>
                <FigmaImage name={themeId === "garden" ? "12-1167-imgTv" : "10-2-imgTv"} />
              </View>
              <View style={styles.teardownMeta}>
                <Text style={[styles.teardownItemTitle, { color: palette.text }]}>
                  TV switched off
                </Text>
                <Text style={[styles.teardownItemSub, { color: palette.textSecondary }]}>
                  youtube.com · {lastCompleted.videosWatched} watched
                </Text>
              </View>
              <FigmaImage name={themeId === "garden" ? "12-1167-imgIconCheck" : "10-2-imgIconCheck"} />
            </View>

            <View style={styles.teardownRow}>
              <View style={[styles.teardownIconCircle, { backgroundColor: palette.surface2 }]}>
                <Text style={styles.gameGlyph}>🧩</Text>
              </View>
              <View style={styles.teardownMeta}>
                <Text style={[styles.teardownItemTitle, { color: palette.text }]}>
                  Game Corner closed
                </Text>
                <Text style={[styles.teardownItemSub, { color: palette.textSecondary }]}>
                  nytimes.com · {lastCompleted.gamesPlayed ?? 0} played
                </Text>
              </View>
              <FigmaImage name={themeId === "garden" ? "12-1167-imgIconCheck" : "10-2-imgIconCheck"} />
            </View>
          </Card>
        </View>

        <Button
          label="See summary"
          theme={themeId}
          fullWidth
          onPress={() => setDismissedCompletionId(lastCompleted.clientId)}
        />
      </View>
    );
  }

  // --- VIEW 2: SUMMARY VIEW (Figma ui_18) ---
  const totalMins = lastCompleted
    ? Math.max(1, Math.round(lastCompleted.actualSeconds / 60))
    : 20;
  const musicMins = lastCompleted
    ? Math.round(lastCompleted.musicSeconds / 60)
    : 0;
  const filledStreakCount = Math.min(7, Math.max(1, stats.currentStreak % 7 || (stats.currentStreak > 0 ? 7 : 1)));

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 16, 56),
            paddingBottom: Math.max(insets.bottom + 24, 36),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.summaryHeader}>
          <Text style={[styles.overline, { color: palette.accent }]}>
            BREAK COMPLETE
          </Text>
          <Text style={[styles.heroHeadline, { color: palette.text }]}>
            Nice reset.
          </Text>
          {lastCompleted ? (
            <Text style={[styles.summarySub, { color: palette.textSecondary }]}>
              {formatSessionTimeRange(
                lastCompleted.startedAt,
                lastCompleted.endedAt,
                lastCompleted.actualSeconds
              )}
            </Text>
          ) : (
            <Text style={[styles.summarySub, { color: palette.textSecondary }]}>
              Your break session has ended.
            </Text>
          )}
        </View>

        {/* Breakdown Card */}
        {lastCompleted ? (
          <Card theme={themeId} style={styles.breakdownCard}>
            <Text style={[styles.cardHeading, { color: palette.text }]}>
              Where your {totalMins} {totalMins === 1 ? "minute" : "minutes"} went
            </Text>

            {/* Segmented Breakdown Bar */}
            <View style={styles.segmentBar}>
              <View style={[styles.segmentLeft, { backgroundColor: "#8FA9A6" }]} />
              <View style={[styles.segmentMid, { backgroundColor: "#C1683F" }]} />
            </View>

            <View style={styles.breakdownList}>
              <View style={styles.breakdownRow}>
                <View style={[styles.badgeCircle, { backgroundColor: palette.accent }]}>
                  <FigmaImage name={themeId === "garden" ? "12-1239-imgMusic" : "10-72-imgMusic"} />
                </View>
                <View style={styles.breakdownMeta}>
                  <Text style={[styles.rowTitle, { color: palette.text }]}>
                    Radio
                  </Text>
                  <Text style={[styles.rowSub, { color: palette.textSecondary }]}>
                    {lastCompleted.musicSeconds > 0
                      ? `${formatMmSs(lastCompleted.musicSeconds)} in the background`
                      : "Not played this break"}
                  </Text>
                </View>
                <Text style={[styles.rowMetric, { color: palette.text }]}>
                  {musicMins > 0 ? `${musicMins} min` : formatMmSs(lastCompleted.musicSeconds)}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <View style={[styles.badgeCircle, { backgroundColor: "#8FA9A6" }]}>
                  <FigmaImage name={themeId === "garden" ? "12-1239-imgNews" : "10-72-imgNews"} />
                </View>
                <View style={styles.breakdownMeta}>
                  <Text style={[styles.rowTitle, { color: palette.text }]}>
                    Newspaper
                  </Text>
                  <Text style={[styles.rowSub, { color: palette.textSecondary }]}>
                    {lastCompleted.articlesOpened}{" "}
                    {lastCompleted.articlesOpened === 1 ? "page" : "pages"} opened
                  </Text>
                </View>
                <Text style={[styles.rowMetric, { color: palette.text }]}>
                  {lastCompleted.articlesOpened}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <View style={[styles.badgeCircle, { backgroundColor: "#C1683F" }]}>
                  <FigmaImage name={themeId === "garden" ? "12-1239-imgTv" : "10-72-imgTv"} />
                </View>
                <View style={styles.breakdownMeta}>
                  <Text style={[styles.rowTitle, { color: palette.text }]}>
                    TV
                  </Text>
                  <Text style={[styles.rowSub, { color: palette.textSecondary }]}>
                    {lastCompleted.videosWatched}{" "}
                    {lastCompleted.videosWatched === 1 ? "video" : "videos"} watched
                  </Text>
                </View>
                <Text style={[styles.rowMetric, { color: palette.text }]}>
                  {lastCompleted.videosWatched}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <View style={[styles.badgeCircle, { backgroundColor: "#5E8C61" }]}>
                  <Text style={styles.gameGlyph}>🧩</Text>
                </View>
                <View style={styles.breakdownMeta}>
                  <Text style={[styles.rowTitle, { color: palette.text }]}>
                    Games
                  </Text>
                  <Text style={[styles.rowSub, { color: palette.textSecondary }]}>
                    {lastCompleted.gamesPlayed ?? 0}{" "}
                    {(lastCompleted.gamesPlayed ?? 0) === 1 ? "puzzle" : "puzzles"} played
                  </Text>
                </View>
                <Text style={[styles.rowMetric, { color: palette.text }]}>
                  {lastCompleted.gamesPlayed ?? 0}
                </Text>
              </View>
            </View>
          </Card>
        ) : (
          <Card theme={themeId} style={styles.breakdownCard}>
            <Text style={[styles.rowSub, { color: palette.textSecondary }]}>
              No recent session found. Start a break from your Home Space!
            </Text>
          </Card>
        )}

        {/* Streak Week Card */}
        <Card theme={themeId} style={styles.streakCard}>
          <View style={styles.streakHeaderRow}>
            <View style={[styles.streakFlameBadge, { backgroundColor: palette.surface2 }]}>
              <FigmaImage name={themeId === "garden" ? "12-1239-imgFlame" : "10-72-imgFlame"} />
            </View>
            <View style={styles.streakTextCol}>
              <Text style={[styles.streakTitle, { color: palette.text }]}>
                {Math.max(1, stats.currentStreak)}-day streak
              </Text>
              <Text style={[styles.rowSub, { color: palette.textSecondary }]}>
                A mindful break every day this week.
              </Text>
            </View>
          </View>

          <View style={styles.weekDotsRow}>
            {WEEK_LETTERS.map((letter, idx) => {
              const filled = idx < filledStreakCount;
              return (
                <View key={idx} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dayDot,
                      filled
                        ? { backgroundColor: palette.accent }
                        : { borderColor: palette.line, borderWidth: 1.5 },
                    ]}
                  />
                  <Text
                    style={[
                      styles.dayLabel,
                      {
                        color: filled ? palette.text : palette.textSecondary,
                        fontWeight: filled ? "700" : "400",
                      },
                    ]}
                  >
                    {letter}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsWrap}>
          <Button
            label="Back to room"
            theme={themeId}
            fullWidth
            onPress={() => router.replace("/")}
          />
          <Button
            label="View history"
            variant="secondary"
            theme={themeId}
            fullWidth
            onPress={() => router.replace("/history")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gameGlyph: { fontSize: 18, lineHeight: 22 },
  root: {
    flex: 1,
  },
  teardownRoot: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "space-between",
  },
  teardownCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  clockGraphicWrap: {
    width: 156,
    height: 156,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  clockRingOuter: {
    position: "absolute",
    width: 152,
    height: 152,
    borderRadius: 76,
    borderWidth: 1,
  },
  clockRingInner: {
    position: "absolute",
    width: 122,
    height: 122,
    borderRadius: 61,
    borderWidth: 1,
  },
  clockFaceBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    backgroundColor: "#F6EBD8",
    alignItems: "center",
    justifyContent: "center",
  },
  clockArmVertical: {
    position: "absolute",
    bottom: 42,
    width: 4,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#232437",
  },
  clockArmDiagonal: {
    position: "absolute",
    left: 42,
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#232437",
    transform: [{ rotate: "28deg" }],
  },
  clockPivot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  teardownTitle: {
    ...Typography.presets.display,
    textAlign: "center",
  },
  quoteText: {
    fontFamily: FontFamilies.display,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  quoteAuthor: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  teardownCard: {
    width: "100%",
    gap: 14,
    marginTop: 8,
  },
  teardownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  teardownIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  teardownIconText: {
    fontSize: 15,
  },
  teardownMeta: {
    flex: 1,
    gap: 2,
  },
  teardownItemTitle: {
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
  },
  teardownItemSub: {
    fontSize: Typography.sizes.caption,
  },
  checkMark: {
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 18,
  },
  summaryHeader: {
    gap: 4,
  },
  overline: {
    ...Typography.presets.overline,
  },
  heroHeadline: {
    ...Typography.presets.display,
  },
  summarySub: {
    fontSize: Typography.sizes.sm,
  },
  breakdownCard: {
    borderRadius: 22,
    borderWidth: 0,
    padding: 18,
    gap: 14,
  },
  cardHeading: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  segmentBar: {
    flexDirection: "row",
    height: 8,
    gap: 6,
  },
  segmentLeft: {
    flex: 1.6,
    borderRadius: 4,
  },
  segmentMid: {
    flex: 1,
    borderRadius: 4,
  },
  breakdownList: {
    gap: 14,
    marginTop: 4,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badgeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeEmoji: {
    fontSize: 16,
    fontWeight: "700",
  },
  breakdownMeta: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
  },
  rowSub: {
    fontSize: Typography.sizes.caption,
  },
  rowMetric: {
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
  },
  streakCard: {
    borderRadius: 22,
    borderWidth: 0,
    padding: 18,
    gap: 16,
  },
  streakHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakFlameBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  streakTextCol: {
    flex: 1,
    gap: 2,
  },
  streakTitle: {
    ...Typography.presets.title,
  },
  weekDotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  dayCol: {
    alignItems: "center",
    gap: 6,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  dayLabel: {
    fontSize: Typography.sizes.xs,
  },
  actionsWrap: {
    gap: 10,
    marginTop: 4,
  },
});
