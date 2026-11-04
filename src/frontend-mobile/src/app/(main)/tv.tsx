// TV screen supporting both Short vertical feed (max 10 clips + End Card, FR 6.1–6.3) and Long videos via YouTube iframe.
// Automatically pauses music on enter and resumes on exit (FR 4.5).
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors, Spacing } from "@/constants/theme";
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
  const [format, setFormat] = useState<VideoFormat>("SHORT");
  const { items, isLoading, error, refetch } = useVideoFeed(format);
  const pager = useShortsPager(items);
  const [selectedLong, setSelectedLong] = useState<VideoItem | null>(null);
  const { recordVideoWatched } = useSessionTimer();
  const { width } = useWindowDimensions();

  const activeLong = selectedLong ?? items[0] ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button label="← Space" variant="ghost" onPress={() => router.back()} />
        <View style={styles.tabs}>
          <Button
            label="Shorts"
            variant={format === "SHORT" ? "primary" : "secondary"}
            onPress={() => setFormat("SHORT")}
          />
          <Button
            label="Long Videos"
            variant={format === "LONG" ? "primary" : "secondary"}
            onPress={() => setFormat("LONG")}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Could not load videos</Text>
          <Button label="Retry" onPress={() => void refetch()} />
        </View>
      ) : format === "SHORT" ? (
        <View style={styles.shortsWrap}>
          {pager.isEndCard ? (
            <Card style={styles.endCard}>
              <Text style={styles.title}>You have reached the end of this short-video feed ✨</Text>
              <Text style={styles.sub}>Take a deep breath or return to your space.</Text>
              <Button label="Return to Home Space" onPress={() => router.replace("/")} />
              <Button label="Previous Clip" variant="secondary" onPress={() => pager.setIndex(pager.index - 1)} />
            </Card>
          ) : pager.currentClip ? (
            <View style={styles.shortPlayerBox}>
              <YouTubePlayerView
                key={pager.currentClip.externalRef}
                videoId={pager.currentClip.externalRef}
                playing={pager.playing}
                muted={pager.muted}
                width={width - Spacing.md * 2}
                height={320}
                onPlaying={recordVideoWatched}
              />
              <Text style={styles.title}>{pager.currentClip.title}</Text>
              <Text style={styles.sub}>
                Clip {pager.index + 1} / {pager.totalClips}
              </Text>
              <View style={styles.controls}>
                <Button label={pager.playing ? "Pause" : "Play"} onPress={pager.togglePlay} />
                <Button label={pager.muted ? "Unmute" : "Mute"} variant="secondary" onPress={pager.toggleMute} />
              </View>
              <View style={styles.controls}>
                <Button
                  label="↑ Prev"
                  variant="ghost"
                  onPress={() => pager.setIndex(pager.index - 1)}
                />
                <Button
                  label="↓ Next"
                  variant="primary"
                  onPress={() => pager.setIndex(pager.index + 1)}
                />
              </View>
            </View>
          ) : (
            <Text style={styles.sub}>No short clips available</Text>
          )}
        </View>
      ) : (
        <View style={styles.longWrap}>
          {activeLong && (
            <View style={styles.longPlayer}>
              <YouTubePlayerView
                key={activeLong.externalRef}
                videoId={activeLong.externalRef}
                playing
                width={width - Spacing.md * 2}
                height={220}
                onPlaying={recordVideoWatched}
              />
              <Text style={styles.title}>{activeLong.title}</Text>
            </View>
          )}
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedLong(item)}>
                <Card style={activeLong?.id === item.id ? styles.activeCard : undefined}>
                  <Text style={styles.title}>{item.title}</Text>
                  {item.author && <Text style={styles.sub}>{item.author}</Text>}
                </Card>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingTop: 44 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  tabs: { flexDirection: "row", gap: Spacing.xs },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.sm },
  shortsWrap: { flex: 1, padding: Spacing.md, justifyContent: "center" },
  shortPlayerBox: { alignItems: "center", gap: Spacing.sm },
  endCard: { alignItems: "center", gap: Spacing.md, padding: Spacing.lg },
  controls: { flexDirection: "row", gap: Spacing.sm },
  longWrap: { flex: 1, paddingHorizontal: Spacing.md },
  longPlayer: { gap: Spacing.xs, marginBottom: Spacing.md },
  list: { gap: Spacing.sm, paddingBottom: Spacing.lg },
  activeCard: { borderColor: Colors.dark.primary },
  title: { color: Colors.dark.text, fontSize: 16, fontWeight: "700", textAlign: "center" },
  sub: { color: Colors.dark.textMuted, fontSize: 13, textAlign: "center" },
  error: { color: "#F87171" },
});
