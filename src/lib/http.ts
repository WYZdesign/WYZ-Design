import { NextResponse } from "next/server";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE";

const STATUS_TO_CODE: Record<number, ErrorCode> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  413: "PAYLOAD_TOO_LARGE",
  415: "UNSUPPORTED_MEDIA_TYPE",
  429: "RATE_LIMITED",
  500: "INTERNAL_ERROR",
  503: "SERVICE_UNAVAILABLE",
};

/**
 * Standardized error response.
 *
 * Keeps `error` as a plain string for backward compatibility with existing
 * frontend consumers (`toast.error(data.error)`) and adds structured fields
 * (`code`, `timestamp`, optional `retryAfter`, `details`) for programmatic use.
 */
export function errorResponse(
  message: string,
  status = 500,
  options?: { code?: ErrorCode; retryAfter?: number; details?: unknown }
): NextResponse {
  const body: Record<string, unknown> = {
    error: message,
    timestamp: new Date().toISOString(),
  };

  const code = options?.code ?? STATUS_TO_CODE[status] ?? "INTERNAL_ERROR";
  body.code = code;

  if (options?.retryAfter !== undefined) {
    body.retryAfter = options.retryAfter;
  }
  if (options?.details !== undefined) {
    body.details = options.details;
  }

  const headers: Record<string, string> = {};
  if (options?.retryAfter !== undefined) {
    headers["Retry-After"] = String(options.retryAfter);
  }

  const res = NextResponse.json(body, { status });
  for (const [k, v] of Object.entries(headers)) {
    res.headers.set(k, v);
  }
  return res;
}

/**
 * Standardized success response. Wraps arbitrary data and adds a timestamp.
 * Passing `data` directly mirrors `NextResponse.json(data)` — the `timestamp`
 * is only included when `withTimestamp` is true to avoid breaking exact-shape clients.
 */
export function successResponse(data: unknown, init?: { status?: number; headers?: Record<string, string> }): NextResponse {
  return NextResponse.json(data, init);
}
