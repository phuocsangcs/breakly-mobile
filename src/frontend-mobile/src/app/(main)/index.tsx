// Home Space screen composing the virtual space view and session timer controls.
import React from "react";
import { View, StyleSheet } from "react-native";
import { SpaceView } from "@/components/SpaceView";
import { SessionTimerPill } from "@/components/ui/SessionTimerPill";

export default function HomeSpaceScreen() {
  return (
    <View style={styles.container}>
      <SpaceView />
      <View style={styles.pillContainer}>
        <SessionTimerPill />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pillContainer: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
  },
});
