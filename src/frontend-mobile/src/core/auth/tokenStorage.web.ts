// SecureStore is native-only. Browser previews keep tokens in memory, never in localStorage.
// A page reload intentionally starts a guest session; native Keychain/Keystore persistence is unchanged.
let refreshToken: string | null = null;
export const tokenStorage = {
  getRefreshToken: async () => refreshToken,
  setRefreshToken: async (token: string) => { refreshToken = token; },
  clear: async () => { refreshToken = null; },
};
