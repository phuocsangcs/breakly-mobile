// Shared dev auth form (temporary UI) used by sign-in and sign-up screens.
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors, Spacing } from "@/constants/theme";
import { isApiError } from "@/core/api";

interface AuthFormProps {
  title: string;
  submitLabel: string;
  withName?: boolean;
  onSubmit: (v: { email: string; password: string; displayName?: string }) => Promise<void>;
  footer?: React.ReactNode;
}

export function AuthForm({ title, submitLabel, withName, onSubmit, footer }: AuthFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ email, password, displayName: withName ? displayName : undefined });
      router.replace("/");
    } catch (e) {
      const fields = isApiError(e) ? Object.values(e.fieldErrors) : [];
      setError(fields[0] ?? (e instanceof Error ? e.message : "Something went wrong"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {withName && <Input placeholder="Display name" value={displayName} onChangeText={setDisplayName} />}
      <Input placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Input placeholder="Password (min 8)" secureTextEntry value={password} onChangeText={setPassword} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button label={busy ? "..." : submitLabel} onPress={busy ? undefined : submit} />
      {footer}
      <Button label="Continue as guest" variant="ghost" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, backgroundColor: Colors.dark.background, justifyContent: "center", gap: Spacing.md },
  title: { color: Colors.dark.text, fontSize: 24, fontWeight: "700", marginBottom: Spacing.sm },
  error: { color: "#F87171" },
});

