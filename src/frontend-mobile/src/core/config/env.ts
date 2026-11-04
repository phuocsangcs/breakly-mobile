// Runtime environment configuration resolved from EXPO_PUBLIC_* variables (inlined at bundle time).
// Only non-secret values belong here; API keys live on the backend.
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Resolves the backend base URL.
 * - EXPO_PUBLIC_API_URL wins when set (e.g. http://192.168.1.10:8080 for a phone on the same Wi-Fi).
 * - Otherwise, in development, reuse the Metro host IP so Expo Go on a real device can reach the laptop.
 * - Android emulator falls back to 10.0.2.2 (host loopback).
 */
function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const hostUri = Constants.expoConfig?.hostUri; // e.g. "192.168.1.10:8081"
  const host = hostUri?.split(":")[0];
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:8080`;
  }
  return Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
}

export const Env = {
  apiBaseUrl: resolveApiBaseUrl(),
  apiPrefix: "/api/v1",
  requestTimeoutMs: 15_000,
} as const;

