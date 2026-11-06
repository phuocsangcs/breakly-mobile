// Daily streak pill synchronized from Figma "StreakChip" (node 47:1084).
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";

export interface StreakChipProps {
  days?: number;
  label?: string;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function StreakChip({
  days = 5,
  label,
  theme = "dark",
  style,
}: StreakChipProps) {
  const palette = getThemeColors(theme);
  const displayLabel = label ?? `${days} ${days === 1 ? "day" : "days"}`;

  return (
    <View style={[styles.chip, { backgroundColor: palette.surface2 }, style]}>
      {/* Flame Icon */}
      <View style={styles.flameIcon}>
        <View style={[styles.flameOuter, { backgroundColor: palette.accent }]} />
        <View style={[styles.flameInner, { backgroundColor: palette.surface2 }]} />
      </View>
      <Text style={[styles.label, { color: palette.text }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 38,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 6,
    alignSelf: "flex-start",
  },
  flameIcon: {
    width: 14,
    height: 16,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  flameOuter: {
    width: 11,
    height: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  flameInner: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 5,
    borderRadius: 2,
  },
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
    fontWeight: Typography.weights.semibold,
  },
});

