// Break duration selector pills (10 / 20 / 30 min) synchronized from Figma "DurationSelector" (node 47:486).
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
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
                backgroundColor: selected ? palette.accent : theme === "light" || theme === "garden" ? "#FFFFFF" : "rgba(255,246,232,0.08)",
                borderColor: selected ? palette.accent : theme === "light" || theme === "garden" ? palette.line : "rgba(255,246,232,0.28)",
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
    flex: 1,
    minWidth: 0,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Typography.sizes.md,
    lineHeight: 20,
    fontWeight: Typography.weights.semibold,
  },
});

