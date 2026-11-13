import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { AppText as Text } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { FigmaImage } from "@/components/ui/FigmaImage";
import { ScreenGlow } from "@/components/ui/ScreenGlow";
import { getThemeColors, Typography } from "@/constants/theme";
import { usePreferences } from "@/features/preferences";
import { isArticleUrl, type ArticleLoadError } from "./articleLoad";

export function ArticleFailure({ error, url, onRetry }: {
  error: ArticleLoadError; url: string; onRetry: () => void;
}) {
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const [browserError, setBrowserError] = useState(false);
  const title = error === "timeout" ? "Taking a little too long" : "This page is taking a break";
  const message = error === "http" ? "This article may have moved, or the website is temporarily unavailable." :
    error === "invalid-url" ? "This article link is unavailable. Pick another story from News." :
    error === "process" ? "The reader stopped unexpectedly. Try opening the article again." :
    "We couldn't reach the website. Check your connection and try again.";
  return <View style={[styles.root, { backgroundColor: palette.background }]}>
    <ScreenGlow light={themeId === "garden"} />
    <ScrollView contentContainerStyle={styles.content}>
      <FigmaImage name="8-229-imgIllustration" />
      <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.copy}>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.message, { color: palette.textSecondary }]}>{message}</Text>
      </View>
      <View style={styles.actions}>
        {isArticleUrl(url) && <>
          <Button label="Try again" theme={themeId} onPress={onRetry} fullWidth />
          <Button label="Open in browser" variant="secondary" theme={themeId} fullWidth onPress={async () => {
            try { setBrowserError(false); await WebBrowser.openBrowserAsync(url); }
            catch { setBrowserError(true); }
          }} />
        </>}
        <Button label="Back to News" variant="ghost" theme={themeId} onPress={() => router.replace("/news")} />
        {browserError && <Text accessibilityRole="alert" style={{ color: palette.danger, textAlign: "center" }}>Couldn&apos;t open the browser. Please try again.</Text>}
      </View>
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24, paddingBottom: 112, gap: 24 },
  copy: { width: "100%", maxWidth: 342, gap: 10 },
  title: { ...Typography.presets.h2, textAlign: "center" },
  message: { fontSize: 15, lineHeight: 22, textAlign: "center" },
  actions: { width: "100%", maxWidth: 300, gap: 12 },
});
