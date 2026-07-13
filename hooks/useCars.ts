/**
 * SWR hook for the public car catalog.
 *
 * Wraps `useSWR` around `getCars()` so components can fetch a list of cars
 * with built-in caching, focus revalidation (per Phase 1 `SWRConfig`), and
 * a stable `mutate()` handle for retries.
 *
 * The SWR key is a tuple of `['/cars', params]`. The Phase 1 SWR fetcher
 * ignores the second element (params live in the closure of the inline
 * fetcher below, which is the source of truth for the request), but the
 * tuple still serves as SWR's deduping key — different params yield
 * different cache entries, so flipping `isFeatured` triggers a refetch.
 */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import { getCars, type GetCarsParams } from "@/lib/api/cars";
import type { Car } from "@/lib/api/types";

export type UseCarsResult = {
  /** The fetched cars, or `[]` while loading or when the request failed. */
  cars: Car[];
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch (used by the "حاول مرة أخرى" button in the UI). */
  mutate: () => void;
};

/**
 * Fetch the public car catalog.
 *
 * @param params Optional filter — currently only `isFeatured`. Defaults to
 *               an empty object so callers without filters get the full
 *               published list.
 */
export function useCars(params: GetCarsParams = {}): UseCarsResult {
  const { data, error, isLoading, mutate } = useSWR<Car[]>(
    ["/cars", params],
    () => getCars(params),
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

  // Stable reference for the cars array. Without this, `data ?? []`
  // would create a new [] on every render when SWR has not yet
  // resolved, causing downstream useEffects (e.g. in CarGrid) to fire
  // on every render → infinite loop.
  const cars = useMemo<Car[]>(() => data ?? [], [data]);

  return {
    cars,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}