// Atomic text input component synchronized from Figma "Input" (node 47:366).
// Supports Default, Focused, Filled, and Error states across Dark (Cozy) and Light (Normal) themes.
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { BreaklyThemeId, getThemeColors, Radius, Spacing, ThemeMode, Typography } from "@/constants/theme";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  theme?: ThemeMode | BreaklyThemeId;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  theme = "dark",
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const palette = getThemeColors(theme);

  const hasError = Boolean(error);
  const borderColor = hasError
    ? palette.danger
    : focused
      ? palette.accent
      : palette.line;
  const borderWidth = hasError || focused ? 1.5 : 1;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: palette.textSecondary }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            backgroundColor: palette.inputFill,
            borderColor,
            borderWidth,
          },
        ]}
      >
        {leftIcon ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor={palette.textSecondary}
          style={[styles.input, { color: palette.text }, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon ? <View style={styles.iconSlot}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text style={[styles.error, { color: palette.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.semibold,
  },
  field: {
    minHeight: 52,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconSlot: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes. label,
    lineHeight: Typography.lineHeights.sm,
    fontWeight: Typography.weights.regular,
    paddingVertical: 14,
  },
  error: {
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.regular,
  },
});
