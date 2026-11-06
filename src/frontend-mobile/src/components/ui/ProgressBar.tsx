// Progress bar synchronized from Figma "ProgressBar" (node 47:1114).
// Supports "break" (6px height), "track" (4px height + 14x14 scrubber knob), and "loading" (3px height).
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode } from "@/constants/theme";

export type ProgressBarType = "break" | "track" | "loading";

export interface ProgressBarProps {
  /** Progress ratio between 0 and 1 */
  progress: number;
  type?: ProgressBarType;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  progress,
  type = "break",
  theme = "dark",
  style,
}: ProgressBarProps) {
  const palette = getThemeColors(theme);
  const clamped = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  const percent = `${Math.round(clamped * 100)}%` as const;

  if (type === "track") {
    return (
      <View style={[styles.trackWrapper, style]}>
        <View style={[styles.trackRail, { backgroundColor: palette.surface2 }]}>
          <View
            style={[
              styles.trackFill,
              { width: percent, backgroundColor: palette.accent },
            ]}
          />
        </View>
        <View
          style={[
            styles.knob,
            {
              left: percent,
              backgroundColor: palette.accent,
            },
          ]}
        />
      </View>
    );
  }

  const height = type === "loading" ? 3 : 6;
  const radius = height / 2;

  return (
    <View
      style={[
        styles.barRail,
        {
          height,
          borderRadius: radius,
          backgroundColor: palette.surface2,
        },
        style,
      ]}
    >
      <View
        style={{
          width: percent,
          height,
          borderRadius: radius,
          backgroundColor: palette.accent,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  barRail: {
    width: "100%",
    overflow: "hidden",
  },
  trackWrapper: {
    width: "100%",
    height: 14,
    justifyContent: "center",
  },
  trackRail: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
  },
  knob: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
  },
});

