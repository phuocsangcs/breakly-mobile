// Original Figma scene layers with interactive native hotspots: radio, newspaper, TV and gamepad on the cabinet.
// The gamepad (Game Corner) is not part of the Figma file; it is drawn in the same flat style (assets/room).
// The wall clock shows the real time and the window sky is animated (components/room).
// Coordinates are in the 390x844 Figma frame, which is scaled to fit the screen.
import React, { useState } from "react";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FigmaImage } from "./ui/FigmaImage";
import { RoomLabel, type RoomLabelKind } from "./ui/RoomLabel";
import { MusicNotes } from "./room/MusicNotes";
import { WallClock } from "./room/WallClock";
import { WindowSky } from "./room/WindowSky";
import type { FigmaAssetName } from "@/constants/figma-assets";
import type { ThemeId } from "@/features/preferences";
import type { ServiceType } from "@/features/session";

const GAMEPAD = {
  cozy: require("../../assets/room/gamepad-cozy.svg"),
  garden: require("../../assets/room/gamepad-garden.svg"),
};

// Four equal label pills across the cabinet front; each object is centred above its pill.
const LABEL_WIDTH = 84;
const LABEL_TOP = 566;
const TABLE_TOP = 542; // objects stand on this line

type RoomObject = {
  service: ServiceType;
  kind: RoomLabelKind;
  asset: "imgObjectRadioMusic" | "imgObjectNewspaperNews" | "imgObjectTvShortVideos" | "gamepad";
  labelX: number;
  width: number;
  height: number;
};

const OBJECTS: RoomObject[] = [
  { service: "MUSIC", kind: "music", asset: "imgObjectRadioMusic", labelX: 18, width: 92, height: 76 },
  { service: "NEWS", kind: "news", asset: "imgObjectNewspaperNews", labelX: 108, width: 76, height: 82 },
  { service: "VIDEO", kind: "videos", asset: "imgObjectTvShortVideos", labelX: 198, width: 100, height: 100 },
  { service: "GAME", kind: "games", asset: "gamepad", labelX: 288, width: 72, height: 56 },
];

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
  const garden = themeId === "garden";
  const prefix = garden ? "2-195" : "2-2";
  return <View style={[styles.scene, { backgroundColor: garden ? "#CFA77C" : "#4B3529" }]}
    onLayout={({ nativeEvent: { layout } }) => setSize({ width: layout.width, height: layout.height })}>
    <View style={{ position: "absolute", left, top, width: 390, height: 844,
      transform: [{ scale }], transformOrigin: "top left" }}>
      <FigmaImage name={`${prefix}-imgRoomBackground`} />
      <WindowSky garden={garden} />
      <WallClock garden={garden} />
      {OBJECTS.map(({ service, kind, asset, labelX, width, height }) => {
        const x = labelX + (LABEL_WIDTH - width) / 2;
        const open = () => onSelectObject?.(service);
        return <React.Fragment key={service}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open ${kind}`} activeOpacity={0.8}
            onPress={open} style={{ position: "absolute", left: x, top: TABLE_TOP - height, width, height }}>
            {asset === "gamepad" ? (
              <Image source={garden ? GAMEPAD.garden : GAMEPAD.cozy} contentFit="contain" style={{ width, height }} />
            ) : (
              <FigmaImage name={`${prefix}-${asset}` as FigmaAssetName} width={width} height={height} />
            )}
          </TouchableOpacity>
          <RoomLabel kind={kind} theme={themeId} onPress={open}
            style={[styles.label, { left: labelX }]} />
        </React.Fragment>;
      })}
      {/* Notes rise from the radio while music plays. */}
      <MusicNotes playing={!!musicPlaying} />
    </View>
  </View>;
}
const styles = StyleSheet.create({
  scene: { flex: 1, overflow: "hidden" },
  label: {
    position: "absolute",
    top: LABEL_TOP,
    width: LABEL_WIDTH,
    minWidth: 0,
    paddingHorizontal: 8,
    gap: 4,
  },
});
