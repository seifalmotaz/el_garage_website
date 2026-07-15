/**
 * Thin wrappers around the authenticated `/listing-requests` endpoints
 * exposed by the backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime
 * validation and a single inferred TypeScript type per response.
 *
 *   - `createListingRequest`   → `POST   /api/v1/listing-requests`
 *   - `getMyListingRequests`   → `GET    /api/v1/listing-requests/my-requests`
 *   - `getListingRequestById`  → `GET    /api/v1/listing-requests/:id`
 *   - `cancelListingRequest`   → `POST   /api/v1/listing-requests/:id/cancel`
 *
 * Schemas mirror `backend/src/car-listing/dto/listing-request.dto.ts` and
 * the Prisma `CarListingRequest` model. The backend's response includes
 * nested `user`, `assignedInspector`, and `inspectionReport` blocks; we
 * model them as optional so the schemas still validate when the backend
 * trims fields in the future.
 *
 * Schemas are co-located here (rather than `./types`) because listing
 * requests are a one-off concern — keeping the DTOs next to the
 * functions that use them avoids polluting the shared `types.ts`.
 */
import { z } from "zod";
import { fetcher } from "./client";

/**
 * Status enum mirroring the Prisma `ListingRequestStatus` enum surfaced
 * by the backend service (see `car-listing.service.ts`).
 */
export const ListingRequestStatusSchema = z.enum([
  "PENDING",
  "ASSIGNED",
  "IN_INSPECTION",
  "INSPECTED",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

export type ListingRequestStatus = z.infer<typeof ListingRequestStatusSchema>;

/** Nested user summary projected by `create` / `findByUser` / `findOne`. */
export const ListingRequestUserSchema = z.object({
  id: z.string(),
  phone: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable().optional(),
});

export type ListingRequestUser = z.infer<typeof ListingRequestUserSchema>;

/** Nested inspector summary projected by `findByUser` / `findOne`. */
export const ListingRequestInspectorSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable().optional(),
});

export type ListingRequestInspector = z.infer<
  typeof ListingRequestInspectorSchema
>;

/** Nested inspection-report summary (subset of `findByUser` / `findOne`). */
export const InspectionReportSummarySchema = z.object({
  id: z.string(),
  status: z.string(),
  progress: z.number().int(),
  completedAt: z.iso.datetime().nullable().optional(),
});

export type InspectionReportSummary = z.infer<
  typeof InspectionReportSummarySchema
>;

/**
 * Listing-request shape returned by the backend. Mirrors the Prisma
 * `CarListingRequest` model plus the nested projections documented
 * above. Optional fields reflect what the backend may or may not
 * include depending on the endpoint.
 */
export const ListingRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  user: ListingRequestUserSchema.nullable().optional(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  mileage: z.number().int(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  scheduledDate: z.iso.datetime(),
  scheduledTime: z.string(),
  status: ListingRequestStatusSchema,
  assignedInspectorId: z.string().nullable().optional(),
  assignedInspector: ListingRequestInspectorSchema.nullable().optional(),
  assignedAt: z.iso.datetime().nullable().optional(),
  inspectionReportId: z.string().nullable().optional(),
  inspectionReport: InspectionReportSummarySchema.nullable().optional(),
  reviewedBy: z.string().nullable().optional(),
  reviewedAt: z.iso.datetime().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  plateNumber: z.string().nullable().optional(),
  chassisNumber: z.string().nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type ListingRequest = z.infer<typeof ListingRequestSchema>;

/** Request body for `POST /listing-requests` (see `CreateListingRequestDto`). */
export const CreateListingRequestSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int(),
  mileage: z.number().int(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(1),
  scheduledDate: z.string().min(1),
  scheduledTime: z.string().min(1),
});

export type CreateListingRequest = z.infer<typeof CreateListingRequestSchema>;

/**
 * Create a new listing request.
 *
 * Issues `POST /api/v1/listing-requests` with the validated payload and
 * returns the persisted request (including the nested `user` projection).
 */
export async function createListingRequest(
  input: CreateListingRequest,
): Promise<ListingRequest> {
  CreateListingRequestSchema.parse(input);
  return fetcher<ListingRequest>(
    "/listing-requests",
    { method: "POST", body: input },
    ListingRequestSchema,
  );
}

/**
 * Fetch the authenticated user's listing requests.
 *
 * Issues `GET /api/v1/listing-requests/my-requests`. The backend returns
 * a plain array (no pagination envelope for this endpoint).
 */
export async function getMyListingRequests(): Promise<ListingRequest[]> {
  return fetcher<ListingRequest[]>(
    "/listing-requests/my-requests",
    { method: "GET" },
    z.array(ListingRequestSchema),
  );
}

/**
 * Fetch a single listing request by id.
 *
 * Issues `GET /api/v1/listing-requests/:id`. The backend enforces
 * ownership — non-owners receive a 403 (`ForbiddenException`).
 */
export async function getListingRequestById(
  id: string,
): Promise<ListingRequest> {
  return fetcher<ListingRequest>(
    `/listing-requests/${encodeURIComponent(id)}`,
    { method: "GET" },
    ListingRequestSchema,
  );
}

/**
 * Cancel an existing listing request.
 *
 * Issues `POST /api/v1/listing-requests/:id/cancel`. The backend only
 * allows cancellation when the request is in `PENDING` status; otherwise
 * a 400 is surfaced as a typed `ApiError`.
 */
export async function cancelListingRequest(
  id: string,
): Promise<ListingRequest> {
  return fetcher<ListingRequest>(
    `/listing-requests/${encodeURIComponent(id)}/cancel`,
    { method: "POST" },
    ListingRequestSchema,
  );
}
