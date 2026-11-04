// Headless YouTube iframe player wrapper (runs inside react-native-webview).
import React, { useCallback } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import YoutubeIframe, { PLAYER_STATES, type YoutubeIframeProps } from "react-native-youtube-iframe";

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

export function YouTubePlayerView({
  videoId,
  playing,
  muted = false,
  height = 240,
  width,
  style,
  onPlaying,
  onEnded,
}: YouTubePlayerViewProps) {
  const handleState = useCallback(
    (state: PLAYER_STATES) => {
      if (state === PLAYER_STATES.PLAYING) onPlaying?.();
      if (state === PLAYER_STATES.ENDED) onEnded?.();
    },
    [onPlaying, onEnded],
  );

  return (
    <View style={style}>
      <Player
        videoId={videoId}
        play={playing}
        mute={muted}
        height={height}
        width={width}
        onChangeState={handleState}
        initialPlayerParams={{ controls: true, rel: false }}
      />
    </View>
  );
}

