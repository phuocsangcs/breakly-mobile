// Live wall clock drawn over the Figma room clock (centre 70,362 in the 390x844 frame).
// Shows the device's current time; both hands glide to their new angle at every minute change.
import React, { useEffect, useRef, useState } from "react";
import { Animated, AppState, Easing, Platform, StyleSheet, View } from "react-native";

const CX = 70;
const CY = 362;
const FACE_R = 28; // covers the static hands and ticks baked into the background
const TICK_R = 22.5;
const MINUTE_LEN = 19;
const HOUR_LEN = 16;
const HAND_W = 3;
const useNativeDriver = Platform.OS !== "web";

const COLORS = {
  cozy: { face: "#F3E6CC", ink: "#2E2F46" },
  garden: { face: "#FFFFFF", ink: "#1F2A2A" },
};

function anglesFor(date: Date) {
  const m = date.getMinutes();
  return { minute: m * 6, hour: (date.getHours() % 12) * 30 + m * 0.5 };
}

/** Rotates forward only (59 → 0 goes +6°, not -354°), so hands never spin backwards. */
function useHandAngle(target: number) {
  const total = useRef(target);
  const value = useState(() => new Animated.Value(target))[0];
  useEffect(() => {
    const current = ((total.current % 360) + 360) % 360;
    const delta = (((target - current) % 360) + 360) % 360;
    if (delta === 0) return;
    total.current += delta;
    Animated.timing(value, {
      toValue: total.current,
      duration: delta > 30 ? 900 : 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver,
    }).start();
  }, [target, value]);
  return value.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] });
}

function useNow(): Date {
  const [now, setNow] = React.useState(() => new Date());
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    // Align to the next minute boundary, then tick every minute.
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000) + 50);
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") setNow(new Date());
    });
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
      sub.remove();
    };
  }, []);
  return now;
}

export function WallClock({ garden }: { garden: boolean }) {
  const c = garden ? COLORS.garden : COLORS.cozy;
  const { minute, hour } = anglesFor(useNow());
  const minuteRotate = useHandAngle(minute);
  const hourRotate = useHandAngle(hour);

  const hand = (len: number, rotate: Animated.AnimatedInterpolation<string>) => (
    <Animated.View style={[styles.hand, {
      left: CX - HAND_W / 2, top: CY - len, height: len + HAND_W / 2, backgroundColor: c.ink,
      // Pivot on the clock centre: `len` px down from the hand's top (the rest is the rounded cap).
      transformOrigin: [HAND_W / 2, len, 0],
      transform: [{ rotate }],
    }]} />
  );

  return <View pointerEvents="none" style={StyleSheet.absoluteFill}
    accessible accessibilityLabel={`Clock showing ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}>
    <View style={[styles.face, { backgroundColor: c.face }]} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      return <View key={i} style={[styles.tick, {
        backgroundColor: c.ink,
        left: CX + TICK_R * Math.sin(a) - 1,
        top: CY - TICK_R * Math.cos(a) - 2.5,
        transform: [{ rotate: `${i * 30}deg` }],
      }]} />;
    })}
    {hand(HOUR_LEN, hourRotate)}
    {hand(MINUTE_LEN, minuteRotate)}
    <View style={styles.pin} />
  </View>;
}

const styles = StyleSheet.create({
  face: {
    position: "absolute",
    left: CX - FACE_R,
    top: CY - FACE_R,
    width: FACE_R * 2,
    height: FACE_R * 2,
    borderRadius: FACE_R,
  },
  tick: { position: "absolute", width: 2, height: 5, borderRadius: 1 },
  hand: {
    position: "absolute",
    width: HAND_W,
    borderRadius: HAND_W / 2,
  },
  pin: {
    position: "absolute",
    left: CX - 3,
    top: CY - 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E9B44C",
  },
});
