// Category filter pill synchronized from Figma "Chip" (node 47:434).
// Supports Selected and Default states across Dark (Cozy) and Light (Normal) themes.
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  selected = false,
  onPress,
  theme = "dark",
  style,
}: ChipProps) {
  const palette = getThemeColors(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? palette.accent : palette.surface2,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? palette.onAccent : palette.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  label: {
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
    fontWeight: Typography.weights.semibold,
  },
});

