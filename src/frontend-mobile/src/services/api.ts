// Base HTTP client instance for communicating with Breakly backend REST endpoints.
import { Config } from "@/constants/config";

export const apiClient = {
  baseUrl: Config.apiBaseUrl,
  get: async <T>(path: string): Promise<T | null> => null,
  post: async <T>(path: string, body?: unknown): Promise<T | null> => null,
};

