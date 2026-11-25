// Music notes rising from the radio while music plays (replaces the static Figma note group).
// Each note fades in, floats up with a gentle sway and a slight tilt, then fades out; staggered so a
// couple are always in the air. When the music stops, the notes in flight fade away.
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";

const NOTE_DOUBLE = require("../../../assets/room/note-double.svg");
const NOTE_SINGLE = require("../../../assets/room/note-single.svg");
const useNativeDriver = Platform.OS !== "web";

// Spawn points sit just above the radio's top-right corner (radio: x 14–106, top 466 in the 390x844 frame).
const NOTES = [
  { source: NOTE_DOUBLE, w: 21, h: 27, x: 74, y: 448, rise: 58, sway: 9, tilt: 12, duration: 3400, delay: 0 },
  { source: NOTE_SINGLE, w: 9, h: 19, x: 96, y: 452, rise: 50, sway: -7, tilt: -14, duration: 3000, delay: 1100 },
  { source: NOTE_DOUBLE, w: 16, h: 21, x: 58, y: 454, rise: 46, sway: -6, tilt: -10, duration: 3800, delay: 2200 },
  { source: NOTE_SINGLE, w: 8, h: 17, x: 86, y: 450, rise: 62, sway: 8, tilt: 16, duration: 3600, delay: 2900 },
] as const;

type Note = (typeof NOTES)[number];

function FloatingNote({ note }: { note: Note }) {
  const t = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    // The stagger delay runs once; after that each note loops back-to-back.
    const anim = Animated.sequence([
      Animated.delay(note.delay),
      Animated.loop(Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: note.duration, easing: Easing.out(Easing.quad), useNativeDriver }),
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver }),
      ])),
    ]);
    anim.start();
    return () => anim.stop();
  }, [note, t]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -note.rise] });
  // Sway left-right twice on the way up.
  const translateX = t.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, note.sway, 0, -note.sway * 0.6, note.sway * 0.4],
  });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${note.tilt}deg`] });
  const scale = t.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.6, 1, 0.9] });
  const opacity = t.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 0.85, 0] });

  return <Animated.View style={[styles.note, {
    left: note.x, top: note.y, width: note.w, height: note.h, opacity,
    transform: [{ translateX }, { translateY }, { rotate }, { scale }],
  }]}>
    <Image source={note.source} style={StyleSheet.absoluteFill} contentFit="contain" />
  </Animated.View>;
}

export function MusicNotes({ playing }: { playing: boolean }) {
  // Stays rendered while playing and during the fade-out; state only changes when a fade finishes.
  const [fadedOut, setFadedOut] = useState(!playing);
  const fade = useState(() => new Animated.Value(playing ? 1 : 0))[0];

  useEffect(() => {
    const anim = Animated.timing(fade, { toValue: playing ? 1 : 0, duration: playing ? 300 : 700, useNativeDriver });
    anim.start(({ finished }) => {
      if (finished) setFadedOut(!playing);
    });
    return () => anim.stop();
  }, [playing, fade]);

  if (!playing && fadedOut) return null;
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: fade }]}>
    <View style={StyleSheet.absoluteFill}>
      {NOTES.map((n, i) => <FloatingNote key={i} note={n} />)}
    </View>
  </Animated.View>;
}

const styles = StyleSheet.create({
  note: { position: "absolute" },
});
