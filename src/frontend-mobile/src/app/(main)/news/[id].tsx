import { FigmaImage } from "@/components/ui/FigmaImage";
import { ScreenGlow } from "@/components/ui/ScreenGlow";
// News article detail screen synchronized with Figma "05 · News Loading" & "05b · News Reader".
// Features WebViewHeader with domain + SessionTimerPill + loading bar, smooth "Opening the newspaper?" overlay,
// external browser fallback, and floating MiniPlayer (FR 5.4–5.5).
import React, { useState } from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { Alert, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MiniPlayer } from "@/components/MiniPlayer";
import { Button } from "@/components/ui/Button";
import { WebViewHeader } from "@/components/ui/WebViewHeader";
import { getThemeColors, Spacing, Typography } from "@/constants/theme";
import { useMusicPlayer } from "@/features/music";
import { ArticleWebView, useSelectedArticleStore } from "@/features/news";
import { usePreferences } from "@/features/preferences";
import { useSessionTimer } from "@/features/session";

function extractDomain(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function NewsDetailScreen() {
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const { currentTrack } = useMusicPlayer();
  const {
    formattedRemaining,
    isFinalMinute,
    endSession,
  } = useSessionTimer();

  const params = useLocalSearchParams<{ id?: string; url?: string; title?: string }>();
  const selected = useSelectedArticleStore((s) => s.selected);
  const url = params.url ?? selected?.link;

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0.35);

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

  if (!url) {
    return (
      <View
        style={[
          styles.empty,
          {
            backgroundColor: palette.background,
            paddingTop: Math.max(insets.top + 8, 48),
          },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: palette.text }]}>
          Article not found
        </Text>
        <Button
          label="Back to News"
          theme={themeId}
          onPress={() => router.back()}
        />
      </View>
    );
  }

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
      {/* Figma WebViewHeader (47:704) */}
      <WebViewHeader
        title="News"
        domain={extractDomain(url)}
        timerText={formattedRemaining}
        timerHighlighted={isFinalMinute}
        loading={isLoading}
        loadingProgress={loadProgress}
        onBackPress={() => router.back()}
        onEndSessionPress={confirmEndEarly}
        theme={themeId}
      />

      {/* WebView Reader Area */}
      <View style={styles.webWrap}>
        <ArticleWebView
          url={url}
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
        />

        {/* Editorial Figma Loading Screen ("05 · News Loading") */}
        {isLoading ? (
          <View
            style={[
              styles.loadingOverlay,
              { backgroundColor: palette.background },
            ]}
          >
            <ScreenGlow light={themeId === "garden"} />
            <FigmaImage name="8-229-imgIllustration" style={styles.illustration} />
            <Text style={[styles.loadingTitle, { color: palette.text }]}>
              Opening the newspaper…
            </Text>
            <Text
              style={[styles.loadingSub, { color: palette.textSecondary }]}
            >
              Loading the site. Your music keeps playing.
            </Text>
            <FigmaImage name={themeId === "garden" ? "12-768-imgLoadingDots" : "8-229-imgLoadingDots"} style={{ marginTop: 34 }} />
          </View>
        ) : null}
      </View>

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
  container: {
    flex: 1,
  },
  webWrap: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 110,
    paddingHorizontal: 24,
    gap: 12,
  },
  illustration: { marginBottom: 38 },
  paperGraphic: {
    width: 96,
    height: 110,
    backgroundColor: "#EFEADF",
    borderRadius: 6,
    padding: 10,
    gap: 8,
    marginBottom: 8,
    borderBottomWidth: 14,
    borderBottomColor: "#8A5334",
  },
  paperGraphicBar: {
    height: 10,
    backgroundColor: "#3D4354",
    borderRadius: 2,
  },
  paperGraphicSub: {
    height: 5,
    width: "70%",
    backgroundColor: "#696E78",
    borderRadius: 2,
  },
  paperGraphicPhoto: {
    width: 28,
    height: 22,
    backgroundColor: "#8EB2AC",
    borderRadius: 3,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  loadingTitle: {
    ...Typography.presets.h2,
    fontSize: 26,
    textAlign: "center",
  },
  loadingSub: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
    textAlign: "center",
  },
  externalBtn: {
    marginTop: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.presets.title,
  },
  miniDock: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
  },
});
