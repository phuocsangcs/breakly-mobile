// Composed virtual space renderer displaying interactive background and hotspots.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SpaceTheme } from "@/types/space";
import { Colors } from "@/constants/theme";

interface SpaceViewProps {
  theme?: SpaceTheme;
}

export function SpaceView({ theme }: SpaceViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Virtual Space: {theme?.name ?? "Default Space"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
  },
  text: {
    color: Colors.dark.text,
  },
});

