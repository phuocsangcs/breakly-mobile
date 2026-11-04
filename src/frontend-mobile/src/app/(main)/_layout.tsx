// Main group layout: runs the 1-second session countdown, handles background catch-up (FR 2.4),
// shows the persistent timer pill on every screen (FR 2.3), 1-minute notice (FR 2.5) and auto-navigates to Summary.
import React, { useEffect, useRef } from "react";
import { Alert, AppState, StyleSheet, View } from "react-native";
import { router, Stack } from "expo-router";
import { SessionTimerPill } from "@/components/ui/SessionTimerPill";
import { Toast } from "@/components/ui/Toast";
import { useSessionStore, useSessionTimer } from "@/features/session";

export default function MainLayout() {
  const { isActive, formattedRemaining, isFinalMinute, showOneMinuteBanner, lastCompleted, endSession, dismissOneMinuteBanner } =
    useSessionTimer();
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
    const t = setTimeout(dismissOneMinuteBanner, 4000);
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
      { text: "End session", style: "destructive", onPress: () => void endSession("ENDED_EARLY") },
    ]);
  };

  return (
    <View style={styles.root}>
      <Stack screenOptions={{ headerShown: false }} />
      {isActive && (
        <View style={styles.topOverlay} pointerEvents="box-none">
          <SessionTimerPill time={formattedRemaining} highlighted={isFinalMinute} onEndPress={confirmEndEarly} />
          {showOneMinuteBanner && <Toast message="One minute left in your break" />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topOverlay: { position: "absolute", top: 44, left: 0, right: 0, alignItems: "center", gap: 8 },
});
