import React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { figmaAssets, type FigmaAssetName } from "@/constants/figma-assets";

export function FigmaImage({ name, width, height, style }: {
  name: FigmaAssetName; width?: number; height?: number; style?: StyleProp<ViewStyle>;
}) {
  const asset = figmaAssets[name];
  return <View pointerEvents="none" style={[{ width: width ?? asset.width, height: height ?? asset.height }, style]}>
    <Image source={asset.source} contentFit="contain" style={StyleSheet.absoluteFill} />
  </View>;
}
