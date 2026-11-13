// Theme selector screen offering Cozy chill room and Normal (Garden) themes with live color previews (FR 3.2–3.3).
import React from "react";
import { AppText as Text } from "@/components/ui/AppText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import {
  Colors,
  FontFamilies,
  getThemeColors,
  Radius,
  Spacing,
  Typography,
} from "@/constants/theme";
import { usePreferences, type ThemeId } from "@/features/preferences";

interface ThemeOption {
  id: ThemeId;
  name: string;
  desc: string;
  previewBg: string;
  previewSurface: string;
  previewAccent: string;
}

const THEMES: ThemeOption[] = [
  {
    id: "cozy-room",
    name: "Cozy chill room",
    desc: "Warm lamp-lit evening corner with amber tones and starry night window",
    previewBg: Colors.dark.background,
    previewSurface: Colors.dark.surface,
    previewAccent: Colors.dark.accent,
  },
  {
    id: "garden",
    name: "Normal (Daylight Garden)",
    desc: "Fresh cream paper tones, warm sunlight and forest sage accents",
    previewBg: Colors.light.background,
    previewSurface: Colors.light.surface,
    previewAccent: Colors.light.accent,
  },
];

export default function ThemesScreen() {
  const insets = useSafeAreaInsets();
  const { themeId, setTheme } = usePreferences();
  const palette = getThemeColors(themeId);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.background,
          paddingTop: Math.max(insets.top + 8, 48),
        },
      ]}
    >
      <View style={styles.header}>
        <IconButton
          icon="back"
          theme={themeId}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        />
        <Text style={[styles.title, { color: palette.text }]}>Room Theme</Text>
      </View>

      <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
        Choose the atmosphere that matches your current break mood.
      </Text>

      <View style={styles.cardsList}>
        {THEMES.map((t) => {
          const isSelected = themeId === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.85}
              onPress={() => setTheme(t.id)}
            >
              <Card
                theme={themeId}
                style={[
                  styles.card,
                  isSelected && {
                    borderColor: palette.accent,
                    borderWidth: 2,
                  },
                ]}
              >
                {/* Mini Theme Swatch Preview */}
                <View style={styles.previewRow}>
                  <View
                    style={[
                      styles.swatchBox,
                      { backgroundColor: t.previewBg, borderColor: palette.line },
                    ]}
                  >
                    <View
                      style={[
                        styles.swatchCard,
                        { backgroundColor: t.previewSurface },
                      ]}
                    >
                      <View
                        style={[
                          styles.swatchDot,
                          { backgroundColor: t.previewAccent },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={[styles.name, { color: palette.text }]}>
                      {t.name}
                    </Text>
                    <Text style={[styles.desc, { color: palette.textSecondary }]}>
                      {t.desc}
                    </Text>
                  </View>
                </View>

                <Button
                  label={isSelected ? "Active Theme ✓" : "Apply Theme"}
                  variant={isSelected ? "primary" : "secondary"}
                  size="md"
                  theme={themeId}
                  onPress={() => setTheme(t.id)}
                  fullWidth
                />
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  title: {
    ...Typography.presets.h2,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
  },
  cardsList: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  card: {
    gap: Spacing.md,
    padding: Spacing.md,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  swatchBox: {
    width: 68,
    height: 68,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 8,
    justifyContent: "flex-end",
  },
  swatchCard: {
    width: "100%",
    height: 28,
    borderRadius: 6,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  swatchDot: {
    width: 14,
    height: 6,
    borderRadius: 3,
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: FontFamilies.display,
    fontSize: 18,
    fontWeight: "600",
  },
  desc: {
    fontSize: Typography.sizes.caption,
    lineHeight: 18,
  },
});
