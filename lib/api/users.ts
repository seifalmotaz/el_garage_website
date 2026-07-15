/**
 * Thin wrappers around the authenticated `/users` endpoints exposed by the
 * backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime
 * validation and a single inferred TypeScript type per response.
 *
 *   - `updateMyProfile` → `PATCH /api/v1/users/me`
 *   - `changeMyPassword` → `PATCH /api/v1/users/me/password`
 *
 * `GET /users/me` mirrors `GET /auth/me` (see `lib/api/auth.ts` → `me`),
 * which the AuthContext already calls on bootstrap — we deliberately do
 * not re-export it here so callers don't split their source of truth
 * between two modules.
 *
 * Schemas mirror `backend/src/users/dto/update-user.dto.ts` and
 * `change-password.dto.ts`. Response shapes mirror `UserResponseDto` and
 * `MessageResponseDto`.
 *
 * Schemas are co-located here (rather than `./types`) because profile
 * updates are a one-off concern — keeping the DTOs next to the functions
 * that use them avoids polluting the shared `types.ts`.
 */
import { z } from "zod";
import { fetcher } from "./client";
import {
  MessageResponseSchema,
  UserSchema,
  type MessageResponse,
  type User,
} from "./types";

/** Patch payload for `PATCH /users/me` (see `UpdateUserDto`). */
export const UpdateProfileRequestSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    avatar: z.string().optional(),
  })
  .strict();

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

/** Patch payload for `PATCH /users/me/password`. */
export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export type ChangePasswordRequest = z.infer<
  typeof ChangePasswordRequestSchema
>;

/**
 * Update the authenticated user's profile.
 *
 * Issues `PATCH /api/v1/users/me` with the partial profile payload and
 * returns the updated `User`. Throws `ApiError` on non-2xx responses;
 * a 409 from a duplicate email is surfaced through `fieldErrors.email`.
 */
export async function updateMyProfile(
  input: UpdateProfileRequest,
): Promise<User> {
  UpdateProfileRequestSchema.parse(input);
  return fetcher<User>(
    "/users/me",
    { method: "PATCH", body: input },
    UserSchema,
  );
}

/**
 * Change the authenticated user's password.
 *
 * Issues `PATCH /api/v1/users/me/password` with `{ currentPassword,
 * newPassword }` and returns the backend's `{ message }` acknowledgement.
 * A wrong current password surfaces as a 401; the error message comes
 * from the backend's `UnauthorizedException`.
 */
export async function changeMyPassword(
  input: ChangePasswordRequest,
): Promise<MessageResponse> {
  ChangePasswordRequestSchema.parse(input);
  return fetcher<MessageResponse>(
    "/users/me/password",
    { method: "PATCH", body: input },
    MessageResponseSchema,
  );
}
