// Interactive virtual space scene with Radio (Music), Newspaper (News) and TV (Short Videos) hotspots (FR 3.1–3.2).
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Spacing } from "@/constants/theme";
import type { ThemeId } from "@/features/preferences";
import type { ServiceType } from "@/features/session";

const THEME_PALETTE: Record<ThemeId, { name: string; bg: string; card: string; accent: string }> = {
  "cozy-room": { name: "Cozy Room", bg: "#1E1B2E", card: "#2D2747", accent: "#F59E0B" },
  garden: { name: "Garden", bg: "#0F291E", card: "#1B4332", accent: "#34D399" },
};

interface SpaceViewProps {
  themeId?: ThemeId;
  onSelectObject?: (service: ServiceType) => void;
}

export function SpaceView({ themeId = "cozy-room", onSelectObject }: SpaceViewProps) {
  const palette = THEME_PALETTE[themeId] ?? THEME_PALETTE["cozy-room"];

  const items: { service: ServiceType; icon: string; label: string; sub: string }[] = [
    { service: "MUSIC", icon: "📻", label: "Music (Radio)", sub: "Jamendo ambient & lo-fi" },
    { service: "NEWS", icon: "📰", label: "News", sub: "VnExpress RSS reader" },
    { service: "VIDEO", icon: "📺", label: "Short & Long Videos", sub: "Curated YouTube TV" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <Text style={[styles.themeTitle, { color: palette.accent }]}>{palette.name}</Text>
      <Text style={styles.subtitle}>Tap an object in your space to start or continue your break</Text>
      <View style={styles.grid}>
        {items.map((it) => (
          <TouchableOpacity
            key={it.service}
            style={[styles.hotspot, { backgroundColor: palette.card, borderColor: palette.accent }]}
            onPress={() => onSelectObject?.(it.service)}
          >
            <Text style={styles.icon}>{it.icon}</Text>
            <View style={styles.hotspotText}>
              <Text style={styles.label}>{it.label}</Text>
              <Text style={styles.sub}>{it.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.lg, gap: Spacing.md },
  themeTitle: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#CBD5E1", fontSize: 13, textAlign: "center", marginBottom: Spacing.sm },
  grid: { width: "100%", gap: Spacing.md },
  hotspot: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    gap: Spacing.md,
  },
  icon: { fontSize: 28 },
  hotspotText: { flex: 1 },
  label: { color: "#F8FAFC", fontSize: 16, fontWeight: "700" },
  sub: { color: "#94A3B8", fontSize: 12 },
});
