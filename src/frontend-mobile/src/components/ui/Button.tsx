// Atomic button component synchronized from Figma "Button" (node 47:296).
// Supports Primary, Secondary, and Ghost variants across Dark (Cozy) and Light (Normal) themes.
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, Spacing, ThemeMode, Typography } from "@/constants/theme";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  theme?: ThemeMode | BreaklyThemeId;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  disabled = false,
  loading = false,
  theme = "dark",
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const palette = getThemeColors(theme);
  const isDisabled = disabled || loading;

  const getContainerStyle = (): ViewStyle => {
    if (variant === "primary") {
      return {
        backgroundColor: isDisabled ? palette.surface2 : palette.accent,
      };
    }
    if (variant === "secondary") {
      return {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: palette.line,
        opacity: isDisabled ? 0.45 : 1,
      };
    }
    return {
      backgroundColor: "transparent",
      opacity: isDisabled ? 0.45 : 1,
    };
  };

  const getLabelColor = (): string => {
    if (variant === "primary") {
      return isDisabled ? palette.textSecondary : palette.onAccent;
    }
    if (variant === "secondary") {
      return palette.text;
    }
    return palette.accent;
  };

  const labelColor = getLabelColor();

  return (
    <TouchableOpacity
      style={[
        styles.base,
        size === "lg" ? styles.sizeLg : styles.sizeMd,
        fullWidth && styles.fullWidth,
        getContainerStyle(),
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon}
          <Text style={[styles.label, size === "md" && styles.labelMd, { color: labelColor }, textStyle]}>
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  sizeLg: {
    minHeight: 52,
    paddingVertical: 14,
  },
  sizeMd: {
    minHeight: 40,
    paddingVertical: 9,
    paddingHorizontal: Spacing.md,
  },
  fullWidth: {
    width: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  label: {
    fontSize: Typography.sizes.md,
    lineHeight: Typography.lineHeights.md,
    fontWeight: Typography.weights.semibold,
  },
  labelMd: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
  },
});
