/**
 * Thin wrappers around the public `/contact` endpoint exposed by the
 * backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime validation
 * and a single inferred TypeScript type per response.
 *
 *   - `submitContact` → `POST /api/v1/contact` (public, throttled)
 *
 * The backend stores the submission and returns `{ id, message }` on
 * success. Field-level validation (name length, email format, messageType
 * enum, message min length) is enforced by the backend's `CreateContactDto`
 * and surfaced to the UI through the typed `ApiError`'s `fieldErrors`.
 *
 * Schemas are co-located here (rather than `./types`) because contact is
 * a one-off concern — keeping the request/response DTOs next to the
 * functions that use them avoids polluting the shared `types.ts`.
 */
import { z } from "zod";
import { fetcher } from "./client";

/**
 * Contact submission categories accepted by the backend
 * (`backend/src/contact/dto/create-contact.dto.ts`).
 *
 * Mirrored as a zod enum so the front-end can validate client-side before
 * sending and the response shape is pinned at the type level.
 */
export const ContactMessageTypeSchema = z.enum([
  "suggestion",
  "complaint",
  "inquiry",
]);

export type ContactMessageType = z.infer<typeof ContactMessageTypeSchema>;

/** Request body for `POST /contact`. */
export const ContactRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  messageType: ContactMessageTypeSchema,
  message: z.string().min(10).max(2000),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;

/** Response body for `POST /contact` (see `contact.service.ts`). */
export const ContactResponseSchema = z.object({
  id: z.string(),
  message: z.string(),
});

export type ContactResponse = z.infer<typeof ContactResponseSchema>;

/**
 * Submit a contact form.
 *
 * Issues `POST /api/v1/contact` with the validated payload and returns the
 * backend's `{ id, message }` acknowledgement. Throws `ApiError` on
 * non-2xx responses; the error's `fieldErrors` map mirrors the backend's
 * per-field validation messages when available.
 */
export async function submitContact(
  input: ContactRequest,
): Promise<ContactResponse> {
  ContactRequestSchema.parse(input);
  return fetcher<ContactResponse>(
    "/contact",
    { method: "POST", body: input },
    ContactResponseSchema,
  );
}
