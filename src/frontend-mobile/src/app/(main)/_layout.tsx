// Main group layout: runs the 1-second session countdown, handles background catch-up (FR 2.4),
// displays the persistent SessionTimerPill on secondary tabs (FR 2.3), 1-minute notice Toast (FR 2.5),
// and auto-navigates to Session Summary when a break ends.
import React, { useEffect, useRef } from "react";
import { Alert, AppState, StyleSheet, View } from "react-native";
import { router, Stack, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SessionTimerPill } from "@/components/ui/SessionTimerPill";
import { Toast } from "@/components/ui/Toast";
import { usePreferences } from "@/features/preferences";
import { useSessionStore, useSessionTimer } from "@/features/session";

const ROUTES_WITH_INLINE_TIMER = new Set(["/", "/radio", "/news", "/tv", "/games"]);

export default function MainLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { themeId } = usePreferences();
  const {
    isActive,
    formattedRemaining,
    isFinalMinute,
    showOneMinuteBanner,
    lastCompleted,
    endSession,
    dismissOneMinuteBanner,
  } = useSessionTimer();
  const prevCompletedId = useRef<string | null>(null);

  useEffect(() => {
    void useSessionStore.getState().hydrate();
    const id = setInterval(() => useSessionStore.getState().tick(), 1000);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") useSessionStore.getState().tick();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (!showOneMinuteBanner) return;
    const t = setTimeout(dismissOneMinuteBanner, 4500);
    return () => clearTimeout(t);
  }, [showOneMinuteBanner, dismissOneMinuteBanner]);

  useEffect(() => {
    if (lastCompleted && lastCompleted.clientId !== prevCompletedId.current) {
      prevCompletedId.current = lastCompleted.clientId;
      router.push("/summary");
    }
  }, [lastCompleted]);

  const confirmEndEarly = () => {
    Alert.alert("End session early?", "Your break progress up to now will be saved.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End session",
        style: "destructive",
        onPress: () => void endSession("ENDED_EARLY"),
      },
    ]);
  };

  const hasInlineTimer =
    ROUTES_WITH_INLINE_TIMER.has(pathname) || pathname.startsWith("/news/") || pathname.startsWith("/games/");

  return (
    <View style={styles.root}>
      <Stack screenOptions={{ headerShown: false }} />

      {isActive && (!hasInlineTimer || showOneMinuteBanner) ? (
        <View
          style={[styles.topOverlay, { top: Math.max(insets.top + 8, 48) }]}
          pointerEvents="box-none"
        >
          {!hasInlineTimer ? (
            <View style={styles.pillRow} pointerEvents="box-none">
              {/* The pill defaults to alignSelf: flex-start; pin it right so it never covers a screen title. */}
              <SessionTimerPill
                time={formattedRemaining}
                highlighted={isFinalMinute}
                onEndPress={confirmEndEarly}
                theme={themeId}
                style={styles.floatingPill}
              />
            </View>
          ) : null}

          {showOneMinuteBanner ? (
            <View style={styles.toastWrap} pointerEvents="box-none">
              <Toast
                title="1 minute left"
                message="Everything stops on its own, even mid-article."
                theme={themeId}
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    gap: 10,
    zIndex: 50,
  },
  pillRow: {
    alignItems: "flex-end",
  },
  floatingPill: {
    alignSelf: "flex-end",
  },
  toastWrap: {
    width: "100%",
  },
});
