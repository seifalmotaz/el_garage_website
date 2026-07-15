/**
 * SWR hooks + imperative mutators for the authenticated `/notifications`
 * endpoints.
 *
 *   - `useNotifications`     → wraps `getNotifications()` for the paginated
 *                              list
 *   - `useMarkNotificationRead`     → imperative single-notification mark
 *   - `useMarkAllNotificationsRead` → imperative mark-all mutator
 *
 * The list hook uses a tuple SWR key `['/notifications', params]` so
 * different pagination produces distinct cache entries.
 *
 * The mutator hooks do NOT use SWR for the request itself — marking a
 * notification as read is a mutation, not a read. They expose the same
 * `ApiError` normalisation used elsewhere so the UI can render a single
 * error surface.
 */
"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type GetNotificationsParams,
  type Notification,
  type NotificationsListResponse,
} from "@/lib/api/notifications";

// ===== useNotifications ===== //

export type UseNotificationsResult = {
  /**
   * The paginated response, or `null` while loading or on failure. Use
   * `isLoading` / `error` to disambiguate. `data.data` is `[]` when the
   * backend returns an empty page.
   */
  data: NotificationsListResponse | null;
  /** `true` while the initial fetch is in flight. */
  isLoading: boolean;
  /** A typed `ApiError` on failure, `null` otherwise. */
  error: ApiError | null;
  /**
   * Force a refetch. Callers can also import SWR's global `mutate` to
   * invalidate this key from anywhere in the tree.
   */
  mutate: () => void;
};

/**
 * Fetch the authenticated user's notifications.
 *
 * @param params   Optional `{ page, limit }` pagination. Defaults to `{}`
 *                 so callers without params get page 1 of the default page
 *                 size enforced by the backend (20).
 * @param enabled  When `false`, the SWR key resolves to `null` and no
 *                 fetch is issued — useful for auth-gated reads where the
 *                 caller doesn't yet know whether the user is signed in.
 */
export function useNotifications(
  params: GetNotificationsParams = {},
  enabled: boolean = true,
): UseNotificationsResult {
  const { data, error, isLoading, mutate } = useSWR<NotificationsListResponse>(
    enabled ? ["/notifications", params] : null,
    () => getNotifications(params),
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

// ===== useMarkNotificationRead ===== //

export type UseMarkNotificationReadResult = {
  /**
   * Mark a single notification as read. Returns the updated notification
   * on success and re-throws typed `ApiError` on failure. Callers are
   * expected to revalidate `useNotifications` afterwards.
   */
  markRead: (id: string) => Promise<Notification>;
  /** `true` while a mark-read request is in flight. */
  isMarking: boolean;
  /** A typed `ApiError` from the last attempt, `null` otherwise. */
  error: ApiError | null;
  /** Clear the last error. */
  reset: () => void;
};

/**
 * Imperative hook for marking a single notification as read.
 *
 * Does NOT use SWR for the request itself — mark-as-read is a mutation,
 * not a read. Callers should revalidate `useNotifications` afterwards
 * (e.g. by calling the global SWR `mutate` or the hook's own `mutate`
 * handle).
 */
export function useMarkNotificationRead(): UseMarkNotificationReadResult {
  const [isMarking, setIsMarking] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const markRead = useCallback(
    async (id: string): Promise<Notification> => {
      setIsMarking(true);
      setError(null);
      try {
        const updated = await markNotificationRead(id);
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
        setIsMarking(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    markRead,
    isMarking,
    error,
    reset,
  };
}

// ===== useMarkAllNotificationsRead ===== //

export type UseMarkAllNotificationsReadResult = {
  /**
   * Mark every unread notification as read. Returns the `{ count }`
   * acknowledgement on success and re-throws typed `ApiError` on
   * failure. Callers are expected to revalidate `useNotifications`
   * afterwards.
   */
  markAllRead: () => Promise<number>;
  /** `true` while the mark-all request is in flight. */
  isMarking: boolean;
  /** A typed `ApiError` from the last attempt, `null` otherwise. */
  error: ApiError | null;
  /** Clear the last error. */
  reset: () => void;
};

/**
 * Imperative hook for marking every unread notification as read.
 *
 * Does NOT use SWR for the request itself — mark-all is a mutation, not
 * a read. Callers should revalidate `useNotifications` afterwards.
 */
export function useMarkAllNotificationsRead(): UseMarkAllNotificationsReadResult {
  const [isMarking, setIsMarking] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const markAllRead = useCallback(async (): Promise<number> => {
    setIsMarking(true);
    setError(null);
    try {
      const response = await markAllNotificationsRead();
      return response.count;
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
      setIsMarking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    markAllRead,
    isMarking,
    error,
    reset,
  };
}
