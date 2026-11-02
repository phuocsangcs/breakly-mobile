// Reusable surface Card component providing elevation, rounded corners, and padding.
import React, { PropsWithChildren } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});

