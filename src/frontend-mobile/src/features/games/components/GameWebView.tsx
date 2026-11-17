// In-app browser for a Game Corner game. Shows the provider's page unmodified (no injected scripts),
// keeps navigation on the game's site, sends other links to the system browser and blocks app-switch links.
import React, { useMemo, useRef } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { ArticleFailure } from "@/features/news/components/ArticleFailure";
import { useArticleLoad } from "@/features/news/components/useArticleLoad";
import { allowedHostsFor, decideNavigation } from "./gameNavigation";
import type { GameWebViewProps } from "./GameWebView.types";
export type { GameWebViewProps } from "./GameWebView.types";

export function GameWebView(props: GameWebViewProps) {
  return <GameBrowser key={props.url} {...props} />;
}

function GameBrowser(props: GameWebViewProps) {
  const load = useArticleLoad(props);
  const allowedHosts = useMemo(() => allowedHostsFor(props.url), [props.url]);
  const opened = useRef(false);

  return <View style={[styles.container, props.style]}>
    {load.error ? <ArticleFailure error={load.error} url={load.failedUrl} onRetry={load.tryAgain} /> :
      <WebView key={load.retry} source={{ uri: load.sourceUrl }} style={styles.container}
        onShouldStartLoadWithRequest={(req) => {
          // Sub-frames (ads, sign-in widgets) are allowed; only top-level page changes are guarded.
          if (req.isTopFrame === false) return true;
          const decision = decideNavigation(req.url, allowedHosts);
          if (decision === "open-external") void Linking.openURL(req.url).catch(() => undefined);
          return decision === "allow";
        }}
        onLoadStart={({ nativeEvent }) => load.start(nativeEvent.url)}
        onLoadProgress={({ nativeEvent }) => props.onLoadProgress?.(nativeEvent.progress)}
        onLoad={() => {
          load.finish();
          if (!opened.current) {
            opened.current = true;
            props.onOpened?.();
          }
        }}
        onError={() => load.fail("network")}
        onHttpError={({ nativeEvent }) => {
          if (nativeEvent.statusCode >= 400) load.fail("http", nativeEvent.url);
        }}
        onRenderProcessGone={() => load.fail("process")}
        onContentProcessDidTerminate={() => load.fail("process")}
        renderError={() => <View />}
        // Keep links with target=_blank inside this view so the guard above still applies.
        setSupportMultipleWindows={false}
        // Keeps the NYT sign-in and in-progress puzzles between visits.
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled={false}
      />}
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
