// Root layout configuring global navigation stack and application providers.
import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/query";
import { useAuthStore } from "@/features/auth";

export default function RootLayout() {
  useEffect(() => {
    void useAuthStore.getState().bootstrap();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
