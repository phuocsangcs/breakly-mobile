import React from "react";
import { View, Pressable } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { useArticleLoad } from "@/features/news/components/useArticleLoad";
import { VideoUnavailable } from "./VideoUnavailable";
import type { YouTubePlayerViewProps } from "./YouTubePlayerView";

export function YouTubePlayerView(props: YouTubePlayerViewProps) {
  return <VideoPlayer key={props.videoId} {...props} />;
}
function VideoPlayer({ videoId, playing, muted = false, height = 240, width, style }: YouTubePlayerViewProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}&mute=${muted ? 1 : 0}&controls=1&rel=0`;
  const load = useArticleLoad({ url: embedUrl });
  return <View style={[{ height, width: width ?? "100%", overflow: "hidden", borderRadius: 12 }, style]}>
    {load.error ? <VideoUnavailable onRetry={load.tryAgain} /> : <>
      <iframe key={load.retry} title="YouTube video player" src={embedUrl} width="100%" height="100%" style={{ border: 0, flex: 1 }}
        onLoad={load.finish} onError={() => load.fail("network")}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      <Pressable onPress={() => load.fail("network")} accessibilityRole="button" style={{ padding: 6, backgroundColor: "#232437" }}>
        <Text style={{ color: "#F6EBDD", fontSize: 12, textAlign: "center" }}>Video unavailable? Tap to retry.</Text>
      </Pressable>
    </>}
  </View>;
}
