// Main app group layout configuring bottom tabs or main navigation stack.
import { Stack } from "expo-router";

export default function MainLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

