import { FigmaImage } from "@/components/ui/FigmaImage";
import { ScreenGlow } from "@/components/ui/ScreenGlow";
import { WebViewHeader } from "@/components/ui/WebViewHeader";
// TV screen synchronized with Figma "06 · Videos Player" (Shorts vertical feed + End Card + Long Videos).
// Automatically pauses music on enter and resumes on exit (FR 4.5), displaying the paused notice pill & MiniPlayer.
import React, { useState } from "react";
import { AppText as Text } from "@/components/ui/AppText";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  FontFamilies,
  getThemeColors,
  Radius,
  Spacing,
  Typography,
} from "@/constants/theme";
import { useMusicPlayer } from "@/features/music";
import { usePreferences } from "@/features/preferences";
import { useSessionTimer } from "@/features/session";
import {
  useShortsPager,
  useVideoFeed,
  useVideoMediaFocus,
  YouTubePlayerView,
  type VideoFormat,
  type VideoItem,
} from "@/features/video";

export default function TvScreen() {
  useVideoMediaFocus();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const { currentTrack } = useMusicPlayer();
  const {
    isActive,
    formattedRemaining,
    isFinalMinute,
    endSession,
    recordVideoWatched,
  } = useSessionTimer();

  const [format, setFormat] = useState<VideoFormat>("SHORT");
  const { items, isLoading, error, refetch } = useVideoFeed(format);
  const pager = useShortsPager(items);
  const [selectedLong, setSelectedLong] = useState<VideoItem | null>(null);

  const activeLong = selectedLong ?? items[0] ?? null;

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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
          paddingTop: Math.max(insets.top, 47),
        },
      ]}
    >
      <WebViewHeader title="Videos" domain="youtube.com" theme={themeId}
        timerText={formattedRemaining} timerHighlighted={isFinalMinute}
        onBackPress={() => router.back()} onEndSessionPress={isActive ? confirmEndEarly : undefined}
        loading={isLoading} loadingProgress={0.3} />

      {/* Format Selector Chips + Music Paused Notice */}
      {!isLoading && <View style={styles.subHeaderRow}>
        <View style={styles.tabs}>
          <Chip
            label="Shorts"
            selected={format === "SHORT"}
            theme={themeId}
            onPress={() => setFormat("SHORT")}
          />
          <Chip
            label="Long Videos"
            selected={format === "LONG"}
            theme={themeId}
            onPress={() => setFormat("LONG")}
          />
        </View>

        {currentTrack ? (
          <View
            style={[
              styles.pausedBadge,
              { backgroundColor: palette.surface, borderColor: palette.line },
            ]}
          >
            <Text style={[styles.pausedIcon, { color: palette.accent }]}>⏸</Text>
            <Text style={[styles.pausedText, { color: palette.text }]}>
              Music paused while the TV is on
            </Text>
          </View>
        ) : null}
      </View>}

      {isLoading ? (
        <View style={styles.loadingState}>
          <ScreenGlow light={themeId === "garden"} />
          <FigmaImage name="8-476-imgIllustration" />
          <Text style={[styles.loadingTitle, { color: palette.text }]}>Tuning the TV…</Text>
          <Text style={[styles.loadingSub, { color: palette.textSecondary }]}>Loading the site. Music pauses while a video plays.</Text>
          <FigmaImage name={themeId === "garden" ? "12-1011-imgLoadingDots" : "8-476-imgLoadingDots"} style={{ marginTop: 22 }} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.error, { color: palette.danger }]}>
            Could not load videos
          </Text>
          <Button
            label="Retry"
            size="md"
            theme={themeId}
            onPress={() => void refetch()}
          />
        </View>
      ) : format === "SHORT" ? (
        <View
          style={[
            styles.shortsWrap,
            { paddingBottom: currentTrack ? 96 : 24 },
          ]}
        >
          {pager.isEndCard ? (
            <Card theme={themeId} style={styles.endCard}>
              <Text style={[styles.endCardTitle, { color: palette.text }]}>
                You&apos;ve reached the end ✨
              </Text>
              <Text style={[styles.sub, { color: palette.textSecondary }]}>
                Take a deep breath, listen to music, or return to your space.
              </Text>
              <Button
                label="Return to Home Space"
                theme={themeId}
                fullWidth
                onPress={() => router.replace("/")}
              />
              <Button
                label="Previous Clip"
                variant="secondary"
                theme={themeId}
                fullWidth
                onPress={() => pager.setIndex(pager.index - 1)}
              />
            </Card>
          ) : pager.currentClip ? (
            <View style={styles.shortPlayerBox}>
              <View
                style={[
                  styles.videoFrame,
                  { backgroundColor: palette.surface, borderColor: palette.line },
                ]}
              >
                <YouTubePlayerView
                  key={pager.currentClip.externalRef}
                  videoId={pager.currentClip.externalRef}
                  playing={pager.playing}
                  muted={pager.muted}
                  width={Math.max(260, width - Spacing.md * 2 - 4)}
                  height={280}
                  onPlaying={recordVideoWatched}
                />
              </View>

              <View style={styles.shortInfoRow}>
                <View style={styles.shortTitleWrap}>
                  <Text style={[styles.title, { color: palette.text }]} numberOfLines={2}>
                    {pager.currentClip.title}
                  </Text>
                  <Text style={[styles.sub, { color: palette.textSecondary }]}>
                    Clip {pager.index + 1} of {pager.totalClips}
                  </Text>
                </View>
              </View>

              <ProgressBar
                type="loading"
                progress={(pager.index + 1) / Math.max(1, pager.totalClips)}
                theme={themeId}
              />

              <View style={styles.controls}>
                <Button
                  label={pager.playing ? "Pause" : "Play"}
                  size="md"
                  theme={themeId}
                  onPress={pager.togglePlay}
                  style={styles.controlBtn}
                />
                <Button
                  label={pager.muted ? "Unmute" : "Mute"}
                  variant="secondary"
                  size="md"
                  theme={themeId}
                  onPress={pager.toggleMute}
                  style={styles.controlBtn}
                />
              </View>

              <View style={styles.controls}>
                <Button
                  label="↑ Prev clip"
                  variant="ghost"
                  size="md"
                  theme={themeId}
                  disabled={pager.index === 0}
                  onPress={() => pager.setIndex(pager.index - 1)}
                  style={styles.controlBtn}
                />
                <Button
                  label="↓ Next clip"
                  variant="secondary"
                  size="md"
                  theme={themeId}
                  onPress={() => pager.setIndex(pager.index + 1)}
                  style={styles.controlBtn}
                />
              </View>
            </View>
          ) : (
            <Text style={[styles.sub, { color: palette.textSecondary }]}>
              No short clips available
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.longWrap}>
          {activeLong ? (
            <View style={styles.longPlayer}>
              <View
                style={[
                  styles.videoFrame,
                  { backgroundColor: palette.surface, borderColor: palette.line },
                ]}
              >
                <YouTubePlayerView
                  key={activeLong.externalRef}
                  videoId={activeLong.externalRef}
                  playing
                  width={Math.max(260, width - Spacing.md * 2 - 4)}
                  height={215}
                  onPlaying={recordVideoWatched}
                />
              </View>
              <Text style={[styles.title, { color: palette.text }]}>
                {activeLong.title}
              </Text>
            </View>
          ) : null}

          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: currentTrack ? 110 : 28 },
            ]}
            renderItem={({ item }) => {
              const selected = activeLong?.id === item.id;
              return (
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => setSelectedLong(item)}
                >
                  <Card
                    theme={themeId}
                    style={[
                      styles.longItemCard,
                      selected && {
                        borderColor: palette.accent,
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.longItemTitle,
                        { color: selected ? palette.accent : palette.text },
                      ]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    {item.author ? (
                      <Text style={[styles.longItemSub, { color: palette.textSecondary }]}>
                        {item.author}
                      </Text>
                    ) : null}
                  </Card>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {currentTrack ? (
        <View
          style={[
            styles.miniDock,
            { paddingBottom: Math.max(insets.bottom - 6, 28) },
          ]}
        >
          <MiniPlayer theme={themeId} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingState: { flex: 1, alignItems: "center", paddingTop: 80, gap: 18 },
  loadingTitle: { ...Typography.presets.h2, fontSize: 26, marginTop: 32 },
  loadingSub: { fontSize: 15, lineHeight: 22, textAlign: "center", maxWidth: 300 },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleBlock: {
    gap: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  headerDomain: {
    fontSize: Typography.sizes.xs,
  },
  subHeaderRow: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  pausedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  pausedIcon: {
    fontSize: 12,
    fontWeight: "700",
  },
  pausedText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  shortsWrap: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
  },
  shortPlayerBox: {
    gap: Spacing.md,
  },
  videoFrame: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  shortInfoRow: {
    gap: 4,
  },
  shortTitleWrap: {
    gap: 3,
  },
  endCard: {
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  endCardTitle: {
    fontFamily: FontFamilies.display,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  controlBtn: {
    flex: 1,
  },
  longWrap: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  longPlayer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  list: {
    gap: Spacing.sm,
  },
  longItemCard: {
    gap: 4,
  },
  longItemTitle: {
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
  },
  longItemSub: {
    fontSize: Typography.sizes.caption,
  },
  title: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  sub: {
    fontSize: Typography.sizes.caption,
  },
  error: {
    fontSize: Typography.sizes.sm,
  },
  miniDock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
  },
});
