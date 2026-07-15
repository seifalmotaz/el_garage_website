/**
 * SWR hooks for the public articles endpoints.
 *
 *   - `useArticles`     → wraps `getArticles()` for the paginated list
 *   - `useArticleById`  → wraps `getArticleById()` for a single article
 *
 * The list hook uses a tuple SWR key `['/articles', params]` so different
 * filters (`page`, `category`, `search`) produce distinct cache entries.
 * The detail hook uses a tuple `['/article', id]` and accepts a nullable
 * id — passing `null` skips the request per SWR's documented contract.
 *
 * The error-normalisation block mirrors `useCars`: SWR surfaces network
 * failures as a plain `TypeError`, but the rest of the app expects a
 * typed `ApiError`. We coerce any other thrown value into the same shape
 * so consumers can render one error UI.
 */
"use client";

import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import {
  getArticleById,
  getArticles,
  type Article,
  type ArticlesListResponse,
  type GetArticlesParams,
} from "@/lib/api/articles";

// ===== useArticles ===== //

export type UseArticlesResult = {
  /**
   * The paginated response, or `null` while loading or on failure. Use
   * `isLoading` / `error` to disambiguate. `data.data` is `[]` when the
   * backend returns an empty page.
   */
  data: ArticlesListResponse | null;
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch. */
  mutate: () => void;
};

/**
 * Fetch a paginated list of published articles.
 *
 * @param params Optional filters matching `GetArticlesParams` (page,
 *               limit, category, search). Defaults to `{}` so callers
 *               without filters get page 1 of the full list.
 */
export function useArticles(
  params: GetArticlesParams = {},
): UseArticlesResult {
  const { data, error, isLoading, mutate } = useSWR<ArticlesListResponse>(
    ["/articles", params],
    () => getArticles(params),
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

  return {
    data: data ?? null,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}

// ===== useArticleById ===== //

export type UseArticleByIdResult = {
  /**
   * The fetched article, or `null` while loading, when the id is not yet
   * known, or when the backend returned `null`. Use `isLoading` / `error`
   * to disambiguate.
   */
  article: Article | null;
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /** Force a refetch. */
  mutate: () => void;
};

/**
 * Fetch a single published article by id.
 *
 * @param id The article UUID, or `null` to skip the request (SWR treats
 *           a `null` key as "do not fetch"). Pass `null` from components
 *           that don't yet know which article to load.
 */
export function useArticleById(id: string | null): UseArticleByIdResult {
  const { data, error, isLoading, mutate } = useSWR<Article>(
    id ? ["/article", id] : null,
    // SWR types tuple keys as `readonly [any, ...unknown[]]`, so the
    // destructured `articleId` is `unknown`. We trust the key shape we
    // built above and coerce it here; if the key ever changes, the call
    // site (just above) is the only place to update.
    ([, articleId]) => getArticleById(articleId as string),
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
    article: data ?? null,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}
