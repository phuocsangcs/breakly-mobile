// Radio player screen composing ambient audio station selector and player controls.
import React from "react";
import { View, StyleSheet } from "react-native";
import { RadioPlayer } from "@/components/RadioPlayer";
import { Colors, Spacing } from "@/constants/theme";

export default function RadioScreen() {
  return (
    <View style={styles.container}>
      <RadioPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
  },
});
