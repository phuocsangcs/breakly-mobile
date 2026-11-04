// Base Axios HTTP client for the Breakly backend: bearer auth, timeouts and single-flight 401 token refresh.
// Auth is injected via `configureApiAuth` so core/ never depends on features/.
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { Env } from "@/core/config/env";
import { ApiError, type ApiErrorBody } from "./errors";

type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  query?: Record<string, QueryValue>;
  /** Attach the access token if one exists (default true). Public endpoints still work for guests. */
  auth?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ApiAuthHandlers {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  onUnauthorized: () => void;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
  skipAuth?: boolean;
}

let authHandlers: ApiAuthHandlers | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export function configureApiAuth(handlers: ApiAuthHandlers | null) {
  authHandlers = handlers;
}

export const http = axios.create({
  baseURL: `${Env.apiBaseUrl}${Env.apiPrefix}`,
  timeout: Env.requestTimeoutMs,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config: RetryableConfig) => {
  if (!config.skipAuth) {
    const token = authHandlers?.getAccessToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

function refreshOnce(): Promise<string | null> {
  if (!authHandlers) return Promise.resolve(null);
  if (!refreshInFlight) {
    refreshInFlight = authHandlers
      .refreshAccessToken()
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<ApiErrorBody>) => {
    const cfg = err.config as RetryableConfig | undefined;
    if (err.response?.status === 401 && cfg && !cfg.skipAuth && !cfg._retried && authHandlers?.getAccessToken()) {
      cfg._retried = true;
      const newToken = await refreshOnce();
      if (newToken) {
        cfg.headers.set("Authorization", `Bearer ${newToken}`);
        return http(cfg);
      }
      authHandlers.onUnauthorized();
    }
    if (err.response) {
      throw ApiError.fromResponse(err.response.status, err.response.data ?? null);
    }
    throw ApiError.network(err.code === "ECONNABORTED" ? "Request timed out" : undefined);
  },
);

function toAxiosConfig(opts?: RequestOptions): Partial<RetryableConfig> {
  return {
    params: opts?.query,
    signal: opts?.signal,
    timeout: opts?.timeoutMs,
    skipAuth: opts?.auth === false,
  };
}

export const apiClient = {
  get: async <T>(path: string, opts?: RequestOptions): Promise<T> =>
    (await http.get<T>(path, toAxiosConfig(opts))).data,
  post: async <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    (await http.post<T>(path, body, toAxiosConfig(opts))).data,
  put: async <T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> =>
    (await http.put<T>(path, body, toAxiosConfig(opts))).data,
  delete: async <T>(path: string, opts?: RequestOptions): Promise<T> =>
    (await http.delete<T>(path, toAxiosConfig(opts))).data,
};
