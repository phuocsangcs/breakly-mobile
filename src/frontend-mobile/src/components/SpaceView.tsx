// Original Figma scene layers with interactive native hotspots.
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FigmaImage } from "./ui/FigmaImage";
import { RoomLabel } from "./ui/RoomLabel";
import type { ThemeId } from "@/features/preferences";
import type { ServiceType } from "@/features/session";

export interface SpaceViewProps {
  themeId?: ThemeId;
  musicPlaying?: boolean;
  onSelectObject?: (service: ServiceType) => void;
}
export function SpaceView({ themeId = "cozy-room", musicPlaying, onSelectObject }: SpaceViewProps) {
  const [size, setSize] = useState({ width: 390, height: 844 });
  const scale = Math.min(size.width / 390, size.height / 844);
  const left = (size.width - 390 * scale) / 2;
  const top = (size.height - 844 * scale) / 2;
  const prefix = themeId === "garden" ? "2-195" : "2-2";
  return <View style={[styles.scene, { backgroundColor: themeId === "garden" ? "#CFA77C" : "#4B3529" }]}
    onLayout={({ nativeEvent: { layout } }) => setSize({ width: layout.width, height: layout.height })}>
    <View style={{ position: "absolute", left, top, width: 390, height: 844,
      transform: [{ scale }], transformOrigin: "top left" }}>
      <FigmaImage name={`${prefix}-imgRoomBackground`} />
      {([
        ["MUSIC", "music", "imgObjectRadioMusic", 24, 446, 116, 96, 30],
        ["NEWS", "news", "imgObjectNewspaperNews", 148, 438, 96, 104, 150],
        ["VIDEO", "videos", "imgObjectTvShortVideos", 250, 418, 124, 124, 266],
      ] as const).map(([service, kind, asset, x, y, width, height, labelX]) => <React.Fragment key={service}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open ${kind}`} activeOpacity={0.8}
          onPress={() => onSelectObject?.(service)} style={{ position: "absolute", left: x, top: y, width, height }}>
          <FigmaImage name={`${prefix}-${asset}`} width={width} height={height} />
        </TouchableOpacity>
        <RoomLabel kind={kind} theme={themeId} onPress={() => onSelectObject?.(service)}
          style={{ position: "absolute", left: labelX, top: 566, width: 96 }} />
      </React.Fragment>)}
      {musicPlaying && <FigmaImage name="8-630-imgGroup" style={{ position: "absolute", left: 99, top: 402 }} />}
    </View>
  </View>;
}
const styles = StyleSheet.create({ scene: { flex: 1, overflow: "hidden" } });
