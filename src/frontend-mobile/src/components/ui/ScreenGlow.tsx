import React from "react";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { figmaAssets } from "@/constants/figma-assets";

export function ScreenGlow({ light = false }: { light?: boolean }) {
  return <Image pointerEvents="none" source={figmaAssets[light ? "12-198-imgBackgroundGlow" : "6-193-imgBackgroundGlow"].source}
    contentFit="fill" style={StyleSheet.absoluteFill} />;
}
