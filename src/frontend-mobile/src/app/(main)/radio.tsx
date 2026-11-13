import { FigmaImage } from "@/components/ui/FigmaImage";
import { ScreenGlow } from "@/components/ui/ScreenGlow";
// Radio screen synchronized with Figma "04 · Radio Track List" & "04b · Full Radio Player".
// Allows browsing category stations, playing tracks, and expanding into the full-screen player.
import React, { useEffect, useState } from "react";
import { AppText as Text } from "@/components/ui/AppText";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SessionTimerPill } from "@/components/ui/SessionTimerPill";
import { TrackRow } from "@/components/ui/TrackRow";
import {
  FontFamilies,
  getThemeColors,
  Radius,
  Spacing,
  Typography,
} from "@/constants/theme";
import { useMusicCategories, useMusicPlayer } from "@/features/music";
import { usePreferences } from "@/features/preferences";
import { formatMmSs, useSessionTimer } from "@/features/session";

export default function RadioScreen() {
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const {
    isActive,
    formattedRemaining,
    isFinalMinute,
    endSession,
  } = useSessionTimer();

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
    previous,
    playTrackAt,
    setVolume,
  } = useMusicPlayer();

  const [expanded, setExpanded] = useState(false);

  // Auto-load initial station queue if empty (without auto-playing until tapped)
  useEffect(() => {
    if (queue.length === 0 && !isLoadingQueue) {
      void selectCategory(category || "lofi", false);
    }
  }, [category, isLoadingQueue, queue.length, selectCategory]);

  const confirmEndEarly = () => {
    Alert.alert("End break early?", "Your break progress up to now will be saved.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End break",
        style: "destructive",
        onPress: () => void endSession("ENDED_EARLY"),
      },
    ]);
  };

  const activeCategoryTitle =
    categories.find((c) => c.category === category)?.title ?? "Lo-fi";
  const trackProgress =
    durationSec > 0 ? Math.max(0, Math.min(1, positionSec / durationSec)) : 0;

  // --- EXPANDED FULL PLAYER VIEW (Figma 04b) ---
  if (expanded && currentTrack) {
    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: palette.background,
            paddingTop: Math.max(insets.top + 9, 56),
            paddingBottom: Math.max(insets.bottom + 12, 24),
          },
        ]}
      >
        <ScreenGlow light={themeId === "garden"} />
        {/* Top Bar */}
        <View style={styles.topBar}>
          <IconButton
            icon="collapse"
            theme={themeId}
            onPress={() => setExpanded(false)}
            accessibilityLabel="Collapse player"
          />
          <View style={styles.playingFromWrap}>
            <Text style={[styles.playingFromOverline, { color: palette.textSecondary }]}>
              PLAYING FROM
            </Text>
            <Text style={[styles.playingFromValue, { color: palette.text }]}>
              Radio · {activeCategoryTitle}
            </Text>
          </View>
          {isActive ? (
            <SessionTimerPill
              time={formattedRemaining}
              highlighted={isFinalMinute}
              onEndPress={confirmEndEarly}
              theme={themeId}
            />
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>

        {/* Artwork Illustration / Image */}
        <View style={styles.expandedCenter}>
          <View
            style={[
              styles.heroArtCard,
              {
                backgroundColor:
                  themeId === "garden" ? "#CFE2EC" : "#2E3B61",
              },
            ]}
          >
            {currentTrack.artworkUrl ? (
              <Image
                source={{ uri: currentTrack.artworkUrl }}
                style={styles.heroArtImg}
              />
            ) : (
              <FigmaImage name="8-134-imgArt" width={326} height={326} style={{ maxWidth: "100%" }} />
            )}
          </View>

          {/* Title & Artist */}
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaText}>
              <Text style={[styles.heroTitle, { color: palette.text }]} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={[styles.heroArtist, { color: palette.textSecondary }]} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <Button
              label="Read News →"
              variant="secondary"
              size="md"
              theme={themeId}
              onPress={() => router.push("/news")}
            />
          </View>

          {/* Scrubber Bar */}
          <View style={styles.scrubberBlock}>
            <ProgressBar type="track" progress={trackProgress} theme={themeId} />
            <View style={styles.timeRow}>
              <Text style={[styles.timeText, { color: palette.textSecondary }]}>
                {formatMmSs(Math.floor(positionSec))}
              </Text>
              <Text style={[styles.timeText, { color: palette.textSecondary }]}>
                {formatMmSs(Math.floor(durationSec || currentTrack.durationSeconds))}
              </Text>
            </View>
          </View>

          {/* Transport Controls */}
          <View style={styles.transportRow}>
            <TouchableOpacity
              onPress={previous}
              activeOpacity={0.75}
              style={styles.skipBtn}
              accessibilityLabel="Previous track"
            >
              <View style={styles.skipGlyph}>
                <View style={[styles.skipBar, { backgroundColor: palette.text }]} />
                <Text style={[styles.skipArrow, { color: palette.text }]}>◂</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => void togglePlay()}
              activeOpacity={0.85}
              style={[styles.bigPlayBtn, { backgroundColor: palette.accent }]}
              accessibilityLabel={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <View style={styles.bigPauseBars}>
                  <View style={[styles.bigPauseBar, { backgroundColor: palette.onAccent }]} />
                  <View style={[styles.bigPauseBar, { backgroundColor: palette.onAccent }]} />
                </View>
              ) : (
                <Text style={[styles.bigPlayGlyph, { color: palette.onAccent }]}>
                  ▸
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={next}
              activeOpacity={0.75}
              style={styles.skipBtn}
              accessibilityLabel="Next track"
            >
              <View style={styles.skipGlyph}>
                <Text style={[styles.skipArrow, { color: palette.text }]}>▸</Text>
                <View style={[styles.skipBar, { backgroundColor: palette.text }]} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Volume Row */}
          <View style={styles.volumeRow}>
            <TouchableOpacity
              onPress={() => setVolume(volume - 10)}
              style={[styles.volStepBtn, { backgroundColor: palette.surface2 }]}
            >
              <Text style={[styles.volStepText, { color: palette.text }]}>−</Text>
            </TouchableOpacity>
            <View style={styles.volBarWrap}>
              <ProgressBar
                type="break"
                progress={volume / 100}
                theme={themeId}
              />
            </View>
            <TouchableOpacity
              onPress={() => setVolume(volume + 10)}
              style={[styles.volStepBtn, { backgroundColor: palette.surface2 }]}
            >
              <Text style={[styles.volStepText, { color: palette.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Info Pill */}
        <View
          style={[
            styles.infoBanner,
            { backgroundColor: palette.surface, borderColor: palette.line },
          ]}
        >
          <Text style={[styles.infoIcon, { color: palette.accent }]}>♫</Text>
          <Text style={[styles.infoText, { color: palette.textSecondary }]}>
            Keeps playing while you read the news.{"\n"}Stops when your break ends.
          </Text>
        </View>
      </View>
    );
  }

  // --- STATION & TRACK LIST VIEW (Figma 04) ---
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: palette.background,
          paddingTop: Math.max(insets.top + 9, 56),
        },
      ]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <IconButton
          icon="back"
          theme={themeId}
          onPress={() => router.back()}
          accessibilityLabel="Back to room"
        />
        {isActive ? (
          <SessionTimerPill
            time={formattedRemaining}
            highlighted={isFinalMinute}
            onEndPress={confirmEndEarly}
            theme={themeId}
          />
        ) : null}
      </View>

      {/* Editorial Heading */}
      <View style={styles.headingBlock}>
        <Text style={[styles.pageTitle, { color: palette.text }]}>Radio</Text>
        <Text style={[styles.pageSubtitle, { color: palette.textSecondary }]}>
          Keeps playing while you read or watch.
        </Text>
      </View>

      {/* Station Category Filter Chips */}
      <View style={styles.chipsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.title}
              selected={category === c.category}
              theme={themeId}
              onPress={() => void selectCategory(c.category, true)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Track Queue */}
      {isLoadingQueue && queue.length === 0 ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={palette.accent} />
          <Text style={[styles.stateText, { color: palette.textSecondary }]}>
            Tuning {activeCategoryTitle} station...
          </Text>
        </View>
      ) : error && queue.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={[styles.stateText, { color: palette.danger }]}>
            {error}
          </Text>
          <Button
            label="Retry"
            size="md"
            theme={themeId}
            onPress={() => void selectCategory(category, false)}
          />
        </View>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: currentTrack ? 120 : 32 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isCurrent = currentTrack?.id === item.id;
            return (
              <TrackRow
                title={item.title}
                artist={item.artist}
                durationText={
                  item.durationSeconds
                    ? formatMmSs(Math.floor(item.durationSeconds))
                    : undefined
                }
                artworkUrl={item.artworkUrl}
                playing={isCurrent && isPlaying}
                theme={themeId}
                onPress={() => {
                  if (isCurrent) {
                    void togglePlay();
                  } else {
                    playTrackAt(index);
                  }
                }}
              />
            );
          }}
        />
      )}

      {/* Floating MiniPlayer pinned at bottom (tap to expand full player) */}
      {currentTrack ? (
        <View
          style={[
            styles.miniPlayerDock,
            { paddingBottom: Math.max(insets.bottom - 6, 28) },
          ]}
        >
          <MiniPlayer theme={themeId} onPress={() => setExpanded(true)} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerSpacer: {
    width: 44,
  },
  headingBlock: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 4,
  },
  pageTitle: {
    ...Typography.presets.h1,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  chipsWrap: {
    paddingVertical: 20,
  },
  chipsScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 4,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  stateText: {
    fontSize: Typography.sizes.sm,
    textAlign: "center",
  },
  miniPlayerDock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
  },
  playingFromWrap: {
    alignItems: "center",
  },
  playingFromOverline: {
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: "600",
  },
  playingFromValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
  },
  expandedCenter: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-evenly",
  },
  heroArtCard: {
    width: "100%",
    aspectRatio: 1,
    maxHeight: 326,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroArtImg: {
    width: "100%",
    height: "100%",
  },
  cozyWindowIllustration: {
    alignItems: "center",
    justifyContent: "center",
  },
  artWindowFrame: {
    width: 170,
    height: 150,
    borderRadius: 16,
    borderWidth: 8,
    borderColor: "#D6A156",
    backgroundColor: "#253357",
    justifyContent: "flex-end",
    padding: 12,
  },
  artWindowMoon: {
    position: "absolute",
    top: 16,
    right: 22,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5D98C",
  },
  artWindowMug: {
    position: "absolute",
    bottom: 10,
    left: 24,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#F4EAD3",
  },
  artWindowPlant: {
    position: "absolute",
    bottom: 10,
    right: 24,
    width: 22,
    height: 26,
    borderRadius: 4,
    backgroundColor: "#B35A36",
  },
  artWindowSill: {
    width: 196,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#A66A3E",
    marginTop: -2,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heroMetaText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontFamily: FontFamilies.display,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "600",
  },
  heroArtist: {
    fontSize: Typography.sizes.md,
  },
  scrubberBlock: {
    gap: 6,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: Typography.sizes.xs,
    fontVariant: ["tabular-nums"],
  },
  transportRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 36,
  },
  skipBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  skipGlyph: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipBar: {
    width: 3,
    height: 16,
    borderRadius: 1.5,
  },
  skipArrow: {
    fontSize: 24,
    lineHeight: 26,
  },
  bigPlayBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  bigPauseBars: {
    flexDirection: "row",
    gap: 7,
  },
  bigPauseBar: {
    width: 6,
    height: 22,
    borderRadius: 2,
  },
  bigPlayGlyph: {
    fontSize: 30,
    marginLeft: 4,
  },
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  volStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  volStepText: {
    fontSize: 18,
    fontWeight: "600",
  },
  volBarWrap: {
    flex: 1,
  },
  infoBanner: {
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.caption,
    lineHeight: 18,
  },
});
