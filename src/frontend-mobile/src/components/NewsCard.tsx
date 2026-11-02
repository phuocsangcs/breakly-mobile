// Composed news item card previewing title, category, and reading duration.
import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card } from "./ui/Card";
import { Colors, Spacing } from "@/constants/theme";

interface NewsCardProps {
  title?: string;
  category?: string;
  onPress?: () => void;
}

export function NewsCard({ title = "Mindfulness in 3 minutes", category = "Wellness" }: NewsCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.title}>{title}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xs,
  },
  category: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600",
  },
});

