// Type definitions for authentication credentials, tokens, and user profiles.
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

