// Game tile: the game's own app icon (thumbnailUrl from the backend), falling back to an emoji when the
// icon is missing or fails to load (offline, URL changed upstream).
import React, { useState } from "react";
import { Image } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { gameEmoji } from "../hooks";
import type { Game } from "../types";

export function GameIcon({ game, size = 56, backgroundColor, style }: {
  game: Pick<Game, "title" | "category" | "thumbnailUrl">;
  size?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const [failed, setFailed] = useState(false);
  const showIcon = !!game.thumbnailUrl && !failed;
  const radius = Math.round(size * 0.24); // app-icon style rounded square

  return <View style={[styles.tile, { width: size, height: size, borderRadius: radius, backgroundColor }, style]}>
    {showIcon ? (
      <Image source={{ uri: game.thumbnailUrl! }} contentFit="cover" cachePolicy="memory-disk"
        accessibilityIgnoresInvertColors style={StyleSheet.absoluteFill} onError={() => setFailed(true)} />
    ) : (
      <Text style={{ fontSize: size * 0.5 }}>{gameEmoji(game)}</Text>
    )}
  </View>;
}

const styles = StyleSheet.create({
  tile: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
});
