import { FigmaImage } from "./FigmaImage";
// Circular 44x44 icon button synchronized from Figma "IconButton" (node 47:386).
// Supports "back" (←), "collapse" (⌄), and "close" (✕) icons across Dark and Light themes.
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode } from "@/constants/theme";

export type IconButtonType = "back" | "collapse" | "close";

export interface IconButtonProps {
  icon?: IconButtonType;
  onPress?: () => void;
  theme?: ThemeMode | BreaklyThemeId;
  size?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const ICON_GLYPHS: Record<IconButtonType, string> = {
  back: "‹",
  collapse: "⌄",
  close: "✕",
};

export function IconButton({
  icon = "back",
  onPress,
  theme = "dark",
  size = 44,
  style,
  accessibilityLabel,
}: IconButtonProps) {
  const palette = getThemeColors(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.surface,
        },
        style,
      ]}
    >
      {icon === "close" ? <Text style={[styles.glyph, { color: palette.text }]}>{ICON_GLYPHS.close}</Text> :
        <FigmaImage name={icon === "back" ? (theme === "light" || theme === "garden" ? "12-541-imgIconBack" : "8-2-imgIconBack") :
          (theme === "light" || theme === "garden" ? "12-673-imgIconDown" : "8-134-imgIconDown")} />}

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  glyphBack: {
    fontSize: 24,
    lineHeight: 24,
    marginRight: 2,
  },
  glyphCollapse: {
    fontSize: 20,
    lineHeight: 20,
    marginBottom: 4,
  },
});

