/**
 * SWR hook for the public car-specs catalog.
 *
 * Wraps `useSWR` around `getSpecTypes()` so components can fetch the list
 * of active spec types (with their active options) with built-in caching,
 * focus revalidation (per the app's `SWRConfig`), and a stable `mutate()`
 * handle for retries.
 *
 * The SWR key is the literal path `"/car-specs"` — there are no params on
 * this endpoint, so a single cache entry is sufficient. Different filter
 * surfaces compose on top of this list (see `useCars`'s `specs` param).
 *
 * The error-normalisation block mirrors `useCars`: SWR surfaces network
 * failures as a plain `TypeError`, but the rest of the app expects a
 * typed `ApiError`. We coerce any other thrown value into the same
 * shape so consumers can render one error UI.
 */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import { getSpecTypes, type SpecType } from "@/lib/api/specs";

export type UseSpecTypesResult = {
  /** The fetched spec types, or `[]` while loading or when the request failed. */
  specTypes: SpecType[];
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch (used by the "حاول مرة أخرى" button in the UI). */
  mutate: () => void;
};

/**
 * Fetch the public car-specs catalog (active spec types with their
 * active options, sorted by `order` ascending).
 */
export function useSpecTypes(): UseSpecTypesResult {
  const { data, error, isLoading, mutate } = useSWR<SpecType[]>(
    "/car-specs",
    () => getSpecTypes(),
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

  // Stable reference for the spec types array. Without this, `data ?? []`
  // would create a new [] on every render when SWR has not yet resolved,
  // causing downstream useEffects to fire on every render → infinite loop.
  const specTypes = useMemo<SpecType[]>(() => data ?? [], [data]);

  return {
    specTypes,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}