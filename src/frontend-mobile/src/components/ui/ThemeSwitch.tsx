// Cozy (Moon) / Normal (Sun) theme toggle pill synchronized from Figma "ThemeSwitch" (node 47:1070).
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode } from "@/constants/theme";

export interface ThemeSwitchProps {
  /** Current theme mode ("dark" | "cozy-room" = Cozy Moon, "light" | "garden" = Normal Sun) */
  value?: ThemeMode | BreaklyThemeId;
  onChange?: (nextMode: ThemeMode, nextThemeId: BreaklyThemeId) => void;
  style?: StyleProp<ViewStyle>;
}

export function ThemeSwitch({
  value = "dark",
  onChange,
  style,
}: ThemeSwitchProps) {
  const isLight = value === "light" || value === "garden";
  const palette = getThemeColors(value);

  return (
    <View style={[styles.container, { backgroundColor: palette.surface2 }, style]}>
      {/* Cozy (Moon) Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange?.("dark", "cozy-room")}
        accessibilityRole="button"
        accessibilityLabel="Cozy chill room theme"
        style={[
          styles.iconBtn,
          !isLight && { backgroundColor: palette.accent },
        ]}
      >
        <Text
          style={[
            styles.glyph,
            { color: !isLight ? palette.onAccent : palette.textSecondary },
          ]}
        >
          ☾
        </Text>
      </TouchableOpacity>

      {/* Normal (Sun) Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange?.("light", "garden")}
        accessibilityRole="button"
        accessibilityLabel="Normal light theme"
        style={[
          styles.iconBtn,
          isLight && { backgroundColor: palette.accent },
        ]}
      >
        <Text
          style={[
            styles.glyph,
            { color: isLight ? palette.onAccent : palette.textSecondary },
          ]}
        >
          ☀
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 68,
    height: 36,
    borderRadius: 18,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    fontSize: 14,
    lineHeight: 16,
  },
});

