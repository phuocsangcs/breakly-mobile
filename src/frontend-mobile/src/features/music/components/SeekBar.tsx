// Draggable scrubber over the Figma "track" ProgressBar: tap or drag to seek. While dragging, the bar
// follows the finger and the seek is applied on release, so the stream is not re-buffered on every move.
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { BreaklyThemeId, ThemeMode } from "@/constants/theme";

export function SeekBar({ positionSec, durationSec, onSeek, onScrub, theme }: {
  positionSec: number;
  durationSec: number;
  onSeek: (seconds: number) => void;
  /** Live preview position while the finger is down (null when released). */
  onScrub?: (seconds: number | null) => void;
  theme?: ThemeMode | BreaklyThemeId;
}) {
  const [width, setWidth] = useState(0);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const canSeek = durationSec > 0 && width > 0;

  const ratioAt = (x: number) => Math.max(0, Math.min(1, x / width));
  const move = (x: number) => {
    const r = ratioAt(x);
    setDragRatio(r);
    onScrub?.(r * durationSec);
  };
  const release = (x: number) => {
    const r = ratioAt(x);
    setDragRatio(null);
    onScrub?.(null);
    onSeek(r * durationSec);
  };

  const progress = dragRatio ?? (durationSec > 0 ? Math.max(0, Math.min(1, positionSec / durationSec)) : 0);

  return <View
    style={styles.hitArea}
    onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    accessible
    accessibilityRole="adjustable"
    accessibilityLabel="Track position"
    accessibilityValue={{ min: 0, max: Math.round(durationSec), now: Math.round(positionSec) }}
    accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
    onAccessibilityAction={(e) => {
      if (!canSeek) return;
      onSeek(positionSec + (e.nativeEvent.actionName === "increment" ? 15 : -15));
    }}
    onStartShouldSetResponder={() => canSeek}
    onMoveShouldSetResponder={() => canSeek}
    // Keep the gesture even if the finger drifts vertically (e.g. inside a ScrollView).
    onResponderTerminationRequest={() => false}
    onResponderGrant={(e) => move(e.nativeEvent.locationX)}
    onResponderMove={(e) => move(e.nativeEvent.locationX)}
    onResponderRelease={(e) => release(e.nativeEvent.locationX)}
    onResponderTerminate={() => {
      setDragRatio(null);
      onScrub?.(null);
    }}
  >
    <View pointerEvents="none">
      <ProgressBar type="track" progress={progress} theme={theme} />
    </View>
  </View>;
}

const styles = StyleSheet.create({
  // Taller than the 4px bar so it is easy to grab with a thumb.
  hitArea: { paddingVertical: 12, justifyContent: "center" },
});
