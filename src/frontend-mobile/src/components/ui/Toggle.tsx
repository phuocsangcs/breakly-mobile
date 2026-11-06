// Custom 46x28 switch synchronized from Figma "Toggle" (node 47:920).
import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode } from "@/constants/theme";

export interface ToggleProps {
  value: boolean;
  onValueChange?: (nextValue: boolean) => void;
  disabled?: boolean;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function Toggle({
  value,
  onValueChange,
  disabled = false,
  theme = "dark",
  style,
}: ToggleProps) {
  const palette = getThemeColors(theme);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={[
        styles.track,
        {
          backgroundColor: value ? palette.accent : palette.surface2,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.knob,
          value ? styles.knobOn : styles.knobOff,
          {
            backgroundColor: value ? palette.onAccent : palette.textSecondary,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  knobOn: {
    alignSelf: "flex-end",
  },
  knobOff: {
    alignSelf: "flex-start",
  },
});

