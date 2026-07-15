/**
 * SWR hook for the public car detail endpoint.
 *
 * Wraps `useSWR` around `getCarById()` so components can fetch a single
 * car's full detail (including the optional `inspectionReport`) with
 * the same caching, focus revalidation, and `mutate()` retry handle
 * used by `useCars`.
 *
 * The SWR key is `["/car", id]` when `id` is non-null, or `null` when
 * no id is provided yet (e.g. while a parent route is still
 * resolving the route param). Passing `null` to `useSWR` is the
 * documented way to skip a request — see
 * `node_modules/swr` for the contract.
 *
 * The error-normalisation block mirrors `useCars`: SWR surfaces
 * network failures as a plain `TypeError`, but the rest of the app
 * expects a typed `ApiError`. We coerce any other thrown value into
 * the same shape so consumers can render one error UI.
 */
"use client";

import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import { getCarById } from "@/lib/api/cars";
import type { CarDetail } from "@/lib/api/types";

export type UseCarResult = {
  /**
   * The fetched car, or `null` while loading, when the id is not yet
   * known, or when the backend returned `null` (car not found).
   * Use `isLoading` / `error` to disambiguate.
   */
  car: CarDetail | null;
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch. */
  mutate: () => void;
};

/**
 * Fetch a single car's detail.
 *
 * @param id The car UUID, or `null` to skip the request (SWR treats a
 *           `null` key as "do not fetch"). Pass `null` from components
 *           that don't yet know which car to load.
 */
export function useCar(id: string | null): UseCarResult {
  const { data, error, isLoading, mutate } = useSWR<CarDetail | null>(
    id ? ["/car", id] : null,
    // SWR types tuple keys as `readonly [any, ...unknown[]]`, so the
    // destructured `carId` is `unknown`. We trust the key shape we built
    // above and coerce it here; if the key ever changes, the call site
    // (just above) is the only place to update.
    ([, carId]) => getCarById(carId as string),
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
    car: data ?? null,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}