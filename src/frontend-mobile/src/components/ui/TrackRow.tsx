// Audio track list row synchronized from Figma "Track row" (node 47:550).
// Supports Default and Playing states across Dark (Cozy) and Light (Normal) themes.
import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, ThemeMode, Typography } from "@/constants/theme";

export interface TrackRowProps {
  title: string;
  artist: string;
  durationText?: string;
  artworkUrl?: string | null;
  playing?: boolean;
  onPress?: () => void;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function TrackRow({
  title,
  artist,
  durationText,
  artworkUrl,
  playing = false,
  onPress,
  theme = "dark",
  style,
}: TrackRowProps) {
  const palette = getThemeColors(theme);
  const subtitle = durationText ? `${artist} · ${durationText}` : artist;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.row,
        playing && { backgroundColor: palette.surface },
        style,
      ]}
    >
      {/* 52x52 Artwork */}
      <View style={[styles.artworkBox, { backgroundColor: palette.artworkBg }]}>
        {artworkUrl ? (
          <Image source={{ uri: artworkUrl }} style={styles.artworkImage} />
        ) : (
          <View style={[styles.artworkDot, { backgroundColor: palette.accent }]} />
        )}
      </View>

      {/* Track Metadata */}
      <View style={styles.meta}>
        <Text
          style={[
            styles.title,
            { color: playing ? palette.accent : palette.text },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: palette.textSecondary }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>

      {/* Right Action: Equalizer bars when playing, or 36x36 Play button when idle */}
      {playing ? (
        <View style={styles.eqWrap}>
          <View style={[styles.eqBar, styles.eqBarShort, { backgroundColor: palette.accent }]} />
          <View style={[styles.eqBar, styles.eqBarTall, { backgroundColor: palette.accent }]} />
          <View style={[styles.eqBar, styles.eqBarMid, { backgroundColor: palette.accent }]} />
        </View>
      ) : (
        <View style={[styles.playCircle, { borderColor: palette.line }]}>
          <Text style={[styles.playIcon, { color: palette.text }]}>▸</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: Radius.lg,
    gap: 14,
  },
  artworkBox: {
    width: 52,
    height: 52,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  artworkImage: {
    width: 52,
    height: 52,
  },
  artworkDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: Typography.sizes.md,
    lineHeight: 20,
    fontWeight: Typography.weights.semibold,
  },
  subtitle: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.regular,
  },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 13,
    marginLeft: 2,
  },
  eqWrap: {
    width: 36,
    height: 36,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 9,
    gap: 3,
  },
  eqBar: {
    width: 3,
    borderRadius: 1.5,
  },
  eqBarShort: {
    height: 10,
  },
  eqBarTall: {
    height: 16,
  },
  eqBarMid: {
    height: 12,
  },
});

