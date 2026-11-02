// Composed ambient audio player component with station selector and volume controls.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Colors, Spacing } from "@/constants/theme";

export function RadioPlayer() {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Lo-Fi Radio Station</Text>
      <Button label="Play / Pause" variant="primary" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "600",
  },
});

