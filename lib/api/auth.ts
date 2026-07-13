/**
 * Thin wrappers around the 9 auth endpoints exposed by the backend.
 *
 * Each function:
 *   - accepts the request payload type from `./types`,
 *   - delegates to the typed `fetcher` in `./client`,
 *   - validates the response body against the matching zod schema.
 *
 * Callers (e.g. the AuthContext, or feature pages) should prefer these
 * functions over calling `fetcher` directly so the response shapes are
 * pinned at the type level and validated at runtime.
 */
import { fetcher } from "./client";
import {
  AuthResponseSchema,
  ForgotPasswordRequestSchema,
  LoginRequestSchema,
  MessageResponseSchema,
  OtpResponseSchema,
  RefreshTokenRequestSchema,
  RegisterRequestSchema,
  RegisterResponseSchema,
  ResendOtpRequestSchema,
  ResetPasswordRequestSchema,
  UserSchema,
  VerifyOtpRequestSchema,
  VerifyOtpResponseSchema,
  type AuthResponse,
  type ForgotPasswordRequest,
  type LoginRequest,
  type MessageResponse,
  type OtpResponse,
  type RefreshTokenRequest,
  type RegisterRequest,
  type RegisterResponse,
  type ResendOtpRequest,
  type ResetPasswordRequest,
  type User,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
} from "./types";

/**
 * Register a new user. Returns the created user profile and an OTP
 * delivery receipt. Does NOT issue auth tokens — the caller must verify
 * the OTP before the user can log in.
 */
export function register(input: RegisterRequest): Promise<RegisterResponse> {
  // Runtime guard: validates input before sending so the caller gets a
  // clear client-side error instead of a 400 from the backend.
  RegisterRequestSchema.parse(input);
  return fetcher<RegisterResponse>(
    "/auth/register",
    { method: "POST", body: input },
    RegisterResponseSchema,
  );
}

/**
 * Exchange phone + password for an access/refresh token pair.
 * On success the caller is responsible for persisting the returned pair
 * (the AuthContext does this via the shared storage helpers in `./client`).
 */
export function login(input: LoginRequest): Promise<AuthResponse> {
  LoginRequestSchema.parse(input);
  return fetcher<AuthResponse>(
    "/auth/login",
    { method: "POST", body: input },
    AuthResponseSchema,
  );
}

/**
 * Verify the 4-digit OTP sent to the user's phone after registration.
 * Returns the updated user profile (now with `isPhoneVerified: true`).
 */
export function verifyOtp(input: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  VerifyOtpRequestSchema.parse(input);
  return fetcher<VerifyOtpResponse>(
    "/auth/verify-otp",
    { method: "POST", body: input },
    VerifyOtpResponseSchema,
  );
}

/** Resend the verification OTP. */
export function resendOtp(input: ResendOtpRequest): Promise<OtpResponse> {
  ResendOtpRequestSchema.parse(input);
  return fetcher<OtpResponse>(
    "/auth/resend-otp",
    { method: "POST", body: input },
    OtpResponseSchema,
  );
}

/**
 * Exchange a refresh token for a new token pair. Used internally by
 * the typed `fetcher` on 401 responses; can also be called directly if
 * the caller wants to force a refresh.
 */
export function refreshToken(input: RefreshTokenRequest): Promise<AuthResponse> {
  RefreshTokenRequestSchema.parse(input);
  return fetcher<AuthResponse>(
    "/auth/refresh",
    { method: "POST", body: input },
    AuthResponseSchema,
  );
}

/**
 * Invalidate the given refresh token on the server. Best-effort — the
 * caller should always clear local tokens regardless of the outcome.
 */
export function logout(input: RefreshTokenRequest): Promise<MessageResponse> {
  RefreshTokenRequestSchema.parse(input);
  return fetcher<MessageResponse>(
    "/auth/logout",
    { method: "POST", body: input },
    MessageResponseSchema,
  );
}

/** Send a password-reset OTP to the user's phone. */
export function forgotPassword(
  input: ForgotPasswordRequest,
): Promise<OtpResponse> {
  ForgotPasswordRequestSchema.parse(input);
  return fetcher<OtpResponse>(
    "/auth/forgot-password",
    { method: "POST", body: input },
    OtpResponseSchema,
  );
}

/** Set a new password using the OTP received via `forgotPassword`. */
export function resetPassword(
  input: ResetPasswordRequest,
): Promise<MessageResponse> {
  ResetPasswordRequestSchema.parse(input);
  return fetcher<MessageResponse>(
    "/auth/reset-password",
    { method: "POST", body: input },
    MessageResponseSchema,
  );
}

/**
 * Fetch the currently-authenticated user's profile. Requires a valid
 * access token in storage. On `401`, the typed `fetcher` will attempt
 * a one-time refresh + retry; if that fails, the stored tokens are
 * cleared and the error is propagated.
 */
export function me(): Promise<User> {
  return fetcher<User>("/auth/me", { method: "GET" }, UserSchema);
}