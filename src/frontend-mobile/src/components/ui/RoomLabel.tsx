import { FigmaImage } from "./FigmaImage";
// Interactive room hotspot pill synchronized from Figma "RoomLabel" (node 47:1030).
// Supports "music", "news", and "videos" hotspot types across Dark and Light themes.
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";

export type RoomLabelKind = "music" | "news" | "videos";

export interface RoomLabelProps {
  kind?: RoomLabelKind;
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_LABELS: Record<RoomLabelKind, string> = {
  music: "Music",
  news: "News",
  videos: "Videos",
};

export function RoomLabel({
  kind = "music",
  label,
  onPress,
  disabled = false,
  theme = "dark",
  style,
}: RoomLabelProps) {
  const palette = getThemeColors(theme);
  const displayLabel = label ?? DEFAULT_LABELS[kind];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.pill,
        {
          backgroundColor: palette.roomLabelBg,
          opacity: disabled ? 0.55 : 1,
        },
        style,
      ]}
    >
      <FigmaImage name={`${theme === "light" || theme === "garden" ? "2-195" : "2-2"}-${kind === "music" ? "imgIconMusic" : kind === "news" ? "imgIconNews" : "imgIconTv"}`} />

      <Text style={[styles.label, { color: palette.roomLabelText }]}>
        {displayLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 96,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  iconBox: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlyph: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  newsIconRect: {
    width: 13,
    height: 11,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  newsIconLine: {
    width: 7,
    height: 1.5,
    borderRadius: 1,
  },
  videoIconRect: {
    width: 14,
    height: 11,
    borderWidth: 1.5,
    borderRadius: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  playGlyph: {
    fontSize: 9,
    lineHeight: 10,
  },
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
    fontWeight: Typography.weights.semibold,
  },
});

