/**
 * Thin wrappers around the authenticated `/notifications` endpoints
 * exposed by the backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime
 * validation and a single inferred TypeScript type per response.
 *
 *   - `getNotifications`     → `GET    /api/v1/notifications?page&limit`
 *   - `markNotificationRead` → `PATCH  /api/v1/notifications/:id/read`
 *   - `markAllNotificationsRead` → `PATCH /api/v1/notifications/mark-all-read`
 *
 * Schemas mirror `backend/src/notifications/dto/notification-response.dto.ts`.
 * The list endpoint returns a paginated envelope:
 *   `{ data: Notification[]; total; page; limit; totalPages }`.
 *
 * Schemas are co-located here (rather than `./types`) because
 * notifications are a one-off concern — keeping the DTOs next to the
 * functions that use them avoids polluting the shared `types.ts`.
 */
import { z } from "zod";
import { fetcher } from "./client";

/** Optional payload attached to a notification (car / negotiation links). */
export const NotificationDataSchema = z
  .object({
    carId: z.string().optional(),
    negotiationId: z.string().optional(),
    requestId: z.string().optional(),
  })
  .nullable()
  .optional();

export type NotificationData = z.infer<typeof NotificationDataSchema>;

/** Public notification shape returned by the backend. */
export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  type: z.string(),
  isRead: z.boolean(),
  createdAt: z.iso.datetime(),
  data: NotificationDataSchema,
});

export type Notification = z.infer<typeof NotificationSchema>;

/** Paginated list response from `GET /notifications`. */
export const NotificationsListResponseSchema = z.object({
  data: z.array(NotificationSchema),
  total: z.number(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

export type NotificationsListResponse = z.infer<
  typeof NotificationsListResponseSchema
>;

/** Optional pagination params for `GET /notifications`. */
export type GetNotificationsParams = {
  /** 1-indexed page number (backend defaults to 1). */
  page?: number;
  /** Items per page (backend defaults to 20, max 100). */
  limit?: number;
};

/** Acknowledgement returned by `PATCH /notifications/mark-all-read`. */
export const MarkAllReadResponseSchema = z.object({
  count: z.number(),
});

export type MarkAllReadResponse = z.infer<typeof MarkAllReadResponseSchema>;

/**
 * Build the `?...` query string for `getNotifications`. We iterate
 * explicitly so `undefined` fields are skipped (rather than serialised as
 * the literal string `"undefined"`).
 */
function buildQueryString(params: GetNotificationsParams): string {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  return search.toString();
}

/**
 * Fetch the authenticated user's notifications.
 *
 * Issues `GET /api/v1/notifications` with optional pagination and
 * validates the response against `NotificationsListResponseSchema`.
 */
export async function getNotifications(
  params: GetNotificationsParams = {},
): Promise<NotificationsListResponse> {
  const query = buildQueryString(params);
  const path = query ? `/notifications?${query}` : "/notifications";
  return fetcher<NotificationsListResponse>(
    path,
    { method: "GET" },
    NotificationsListResponseSchema,
  );
}

/**
 * Mark a single notification as read.
 *
 * Issues `PATCH /api/v1/notifications/:id/read` and returns the updated
 * notification. The backend enforces ownership — non-owners receive a
 * 404 (`NotFoundException`).
 */
export async function markNotificationRead(
  id: string,
): Promise<Notification> {
  return fetcher<Notification>(
    `/notifications/${encodeURIComponent(id)}/read`,
    { method: "PATCH" },
    NotificationSchema,
  );
}

/**
 * Mark all unread notifications as read.
 *
 * Issues `PATCH /api/v1/notifications/mark-all-read` and returns the
 * number of notifications that were updated.
 */
export async function markAllNotificationsRead(): Promise<MarkAllReadResponse> {
  return fetcher<MarkAllReadResponse>(
    "/notifications/mark-all-read",
    { method: "PATCH" },
    MarkAllReadResponseSchema,
  );
}
