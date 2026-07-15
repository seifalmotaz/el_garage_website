/**
 * SWR hook for the authenticated user's negotiations list.
 *
 * Wraps `useSWR` around `getMyNegotiations()` so components can render the
 * caller's negotiations with the same caching, focus revalidation, and
 * `mutate()` retry handle used by `useCars` / `useCar`.
 *
 * The SWR key is the static string `"/negotiations/mine"` — different
 * concerns (e.g. a per-car detail endpoint when added) should pick their
 * own keys. UI FREEZE: this hook is API-only and is not consumed yet;
 * the shape mirrors `useCars` so the eventual consumer can render with
 * minimal churn.
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
import {
  getMyNegotiations,
  type Negotiation,
} from "@/lib/api/negotiations";

export type UseNegotiationsResult = {
  /** The fetched negotiations, or `[]` while loading or on failure. */
  negotiations: Negotiation[];
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch (used by the "حاول مرة أخرى" button in the UI). */
  mutate: () => void;
};

/**
 * Fetch the authenticated user's negotiations list.
 *
 * Pass `enabled = false` to skip the request — useful when the caller
 * doesn't yet know whether the user is signed in. SWR treats a `null`
 * key as "do not fetch", which is the documented contract for gated
 * reads (see https://swr.vercel.app/docs/conditional-fetching).
 */
export function useNegotiations(
  enabled: boolean = true,
): UseNegotiationsResult {
  const { data, error, isLoading, mutate } = useSWR<Negotiation[]>(
    enabled ? "/negotiations/mine" : null,
    () => getMyNegotiations(),
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

  // Stable reference for the negotiations array. Without this, `data ?? []`
  // would create a new [] on every render when SWR has not yet resolved,
  // which can cause downstream useEffects to fire on every render.
  const negotiations = useMemo<Negotiation[]>(() => data ?? [], [data]);

  return {
    negotiations,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}