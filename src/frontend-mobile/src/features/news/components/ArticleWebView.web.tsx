import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { ArticleFailure } from "./ArticleFailure";
import { useArticleLoad } from "./useArticleLoad";
import type { ArticleWebViewProps } from "./ArticleWebView.types";
export type { ArticleWebViewProps } from "./ArticleWebView.types";

export function ArticleWebView(props: ArticleWebViewProps) {
  return <Reader key={props.url} {...props} />;
}
function Reader(props: ArticleWebViewProps) {
  const load = useArticleLoad(props);
  return <View style={[styles.root, props.style]}>
    {load.error ? <ArticleFailure error={load.error} url={load.failedUrl} onRetry={load.tryAgain} /> : <>
      {/* Browsers hide cross-origin HTTP status and frame-blocking failures. Keep manual recovery available. */}
      <Pressable accessibilityRole="button" onPress={() => load.fail("network")} style={styles.help}>
        <Text style={styles.helpText}>Page blank or unavailable? Tap here for help.</Text>
      </Pressable>
      <iframe key={load.retry} src={load.sourceUrl} title="Article reader"
        style={{ width: "100%", flex: 1, border: 0, backgroundColor: "#FFFFFF" }}
        onLoad={() => load.finish()}
        onError={() => load.fail("network")} />
    </>}
  </View>;
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  help: { backgroundColor: "#F4EDE1", padding: 10 },
  helpText: { color: "#2F6B5E", fontSize: 13, textAlign: "center" },
});
