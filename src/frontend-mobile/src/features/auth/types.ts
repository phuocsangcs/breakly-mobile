// Auth domain types (mirror backend AuthDto).
export interface User {
  id: string;
  email: string;
  displayName: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInInput {
  displayName?: string;
}

/** `loading` until the stored refresh token has been checked on startup. Guests can use every core feature. */
export type AuthStatus = "loading" | "guest" | "authenticated";

