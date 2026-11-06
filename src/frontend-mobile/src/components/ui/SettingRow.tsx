// Settings & Profile row synchronized from Figma "SettingRow" (node 47:904).
// Supports "value" (with right value + chevron), "toggle" (with embedded Toggle), and "danger" (destructive action).
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, ThemeMode, Typography } from "@/constants/theme";
import { Toggle } from "./Toggle";

export type SettingRowType = "value" | "toggle" | "danger";

export interface SettingRowProps {
  label: string;
  type?: SettingRowType;
  value?: string;
  toggleValue?: boolean;
  onToggleChange?: (next: boolean) => void;
  onPress?: () => void;
  disabled?: boolean;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function SettingRow({
  label,
  type = "value",
  value,
  toggleValue = false,
  onToggleChange,
  onPress,
  disabled = false,
  theme = "dark",
  style,
}: SettingRowProps) {
  const palette = getThemeColors(theme);

  if (type === "toggle") {
    return (
      <View
        style={[
          styles.row,
          { backgroundColor: palette.surface, opacity: disabled ? 0.55 : 1 },
          style,
        ]}
      >
        <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
          {label}
        </Text>
        <Toggle
          value={toggleValue}
          onValueChange={onToggleChange}
          disabled={disabled}
          theme={theme}
        />
      </View>
    );
  }

  const isDanger = type === "danger";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.row,
        { backgroundColor: palette.surface, opacity: disabled ? 0.55 : 1 },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: isDanger ? palette.danger : palette.text },
          isDanger && styles.dangerLabel,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {!isDanger ? (
        <View style={styles.rightValueRow}>
          {value ? (
            <Text style={[styles.valueText, { color: palette.textSecondary }]}>
              {value}
            </Text>
          ) : null}
          <Text style={[styles.chevron, { color: palette.textSecondary }]}>›</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: Radius.lg,
    gap: 10,
  },
  label: {
    flex: 1,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.medium,
  },
  dangerLabel: {
    fontWeight: Typography.weights.semibold,
  },
  rightValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueText: {
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
    fontWeight: Typography.weights.medium,
  },
  chevron: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "600",
  },
});

