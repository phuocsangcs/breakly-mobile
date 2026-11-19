// Animated view through the room window (glass 148,305 → 242,426 in the 390x844 frame, arched top r=47):
// sky + sun/moon, slowly drifting clouds, twinkling stars at night, then the window cross drawn back on top.
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";

const GLASS = { left: 148, top: 305, width: 94, height: 121 };
const FRAME = { cozy: "#E8D9BF", garden: "#FFFFFF" };
const SKY = {
  cozy: require("../../../assets/room/sky-cozy.svg"),
  garden: require("../../../assets/room/sky-garden.svg"),
};
const useNativeDriver = Platform.OS !== "web";

type Cloud = { top: number; scale: number; duration: number; phase: number };
// Few, slow clouds: a calm room, not a weather report. phase = where in its trip a cloud starts.
const CLOUDS: Cloud[] = [
  { top: 60, scale: 1, duration: 46_000, phase: 0.15 },
  { top: 18, scale: 0.7, duration: 62_000, phase: 0.6 },
  { top: 88, scale: 0.85, duration: 54_000, phase: 0.85 },
];
const CLOUD_W = 40;
// Star positions from the Figma night sky, relative to the glass.
const STARS = [[18, 25], [32, 91], [60, 83], [84, 97], [22, 55]] as const;

/** 0→1 forever, starting at `phase`, so clouds are already spread out when the screen opens. */
function useLoop(duration: number, phase: number) {
  const v = useState(() => new Animated.Value(phase))[0];
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    const first = Animated.timing(v, {
      toValue: 1, duration: duration * (1 - phase), easing: Easing.linear, useNativeDriver,
    });
    first.start(({ finished }) => {
      if (!finished) return;
      v.setValue(0);
      loop = Animated.loop(Animated.timing(v, { toValue: 1, duration, easing: Easing.linear, useNativeDriver }));
      loop.start();
    });
    return () => {
      first.stop();
      loop?.stop();
    };
  }, [duration, phase, v]);
  return v;
}

function DriftingCloud({ cloud, color, opacity }: { cloud: Cloud; color: string; opacity: number }) {
  const t = useLoop(cloud.duration, cloud.phase);
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [-CLOUD_W * cloud.scale - 4, GLASS.width + 4] });
  return <Animated.View style={[styles.cloud, { top: cloud.top, opacity, transform: [{ translateX }, { scale: cloud.scale }] }]}>
    <View style={[styles.puff, { backgroundColor: color, left: 0, top: 8, width: 26, height: 12 }]} />
    <View style={[styles.puff, { backgroundColor: color, left: 9, top: 0, width: 18, height: 18 }]} />
    <View style={[styles.puff, { backgroundColor: color, left: 16, top: 5, width: 24, height: 15 }]} />
  </Animated.View>;
}

function TwinklingStar({ x, y, delay }: { x: number; y: number; delay: number }) {
  const o = useState(() => new Animated.Value(0.85))[0];
  useEffect(() => {
    const anim = Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(o, { toValue: 0.25, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver }),
      Animated.timing(o, { toValue: 0.85, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver }),
    ]));
    anim.start();
    return () => anim.stop();
  }, [delay, o]);
  return <Animated.View style={[styles.star, { left: x - 1.6, top: y - 1.6, opacity: o }]} />;
}

export function WindowSky({ garden }: { garden: boolean }) {
  const frame = garden ? FRAME.garden : FRAME.cozy;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={styles.glass}>
      <Image source={garden ? SKY.garden : SKY.cozy} style={StyleSheet.absoluteFill} contentFit="fill" />
      {!garden && STARS.map(([x, y], i) => <TwinklingStar key={i} x={x} y={y} delay={i * 700} />)}
      {CLOUDS.map((c, i) => (
        <DriftingCloud key={i} cloud={c} color={garden ? "#FFFFFF" : "#8C8FBF"} opacity={garden ? 0.95 : 0.4} />
      ))}
    </View>
    {/* Window cross, redrawn above the clouds. */}
    <View style={[styles.mullionV, { backgroundColor: frame }]} />
    <View style={[styles.mullionH, { backgroundColor: frame }]} />
  </View>;
}

const styles = StyleSheet.create({
  glass: {
    position: "absolute",
    left: GLASS.left,
    top: GLASS.top,
    width: GLASS.width,
    height: GLASS.height,
    borderTopLeftRadius: GLASS.width / 2,
    borderTopRightRadius: GLASS.width / 2,
    overflow: "hidden",
  },
  cloud: { position: "absolute", left: 0, width: CLOUD_W, height: 20 },
  puff: { position: "absolute", borderRadius: 999 },
  star: { position: "absolute", width: 3.2, height: 3.2, borderRadius: 1.6, backgroundColor: "#F6E7B8" },
  mullionV: { position: "absolute", left: 192.5, top: 304, width: 5, height: 122 },
  mullionH: { position: "absolute", left: 148, top: 369.5, width: 94, height: 5 },
});
