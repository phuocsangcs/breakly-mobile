// Radio player screen composing ambient audio station selector, playback controls and quick link to News.
import React from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { RadioPlayer } from "@/components/RadioPlayer";
import { Button } from "@/components/ui/Button";
import { Colors, Spacing } from "@/constants/theme";

export default function RadioScreen() {
  return (
    <View style={styles.container}>
      <RadioPlayer />
      <View style={styles.actions}>
        <Button label="Read News while listening →" variant="secondary" onPress={() => router.push("/news")} />
        <Button label="Back to Space" variant="ghost" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
    gap: Spacing.md,
  },
  actions: { gap: Spacing.xs },
});
