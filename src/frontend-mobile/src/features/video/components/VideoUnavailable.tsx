import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { getThemeColors, Typography } from "@/constants/theme";
import { usePreferences } from "@/features/preferences";

export function VideoUnavailable({ onRetry }: { onRetry: () => void }) {
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  return <ScrollView style={{ flex: 1, backgroundColor: palette.background }} contentContainerStyle={styles.content}>
    <Text accessibilityRole="alert" style={[styles.title, { color: palette.text }]}>This video is unavailable</Text>
    <Text style={[styles.message, { color: palette.textSecondary }]}>Check your connection and try again, or choose another video.</Text>
    <Button label="Try again" size="md" theme={themeId} onPress={onRetry} />
  </ScrollView>;
}
const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, gap: 12 },
  title: { ...Typography.presets.title, textAlign: "center" },
  message: { fontSize: 14, lineHeight: 20, textAlign: "center" },
});
