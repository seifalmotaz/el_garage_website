/**
 * SWR hook for the public car-brands list.
 *
 * Wraps `useSWR` around `getBrands()` so components can fetch the list of
 * active brands with the same caching, focus revalidation, and `mutate()`
 * retry handle used by `useCars`.
 *
 * The SWR key is the literal `"/car-brands"` string. The same deduping key
 * is used by `useBrandModels` for its per-brand model list, so toggling
 * between brand detail pages does not invalidate the brand list cache.
 */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import { getBrands, type Brand } from "@/lib/api/brands";

export type UseBrandsResult = {
  /** The fetched brands, or `[]` while loading or when the request failed. */
  brands: Brand[];
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch (used by a "حاول مرة أخرى" button in the UI). */
  mutate: () => void;
};

/**
 * Fetch the public car-brands list.
 *
 * Brand logos are already rewritten to absolute URLs by `getBrands`, so
 * the consumer can drop them straight into `<img src>`.
 */
export function useBrands(): UseBrandsResult {
  const { data, error, isLoading, mutate } = useSWR<Brand[]>(
    "/car-brands",
    () => getBrands(),
  );

  // Normalize any non-`ApiError` thrown value (e.g. network failures, which
  // surface as plain `TypeError` from `fetch`) into the same `ApiError`
  // shape consumers expect, so the UI can render a single error state.
  const normalizedError: ApiError | null = !error
    ? null
    : error instanceof ApiError
      ? error
      : new ApiError(
          0,
          error instanceof Error ? error.message : "Request failed",
        );

  // Stable reference for the brands array. Without this, `data ?? []`
  // would create a new [] on every render when SWR has not yet resolved,
  // causing downstream useEffects to fire on every render → infinite loop.
  const brands = useMemo<Brand[]>(() => data ?? [], [data]);

  return {
    brands,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}