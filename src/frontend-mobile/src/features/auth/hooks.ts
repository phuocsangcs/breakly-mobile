// Headless auth hook for screens: state + actions, no UI.
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "./store";

export function useAuth() {
  return useAuthStore(
    useShallow((s) => ({
      status: s.status,
      user: s.user,
      isGuest: s.status === "guest",
      isAuthenticated: s.status === "authenticated",
      signIn: s.signIn,
      signUp: s.signUp,
      signOut: s.signOut,
    })),
  );
}

