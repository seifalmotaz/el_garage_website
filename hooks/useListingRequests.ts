/**
 * SWR hooks for the authenticated `/listing-requests` endpoints.
 *
 *   - `useMyListingRequests`       → wraps `getMyListingRequests()`
 *   - `useListingRequestById`      → wraps `getListingRequestById()`
 *   - `useCancelListingRequest`    → imperative cancel helper (no SWR)
 *
 * The list hook uses the static SWR key `"/listing-requests/mine"` —
 * one cache entry per browser is sufficient. The detail hook uses a
 * tuple `['/listing-request', id]` and accepts a nullable id — passing
 * `null` skips the request per SWR's documented contract.
 *
 * The error-normalisation block mirrors `useCars`: SWR surfaces network
 * failures as a plain `TypeError`, but the rest of the app expects a
 * typed `ApiError`. We coerce any other thrown value into the same shape
 * so consumers can render one error UI.
 */
"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import {
  cancelListingRequest,
  getListingRequestById,
  getMyListingRequests,
  type ListingRequest,
} from "@/lib/api/listing-requests";

// ===== useMyListingRequests ===== //

export type UseMyListingRequestsResult = {
  /** The fetched listing requests, or `[]` while loading or on failure. */
  requests: ListingRequest[];
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /**
   * Force a refetch (used by the "حاول مرة أخرى" button in the UI and
   * after a successful cancel — pass the global SWR `mutate` so the
   * `useListingRequestById` cache stays in sync too).
   */
  mutate: () => void;
};

/**
 * Fetch the authenticated user's listing requests.
 *
 * Pass `enabled = false` to skip the request — useful when the caller
 * doesn't yet know whether the user is signed in. SWR treats a `null`
 * key as "do not fetch", which is the documented contract for gated
 * reads (see https://swr.vercel.app/docs/conditional-fetching).
 */
export function useMyListingRequests(
  enabled: boolean = true,
): UseMyListingRequestsResult {
  const { data, error, isLoading, mutate } = useSWR<ListingRequest[]>(
    enabled ? "/listing-requests/mine" : null,
    () => getMyListingRequests(),
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

  // Stable reference for the requests array. Without this, `data ?? []`
  // would create a new [] on every render when SWR has not yet resolved,
  // which can cause downstream useEffects to fire on every render.
  const requests = useMemo<ListingRequest[]>(() => data ?? [], [data]);

  return {
    requests,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}

// ===== useListingRequestById ===== //

export type UseListingRequestByIdResult = {
  /**
   * The fetched listing request, or `null` while loading, when the id is
   * not yet known, or when the backend returned `null`. Use `isLoading`
   * / `error` to disambiguate.
   */
  request: ListingRequest | null;
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch. */
  mutate: () => void;
};

/**
 * Fetch a single listing request by id.
 *
 * @param id The listing-request UUID, or `null` to skip the request
 *           (SWR treats a `null` key as "do not fetch").
 */
export function useListingRequestById(
  id: string | null,
): UseListingRequestByIdResult {
  const { data, error, isLoading, mutate } = useSWR<ListingRequest>(
    id ? ["/listing-request", id] : null,
    ([, requestId]) => getListingRequestById(requestId as string),
  );

  const normalizedError: ApiError | null = !error
    ? null
    : error instanceof ApiError
      ? error
      : new ApiError(
          0,
          error instanceof Error ? error.message : "Request failed",
        );

  return {
    request: data ?? null,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}

// ===== useCancelListingRequest ===== //

export type UseCancelListingRequestResult = {
  /**
   * Imperative cancel helper. Returns the updated `ListingRequest` on
   * success and re-throws typed `ApiError` on failure. While a cancel
   * is in flight, `isCancelling` is `true`; after it resolves, the last
   * `error` (if any) is exposed here for the UI to render.
   */
  cancel: (id: string) => Promise<ListingRequest>;
  /** `true` while a cancel request is in flight. */
  isCancelling: boolean;
  /** A typed `ApiError` from the last cancel attempt, `null` otherwise. */
  error: ApiError | null;
  /** Clear the last error (e.g. when the UI closes a banner). */
  reset: () => void;
};

/**
 * Imperative hook for cancelling a listing request. Does NOT use SWR —
 * cancellations are user-initiated mutations rather than reads. Callers
 * are expected to revalidate `useMyListingRequests` / `useListingRequestById`
 * afterwards (e.g. by calling the global SWR `mutate` or the hook's own
 * `mutate` handle).
 */
export function useCancelListingRequest(): UseCancelListingRequestResult {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const cancel = useCallback(
    async (id: string): Promise<ListingRequest> => {
      setIsCancelling(true);
      setError(null);
      try {
        const updated = await cancelListingRequest(id);
        return updated;
      } catch (raw) {
        const normalized: ApiError =
          raw instanceof ApiError
            ? raw
            : new ApiError(
                0,
                raw instanceof Error ? raw.message : "Request failed",
              );
        setError(normalized);
        throw normalized;
      } finally {
        setIsCancelling(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    cancel,
    isCancelling,
    error,
    reset,
  };
}
