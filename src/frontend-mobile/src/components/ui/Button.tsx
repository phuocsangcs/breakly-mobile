// Reusable pressable Button component supporting primary, secondary, and ghost variants.
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ label, onPress, variant = "primary", style, textStyle }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: Colors.dark.primary,
  },
  secondary: {
    backgroundColor: Colors.dark.surface,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

