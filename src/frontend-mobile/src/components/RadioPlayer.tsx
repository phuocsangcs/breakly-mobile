// Composed ambient audio player component with category selector, track metadata and playback controls (FR 4.1–4.3).
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Colors, Spacing } from "@/constants/theme";
import { useMusicCategories, useMusicPlayer } from "@/features/music";
import { formatMmSs } from "@/features/session";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function RadioPlayer() {
  const { categories } = useMusicCategories();
  const {
    category,
    currentTrack,
    isPlaying,
    isLoadingQueue,
    error,
    positionSec,
    durationSec,
    volume,
    selectCategory,
    togglePlay,
    next,
    setVolume,
  } = useMusicPlayer();

  return (
    <Card style={styles.card}>
      <Text style={styles.heading}>Radio Stations</Text>
      <View style={styles.chips}>
        {categories.map((c) => (
          <Button
            key={c.id}
            label={c.title}
            variant={category === c.category ? "primary" : "secondary"}
            onPress={() => void selectCategory(c.category, true)}
          />
        ))}
      </View>

      {isLoadingQueue && <ActivityIndicator size="small" color={Colors.dark.primary} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {currentTrack ? (
        <View style={styles.trackBox}>
          {currentTrack.artworkUrl && (
            <Image source={{ uri: currentTrack.artworkUrl }} style={styles.artwork} />
          )}
          <Text style={styles.title}>{currentTrack.title}</Text>
          <Text style={styles.artist}>{currentTrack.artist}</Text>
          <Text style={styles.time}>
            {formatMmSs(Math.floor(positionSec))} / {formatMmSs(Math.floor(durationSec))}
          </Text>
        </View>
      ) : (
        <Text style={styles.artist}>Select a station or tap Play to begin</Text>
      )}

      <View style={styles.controls}>
        <Button label={isPlaying ? "Pause" : "Play"} onPress={() => void togglePlay()} />
        <Button label="Next Track" variant="secondary" onPress={next} />
      </View>

      <View style={styles.volumeRow}>
        <Button label="Vol -" variant="ghost" onPress={() => setVolume(volume - 10)} />
        <Text style={styles.artist}>Volume: {volume}%</Text>
        <Button label="Vol +" variant="ghost" onPress={() => setVolume(volume + 10)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.md },
  heading: { color: Colors.dark.text, fontSize: 18, fontWeight: "700" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  trackBox: { alignItems: "center", gap: Spacing.xs, paddingVertical: Spacing.sm },
  artwork: { width: 140, height: 140, borderRadius: 12 },
  title: { color: Colors.dark.text, fontSize: 16, fontWeight: "700", textAlign: "center" },
  artist: { color: Colors.dark.textMuted, fontSize: 13 },
  time: { color: Colors.dark.primary, fontSize: 12, fontWeight: "600" },
  controls: { flexDirection: "row", justifyContent: "center", gap: Spacing.sm },
  volumeRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: Spacing.sm },
  error: { color: "#F87171", fontSize: 13 },
});
