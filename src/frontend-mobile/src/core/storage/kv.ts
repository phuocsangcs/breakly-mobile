// Typed JSON key-value storage on top of AsyncStorage for non-sensitive local cache (preferences, offline queue...).
// Tokens must NOT go here – use core/auth/tokenStorage (SecureStore).
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StateStorage } from "zustand/middleware";

const PREFIX = "breakly:";

export const StorageKeys = {
  preferences: "preferences",
  sessionActive: "session:active",
  sessionHistory: "session:history",
  sessionSyncQueue: "session:syncQueue",
  musicState: "music:state",
  authUser: "auth:user",
} as const;

export const kv = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null; // corrupted entry → behave as empty
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(PREFIX + key);
  },
};

/** Adapter for zustand `persist` middleware. */
export const zustandStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(PREFIX + name),
  setItem: (name, value) => AsyncStorage.setItem(PREFIX + name, value),
  removeItem: (name) => AsyncStorage.removeItem(PREFIX + name),
};

