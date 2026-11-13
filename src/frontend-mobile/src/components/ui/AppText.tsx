import React from "react";
import { Text, StyleSheet, type TextProps } from "react-native";

/** Resolve each weight to a bundled font on Android, iOS and web. */
export function AppText({ style, ...props }: TextProps) {
  const resolved = StyleSheet.flatten(style) ?? {};
  const display = resolved.fontFamily?.includes("Fraunces");
  const weight = Number(resolved.fontWeight) || (resolved.fontWeight === "bold" ? 700 : 400);
  const fontFamily = display ? "Fraunces-SemiBold" :
    weight >= 700 ? "DMSans-Bold" : weight >= 600 ? "DMSans-SemiBold" :
    weight >= 500 ? "DMSans-Medium" : "DMSans-Regular";
  return <Text {...props} style={[style, { fontFamily, fontWeight: "normal" }]} />;
}
