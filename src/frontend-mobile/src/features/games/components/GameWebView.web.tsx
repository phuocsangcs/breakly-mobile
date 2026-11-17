// Web build: game sites forbid being embedded in an iframe, so the game opens in a new browser tab instead.
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { getThemeColors, Typography } from "@/constants/theme";
import { usePreferences } from "@/features/preferences";
import type { GameWebViewProps } from "./GameWebView.types";
export type { GameWebViewProps } from "./GameWebView.types";

export function GameWebView({ url, title, style, onLoadEnd, onOpened }: GameWebViewProps) {
  const { themeId } = usePreferences();
  const palette = getThemeColors(themeId);
  const opened = useRef(false);

  useEffect(() => {
    onLoadEnd?.(); // nothing to load in-page; let the screen drop its loading state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = () => {
    if (!opened.current) {
      opened.current = true;
      onOpened?.();
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return <View style={[styles.root, style]}>
    <Text style={[styles.title, { color: palette.text }]}>{title} opens in a new tab</Text>
    <Text style={[styles.sub, { color: palette.textSecondary }]}>
      The game site does not allow being shown inside other web pages. Your break timer keeps running here.
    </Text>
    <Button label={`Open ${title}`} theme={themeId} onPress={open} />
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  title: { ...Typography.presets.h2, fontSize: 22, textAlign: "center" },
  sub: { fontSize: 15, lineHeight: 22, textAlign: "center", maxWidth: 320 },
});
