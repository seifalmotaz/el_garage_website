/**
 * Thin wrappers around the public `/cars` endpoints exposed by the backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime validation
 * and a single inferred TypeScript type per response.
 *
 *   - `getCars` hits `GET /api/v1/cars` (public) — supports the full filter
 *     surface from `backend/src/cars/cars.controller.ts`.
 *   - `getCarById` hits `GET /api/v1/cars/:id` (public) and returns the
 *     extended detail shape (including `inspectionReport` when present).
 *
 * The list endpoint is what the home page's two grids use
 * ("الأكثر مبيعاً" → non-featured, "السيارات المميزة" → featured). Image
 * paths returned by the backend are rewritten to absolute URLs via the
 * helpers in `./media` so consumers never need to know the API origin.
 */
import { fetcher } from "./client";
import { absolutizeUrl } from "./media";
import {
  CarListSchema,
  CarDetailSchema,
  type Car,
  type CarDetail,
} from "./types";

/**
 * Parameters accepted by `getCars`. These mirror the query surface of
 * `GET /api/v1/cars` on the backend (see `cars.controller.ts`). Every
 * field is optional; only defined entries are forwarded so the URL
 * stays clean when callers don't need every filter.
 *
 * Note: the mobile filter contract also sends a `condition` field, but
 * the backend does not currently process it — we deliberately omit it
 * here to keep the type honest about what the API actually supports.
 */
export type GetCarsParams = {
  /** Brand filter. Backend treats UUIDs as brand IDs, plain text as legacy name search. */
  brand?: string;
  /** Model name (legacy free-text match). */
  model?: string;
  /** Minimum price (inclusive). */
  minPrice?: number;
  /** Maximum price (inclusive). */
  maxPrice?: number;
  /** Minimum model year (inclusive). */
  minYear?: number;
  /** Maximum model year (inclusive). */
  maxYear?: number;
  /** Minimum mileage in km (inclusive). */
  minMileage?: number;
  /** Maximum mileage in km (inclusive). */
  maxMileage?: number;
  /** Transmission filter (e.g. `"manual"` / `"automatic"`). */
  transmission?: string;
  /** Free-text search applied to brand + model. */
  search?: string;
  /** When `true`, only featured cars. When `false`, exclude featured cars. */
  isFeatured?: boolean;
  /**
   * Spec key/value filters. Values are JSON-encoded into the `specs`
   * query param per the backend contract (see `CarsController`).
   */
  specs?: Record<string, string>;
};

/**
 * Build the `?...` query string for `getCars`. We iterate explicitly so
 * `undefined` fields are skipped (rather than serialised as the literal
 * string `"undefined"`). `specs` is JSON-encoded per the backend API.
 */
function buildQueryString(params: GetCarsParams): string {
  const search = new URLSearchParams();
  if (params.brand !== undefined) search.set("brand", params.brand);
  if (params.model !== undefined) search.set("model", params.model);
  if (params.minPrice !== undefined) {
    search.set("minPrice", String(params.minPrice));
  }
  if (params.maxPrice !== undefined) {
    search.set("maxPrice", String(params.maxPrice));
  }
  if (params.minYear !== undefined) search.set("minYear", String(params.minYear));
  if (params.maxYear !== undefined) search.set("maxYear", String(params.maxYear));
  if (params.minMileage !== undefined) {
    search.set("minMileage", String(params.minMileage));
  }
  if (params.maxMileage !== undefined) {
    search.set("maxMileage", String(params.maxMileage));
  }
  if (params.transmission !== undefined) {
    search.set("transmission", params.transmission);
  }
  if (params.search !== undefined) search.set("search", params.search);
  if (params.isFeatured !== undefined) {
    search.set("isFeatured", String(params.isFeatured));
  }
  if (params.specs !== undefined && Object.keys(params.specs).length > 0) {
    search.set("specs", JSON.stringify(params.specs));
  }
  return search.toString();
}

/**
 * Rewrite the image URLs in place so they can be used directly in `<img src>`.
 * Delegates to `absolutizeUrl` from `./media` so the rule lives in one place.
 */
function absolutizeImages(car: Car): Car {
  return {
    ...car,
    images: car.images.map((path) => absolutizeUrl(path) ?? path),
  };
}

/**
 * Fetch the public car catalog.
 *
 * Issues `GET /api/v1/cars` with optional filters and validates the
 * response against `CarListSchema`. Image paths returned by the backend
 * are rewritten to absolute URLs so the consumer does not need to know
 * the API origin.
 */
export async function getCars(params: GetCarsParams = {}): Promise<Car[]> {
  const query = buildQueryString(params);
  const path = query ? `/cars?${query}` : "/cars";

  const cars = await fetcher<Car[]>(path, { method: "GET" }, CarListSchema);
  return cars.map(absolutizeImages);
}

/**
 * Fetch a single car's full detail.
 *
 * Issues `GET /api/v1/cars/:id` and validates the response against
 * `CarDetailSchema`. The backend returns `null` for unknown IDs (the
 * controller does not currently translate this into a 404), so the
 * return type is `CarDetail | null` to match the server contract. The
 * `.nullable()` schema is passed so the fetcher's validation accepts
 * the literal `null` body without raising an "Invalid response shape"
 * error.
 */
export async function getCarById(id: string): Promise<CarDetail | null> {
  const detail = await fetcher<CarDetail | null>(
    `/cars/${encodeURIComponent(id)}`,
    { method: "GET" },
    CarDetailSchema.nullable(),
  );
  // `null` from the backend means "not found" — no images to rewrite.
  if (detail === null) return null;
  return absolutizeImages(detail);
}