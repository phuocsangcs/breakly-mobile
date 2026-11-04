// Compact SessionTimerPill displaying remaining session time and early-end action (FR 2.3, FR 2.5).
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, Spacing } from "@/constants/theme";

interface SessionTimerPillProps {
  time?: string;
  highlighted?: boolean;
  onEndPress?: () => void;
}

export function SessionTimerPill({ time = "20:00", highlighted, onEndPress }: SessionTimerPillProps) {
  return (
    <View style={[styles.pill, highlighted && styles.pillUrgent]}>
      <Text style={[styles.text, highlighted && styles.textUrgent]}>⏱ {time}</Text>
      {onEndPress && (
        <TouchableOpacity onPress={onEndPress}>
          <Text style={styles.endBtn}>End</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  pillUrgent: { borderColor: "#F59E0B" },
  text: { color: Colors.dark.primary, fontWeight: "700" },
  textUrgent: { color: "#F59E0B" },
  endBtn: { color: "#F87171", fontWeight: "600", fontSize: 12 },
});
