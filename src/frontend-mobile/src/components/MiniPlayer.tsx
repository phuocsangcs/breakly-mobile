// Compact mini-player bar shown on non-Radio screens while a music track is active (FR 4.3).
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Colors, Spacing } from "@/constants/theme";
import { useMusicPlayer } from "@/features/music";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, next } = useMusicPlayer();
  if (!currentTrack) return null;

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.info} onPress={() => router.push("/radio")}>
        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => void togglePlay()}>
        <Text style={styles.btnText}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={next}>
        <Text style={styles.btnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  info: { flex: 1 },
  title: { color: Colors.dark.text, fontWeight: "600", fontSize: 14 },
  artist: { color: Colors.dark.textMuted, fontSize: 12 },
  btn: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, backgroundColor: Colors.dark.primary, borderRadius: 6 },
  btnText: { color: "#FFF", fontWeight: "600", fontSize: 12 },
});

