// Break duration selector pills (10 / 20 / 30 min) synchronized from Figma "DurationSelector" (node 47:486).
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";

export interface DurationSelectorProps {
  options?: readonly number[];
  value: number;
  onChange?: (minutes: number) => void;
  disabled?: boolean;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function DurationSelector({
  options = [10, 20, 30],
  value,
  onChange,
  disabled = false,
  theme = "dark",
  style,
}: DurationSelectorProps) {
  const palette = getThemeColors(theme);

  return (
    <View style={[styles.row, style]}>
      {options.map((minutes) => {
        const selected = value === minutes;
        return (
          <TouchableOpacity
            key={minutes}
            onPress={() => onChange?.(minutes)}
            disabled={disabled}
            activeOpacity={0.82}
            style={[
              styles.pill,
              {
                backgroundColor: selected ? palette.accent : palette.surface,
                borderColor: selected ? palette.accent : palette.line,
                opacity: disabled && !selected ? 0.5 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? palette.onAccent : palette.text },
              ]}
            >
              {minutes} min
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pill: {
    minWidth: 96,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Typography.sizes.md,
    lineHeight: 20,
    fontWeight: Typography.weights.semibold,
  },
});

