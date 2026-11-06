// Non-blocking notification banner synchronized from Figma "Toast" (node 47:728).
// Features a 36x36 circular accent icon badge, bold title, and muted subtitle.
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, ThemeMode, Typography } from "@/constants/theme";

export interface ToastProps {
  /** Primary title (defaults to "1 minute left" when subtitle/message is provided, or displays message directly) */
  title?: string;
  /** Subtitle / detailed message (e.g. "Wrap up softly — we'll fade out soon.") */
  message: string;
  /** Optional visibility flag */
  visible?: boolean;
  /** Theme mode ("dark" | "light" | "cozy-room" | "garden") */
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function Toast({
  title = "1 minute left",
  message,
  visible = true,
  theme = "dark",
  style,
}: ToastProps) {
  if (!visible) return null;

  const palette = getThemeColors(theme);

  return (
    <View
      style={[
        styles.toast,
        {
          backgroundColor: palette.surface,
          borderColor: palette.line,
        },
        style,
      ]}
    >
      {/* Left 36x36 Accent Badge with Timer Icon */}
      <View style={[styles.badge, { backgroundColor: palette.accent }]}>
        <View style={[styles.clockIcon, { borderColor: palette.onAccent }]}>
          <View style={[styles.clockHand, { backgroundColor: palette.onAccent }]} />
        </View>
      </View>

      {/* Text Stack */}
      <View style={styles.textColumn}>
        {title ? (
          <Text style={[styles.title, { color: palette.text }]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        <Text style={[styles.subtitle, { color: palette.textSecondary }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 65,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  clockIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.6,
    alignItems: "center",
    justifyContent: "center",
  },
  clockHand: {
    width: 1.6,
    height: 5,
    borderRadius: 1,
    marginBottom: 2,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
  },
  subtitle: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.regular,
  },
});
