/**
 * SWR hook for the public models-for-brand endpoint.
 *
 * Wraps `useSWR` around `getBrandModels()` so components can fetch a brand's
 * model list with the same caching, focus revalidation, and `mutate()`
 * retry handle used by `useCar` / `useCars`.
 *
 * The SWR key is `["/car-brand-models", brandId]` when `brandId` is
 * non-null, or `null` when no brand is selected yet (e.g. while a parent
 * route is still resolving). Passing `null` to `useSWR` is the documented
 * way to skip a request — see `node_modules/swr` for the contract.
 *
 * The error-normalisation block mirrors `useCar` / `useCars`: SWR surfaces
 * network failures as a plain `TypeError`, but the rest of the app
 * expects a typed `ApiError`. We coerce any other thrown value into the
 * same shape so consumers can render one error UI.
 */
"use client";

import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import { getBrandModels, type Model } from "@/lib/api/brands";

export type UseBrandModelsResult = {
  /** The fetched models, or `[]` while loading or when no brand is selected. */
  models: Model[];
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch. */
  mutate: () => void;
};

/**
 * Fetch the model list for a given brand.
 *
 * @param brandId The brand UUID, or `null` to skip the request (SWR treats
 *                a `null` key as "do not fetch"). Pass `null` from
 *                components that don't yet know which brand to load —
 *                e.g. dropdowns that wait for `useBrands()` to resolve.
 */
export function useBrandModels(brandId: string | null): UseBrandModelsResult {
  const { data, error, isLoading, mutate } = useSWR<Model[]>(
    brandId ? ["/car-brand-models", brandId] : null,
    // SWR types tuple keys as `readonly [any, ...unknown[]]`, so the
    // destructured `id` is `unknown`. We trust the key shape we built
    // above and coerce it here; if the key ever changes, the call site
    // (just above) is the only place to update.
    ([, id]) => getBrandModels(id as string),
  );

  // Normalise any non-`ApiError` thrown value (e.g. plain `TypeError`
  // from a network failure) into the same `ApiError` shape consumers
  // expect, so the UI can render a single error state.
  const normalizedError: ApiError | null = !error
    ? null
    : error instanceof ApiError
      ? error
      : new ApiError(
          0,
          error instanceof Error ? error.message : "Request failed",
        );

  return {
    models: data ?? [],
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}