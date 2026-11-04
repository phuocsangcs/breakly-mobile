// Composed news item card previewing title, source, publication time and thumbnail (FR 5.1).
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Spacing } from "@/constants/theme";
import { Card } from "./ui/Card";

interface NewsCardProps {
  title?: string;
  category?: string;
  summary?: string;
  imageUrl?: string | null;
  publishedAt?: string;
  onPress?: () => void;
}

export function NewsCard({
  title = "Mindfulness in 3 minutes",
  category = "Wellness",
  summary,
  imageUrl,
  publishedAt,
  onPress,
}: NewsCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.thumb} /> : null}
        <View style={styles.body}>
          <Text style={styles.category}>
            {category}
            {publishedAt ? ` · ${new Date(publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
          </Text>
          <Text style={styles.title}>{title}</Text>
          {summary ? (
            <Text style={styles.summary} numberOfLines={2}>{summary}</Text>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", gap: Spacing.sm, alignItems: "center" },
  thumb: { width: 76, height: 76, borderRadius: 8 },
  body: { flex: 1, gap: Spacing.xs },
  category: { color: Colors.dark.primary, fontSize: 12, fontWeight: "700" },
  title: { color: Colors.dark.text, fontSize: 15, fontWeight: "600" },
  summary: { color: Colors.dark.textMuted, fontSize: 13 },
});
