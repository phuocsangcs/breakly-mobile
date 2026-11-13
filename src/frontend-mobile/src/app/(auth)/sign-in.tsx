// Sign-in screen synchronized with Figma "02 · Sign In".
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { AuthForm } from "@/components/AuthForm";
import { getThemeColors, Typography } from "@/constants/theme";
import { useAuth } from "@/features/auth";
import { usePreferences } from "@/features/preferences";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to keep your streak and break history."
      submitLabel="Sign in"
      onSubmit={signIn}
      footer={
        <View style={styles.footerRow}>
          <Text style={[styles.footerMuted, { color: palette.textSecondary }]}>
            New to Breakly?
          </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={[styles.footerLink, { color: palette.accent }]}>
              Create account
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
