/**
 * Helpers for resolving media URLs returned by the backend.
 *
 * The backend stores user-uploaded assets (car images, inspection photos,
 * inspection PDFs) as relative paths like `/uploads/cars/abc.jpg`. The
 * browser cannot load those directly — they need to be prefixed with the
 * API's origin (the host part of `NEXT_PUBLIC_API_URL`).
 *
 * Anything that has to turn a backend-relative path into a fully-qualified
 * URL should go through `absolutizeUrl`. Centralising this here keeps the
 * `lib/api/cars.ts` (and any future domain modules) free of URL plumbing
 * and gives us one place to evolve the rule (e.g. handle CDN overrides).
 */
import { getApiBaseUrl } from "./client";

/**
 * Resolve the API origin (e.g. `http://localhost:3000`) by stripping the
 * `/api/v1` suffix from the configured base URL.
 *
 * The result is suitable for prepending to backend-relative paths. We do
 * not normalise trailing slashes here — callers should decide whether to
 * add their own `/` before concatenating with the path.
 */
export function getApiOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/v1\/?$/, "");
}

/**
 * Test whether a string is already an absolute URL — i.e. starts with
 * an `http://` or `https://` scheme. Relative paths (`/uploads/...`) and
 * protocol-relative URLs (`//cdn…`) are treated as needing the origin
 * prepended.
 */
export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * Turn a backend-relative asset path into an absolute URL the browser can
 * load. Returns `null` when the input is missing or empty so the caller
 * can skip rendering rather than emit a broken `<img src>`.
 *
 * Behaviour:
 *   - `null` / `undefined` / `""` → `null`
 *   - already-absolute (`http://…`, `https://…`) → returned unchanged
 *   - relative (`/uploads/…`) → `${origin}${path}`
 *   - bare (`uploads/…`) → `${origin}/${path}` (defensive; backend always
 *     uses leading slashes today)
 */
export function absolutizeUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (isAbsoluteUrl(path)) return path;
  const origin = getApiOrigin();
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}