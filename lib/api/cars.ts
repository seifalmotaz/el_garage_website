/**
 * Thin wrappers around the public `/cars` endpoints exposed by the backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime validation
 * and a single inferred TypeScript type per response.
 *
 * The list endpoint (`GET /api/v1/cars`) is public — no auth required — and
 * accepts an optional `isFeatured` filter for the home page's two grids
 * ("الأكثر مبيعاً" → non-featured, "السيارات المميزة" → featured).
 */
import { fetcher, getApiBaseUrl } from "./client";
import { CarListSchema, type Car } from "./types";

/** Parameters accepted by `getCars`. Extend in a future phase as needed. */
export type GetCarsParams = {
  /** When `true`, only featured cars. When `false`, exclude featured cars. */
  isFeatured?: boolean;
};

/**
 * Resolve the API origin (e.g. `http://localhost:3000`) by stripping the
 * `/api/v1` suffix from the configured base URL. Used to rewrite relative
 * `images[]` paths returned by the backend into absolute URLs the browser
 * can load.
 */
function getApiOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/v1\/?$/, "");
}

/**
 * Test whether a path is already an absolute URL (i.e. starts with an
 * http(s) scheme). Relative paths and protocol-relative URLs (`//cdn…`) are
 * treated as needing origin prepending.
 */
function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * Rewrite the image URLs in place so they can be used directly in `<img src>`.
 * Already-absolute URLs are passed through unchanged.
 */
function absolutizeImages(car: Car): Car {
  const origin = getApiOrigin();
  const images = car.images.map((path) =>
    isAbsoluteUrl(path) ? path : `${origin}${path.startsWith("/") ? "" : "/"}${path}`,
  );
  return { ...car, images };
}

/**
 * Fetch the public car catalog.
 *
 * Issues `GET /api/v1/cars` (with optional `?isFeatured=…`) and validates
 * the response against `CarListSchema`. Image paths returned by the backend
 * are rewritten to absolute URLs so the consumer does not need to know the
 * API origin.
 */
export async function getCars(params: GetCarsParams = {}): Promise<Car[]> {
  const search = new URLSearchParams();
  if (params.isFeatured !== undefined) {
    search.set("isFeatured", String(params.isFeatured));
  }
  const query = search.toString();
  const path = query ? `/cars?${query}` : "/cars";

  const cars = await fetcher<Car[]>(path, { method: "GET" }, CarListSchema);
  return cars.map(absolutizeImages);
}