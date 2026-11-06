// Interactive virtual space scene with Radio (Music), Newspaper (News) and TV (Short Videos) hotspots (FR 3.1–3.2).
// Synchronized with Figma "03 · Home Space – Cozy chill room" & "03b · Home Space – Normal" and RoomLabel (47:1030).
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getThemeColors, Radius, Spacing, Typography } from "@/constants/theme";
import type { ThemeId } from "@/features/preferences";
import type { ServiceType } from "@/features/session";
import { RoomLabel, RoomLabelKind } from "./ui/RoomLabel";

export interface SpaceViewProps {
  themeId?: ThemeId;
  onSelectObject?: (service: ServiceType) => void;
}

interface HotspotItem {
  service: ServiceType;
  kind: RoomLabelKind;
  pillLabel: string;
  title: string;
  sub: string;
  badgeBg: string;
}

export function SpaceView({ themeId = "cozy-room", onSelectObject }: SpaceViewProps) {
  const palette = getThemeColors(themeId);
  const isLight = themeId === "garden";

  const themeBadgeLabel = isLight ? "NORMAL · DAYLIGHT GARDEN" : "COZY CHILL ROOM";
  const roomHeading = isLight ? "Breathe & unwind" : "Your cozy corner";

  const items: HotspotItem[] = [
    {
      service: "MUSIC",
      kind: "music",
      pillLabel: "Music",
      title: "Music (Radio)",
      sub: "Lo-fi beats, rain & ambient chill",
      badgeBg: isLight ? "#D8E8E2" : "#3E4A7A",
    },
    {
      service: "NEWS",
      kind: "news",
      pillLabel: "News",
      title: "Mindful News",
      sub: "Curated VnExpress stories & quick reads",
      badgeBg: isLight ? "#EDE2D0" : "#493850",
    },
    {
      service: "VIDEO",
      kind: "videos",
      pillLabel: "Videos",
      title: "Short & Long Videos",
      sub: "Relaxing visuals & curated clips",
      badgeBg: isLight ? "#E2E6D8" : "#384B4E",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.surface,
          borderColor: palette.line,
        },
      ]}
    >
      {/* Room Header */}
      <View style={styles.headerBlock}>
        <Text style={[styles.overline, { color: palette.accent }]}>
          {themeBadgeLabel}
        </Text>
        <Text style={[styles.themeTitle, { color: palette.text }]}>
          {roomHeading}
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          Tap a hotspot in your room to begin or continue your break
        </Text>
      </View>

      {/* Quick Floating RoomLabel Bar matching Figma 47:1030 */}
      <View style={styles.pillRow}>
        {items.map((it) => (
          <RoomLabel
            key={it.service}
            kind={it.kind}
            label={it.pillLabel}
            theme={themeId}
            onPress={() => onSelectObject?.(it.service)}
          />
        ))}
      </View>

      {/* Interactive Object Cards */}
      <View style={styles.grid}>
        {items.map((it) => (
          <TouchableOpacity
            key={it.service}
            activeOpacity={0.85}
            style={[
              styles.hotspot,
              {
                backgroundColor: palette.surface2,
                borderColor: palette.line,
              },
            ]}
            onPress={() => onSelectObject?.(it.service)}
          >
            <View style={[styles.objectBadge, { backgroundColor: it.badgeBg }]}>
              <Text style={[styles.objectGlyph, { color: palette.accent }]}>
                {it.kind === "music" ? "♫" : it.kind === "news" ? "📰" : "▸"}
              </Text>
            </View>
            <View style={styles.hotspotText}>
              <Text style={[styles.label, { color: palette.text }]}>
                {it.title}
              </Text>
              <Text style={[styles.sub, { color: palette.textSecondary }]}>
                {it.sub}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: palette.textSecondary }]}>
              ›
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  headerBlock: {
    alignItems: "center",
    gap: 4,
  },
  overline: {
    ...Typography.presets.overline,
  },
  themeTitle: {
    ...Typography.presets.h2,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.presets.caption,
    textAlign: "center",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  grid: {
    width: "100%",
    gap: Spacing.sm,
  },
  hotspot: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: 14,
  },
  objectBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  objectGlyph: {
    fontSize: 20,
    fontWeight: "700",
  },
  hotspotText: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
  },
  sub: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  chevron: {
    fontSize: 20,
    fontWeight: "600",
  },
});
