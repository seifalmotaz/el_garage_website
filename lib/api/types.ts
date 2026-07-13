/**
 * Zod schemas + inferred TypeScript types for the auth surface of the
 * El Garage NestJS backend.
 *
 * Every request body and response body that crosses the network boundary
 * has a paired schema here. Callers pass the response schema to the
 * typed `fetcher` for runtime validation; types are derived via
 * `z.infer<...>` so there is exactly one source of truth per shape.
 *
 * IMPORTANT: keep these schemas in lockstep with the backend DTOs in
 * `backend/src/auth/dto/`. The backend is the source of truth — if a
 * DTO field is added/removed/relaxes there, mirror the change here.
 */
import { z } from "zod";

// ===== utilities ===== //

/**
 * E.164-style phone number as enforced by the backend.
 * Examples: +201234567890, +447911123456.
 */
const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, "رقم جوال غير صالح");

/** ISO 8601 timestamp as returned by the backend (e.g. "2024-01-15T10:30:00.000Z"). */
const isoDateString = z.iso.datetime();

/** User role enum mirroring `backend/prisma/schema.prisma`. */
const userRoleSchema = z.enum(["USER", "INSPECTOR", "ADMIN"]);
// ===== utilities ===== //
//
//
//
// ===== User ===== //
export const UserSchema = z.object({
  id: z.string(),
  phone: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  city: z.string().nullable(),
  region: z.string().nullable(),
  avatar: z.string().nullable(),
  role: userRoleSchema,
  isPhoneVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: isoDateString,
  updatedAt: isoDateString,
});

export type User = z.infer<typeof UserSchema>;
// ===== User ===== //
//
//
//
// ===== Auth tokens ===== //
export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
// ===== Auth tokens ===== //
//
//
//
// ===== Register ===== //
export const RegisterRequestSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const OtpResponseSchema = z.object({
  message: z.string(),
  expiresInSeconds: z.number(),
});

export type OtpResponse = z.infer<typeof OtpResponseSchema>;

export const RegisterResponseSchema = z.object({
  user: UserSchema,
  otp: OtpResponseSchema,
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
// ===== Register ===== //
//
//
//
// ===== Login ===== //
export const LoginRequestSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
// ===== Login ===== //
//
//
//
// ===== Verify OTP ===== //
export const VerifyOtpRequestSchema = z.object({
  phone: phoneSchema,
  otpCode: z.string().length(4),
});

export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>;

export const VerifyOtpResponseSchema = z.object({
  message: z.string(),
  user: UserSchema,
});

export type VerifyOtpResponse = z.infer<typeof VerifyOtpResponseSchema>;
// ===== Verify OTP ===== //
//
//
//
// ===== Resend OTP ===== //
export const ResendOtpRequestSchema = z.object({
  phone: phoneSchema,
});

export type ResendOtpRequest = z.infer<typeof ResendOtpRequestSchema>;
// ===== Resend OTP ===== //
//
//
//
// ===== Refresh token ===== //
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
// ===== Refresh token ===== //
//
//
//
// ===== Forgot password ===== //
export const ForgotPasswordRequestSchema = z.object({
  phone: phoneSchema,
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
// ===== Forgot password ===== //
//
//
//
// ===== Reset password ===== //
export const ResetPasswordRequestSchema = z.object({
  phone: phoneSchema,
  otpCode: z.string().length(4),
  newPassword: z.string().min(6),
});

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
// ===== Reset password ===== //
//
//
//
// ===== Generic message ===== //
export const MessageResponseSchema = z.object({
  message: z.string(),
});

export type MessageResponse = z.infer<typeof MessageResponseSchema>;
// ===== Generic message ===== //
//
//
//
// ===== Car ===== //
//
// The shapes below mirror the `GET /api/v1/cars` response from
// `backend/src/cars/cars.service.ts`. The list endpoint returns only
// `status: 'PUBLISHED'` cars; field semantics:
//
//   - `brand` / `model`  : legacy free-text fields. May be empty strings.
//                          Prefer `carBrand.name` / `carModel.name` when present.
//   - `carBrand` / `carModel` : relational references. May be null on
//                          legacy rows that haven't been migrated.
//   - `images[]`         : may be empty. Paths may be relative (`/uploads/...`)
//                          or absolute — `lib/api/cars.ts` prepends the API
//                          origin to relative entries.
//   - `inspectionPhotos[]` : photos linked to the car's inspection report.
//                          Empty array when no inspection exists.
//   - `isFeatured`       : optional. The backend's `getAvailableCars` map
//                          currently doesn't include this field; we treat
//                          it as optional so the front-end still renders
//                          until the backend response is updated.
//
// All nullability annotations reflect the runtime values returned by the
// backend, not the spec shorthand.
export const CarSellerSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string(),
});

export type CarSeller = z.infer<typeof CarSellerSchema>;

export const CarBrandRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string().nullable(),
  logo: z.string().nullable(),
});

export type CarBrandRef = z.infer<typeof CarBrandRefSchema>;

export const CarModelRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string().nullable(),
});

export type CarModelRef = z.infer<typeof CarModelRefSchema>;

export const CarSpecificationSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  // `value` / `label` come from either `CarSpecOption.value/label` (non-null)
  // or fall back to `CarSpecification.value` which is nullable on the model.
  value: z.string().nullable(),
  label: z.string().nullable(),
});

export type CarSpecification = z.infer<typeof CarSpecificationSchema>;

export const CarFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  iconUrl: z.string(),
  section: z.string().nullable(),
});

export type CarFeature = z.infer<typeof CarFeatureSchema>;

export const CarInspectionPhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnailUrl: z.string().nullable(),
  description: z.string().nullable(),
  sectionId: z.string().nullable(),
  questionId: z.string().nullable(),
  createdAt: isoDateString,
});

export type CarInspectionPhoto = z.infer<typeof CarInspectionPhotoSchema>;

export const CarStatusSchema = z.enum(["DRAFT", "PUBLISHED", "SOLD"]);

export type CarStatus = z.infer<typeof CarStatusSchema>;

export const CarSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  mileage: z.number().int(),
  trim: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  price: z.number(),
  description: z.string().nullable(),
  images: z.array(z.string()),
  videoUrl: z.string().nullable(),
  has360View: z.boolean(),
  status: CarStatusSchema,
  viewCount: z.number().int(),
  createdAt: isoDateString,
  seller: CarSellerSchema.nullable(),
  carBrand: CarBrandRefSchema.nullable(),
  carModel: CarModelRefSchema.nullable(),
  specifications: z.array(CarSpecificationSchema),
  features: z.array(CarFeatureSchema),
  inspectionPhotos: z.array(CarInspectionPhotoSchema),
  // The backend list endpoint does not currently surface this field; kept
  // optional so validation still passes against the existing response.
  isFeatured: z.boolean().optional(),
});

export type Car = z.infer<typeof CarSchema>;

export const CarListSchema = z.array(CarSchema);
// ===== Car ===== //