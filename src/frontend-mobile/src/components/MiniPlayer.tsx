import { FigmaImage } from "./ui/FigmaImage";
// Compact floating mini-player bar synchronized from Figma "Mini-player" (node 47:624).
// Shown on non-Radio screens while a music track is active (FR 4.3).
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { router } from "expo-router";
import { BreaklyThemeId, getThemeColors, Radius, ThemeMode, Typography } from "@/constants/theme";
import { useMusicPlayer } from "@/features/music";
import { usePreferencesStore } from "@/features/preferences";

export interface MiniPlayerProps {
  theme?: ThemeMode | BreaklyThemeId;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function MiniPlayer({ theme, onPress, style }: MiniPlayerProps) {
  const { currentTrack, isPlaying, positionSec, durationSec, togglePlay, next } =
    useMusicPlayer();
  const storedThemeId = usePreferencesStore((s) => s.themeId);
  const resolvedTheme = theme ?? storedThemeId;
  const palette = getThemeColors(resolvedTheme);
  const isLight = resolvedTheme === "light" || resolvedTheme === "garden";

  if (!currentTrack) return null;

  const handleOpen = onPress ?? (() => router.push("/radio"));

  const progressRatio =
    durationSec > 0 ? Math.max(0, Math.min(1, positionSec / durationSec)) : 0.35;
  const subtitle = isPlaying
    ? currentTrack.artist
    : `Paused · ${currentTrack.artist}`;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: isLight ? palette.surface : palette.surface2,
          borderColor: palette.line,
        },
        style,
      ]}
    >
      {/* 44x44 Artwork */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleOpen}
        style={[styles.artworkBox, { backgroundColor: palette.artworkBg }]}
      >
        {currentTrack.artworkUrl ? (
          <Image
            source={{ uri: currentTrack.artworkUrl }}
            style={styles.artworkImage}
          />
        ) : (
          <FigmaImage name="8-229-imgArt" />
        )}
      </TouchableOpacity>

      {/* Track Title & Subtitle */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.info}
        onPress={handleOpen}
      >
        <Text style={[styles.title, { color: palette.text }]} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text
          style={[styles.artist, { color: palette.textSecondary }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </TouchableOpacity>

      {/* Play / Pause Button */}
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.iconBtn}
        onPress={() => void togglePlay()}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
      >
        <FigmaImage name={`${isLight ? "12-541" : "8-2"}-${isPlaying ? "imgIconPause" : "imgIconPlay"}`} />
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.iconBtn}
        onPress={next}
        accessibilityRole="button"
        accessibilityLabel="Next track"
      >
        <FigmaImage name={isLight ? "12-541-imgIconNext" : "8-2-imgIconNext"} />
      </TouchableOpacity>

      {/* Bottom 3px Progress Bar */}
      <View
        style={[
          styles.progressTrack,
          {
            backgroundColor: isLight
              ? palette.surface2
              : "rgba(255, 246, 232, 0.08)",
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.round(progressRatio * 100)}%`,
              backgroundColor: palette.accent,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingVertical: 9,
    paddingLeft: 10,
    paddingRight: 18,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    gap: 14,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
  },
  artworkBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  artworkImage: {
    width: 44,
    height: 44,
  },
  artworkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.semibold,
  },
  artist: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.regular,
  },
  iconBtn: {
    width: 22,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pauseBars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pauseBar: {
    width: 3.5,
    height: 14,
    borderRadius: 1.5,
  },
  playGlyph: {
    fontSize: 18,
    lineHeight: 20,
  },
  nextGlyphWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextGlyph: {
    fontSize: 15,
    lineHeight: 16,
  },
  nextEndBar: {
    width: 2,
    height: 11,
    borderRadius: 1,
    marginLeft: -1,
  },
  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
  },
  progressFill: {
    height: 3,
  },
});
