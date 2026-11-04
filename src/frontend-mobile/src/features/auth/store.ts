// Auth state machine (loading → guest | authenticated) and wiring of the API client's token refresh.
import { create } from "zustand";
import { configureApiAuth, isApiError } from "@/core/api";
import { tokenStorage } from "@/core/auth/tokenStorage";
import { authApi } from "./api";
import type { AuthResponse, AuthStatus, SignInInput, SignUpInput, User } from "./types";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  bootstrap: () => Promise<void>;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
}

type Listener = (user: User) => void;
const signedInListeners = new Set<Listener>();

/** Lets other features react to a fresh sign-in (e.g. upload guest sessions, pull preferences). */
export function onSignedIn(listener: Listener): () => void {
  signedInListeners.add(listener);
  return () => signedInListeners.delete(listener);
}

export const useAuthStore = create<AuthState>((set, get) => {
  const applySession = async (res: AuthResponse) => {
    await tokenStorage.setRefreshToken(res.refreshToken);
    set({ status: "authenticated", user: res.user, accessToken: res.accessToken });
  };

  const becomeGuest = async () => {
    await tokenStorage.clear();
    set({ status: "guest", user: null, accessToken: null });
  };

  const refresh = async (): Promise<string | null> => {
    const stored = await tokenStorage.getRefreshToken();
    if (!stored) return null;
    try {
      const res = await authApi.refresh(stored);
      await applySession(res);
      return res.accessToken;
    } catch (e) {
      // Only drop the session when the server rejected the token; keep it when offline.
      if (isApiError(e) && e.kind === "unauthorized") await becomeGuest();
      return null;
    }
  };

  configureApiAuth({
    getAccessToken: () => get().accessToken,
    refreshAccessToken: refresh,
    onUnauthorized: () => void becomeGuest(),
  });

  const finishSignIn = async (res: AuthResponse) => {
    await applySession(res);
    signedInListeners.forEach((l) => l(res.user));
  };

  return {
    status: "loading",
    user: null,
    accessToken: null,

    bootstrap: async () => {
      const token = await refresh();
      if (!token && get().status === "loading") set({ status: "guest" });
    },

    signIn: async (input) => finishSignIn(await authApi.login(input)),

    signUp: async (input) => finishSignIn(await authApi.register(input)),

    signOut: async () => {
      const stored = await tokenStorage.getRefreshToken();
      if (stored) await authApi.logout(stored).catch(() => undefined);
      await becomeGuest();
    },
  };
});

