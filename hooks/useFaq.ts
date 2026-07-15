/**
 * SWR hook for the public FAQ endpoint.
 *
 * Wraps `useSWR` around `getFaqs()` so components can render the FAQ list
 * with built-in caching, focus revalidation (per Phase 1 `SWRConfig`), and
 * a stable `mutate()` handle for retries.
 *
 * The SWR key is a tuple of `['/faq', params]`. Different category filters
 * yield different cache entries, so flipping the category triggers a
 * refetch. Passing `null` for `params` is not supported — callers that
 * don't yet know the category should pass `{}` so the request resolves to
 * the full unfiltered list.
 *
 * The error-normalisation block mirrors `useCars`: SWR surfaces network
 * failures as a plain `TypeError`, but the rest of the app expects a
 * typed `ApiError`. We coerce any other thrown value into the same shape
 * so consumers can render one error UI.
 */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import { getFaqs, type Faq, type GetFaqsParams } from "@/lib/api/faq";

export type UseFaqResult = {
  /** The fetched FAQs, or `[]` while loading or when the request failed. */
  faqs: Faq[];
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch (used by the "حاول مرة أخرى" button in the UI). */
  mutate: () => void;
};

/**
 * Fetch the public FAQ list.
 *
 * @param params Optional `{ category }` filter. Defaults to `{}` so
 *               callers without filters get the full active list.
 */
export function useFaq(params: GetFaqsParams = {}): UseFaqResult {
  const { data, error, isLoading, mutate } = useSWR<Faq[]>(
    ["/faq", params],
    () => getFaqs(params),
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

  // Stable reference for the FAQs array. Without this, `data ?? []`
  // would create a new [] on every render when SWR has not yet resolved,
  // causing downstream useEffects to fire on every render → infinite loop.
  const faqs = useMemo<Faq[]>(() => data ?? [], [data]);

  return {
    faqs,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}
