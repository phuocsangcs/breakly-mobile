// Headless WebView wrapper for reading a full article inside the app without interrupting music playback.
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

export interface ArticleWebViewProps {
  url: string;
  style?: StyleProp<ViewStyle>;
  onError?: () => void;
}

export function ArticleWebView({ url, style, onError }: ArticleWebViewProps) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          onError?.();
        }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  loader: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
