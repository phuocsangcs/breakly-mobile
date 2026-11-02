// Non-blocking Toast notification component for feedback and alert banners.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

export function Toast({ message }: { message: string }) {
  return (
    <View style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignSelf: "center",
  },
  text: {
    color: Colors.dark.text,
  },
});

