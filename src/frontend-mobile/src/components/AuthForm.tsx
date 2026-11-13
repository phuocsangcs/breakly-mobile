import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenGlow } from "./ui/ScreenGlow";
import { FigmaImage } from "./ui/FigmaImage";
// Shared auth form synchronized with Figma "02 · Sign In / Sign Up" (Fraunces heading, DM Sans fields, eye toggle, pill CTA).
import React, { useState } from "react";
import { AppText as Text } from "@/components/ui/AppText";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { FontFamilies, getThemeColors, Spacing, Typography } from "@/constants/theme";
import { isApiError } from "@/core/api";
import { usePreferencesStore } from "@/features/preferences";

export interface AuthFormProps {
  title: string;
  subtitle?: string;
  submitLabel: string;
  withName?: boolean;
  showBackButton?: boolean;
  showBrandWordmark?: boolean;
  onSubmit: (v: { email: string; password: string; displayName?: string }) => Promise<void>;
  footer?: React.ReactNode;
}

export function AuthForm({
  title,
  subtitle = "Sign in to keep your streak and break history.",
  submitLabel,
  withName,
  showBackButton = false,
  showBrandWordmark = true,
  onSubmit,
  footer,
}: AuthFormProps) {
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const themeId = usePreferencesStore((s) => s.themeId);
  const palette = getThemeColors(themeId);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await onSubmit({
        email,
        password,
        displayName: withName ? displayName : undefined,
      });
      router.replace("/");
    } catch (e) {
      const fields = isApiError(e) ? Object.values(e.fieldErrors) : [];
      setError(
        fields[0] ?? (e instanceof Error ? e.message : "Something went wrong")
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: palette.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenGlow light={themeId === "garden"} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: showBackButton ? Math.max(insets.top + 9, 56) : Math.max(insets.top + 65, 112), paddingBottom: Math.max(insets.bottom + 18, 50) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          {showBackButton ? (
            <View style={styles.backRow}>
              <IconButton
                icon="back"
                theme={themeId}
                onPress={() => router.back()}
              />
            </View>
          ) : showBrandWordmark ? (
            <Text style={[styles.brandWordmark, { color: palette.text }]}>
              breakly
            </Text>
          ) : null}

          <View style={styles.header}>
            <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={styles.fields}>
            {withName ? (
              <Input
                label="Display name"
                placeholder="Your name"
                value={displayName}
                onChangeText={setDisplayName}
                theme={themeId}
              />
            ) : null}

            <Input
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              theme={themeId}
              leftIcon={
                <FigmaImage name={`${themeId === "garden" ? "12-198" : "6-193"}-imgIconMail`} />
              }
            />

            <Input
              label="Password"
              placeholder="At least 8 characters"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              error={error ?? undefined}
              theme={themeId}
              leftIcon={
                <FigmaImage name={`${themeId === "garden" ? "12-198" : "6-193"}-imgIconLock`} />
              }
              rightIcon={
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FigmaImage name={`${themeId === "garden" ? "12-198" : "6-193"}-imgIconEye`} />
                </TouchableOpacity>
              }
            />

            {withName ? (
              <Text style={[styles.helperCaption, { color: palette.textSecondary }]}>
                Use 8 or more characters.
              </Text>
            ) : (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  Alert.alert(
                    "Password reset",
                    "Please contact support or sign in with your registered email to reset your password."
                  )
                }
              >
                <Text style={[styles.forgotLink, { color: palette.accent }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.ctaWrap}>
            <Button
              label={submitLabel}
              loading={busy}
              disabled={busy}
              onPress={submit}
              theme={themeId}
              fullWidth
            />
            <Button
              label="Continue as guest"
              variant="ghost"
              size="md"
              theme={themeId}
              onPress={() => router.replace("/")}
              fullWidth
            />
          </View>
        </View>

        {footer ? <View style={styles.footerSlot}>{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 64,
    paddingBottom: 36,
    justifyContent: "space-between",
  },
  topSection: {
    gap: 18,
  },
  backRow: {
    marginBottom: Spacing.xs,
  },
  brandWordmark: {
    fontFamily: FontFamilies.display,
    fontSize: 30,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  header: {
    gap: 6,
  },
  title: {
    ...Typography.presets.h2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  fields: {
    gap: 18,
  },
  fieldIcon: {
    fontSize: 15,
  },
  eyeToggle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  helperCaption: {
    ...Typography.presets.caption,
  },
  forgotLink: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  ctaWrap: {
    gap: Spacing.sm,

  },
  footerSlot: {
    alignItems: "center",
    paddingTop: Spacing.lg,
  },
});
