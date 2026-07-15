/**
 * Thin wrappers around the public `/faq` endpoint exposed by the backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime
 * validation and a single inferred TypeScript type per response.
 *
 *   - `getFaqs` → `GET /api/v1/faq?category=...` (public, throttled, cached)
 *
 * The backend returns an array of active FAQs ordered by `order` ascending
 * (see `backend/src/faq/faq.service.ts` → `findAllPublic`). Categories are
 * passed through as opaque strings; the backend validates against its own
 * `FAQ_CATEGORIES` list.
 *
 * Schemas are co-located here (rather than `./types`) because FAQ is a
 * one-off concern — keeping the DTOs next to the functions that use them
 * avoids polluting the shared `types.ts`.
 */
import { z } from "zod";
import { fetcher } from "./client";

/** Public FAQ shape returned by `GET /faq`. */
export const FaqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  order: z.number().int(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Faq = z.infer<typeof FaqSchema>;

/** Optional category filter for `GET /faq?category=...`. */
export type GetFaqsParams = {
  /** FAQ category (e.g. "شراء سيارة" or "بيع سيارة"). */
  category?: string;
};

/**
 * Build the `?...` query string for `getFaqs`. We iterate explicitly so
 * `undefined` fields are skipped (rather than serialised as the literal
 * string `"undefined"`).
 */
function buildQueryString(params: GetFaqsParams): string {
  const search = new URLSearchParams();
  if (params.category !== undefined) {
    search.set("category", params.category);
  }
  return search.toString();
}

/**
 * Fetch the public list of active FAQs.
 *
 * Issues `GET /api/v1/faq` with an optional `category` query parameter
 * and validates each entry against `FaqSchema`. The backend returns an
 * array directly (no pagination envelope for the public endpoint).
 */
export async function getFaqs(params: GetFaqsParams = {}): Promise<Faq[]> {
  const query = buildQueryString(params);
  const path = query ? `/faq?${query}` : "/faq";
  return fetcher<Faq[]>(
    path,
    { method: "GET", public: true },
    z.array(FaqSchema),
  );
}
