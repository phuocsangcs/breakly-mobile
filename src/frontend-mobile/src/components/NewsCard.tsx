// Composed news item card previewing title, source, publication time and thumbnail (FR 5.1).
// Synchronized with Figma "05 · News List" card tokens.
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, Spacing, ThemeMode, Typography } from "@/constants/theme";
import { usePreferencesStore } from "@/features/preferences";
import { Card } from "./ui/Card";

export interface NewsCardProps {
  title?: string;
  category?: string;
  summary?: string;
  imageUrl?: string | null;
  publishedAt?: string;
  onPress?: () => void;
  theme?: ThemeMode | BreaklyThemeId;
}

export function NewsCard({
  title = "Mindfulness in 3 minutes",
  category = "Wellness",
  summary,
  imageUrl,
  publishedAt,
  onPress,
  theme,
}: NewsCardProps) {
  const storedThemeId = usePreferencesStore((s) => s.themeId);
  const resolvedTheme = theme ?? storedThemeId;
  const palette = getThemeColors(resolvedTheme);

  const formattedTime = publishedAt
    ? new Date(publishedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
    >
      <Card theme={resolvedTheme} style={styles.card}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.thumb} />
        ) : (
          <View
            style={[
              styles.thumbPlaceholder,
              { backgroundColor: palette.surface2 },
            ]}
          >
            <View
              style={[styles.thumbAccentDot, { backgroundColor: palette.accent }]}
            />
          </View>
        )}
        <View style={styles.body}>
          <Text style={[styles.category, { color: palette.accent }]}>
            {category.toUpperCase()}
            {formattedTime ? ` · ${formattedTime}` : ""}
          </Text>
          <Text style={[styles.title, { color: palette.text }]} numberOfLines={2}>
            {title}
          </Text>
          {summary ? (
            <Text
              style={[styles.summary, { color: palette.textSecondary }]}
              numberOfLines={2}
            >
              {summary}
            </Text>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: Radius.sm,
  },
  thumbPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbAccentDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  body: {
    flex: 1,
    gap: Spacing.xs,
  },
  category: {
    ...Typography.presets.overline,
  },
  title: {
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
  },
  summary: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
});
