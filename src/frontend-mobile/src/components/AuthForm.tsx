// Shared auth form synchronized with Figma "02 · Sign In / Sign Up" (Fraunces heading, DM Sans fields, pill CTA).
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getThemeColors, Spacing, Typography } from "@/constants/theme";
import { isApiError } from "@/core/api";
import { usePreferencesStore } from "@/features/preferences";

export interface AuthFormProps {
  title: string;
  subtitle?: string;
  submitLabel: string;
  withName?: boolean;
  onSubmit: (v: { email: string; password: string; displayName?: string }) => Promise<void>;
  footer?: React.ReactNode;
}

export function AuthForm({
  title,
  subtitle = "Take a mindful pause in your personal break room.",
  submitLabel,
  withName,
  onSubmit,
  footer,
}: AuthFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <Text style={[styles.brandOverline, { color: palette.accent }]}>
          BREAKLY
        </Text>
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
        />
        <Input
          label="Password"
          placeholder="At least 8 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={error ?? undefined}
          theme={themeId}
        />
      </View>

      <View style={styles.actions}>
        <Button
          label={submitLabel}
          loading={busy}
          disabled={busy}
          onPress={submit}
          theme={themeId}
          fullWidth
        />
        {footer}
        <Button
          label="Continue as guest"
          variant="ghost"
          theme={themeId}
          onPress={() => router.replace("/")}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "center",
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
  },
  brandOverline: {
    ...Typography.presets.overline,
  },
  title: {
    ...Typography.presets.h1,
  },
  subtitle: {
    ...Typography.presets.body,
  },
  fields: {
    gap: Spacing.md,
  },
  actions: {
    gap: Spacing.sm,
  },
});
