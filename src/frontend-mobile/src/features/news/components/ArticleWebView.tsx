import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { ArticleFailure } from "./ArticleFailure";
import { useArticleLoad } from "./useArticleLoad";
import type { ArticleWebViewProps } from "./ArticleWebView.types";
export type { ArticleWebViewProps } from "./ArticleWebView.types";

export function ArticleWebView(props: ArticleWebViewProps) {
  return <Reader key={props.url} {...props} />;
}
function Reader(props: ArticleWebViewProps) {
  const load = useArticleLoad(props);
  return <View style={[styles.container, props.style]}>
    {load.error ? <ArticleFailure error={load.error} url={load.failedUrl} onRetry={load.tryAgain} /> : <>
      <WebView key={load.retry} source={{ uri: load.sourceUrl }} style={styles.container}
        onLoadStart={({ nativeEvent }) => {
          load.start(nativeEvent.url);
        }}
        onLoadProgress={({ nativeEvent }) => props.onLoadProgress?.(nativeEvent.progress)}
        onLoad={() => load.finish()}
        onError={() => load.fail("network")}
        // v14 emits HTTP errors only for main-frame requests, including redirects.
        onHttpError={({ nativeEvent }) => {
          if (nativeEvent.statusCode >= 400) {
            load.fail("http", nativeEvent.url);
          }
        }}
        onRenderProcessGone={() => load.fail("process")}
        onContentProcessDidTerminate={() => load.fail("process")}
        renderError={() => <View />}
        allowsInlineMediaPlayback mediaPlaybackRequiresUserAction />
      {load.loading && !props.onLoadStart && <View style={styles.loader}><ActivityIndicator size="large" /></View>}
    </>}
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
});
