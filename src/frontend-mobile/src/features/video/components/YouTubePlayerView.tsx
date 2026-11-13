// Headless YouTube iframe player wrapper (runs inside react-native-webview).
import React, { useCallback } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import YoutubeIframe, { PLAYER_STATES, type YoutubeIframeProps } from "react-native-youtube-iframe";
import { useArticleLoad } from "@/features/news/components/useArticleLoad";
import { VideoUnavailable } from "./VideoUnavailable";

const Player = YoutubeIframe as unknown as React.ComponentType<YoutubeIframeProps>;

export interface YouTubePlayerViewProps {
  videoId: string;
  playing: boolean;
  muted?: boolean;
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
  onPlaying?: () => void;
  onEnded?: () => void;
}

export function YouTubePlayerView(props: YouTubePlayerViewProps) {
  return <VideoPlayer key={props.videoId} {...props} />;
}
function VideoPlayer({
  videoId,
  playing,
  muted = false,
  height = 240,
  width,
  style,
  onPlaying,
  onEnded,
}: YouTubePlayerViewProps) {
  const load = useArticleLoad({ url: `https://www.youtube.com/embed/${videoId}` });
  const handleState = useCallback(
    (state: PLAYER_STATES) => {
      if (state === PLAYER_STATES.PLAYING) onPlaying?.();
      if (state === PLAYER_STATES.ENDED) onEnded?.();
    },
    [onPlaying, onEnded],
  );

  return (
    <View style={[{ height, width: width ?? "100%" }, style]}>
      {load.error ? <VideoUnavailable onRetry={load.tryAgain} /> : <Player
        key={load.retry}
        videoId={videoId}
        play={playing}
        mute={muted}
        height={height}
        width={width}
        onChangeState={handleState}
        onReady={load.finish}
        onError={() => load.fail("network")}
        webViewProps={{
          onError: () => load.fail("network"),
          onHttpError: ({ nativeEvent }) => { if (nativeEvent.statusCode >= 400) load.fail("http"); },
          onRenderProcessGone: () => load.fail("process"),
          onContentProcessDidTerminate: () => load.fail("process"),
          renderError: () => <View />,
        }}
        initialPlayerParams={{ controls: true, rel: false }}
      />}
    </View>
  );
}

