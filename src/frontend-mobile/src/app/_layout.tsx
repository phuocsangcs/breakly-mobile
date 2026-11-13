// Root layout configuring global navigation stack, providers, and theme-synced status bar.
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "@/core/query";
import { useAuthStore } from "@/features/auth";
import { usePreferencesStore } from "@/features/preferences";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Fraunces-SemiBold": require("../../assets/fonts/Fraunces-SemiBold.ttf"),
    "DMSans-Regular": require("../../assets/fonts/DMSans-Regular.ttf"),
    "DMSans-Medium": require("../../assets/fonts/DMSans-Medium.ttf"),
    "DMSans-SemiBold": require("../../assets/fonts/DMSans-SemiBold.ttf"),
    "DMSans-Bold": require("../../assets/fonts/DMSans-Bold.ttf"),
  });
  const themeId = usePreferencesStore((s) => s.themeId);

  useEffect(() => {
    void useAuthStore.getState().bootstrap();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={themeId === "garden" ? "dark" : "light"} />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
