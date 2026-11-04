// News article detail screen opening the VnExpress article inside a WebView while keeping music playing (FR 5.4–5.5).
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { MiniPlayer } from "@/components/MiniPlayer";
import { Button } from "@/components/ui/Button";
import { Colors, Spacing } from "@/constants/theme";
import { ArticleWebView, useSelectedArticleStore } from "@/features/news";

export default function NewsDetailScreen() {
  const params = useLocalSearchParams<{ id?: string; url?: string; title?: string }>();
  const selected = useSelectedArticleStore((s) => s.selected);
  const url = params.url ?? selected?.link;
  const title = params.title ?? selected?.title ?? "Article";

  if (!url) {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>Article not found</Text>
        <Button label="Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button label="← Back" variant="ghost" onPress={() => router.back()} />
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Button label="Browser" variant="secondary" onPress={() => void WebBrowser.openBrowserAsync(url)} />
      </View>
      <ArticleWebView url={url} />
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingTop: 44 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
    borderBottomWidth: 1,
    borderColor: Colors.dark.border,
  },
  title: { flex: 1, color: Colors.dark.text, fontWeight: "600", fontSize: 14 },
  empty: { flex: 1, backgroundColor: Colors.dark.background, alignItems: "center", justifyContent: "center", gap: Spacing.md },
});
