// Settings screen: one-minute notice toggle (FR 7.5), content credits (FR 7.6) and account sign-in/sign-out.
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth";
import { usePreferences } from "@/features/preferences";

export default function SettingsScreen() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { oneMinuteNoticeEnabled, setOneMinuteNotice } = usePreferences();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button label="← Space" variant="ghost" onPress={() => router.back()} />
        <Text style={styles.title}>Settings</Text>
      </View>

      <Card style={styles.rowCard}>
        <Text style={styles.label}>One-minute remaining notice</Text>
        <Switch value={oneMinuteNoticeEnabled} onValueChange={setOneMinuteNotice} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Content Credits</Text>
        <Text style={styles.muted}>• Music: Jamendo (Creative Commons artists)</Text>
        <Text style={styles.muted}>• News: VnExpress RSS feeds</Text>
        <Text style={styles.muted}>• Videos: YouTube official embedded player</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>Account</Text>
        {isAuthenticated ? (
          <>
            <Text style={styles.muted}>Signed in as {user?.email}</Text>
            <Button label="Sign Out" variant="secondary" onPress={() => void signOut()} />
          </>
        ) : (
          <>
            <Text style={styles.muted}>Using Guest Mode (sessions sync once you sign in)</Text>
            <Button label="Sign In / Create Account" onPress={() => router.push("/sign-in")} />
          </>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingTop: 44, paddingHorizontal: Spacing.md, gap: Spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  title: { color: Colors.dark.text, fontSize: 20, fontWeight: "700" },
  rowCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  card: { gap: Spacing.xs },
  label: { color: Colors.dark.text, fontSize: 16, fontWeight: "600" },
  muted: { color: Colors.dark.textMuted, fontSize: 13 },
});
