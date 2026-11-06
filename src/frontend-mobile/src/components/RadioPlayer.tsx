// Composed ambient audio player component synchronized with Figma "Music Radio" & UI Kit tokens (FR 4.1–4.3).
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { getThemeColors, Radius, Spacing, Typography } from "@/constants/theme";
import { useMusicCategories, useMusicPlayer } from "@/features/music";
import { usePreferencesStore } from "@/features/preferences";
import { formatMmSs } from "@/features/session";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Chip } from "./ui/Chip";
import { ProgressBar } from "./ui/ProgressBar";
import { TrackRow } from "./ui/TrackRow";

export function RadioPlayer() {
  const { categories } = useMusicCategories();
  const {
    category,
    queue,
    currentTrack,
    isPlaying,
    isLoadingQueue,
    error,
    positionSec,
    durationSec,
    volume,
    selectCategory,
    togglePlay,
    next,
    setVolume,
  } = useMusicPlayer();
  const themeId = usePreferencesStore((s) => s.themeId);
  const palette = getThemeColors(themeId);

  const progress =
    durationSec > 0 ? Math.max(0, Math.min(1, positionSec / durationSec)) : 0;

  return (
    <Card theme={themeId} style={styles.card}>
      <Text style={[styles.heading, { color: palette.text }]}>Music Radio</Text>

      {/* Category Filter Chips matching Figma Chip (47:434) */}
      <View style={styles.chips}>
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={c.title}
            selected={category === c.category}
            theme={themeId}
            onPress={() => void selectCategory(c.category, true)}
          />
        ))}
      </View>

      {isLoadingQueue ? (
        <ActivityIndicator size="small" color={palette.accent} />
      ) : null}
      {error ? (
        <Text style={[styles.error, { color: palette.danger }]}>{error}</Text>
      ) : null}

      {currentTrack ? (
        <View style={styles.trackBox}>
          <View style={[styles.artworkWrap, { backgroundColor: palette.artworkBg }]}>
            {currentTrack.artworkUrl ? (
              <Image
                source={{ uri: currentTrack.artworkUrl }}
                style={styles.artwork}
              />
            ) : (
              <View style={[styles.artworkDot, { backgroundColor: palette.accent }]} />
            )}
          </View>

          <Text style={[styles.title, { color: palette.text }]}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.artist, { color: palette.textSecondary }]}>
            {currentTrack.artist}
          </Text>

          <View style={styles.scrubberSection}>
            <ProgressBar type="track" progress={progress} theme={themeId} />
            <View style={styles.timeRow}>
              <Text style={[styles.time, { color: palette.textSecondary }]}>
                {formatMmSs(Math.floor(positionSec))}
              </Text>
              <Text style={[styles.time, { color: palette.textSecondary }]}>
                {formatMmSs(Math.floor(durationSec))}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={[styles.artist, { color: palette.textSecondary }]}>
          Select a station or tap Play to begin
        </Text>
      )}

      <View style={styles.controls}>
        <Button
          label={isPlaying ? "Pause" : "Play"}
          theme={themeId}
          onPress={() => void togglePlay()}
          style={styles.mainBtn}
        />
        <Button
          label="Next Track"
          variant="secondary"
          theme={themeId}
          onPress={next}
          style={styles.mainBtn}
        />
      </View>

      <View style={styles.volumeRow}>
        <Button
          label="Vol −"
          size="md"
          variant="ghost"
          theme={themeId}
          onPress={() => setVolume(volume - 10)}
        />
        <Text style={[styles.artist, { color: palette.textSecondary }]}>
          Volume: {volume}%
        </Text>
        <Button
          label="Vol +"
          size="md"
          variant="ghost"
          theme={themeId}
          onPress={() => setVolume(volume + 10)}
        />
      </View>

      {/* Queue Preview using Figma TrackRow (47:550) */}
      {queue && queue.length > 0 ? (
        <View style={styles.queueSection}>
          <Text style={[styles.queueHeading, { color: palette.textSecondary }]}>
            UP NEXT IN ROOM
          </Text>
          {queue.slice(0, 4).map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <TrackRow
                key={track.id}
                title={track.title}
                artist={track.artist}
                durationText={
                  track.durationSeconds ? formatMmSs(Math.floor(track.durationSeconds)) : undefined
                }
                artworkUrl={track.artworkUrl}
                playing={isCurrent && isPlaying}
                theme={themeId}
                onPress={isCurrent ? () => void togglePlay() : undefined}
              />
            );
          })}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  heading: {
    ...Typography.presets.title,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  trackBox: {
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  artworkWrap: {
    width: 148,
    height: 148,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: Spacing.xs,
  },
  artwork: {
    width: 148,
    height: 148,
  },
  artworkDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  title: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.lg,
    fontWeight: Typography.weights.semibold,
    textAlign: "center",
  },
  artist: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    textAlign: "center",
  },
  scrubberSection: {
    width: "100%",
    marginTop: Spacing.sm,
    gap: 6,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    fontVariant: ["tabular-nums"],
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  mainBtn: {
    flex: 1,
  },
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  queueSection: {
    marginTop: Spacing.xs,
    gap: 6,
  },
  queueHeading: {
    ...Typography.presets.overline,
    marginBottom: 4,
  },
  error: {
    fontSize: Typography.sizes.caption,
  },
});
