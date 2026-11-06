// Onboarding pagination dots synchronized from Figma "PageIndicator" (node 47:954).
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode } from "@/constants/theme";

export interface PageIndicatorProps {
  count?: number;
  activeIndex?: number;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

export function PageIndicator({
  count = 3,
  activeIndex = 0,
  theme = "dark",
  style,
}: PageIndicatorProps) {
  const palette = getThemeColors(theme);

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
              {
                backgroundColor: isActive ? palette.accent : palette.surface2,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 22,
  },
  inactiveDot: {
    width: 8,
  },
});

