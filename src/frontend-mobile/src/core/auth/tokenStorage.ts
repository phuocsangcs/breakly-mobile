// Secure persistence for the refresh token (Keychain / Keystore). Access tokens stay in memory only.
import * as SecureStore from "expo-secure-store";

const REFRESH_KEY = "breakly.refreshToken";

export const tokenStorage = {
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_KEY),
  setRefreshToken: (token: string) => SecureStore.setItemAsync(REFRESH_KEY, token),
  clear: () => SecureStore.deleteItemAsync(REFRESH_KEY),
};

