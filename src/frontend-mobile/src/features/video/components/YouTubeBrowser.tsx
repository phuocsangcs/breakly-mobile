// The real m.youtube.com inside a WebView, with Breakly guard rails:
// - stays on YouTube (other sites open in the system browser, app-switch links like intent:// are blocked);
// - reports each distinct video the user opens, so the screen can count them and stop at the limit;
// - pauses playback when the app goes to the background.
// The page layout is not modified. The injected script only reads location.href, because YouTube
// changes pages with history.pushState, which onShouldStartLoadWithRequest does not see.
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { AppState, Linking, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { WebView, type WebViewMessageEvent, type WebViewProps } from "react-native-webview";
import { decideYouTubeNavigation, extractYouTubeVideoId } from "./youtubeNavigation";

export const YOUTUBE_HOME_URL = "https://m.youtube.com/";

// The package's cross-platform typings omit the ref; the native implementations forward it.
type WebViewRef = { injectJavaScript: (script: string) => void };
const RefWebView = WebView as unknown as React.ComponentType<WebViewProps & { ref?: React.Ref<WebViewRef> }>;

const PAUSE_ALL = "document.querySelectorAll('video').forEach(function (v) { v.pause(); }); true;";

const REPORT_URL = `
(function () {
  var last = "";
  function report() {
    if (location.href !== last) {
      last = location.href;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "url", url: last }));
    }
  }
  report();
  setInterval(report, 700);
})();
true;`;

export interface YouTubeBrowserHandle {
  pause: () => void;
}

export interface YouTubeBrowserProps {
  style?: StyleProp<ViewStyle>;
  /** Called once per distinct video id the user opens (watch page or Short). */
  onVideoOpened?: (videoId: string) => void;
  onLoadStart?: () => void;
  onLoadProgress?: (progress: number) => void;
  onLoadEnd?: () => void;
  onError?: () => void;
}

export const YouTubeBrowser = forwardRef<YouTubeBrowserHandle, YouTubeBrowserProps>(function YouTubeBrowser(
  { style, onVideoOpened, onLoadStart, onLoadProgress, onLoadEnd, onError },
  ref,
) {
  const webRef = useRef<WebViewRef | null>(null);
  const seen = useRef(new Set<string>());

  const pause = () => webRef.current?.injectJavaScript(PAUSE_ALL);
  useImperativeHandle(ref, () => ({ pause }));

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") pause();
    });
    return () => sub.remove();
  }, []);

  const handleUrl = (url: string) => {
    const id = extractYouTubeVideoId(url);
    if (id && !seen.current.has(id)) {
      seen.current.add(id);
      onVideoOpened?.(id);
    }
  };

  const handleMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data) as { type?: string; url?: string };
      if (msg.type === "url" && msg.url) handleUrl(msg.url);
    } catch {
      // ignore messages that are not ours
    }
  };

  return <View style={[styles.container, style]}>
    <RefWebView ref={webRef} source={{ uri: YOUTUBE_HOME_URL }} style={styles.container}
      onShouldStartLoadWithRequest={(req) => {
        if (req.isTopFrame === false) return true;
        const decision = decideYouTubeNavigation(req.url);
        if (decision === "open-external") void Linking.openURL(req.url).catch(() => undefined);
        return decision === "allow";
      }}
      onNavigationStateChange={(nav) => handleUrl(nav.url)}
      onMessage={handleMessage}
      injectedJavaScript={REPORT_URL}
      onLoadStart={() => onLoadStart?.()}
      onLoadProgress={({ nativeEvent }) => onLoadProgress?.(nativeEvent.progress)}
      onLoadEnd={() => onLoadEnd?.()}
      onError={() => onError?.()}
      renderError={() => <View />}
      setSupportMultipleWindows={false}
      allowsInlineMediaPlayback
      allowsFullscreenVideo
      mediaPlaybackRequiresUserAction={false}
      allowsBackForwardNavigationGestures
      domStorageEnabled
      sharedCookiesEnabled
    />
  </View>;
});

const styles = StyleSheet.create({
  container: { flex: 1 },
});
