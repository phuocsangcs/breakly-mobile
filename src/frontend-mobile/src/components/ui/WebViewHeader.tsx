// In-app browser header bar synchronized from Figma "WebViewHeader" (node 47:704).
// Includes a 40x40 back button, page title + SSL lock domain, SessionTimerPill, and optional loading progress bar.
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";
import { IconButton } from "./IconButton";
import { ProgressBar } from "./ProgressBar";
import { SessionTimerPill } from "./SessionTimerPill";

export interface WebViewHeaderProps {
  title: string;
  domain?: string;
  timerText?: string;
  timerHighlighted?: boolean;
  loading?: boolean;
  loadingProgress?: number;
  onBackPress?: () => void;
  onEndSessionPress?: () => void;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function WebViewHeader({
  title,
  domain,
  timerText = "07:42",
  timerHighlighted = false,
  loading = false,
  loadingProgress = 0.42,
  onBackPress,
  onEndSessionPress,
  theme = "dark",
  style,
}: WebViewHeaderProps) {
  const palette = getThemeColors(theme);

  return (
    <View style={[styles.wrapper, { backgroundColor: palette.background }, style]}>
      <View style={styles.bar}>
        <IconButton
          icon="back"
          size={40}
          theme={theme}
          onPress={onBackPress}
          accessibilityLabel="Back to room"
        />

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: palette.text }]} numberOfLines={1}>
            {title}
          </Text>
          {domain ? (
            <View style={styles.domainRow}>
              <View style={[styles.lockBody, { borderColor: palette.textSecondary }]} />
              <Text
                style={[styles.domain, { color: palette.textSecondary }]}
                numberOfLines={1}
              >
                {domain}
              </Text>
            </View>
          ) : null}
        </View>

        <SessionTimerPill
          time={timerText}
          highlighted={timerHighlighted}
          onEndPress={onEndSessionPress}
          theme={theme}
        />
      </View>

      {loading ? (
        <ProgressBar
          type="loading"
          progress={loadingProgress}
          theme={theme}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    paddingHorizontal: 20,
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: Typography.sizes.md,
    lineHeight: 20,
    fontWeight: Typography.weights.semibold,
  },
  domainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  lockBody: {
    width: 9,
    height: 9,
    borderRadius: 2,
    borderWidth: 1.3,
  },
  domain: {
    fontSize: Typography.sizes.xs,
    lineHeight: 16,
    fontWeight: Typography.weights.regular,
  },
});

