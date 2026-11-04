// Auth endpoints. Called without the bearer token; logout is idempotent on the server.
import { apiClient } from "@/core/api";
import type { AuthResponse, SignInInput, SignUpInput, User } from "./types";

export const authApi = {
  register: (input: SignUpInput) => apiClient.post<AuthResponse>("/auth/register", input, { auth: false }),
  login: (input: SignInInput) => apiClient.post<AuthResponse>("/auth/login", input, { auth: false }),
  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/auth/refresh", { refreshToken }, { auth: false }),
  logout: (refreshToken: string) => apiClient.post<void>("/auth/logout", { refreshToken }, { auth: false }),
  me: () => apiClient.get<User>("/users/me"),
};

