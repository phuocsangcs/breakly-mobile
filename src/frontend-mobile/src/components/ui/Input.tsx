// Reusable text Input component for forms and searches.
import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

export function Input(props: TextInputProps) {
  return <TextInput style={[styles.input, props.style]} placeholderTextColor={Colors.dark.textMuted} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.dark.surface,
    color: Colors.dark.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});

