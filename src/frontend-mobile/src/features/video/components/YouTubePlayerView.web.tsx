// Web fallback for YouTube player rendering a standard responsive HTML5 iframe.
import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { YouTubePlayerViewProps } from "./YouTubePlayerView";

export function YouTubePlayerView({
  videoId,
  playing,
  muted = false,
  height = 240,
  width,
  style,
}: YouTubePlayerViewProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}&mute=${muted ? 1 : 0}&controls=1&rel=0`;

  return (
    <View
      style={[
        {
          height,
          width: width ?? "100%",
          overflow: "hidden",
          borderRadius: 12,
        },
        style,
      ]}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </View>
  );
}

