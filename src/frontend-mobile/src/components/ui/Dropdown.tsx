// Atomic select/dropdown trigger component styled with Figma Breakly surface & typography tokens.
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, Spacing, ThemeMode, Typography } from "@/constants/theme";

export interface DropdownProps {
  label?: string;
  value: string;
  onPress?: () => void;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function Dropdown({
  label,
  value,
  onPress,
  theme = "dark",
  style,
}: DropdownProps) {
  const palette = getThemeColors(theme);

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: palette.textSecondary }]}>{label}</Text>
      ) : null}
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: palette.surface,
            borderColor: palette.line,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
        <Text style={[styles.chevron, { color: palette.textSecondary }]}>▾</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.semibold,
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 52,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  value: {
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
  },
  chevron: {
    fontSize: Typography.sizes.sm,
  },
});
