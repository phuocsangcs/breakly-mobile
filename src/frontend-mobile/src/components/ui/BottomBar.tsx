// Floating pill bottom navigation bar synchronized from Figma "BottomBar" (node 47:840).
// Supports "room", "history", and "profile" tabs across Dark (Cozy) and Light (Normal) themes.
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";

export type BottomBarTabKey = "room" | "history" | "profile";

export interface BottomBarItem {
  key: BottomBarTabKey;
  label: string;
}

export interface BottomBarProps {
  activeTab?: BottomBarTabKey;
  onTabPress?: (tab: BottomBarTabKey) => void;
  theme?: ThemeMode | BreaklyThemeId;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_TABS: readonly BottomBarItem[] = [
  { key: "room", label: "Room" },
  { key: "history", label: "History" },
  { key: "profile", label: "Profile" },
];

export function BottomBar({
  activeTab = "room",
  onTabPress,
  theme = "dark",
  style,
}: BottomBarProps) {
  const palette = getThemeColors(theme);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: palette.bottomBarBg,
          borderColor: palette.line,
        },
        style,
      ]}
    >
      {DEFAULT_TABS.map((item) => {
        const isActive = item.key === activeTab;
        const tintColor = isActive ? palette.accent : palette.textSecondary;

        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.8}
            onPress={() => onTabPress?.(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={styles.tab}
          >
            {/* Minimal geometric icon matching Figma 22x22 tab icons */}
            <View style={styles.iconContainer}>
              {item.key === "room" && (
                <View style={[styles.houseIcon, { borderColor: tintColor }]} />
              )}
              {item.key === "history" && (
                <View style={[styles.clockIcon, { borderColor: tintColor }]}>
                  <View style={[styles.clockHand, { backgroundColor: tintColor }]} />
                </View>
              )}
              {item.key === "profile" && (
                <View style={styles.profileIconWrap}>
                  <View style={[styles.profileHead, { borderColor: tintColor }]} />
                  <View style={[styles.profileShoulders, { borderColor: tintColor }]} />
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: tintColor }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  tab: {
    width: 80,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  iconContainer: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  houseIcon: {
    width: 15,
    height: 14,
    borderWidth: 1.8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  clockIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.8,
    alignItems: "center",
    justifyContent: "center",
  },
  clockHand: {
    width: 1.8,
    height: 5,
    borderRadius: 1,
    marginBottom: 2,
  },
  profileIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 1.5,
  },
  profileHead: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.7,
  },
  profileShoulders: {
    width: 13,
    height: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1.7,
    borderBottomWidth: 0,
  },
  label: {
    fontSize: Typography.sizes.xs,
    lineHeight: 15,
    fontWeight: Typography.weights.semibold,
  },
});

