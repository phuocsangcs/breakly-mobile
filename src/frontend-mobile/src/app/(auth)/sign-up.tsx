// Sign-up screen synchronized with Figma "02 · Create Account".
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { AuthForm } from "@/components/AuthForm";
import { getThemeColors, Typography } from "@/constants/theme";
import { useAuth } from "@/features/auth";
import { usePreferences } from "@/features/preferences";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);

  return (
    <AuthForm
      title="Create your account"
      subtitle="Your sessions and streak are saved to your account."
      submitLabel="Create account"
      withName
      showBackButton
      showBrandWordmark={false}
      onSubmit={signUp}
      footer={
        <View style={styles.footerRow}>
          <Text style={[styles.footerMuted, { color: palette.textSecondary }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.footerLink, { color: palette.accent }]}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerMuted: {
    fontSize: Typography.sizes.sm,
  },
  footerLink: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});
