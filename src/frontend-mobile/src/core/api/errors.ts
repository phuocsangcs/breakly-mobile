// Normalized error type for every API / network failure so UI can branch on `kind` instead of raw responses.

export type ApiErrorKind =
  | "network" // no connection, DNS failure, timeout
  | "unauthorized" // 401 after refresh attempt
  | "validation" // 400 with field details
  | "conflict" // 409
  | "not_found" // 404
  | "upstream" // 502 from an external provider (Jamendo, RSS, YouTube)
  | "server" // other 5xx
  | "unknown";

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: Record<string, unknown> | null;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly code: string | null;
  readonly details: Record<string, unknown> | null;

  constructor(params: {
    kind: ApiErrorKind;
    message: string;
    status?: number | null;
    code?: string | null;
    details?: Record<string, unknown> | null;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.kind = params.kind;
    this.status = params.status ?? null;
    this.code = params.code ?? null;
    this.details = params.details ?? null;
  }

  /** Field-level validation messages, e.g. { email: "must be a well-formed email address" }. */
  get fieldErrors(): Record<string, string> {
    const fields = this.details?.fields;
    return fields && typeof fields === "object" ? (fields as Record<string, string>) : {};
  }

  static fromResponse(status: number, body: ApiErrorBody | null): ApiError {
    const message = body?.message ?? `Request failed with status ${status}`;
    const base = { status, code: body?.code ?? null, details: body?.details ?? null, message };
    if (status === 401) return new ApiError({ kind: "unauthorized", ...base });
    if (status === 400) return new ApiError({ kind: "validation", ...base });
    if (status === 404) return new ApiError({ kind: "not_found", ...base });
    if (status === 409) return new ApiError({ kind: "conflict", ...base });
    if (status === 502) return new ApiError({ kind: "upstream", ...base });
    if (status >= 500) return new ApiError({ kind: "server", ...base });
    return new ApiError({ kind: "unknown", ...base });
  }

  static network(message = "Network request failed"): ApiError {
    return new ApiError({ kind: "network", message });
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

/** True for failures worth retrying automatically (offline / transient server issues). */
export function isRetryable(e: unknown): boolean {
  return isApiError(e) && (e.kind === "network" || e.kind === "server" || e.kind === "upstream");
}

