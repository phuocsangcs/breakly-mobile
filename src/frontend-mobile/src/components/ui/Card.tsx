// Reusable surface container component with rounded corners, subtle border, and padding matching Figma cards.
import React, { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, Spacing, ThemeMode } from "@/constants/theme";

export interface CardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  theme?: ThemeMode | BreaklyThemeId;
  variant?: "surface" | "surface2";
}

export function Card({
  children,
  style,
  theme = "dark",
  variant = "surface",
}: CardProps) {
  const palette = getThemeColors(theme);
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: variant === "surface2" ? palette.surface2 : palette.surface,
          borderColor: palette.line,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
  },
});
