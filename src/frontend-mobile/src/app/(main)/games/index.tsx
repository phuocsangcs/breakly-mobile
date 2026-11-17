// Game Corner screen: a short list of daily puzzles (one play a day each), with "played today" and per-game streak.
// Same structure as the News feed: back button + SessionTimerPill, editorial heading, list, floating MiniPlayer.
import React from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { AppText as Text } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { SessionTimerPill } from "@/components/ui/SessionTimerPill";
import { getThemeColors, Spacing, Typography } from "@/constants/theme";
import { GameIcon, useGames, type Game } from "@/features/games";
import { useMusicPlayer } from "@/features/music";
import { usePreferences } from "@/features/preferences";
import { useSessionTimer } from "@/features/session";

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const { currentTrack } = useMusicPlayer();
  const { games, isLoading, error, refetch } = useGames();
  const { isActive, formattedRemaining, isFinalMinute, endSession, startOrContinue } = useSessionTimer();

  const playedCount = games.filter((g) => g.playedToday).length;

  const openGame = (game: Game) => {
    startOrContinue("GAME");
    router.push({ pathname: "/games/[id]", params: { id: game.id, url: game.url, title: game.title } });
  };

  const confirmEndEarly = () => {
    Alert.alert("End break early?", "Your break progress up to now will be saved.", [
      { text: "Cancel", style: "cancel" },
      { text: "End break", style: "destructive", onPress: () => void endSession("ENDED_EARLY") },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background, paddingTop: Math.max(insets.top + 8, 48) }]}>
      <View style={styles.topBar}>
        <IconButton icon="back" theme={themeId} onPress={() => router.back()} accessibilityLabel="Back to room" />
        {isActive ? (
          <SessionTimerPill time={formattedRemaining} highlighted={isFinalMinute} onEndPress={confirmEndEarly} theme={themeId} />
        ) : null}
      </View>

      <View style={styles.headingBlock}>
        <Text style={[styles.heading, { color: palette.text }]}>Game Corner</Text>
        <Text style={[styles.sub, { color: palette.textSecondary }]}>
          One small puzzle a day. Finish it, then you are done. Music keeps playing.
        </Text>
        {games.length > 0 ? (
          <Text style={[styles.progress, { color: palette.accent }]}>
            {playedCount === games.length ? "All of today's puzzles are done ✨" : `${playedCount} of ${games.length} played today`}
          </Text>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      ) : error && games.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.error, { color: palette.danger }]}>Could not load games</Text>
          <Button label="Retry" size="md" theme={themeId} onPress={() => void refetch()} />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(g) => g.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: currentTrack ? 120 : 32 }]}
          ListEmptyComponent={
            <Text style={[styles.sub, { color: palette.textSecondary }]}>No games available right now.</Text>
          }
          ListFooterComponent={
            <Text style={[styles.footnote, { color: palette.textSecondary }]}>
              Puzzles are hosted by their publisher and open in an in-app browser. Some may ask you to sign in with
              a free account.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => openGame(item)} accessibilityRole="button"
              accessibilityLabel={`Play ${item.title}${item.playedToday ? ", played today" : ""}`}>
              <Card theme={themeId} style={styles.card}>
                <GameIcon game={item} backgroundColor={palette.surface2} />
                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: palette.text }]} numberOfLines={1}>{item.title}</Text>
                    {item.currentStreak > 0 ? (
                      <Text style={[styles.streak, { color: palette.accent }]}>🔥 {item.currentStreak}</Text>
                    ) : null}
                  </View>
                  {item.description ? (
                    <Text style={[styles.desc, { color: palette.textSecondary }]} numberOfLines={2}>{item.description}</Text>
                  ) : null}
                  <Text style={[styles.meta, { color: item.playedToday ? palette.accent : palette.textSecondary }]}>
                    {item.playedToday ? "✓ Played today · tap to see your result" : (item.provider ?? "Daily puzzle")}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {currentTrack ? (
        <View style={[styles.miniDock, { paddingBottom: Math.max(insets.bottom - 6, 28) }]}>
          <MiniPlayer theme={themeId} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headingBlock: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16, gap: 4 },
  heading: { ...Typography.presets.h1 },
  sub: { fontSize: Typography.sizes.sm, lineHeight: 20 },
  progress: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, marginTop: 6 },
  list: { paddingHorizontal: 16, gap: Spacing.sm },
  card: { flexDirection: "row", alignItems: "center", gap: 14 },
  cardBody: { flex: 1, gap: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold, flexShrink: 1 },
  streak: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  desc: { fontSize: Typography.sizes.caption, lineHeight: 18 },
  meta: { fontSize: Typography.sizes.caption, fontWeight: Typography.weights.medium },
  footnote: { fontSize: Typography.sizes.caption, lineHeight: 18, marginTop: Spacing.md, paddingHorizontal: 4 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing.sm },
  error: { fontSize: Typography.sizes.sm },
  miniDock: { position: "absolute", left: 16, right: 16, bottom: 0 },
});
