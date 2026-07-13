/**
 * Typed fetch wrapper for the El Garage NestJS backend.
 *
 * Responsibilities:
 *   1. Resolve the base URL from `NEXT_PUBLIC_API_URL` (with a sane default).
 *   2. Attach the Bearer access token from `localStorage.elgarage_auth`.
 *   3. JSON-encode object bodies and set `Content-Type` when needed.
 *   4. On `401`, attempt a single refresh-and-retry using the stored
 *      refresh token. If the refresh fails, clear stored tokens so the
 *      UI can render the logged-out state.
 *   5. Optionally validate the response body against a zod schema.
 *   6. Throw `ApiError` on non-2xx responses so call sites get a
 *      typed error with `status`, `message`, and optional `fieldErrors`.
 *
 * The `fetcher` is the only place that talks to `localStorage` for
 * tokens — every auth wrapper in `lib/api/auth.ts` routes through it.
 * This guarantees the refresh-on-401 behavior is consistent everywhere.
 */
import type { z } from "zod";
import { ApiError } from "./errors";
import { AuthResponseSchema } from "./types";

/** localStorage key under which the auth token pair is persisted. */
export const AUTH_STORAGE_KEY = "elgarage_auth";

/** Default base URL when `NEXT_PUBLIC_API_URL` is not set. */
const DEFAULT_API_URL = "https://elgarage-back.seifalmotaz.com/api/v1";

/** Internal header that flags a request as an already-retried request. */
const RETRY_HEADER = "x-elgarage-retry";

/** Token pair persisted in localStorage. */
export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
};

/** Extended init that accepts a plain JSON-serializable body. */
export type FetcherInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
};

/**
 * Returns the configured API base URL (e.g. `http://localhost:3000/api/v1`).
 * Exported so `lib/api/auth.ts` can call the refresh endpoint directly
 * without going through the auto-retry path.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return DEFAULT_API_URL;
}

/**
 * Read the stored token pair from localStorage. Returns `null` when
 * the key is missing, malformed, or running in a non-browser context
 * (e.g. SSR) where `localStorage` is undefined.
 */
export function readStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAuth> | null;
    if (!parsed || typeof parsed !== "object") return null;
    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string"
    ) {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    };
  } catch {
    return null;
  }
}

/** Persist the token pair to localStorage. No-op outside the browser. */
export function writeStoredAuth(auth: StoredAuth): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // Storage may be unavailable (private mode, quota, etc.) — fail silently.
  }
}

/** Remove the stored token pair from localStorage. No-op outside the browser. */
export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // See writeStoredAuth above.
  }
}

/** Concatenate base URL and a leading-slash-less path. */
function buildUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
}

/** Merge caller-provided headers into a plain object map. */
function mergeHeaders(initHeaders: HeadersInit | undefined): Record<string, string> {
  const headers: Record<string, string> = {};
  if (!initHeaders) return headers;

  if (initHeaders instanceof Headers) {
    initHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(initHeaders)) {
    for (const entry of initHeaders) {
      if (
        Array.isArray(entry) &&
        entry.length === 2 &&
        typeof entry[0] === "string" &&
        typeof entry[1] === "string"
      ) {
        headers[entry[0]] = entry[1];
      }
    }
  } else {
    for (const [key, value] of Object.entries(initHeaders)) {
      if (typeof value === "string") {
        headers[key] = value;
      }
    }
  }
  return headers;
}

/**
 * Detect whether a value is a plain object that needs JSON serialization.
 * Built-ins like `FormData`, `Blob`, `ArrayBuffer`, `URLSearchParams`, and
 * raw strings are passed through to fetch as-is.
 */
function isJsonEncodable(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  if (
    value instanceof FormData ||
    value instanceof Blob ||
    value instanceof ArrayBuffer ||
    value instanceof URLSearchParams ||
    value instanceof ReadableStream
  ) {
    return false;
  }
  return true;
}

/**
 * Prepare the body for fetch: stringify plain objects, leave FormData /
 * strings / Blobs untouched. Returns the prepared body plus the
 * `Content-Type` header value (if any) the caller should set.
 */
function prepareBody(body: unknown): {
  body: BodyInit | null | undefined;
  contentType: string | null;
} {
  if (body === null || body === undefined) {
    return { body: undefined, contentType: null };
  }
  if (typeof body === "string") {
    return { body, contentType: null };
  }
  if (isJsonEncodable(body)) {
    return { body: JSON.stringify(body), contentType: "application/json" };
  }
  // FormData, Blob, ArrayBuffer, URLSearchParams, ReadableStream — pass through.
  return { body: body as BodyInit, contentType: null };
}

/**
 * Inspect a non-2xx response and throw an `ApiError`. Best-effort JSON
 * parsing for the error body so we can surface the backend's `message`
 * and per-field errors when available.
 */
async function throwForError(response: Response): Promise<never> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, "Request failed");
  }

  if (body && typeof body === "object") {
    const b = body as { message?: unknown; fieldErrors?: unknown };
    const message =
      typeof b.message === "string" ? b.message : "Request failed";
    const fieldErrors =
      b.fieldErrors && typeof b.fieldErrors === "object"
        ? (b.fieldErrors as Record<string, string[]>)
        : undefined;
    throw new ApiError(response.status, message, fieldErrors);
  }
  throw new ApiError(response.status, "Request failed");
}

/**
 * Validate a parsed JSON response against an optional schema. Throws
 * `ApiError(500, 'Invalid response shape')` on mismatch.
 */
function validateOrThrow<T>(
  data: unknown,
  schema: z.ZodType<T> | undefined,
): T {
  if (!schema) {
    return data as T;
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(500, "Invalid response shape", {
      _zod: parsed.error.issues.map((i) =>
        JSON.stringify({
          path: i.path,
          message: i.message,
          code: i.code,
        }),
      ),
    });
  }
  return parsed.data;
}

/**
 * Best-effort POST to `/auth/refresh` to mint a new token pair.
 * Returns the new pair on success, or `null` on any failure (including
 * the case where no refresh token is stored).
 */
async function attemptRefresh(): Promise<StoredAuth | null> {
  const stored = readStoredAuth();
  if (!stored?.refreshToken) return null;
  try {
    const res = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken: stored.refreshToken }),
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const parsed = AuthResponseSchema.safeParse(json);
    if (!parsed.success) return null;
    return {
      accessToken: parsed.data.accessToken,
      refreshToken: parsed.data.refreshToken,
    };
  } catch {
    return null;
  }
}

/**
 * Issue a typed request against the API.
 *
 * @param path     Endpoint path, with or without a leading slash
 *                 (e.g. `/auth/login`).
 * @param init     Optional `RequestInit` extensions. `body` may be a plain
 *                 JSON-serializable object — it will be stringified for you.
 * @param schema   Optional zod schema used to validate the parsed response.
 *
 * Throws `ApiError` on non-2xx responses and on zod validation failure.
 */
export async function fetcher<T>(
  path: string,
  init?: FetcherInit,
  schema?: z.ZodType<T>,
): Promise<T> {
  const url = buildUrl(path);

  // Body preparation happens once — the retry reuses the stringified body.
  const prepared = prepareBody(init?.body);

  // Start with the caller's headers, then layer our defaults and the
  // token-derived Authorization header on top.
  const headers: Record<string, string> = mergeHeaders(init?.headers);
  headers["Accept"] = "application/json";
  if (prepared.contentType) {
    headers["Content-Type"] = prepared.contentType;
  }
  if (!headers["Authorization"]) {
    const stored = readStoredAuth();
    if (stored?.accessToken) {
      headers["Authorization"] = `Bearer ${stored.accessToken}`;
    }
  }

  const baseFetchInit: RequestInit = {
    ...init,
    headers,
    body: prepared.body as BodyInit | null | undefined,
  };

  let response = await fetch(url, baseFetchInit);

  // 401 → one-time refresh + retry. If this is already the retried request
  // (RETRY_HEADER present), fall through to normal error handling.
  if (response.status === 401 && headers[RETRY_HEADER] !== "1") {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      writeStoredAuth(refreshed);
      const retryHeaders: Record<string, string> = {
        ...headers,
        Authorization: `Bearer ${refreshed.accessToken}`,
        [RETRY_HEADER]: "1",
      };
      const retryInit: RequestInit = {
        ...baseFetchInit,
        headers: retryHeaders,
      };
      response = await fetch(url, retryInit);
    } else {
      // Refresh failed → drop the tokens so the UI can show the
      // logged-out state on the next render.
      clearStoredAuth();
    }
  }

  if (!response.ok) {
    await throwForError(response);
  }

  if (response.status === 204) {
    // 204 No Content — nothing to validate, return undefined as T.
    return undefined as T;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(response.status, "Invalid JSON response");
  }

  return validateOrThrow(data, schema);
}