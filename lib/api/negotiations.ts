/**
 * Thin wrappers around the buyer-facing `/negotiations` endpoints exposed
 * by the backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins
 * the response shape with a zod schema so the front-end gets runtime
 * validation and a single inferred TypeScript type per response.
 *
 *   - `createNegotiation`   → `POST   /api/v1/negotiations`
 *   - `getMyNegotiations`   → `GET    /api/v1/negotiations` (returns the
 *                             raw list payload's `items` array)
 *   - `cancelNegotiation`   → `POST   /api/v1/negotiations/:id/cancel`
 *
 * Schemas mirror `backend/src/negotiations/dto/negotiation-response.dto.ts`
 * and `create-negotiation.dto.ts`. The backend is the source of truth —
 * any DTO field change there must be mirrored here. The list endpoint
 * returns additional pagination fields (`total`, `page`, `limit`,
 * `totalPages`); we validate only the `items` field per the mobile
 * contract, but the extra keys pass through zod's default non-strict
 * parsing so no information is lost for callers that need it later.
 *
 * Note: the `message` field accepted by `createNegotiation` is request-only
 * — the backend `NegotiationResponseDto` does not echo it back, so the
 * response schema intentionally omits it.
 */
import { z } from "zod";
import { fetcher } from "./client";

// ===== Status enum ===== //
//
// Mirrors the Prisma `NegotiationStatus` enum surfaced by the backend
// in `NegotiationResponseDto.status`.
export const NegotiationStatusSchema = z.enum([
  "PENDING",
  "CONNECTED",
  "COMPLETED",
  "CANCELLED",
]);
export type NegotiationStatus = z.infer<typeof NegotiationStatusSchema>;
// ===== Status enum ===== //
//
//
//
// ===== Nested summaries ===== //
//
// `car` and `buyer` are projected in the backend service with explicit
// `select` clauses (see `backend/src/negotiations/services/negotiations.service.ts`).
// Only the projected fields are guaranteed to be present.
export const NegotiationCarSummarySchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  price: z.number(),
});
export type NegotiationCarSummary = z.infer<typeof NegotiationCarSummarySchema>;

export const NegotiationBuyerSummarySchema = z.object({
  id: z.string(),
  // `firstName` / `lastName` are nullable on `User` and not always populated.
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string(),
});
export type NegotiationBuyerSummary = z.infer<typeof NegotiationBuyerSummarySchema>;
// ===== Nested summaries ===== //
//
//
//
// ===== Negotiation ===== //
export const NegotiationSchema = z.object({
  id: z.string(),
  carId: z.string(),
  car: NegotiationCarSummarySchema,
  buyerId: z.string(),
  buyer: NegotiationBuyerSummarySchema,
  askingPrice: z.number(),
  initialOffer: z.number(),
  finalPrice: z.number().nullable(),
  status: NegotiationStatusSchema,
  adminNotes: z.string().nullable(),
  createdAt: z.iso.datetime(),
  connectedAt: z.iso.datetime().nullable(),
  completedAt: z.iso.datetime().nullable(),
});
export type Negotiation = z.infer<typeof NegotiationSchema>;
// ===== Negotiation ===== //
//
//
//
// ===== List response ===== //
//
// `GET /negotiations` returns `{ items: Negotiation[]; total; page; limit; totalPages }`.
// We only pin `items` because that's what the mobile repository contract
// (`app/lib/features/home/data/repositories/negotiations.repository.dart`)
// consumes; the other fields are passed through unchanged so consumers
// that later need pagination don't have to touch this schema.
export const NegotiationListResponseSchema = z.object({
  items: z.array(NegotiationSchema),
});
export type NegotiationListResponse = z.infer<
  typeof NegotiationListResponseSchema
>;
// ===== List response ===== //
//
//
//
// ===== Create request ===== //
//
// Mirrors `backend/src/negotiations/dto/create-negotiation.dto.ts`.
export const CreateNegotiationRequestSchema = z.object({
  carId: z.string(),
  initialOffer: z.number().min(0),
  message: z.string().max(1000).optional(),
});
export type CreateNegotiationRequest = z.infer<
  typeof CreateNegotiationRequestSchema
>;
// ===== Create request ===== //

/**
 * Create a new negotiation.
 *
 * Issues `POST /api/v1/negotiations` with `{ carId, initialOffer, message? }`
 * and validates the response against `NegotiationSchema`.
 */
export async function createNegotiation(
  input: CreateNegotiationRequest,
): Promise<Negotiation> {
  return fetcher<Negotiation>(
    "/negotiations",
    { method: "POST", body: input },
    NegotiationSchema,
  );
}

/**
 * Fetch the authenticated user's negotiations.
 *
 * Issues `GET /api/v1/negotiations` and returns the `items` array from
 * the response payload. Pagination metadata is ignored — the mobile
 * repository contract only consumes `items`.
 */
export async function getMyNegotiations(): Promise<Negotiation[]> {
  const response = await fetcher<NegotiationListResponse>(
    "/negotiations",
    { method: "GET" },
    NegotiationListResponseSchema,
  );
  return response.items;
}

/**
 * Cancel an existing negotiation.
 *
 * Issues `POST /api/v1/negotiations/:id/cancel` and returns the updated
 * negotiation (the backend re-projects it through `toResponseDto`).
 */
export async function cancelNegotiation(id: string): Promise<Negotiation> {
  return fetcher<Negotiation>(
    `/negotiations/${encodeURIComponent(id)}/cancel`,
    { method: "POST" },
    NegotiationSchema,
  );
}