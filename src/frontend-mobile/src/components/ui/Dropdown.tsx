// Reusable Dropdown component for selecting options from a list.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

interface DropdownProps {
  label: string;
  value?: string;
  onSelect?: (value: string) => void;
}

export function Dropdown({ label }: DropdownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  text: {
    color: Colors.dark.text,
  },
});

