// Download control for one track: ↓ download, spinner while saving, ✓ when kept offline (tap for options).
// Hidden when the track's licence does not allow downloads.
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View, type StyleProp, type ViewStyle } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { BreaklyThemeId, getThemeColors, ThemeMode, Typography } from "@/constants/theme";
import { useDownloadsStore } from "../downloads";
import type { Track } from "../types";

function useTrackDownload(track: Track) {
  const downloaded = useDownloadsStore((s) => !!s.items[track.id]);
  const status = useDownloadsStore((s) => s.status[track.id]);
  const { download, remove, saveToDevice } = useDownloadsStore.getState();

  const showOptions = () => {
    Alert.alert(track.title, "Saved in Breakly, so it plays offline.", [
      {
        text: "Save to phone",
        onPress: () => {
          void saveToDevice(track.id).then((r) => {
            if (r === "saved") Alert.alert("Saved", "The MP3 is in the folder you picked.");
          }).catch(() => Alert.alert("Could not save", "Please try another folder."));
        },
      },
      { text: "Remove download", style: "destructive", onPress: () => void remove(track.id) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return {
    allowed: !!track.downloadUrl,
    downloaded,
    downloading: status === "downloading",
    failed: status === "error",
    onPress: () => (downloaded ? showOptions() : void download(track)),
  };
}

/** Compact 32px circle for track rows. */
export function DownloadIconButton({ track, theme = "dark", style }: {
  track: Track; theme?: ThemeMode | BreaklyThemeId; style?: StyleProp<ViewStyle>;
}) {
  const palette = getThemeColors(theme);
  const d = useTrackDownload(track);
  if (!d.allowed) return null;
  const label = d.downloaded ? "Downloaded, more options" : d.failed ? "Download failed, retry" : "Download MP3";
  return (
    <TouchableOpacity onPress={d.onPress} disabled={d.downloading} accessibilityRole="button" accessibilityLabel={label}
      hitSlop={8} style={[styles.circle, { borderColor: d.downloaded ? palette.accent : palette.line }, style]}>
      {d.downloading ? (
        <ActivityIndicator size="small" color={palette.accent} />
      ) : (
        <Text style={[styles.glyph, { color: d.downloaded ? palette.accent : d.failed ? palette.danger : palette.text }]}>
          {d.downloaded ? "✓" : d.failed ? "!" : "↓"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

/** Full-width action for the expanded player. */
export function DownloadActionButton({ track, theme = "dark" }: { track: Track; theme?: ThemeMode | BreaklyThemeId }) {
  const d = useTrackDownload(track);
  if (!d.allowed) return <View />;
  const label = d.downloading ? "Downloading…"
    : d.downloaded ? "✓ Offline · Save to phone"
    : d.failed ? "Retry download"
    : "↓ Download MP3";
  return <Button label={label} variant="ghost" size="md" theme={theme} disabled={d.downloading} onPress={d.onPress} />;
}

const styles = StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    fontSize: Typography.sizes.md,
    lineHeight: 18,
    fontWeight: Typography.weights.semibold,
  },
});
