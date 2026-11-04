// Theme selector screen offering Cozy Room and Garden themes with persistence (FR 3.2–3.3).
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Colors, Spacing } from "@/constants/theme";
import { usePreferences, type ThemeId } from "@/features/preferences";

const THEMES: { id: ThemeId; name: string; desc: string }[] = [
  { id: "cozy-room", name: "Cozy Room", desc: "Warm indoor lamp-lit study corner" },
  { id: "garden", name: "Garden", desc: "Fresh outdoor greenery and calm breeze" },
];

export default function ThemesScreen() {
  const { themeId, setTheme } = usePreferences();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button label="← Space" variant="ghost" onPress={() => router.back()} />
        <Text style={styles.title}>Select Theme</Text>
      </View>
      {THEMES.map((t) => (
        <Card key={t.id} style={styles.card}>
          <Text style={styles.name}>{t.name}</Text>
          <Text style={styles.desc}>{t.desc}</Text>
          <Button
            label={themeId === t.id ? "Selected ✓" : "Apply Theme"}
            variant={themeId === t.id ? "primary" : "secondary"}
            onPress={() => setTheme(t.id)}
          />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingTop: 44, paddingHorizontal: Spacing.md, gap: Spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  title: { color: Colors.dark.text, fontSize: 20, fontWeight: "700" },
  card: { gap: Spacing.sm },
  name: { color: Colors.dark.text, fontSize: 17, fontWeight: "700" },
  desc: { color: Colors.dark.textMuted, fontSize: 13 },
});
