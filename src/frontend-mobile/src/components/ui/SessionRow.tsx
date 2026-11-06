// History session row synchronized from Figma "SessionRow" (node 47:864).
// Displays a 48x48 duration badge on the left, time range + used services in the middle, and a chevron on the right.
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, ThemeMode, Typography } from "@/constants/theme";

export interface SessionRowProps {
  /** Duration in minutes (e.g. 20) */
  durationMinutes: number;
  /** Formatted time range (e.g. "2:15 PM – 2:35 PM") */
  timeRange: string;
  /** Subtitle describing activities or status (e.g. "Music · News · Read") */
  subtitle?: string;
  onPress?: () => void;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function SessionRow({
  durationMinutes,
  timeRange,
  subtitle = "Break session",
  onPress,
  theme = "dark",
  style,
}: SessionRowProps) {
  const palette = getThemeColors(theme);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.row,
        { backgroundColor: palette.surface },
        style,
      ]}
    >
      {/* Left 48x48 Duration Badge */}
      <View style={[styles.badge, { backgroundColor: palette.surface2 }]}>
        <Text style={[styles.minutesText, { color: palette.accent }]}>
          {durationMinutes}
        </Text>
        <Text style={[styles.minUnit, { color: palette.textSecondary }]}>min</Text>
      </View>

      {/* Center Metadata */}
      <View style={styles.body}>
        <Text style={[styles.timeRange, { color: palette.text }]} numberOfLines={1}>
          {timeRange}
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {/* Right Chevron */}
      <Text style={[styles.chevron, { color: palette.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.xl,
    gap: 14,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  minutesText: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: Typography.weights.semibold,
  },
  minUnit: {
    fontSize: Typography.sizes.xxs,
    lineHeight: 12,
    fontWeight: Typography.weights.medium,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  timeRange: {
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
  },
  subtitle: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.regular,
  },
  chevron: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "600",
  },
});

