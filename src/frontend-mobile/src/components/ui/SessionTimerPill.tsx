// Compact SessionTimerPill component displaying current countdown and play/pause status.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

export function SessionTimerPill({ time = "05:00" }: { time?: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  text: {
    color: Colors.dark.primary,
    fontWeight: "700",
  },
});

