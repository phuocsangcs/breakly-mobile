// Floating pill-shaped countdown indicator synchronized from Figma "TimerChip" (node 47:418).
// Supports Normal and Warning (highlighted / 1-minute left) states across Dark and Light themes.
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";

export interface SessionTimerPillProps {
  /** Formatted time string, e.g. "07:42" or "00:54" */
  time?: string;
  /** Whether the session is in its final warning minute (Figma State=Warning) */
  highlighted?: boolean;
  /** Optional callback to end the session early or handle tap */
  onEndPress?: () => void;
  /** Optional label for the end button when shown */
  endLabel?: string;
  /** Theme mode ("dark" | "light" | "cozy-room" | "garden") */
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function SessionTimerPill({
  time = "07:42",
  highlighted = false,
  onEndPress,
  endLabel = "End",
  theme = "dark",
  style,
}: SessionTimerPillProps) {
  const palette = getThemeColors(theme);

  const bgColor = highlighted ? palette.accent : palette.surface2;
  const iconColor = highlighted ? palette.onAccent : palette.accent;
  const textColor = highlighted ? palette.onAccent : palette.text;

  return (
    <View style={[styles.pill, { backgroundColor: bgColor }, style]}>
      {/* Timer Clock Icon (14x14 matching Figma Vector) */}
      <View style={[styles.clockCircle, { borderColor: iconColor }]}>
        <View style={[styles.clockHandVertical, { backgroundColor: iconColor }]} />
        <View style={[styles.clockHandHorizontal, { backgroundColor: iconColor }]} />
      </View>

      <Text style={[styles.time, { color: textColor }]}>{time}</Text>

      {onEndPress ? (
        <TouchableOpacity
          onPress={onEndPress}
          activeOpacity={0.75}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 8 }}
          style={[
            styles.endBtn,
            {
              borderLeftColor: highlighted
                ? "rgba(43, 34, 56, 0.25)"
                : palette.line,
            },
          ]}
        >
          <Text
            style={[
              styles.endText,
              { color: highlighted ? palette.onAccent : palette.danger },
            ]}
          >
            {endLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 38,
    paddingVertical: 9,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 18,
    gap: 6,
    alignSelf: "flex-start",
  },
  clockCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  clockHandVertical: {
    width: 1.5,
    height: 4,
    borderRadius: 1,
    marginBottom: 2,
  },
  clockHandHorizontal: {
    position: "absolute",
    width: 3.5,
    height: 1.5,
    borderRadius: 1,
    right: 2,
  },
  time: {
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
    fontVariant: ["tabular-nums"],
  },
  endBtn: {
    marginLeft: 4,
    paddingLeft: 8,
    borderLeftWidth: 1,
  },
  endText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});
