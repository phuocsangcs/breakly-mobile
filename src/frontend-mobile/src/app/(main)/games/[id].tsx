// Game player screen: WebViewHeader (domain + timer) over the game's own page in an in-app browser.
// The first successful load counts as "played today" (backend + local log) and as a game used in this break.
// No floating MiniPlayer here: it would cover the game's on-screen keyboard. Music keeps playing underneath.
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText as Text } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { FigmaImage } from "@/components/ui/FigmaImage";
import { ScreenGlow } from "@/components/ui/ScreenGlow";
import { WebViewHeader } from "@/components/ui/WebViewHeader";
import { getThemeColors, Spacing, Typography } from "@/constants/theme";
import { GameWebView, useGames, useRecordGamePlay } from "@/features/games";
import { usePreferences } from "@/features/preferences";
import { useSessionTimer } from "@/features/session";

function extractDomain(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function GamePlayerScreen() {
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const { isActive, formattedRemaining, isFinalMinute, endSession, recordGamePlayed } = useSessionTimer();
  const recordPlay = useRecordGamePlay();

  const params = useLocalSearchParams<{ id: string; url?: string; title?: string }>();
  const { games } = useGames();
  const game = games.find((g) => g.id === params.id);
  const url = params.url ?? game?.url;
  const title = params.title ?? game?.title ?? "Game";

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0.35);

  const confirmEndEarly = () => {
    Alert.alert("End break early?", "Your break progress up to now will be saved.", [
      { text: "Cancel", style: "cancel" },
      { text: "End break", style: "destructive", onPress: () => void endSession("ENDED_EARLY") },
    ]);
  };

  if (!url || !params.id) {
    return (
      <View style={[styles.empty, { backgroundColor: palette.background, paddingTop: Math.max(insets.top + 8, 48) }]}>
        <Text style={[styles.emptyTitle, { color: palette.text }]}>Game not found</Text>
        <Button label="Back to Game Corner" theme={themeId} onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.background, paddingTop: Math.max(insets.top, 47) }]}>
      <WebViewHeader
        title={title}
        domain={extractDomain(url)}
        timerText={formattedRemaining}
        timerHighlighted={isFinalMinute}
        loading={isLoading}
        loadingProgress={loadProgress}
        onBackPress={() => router.back()}
        onEndSessionPress={isActive ? confirmEndEarly : undefined}
        theme={themeId}
      />

      <View style={[styles.webWrap, { paddingBottom: insets.bottom }]}>
        <GameWebView
          url={url}
          title={title}
          onLoadStart={() => {
            setIsLoading(true);
            setLoadProgress(0.35);
          }}
          onLoadProgress={(p) => setLoadProgress(Math.max(0.2, p))}
          onLoadEnd={() => {
            setLoadProgress(1);
            setIsLoading(false);
          }}
          onError={() => setIsLoading(false)}
          onOpened={() => {
            recordGamePlayed(params.id);
            recordPlay.mutate(params.id);
          }}
        />

        {isLoading ? (
          <View style={[styles.loadingOverlay, { backgroundColor: palette.background }]}>
            <ScreenGlow light={themeId === "garden"} />
            <FigmaImage name="8-476-imgIllustration" style={styles.illustration} />
            <Text style={[styles.loadingTitle, { color: palette.text }]}>Setting up the puzzle…</Text>
            <Text style={[styles.loadingSub, { color: palette.textSecondary }]}>
              One game, a few minutes. Your music keeps playing.
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webWrap: { flex: 1 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    paddingTop: 110,
    paddingHorizontal: 24,
    gap: 12,
  },
  illustration: { marginBottom: 30 },
  loadingTitle: { ...Typography.presets.h2, fontSize: 26, textAlign: "center" },
  loadingSub: { fontSize: 15, lineHeight: 22, maxWidth: 300, textAlign: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.lg, gap: Spacing.md },
  emptyTitle: { ...Typography.presets.title },
});
