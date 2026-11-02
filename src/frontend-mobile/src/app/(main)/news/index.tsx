// News feed screen composing curated micro-learning news cards and categories.
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NewsCard } from "@/components/NewsCard";
import { Colors, Spacing } from "@/constants/theme";

export default function NewsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NewsCard title="3-Minute Mindfulness Exercise" category="Mindfulness" />
      <NewsCard title="Desk Stretches for Posture" category="Physical" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
});
