/**
 * Thin wrappers around the public `/car-specs` endpoint exposed by the
 * backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime validation
 * and a single inferred TypeScript type per response.
 *
 *   - `getSpecTypes` hits `GET /api/v1/car-specs` (public) and returns the
 *     list of active spec types, each with its active options, sorted by
 *     `order` ascending. This drives the filter UI on the home page.
 *
 * The endpoint is the public counterpart to the admin-only
 * `/admin/car-spec-types` and `/admin/car-spec-options` controllers under
 * `backend/src/car-specs/controllers/`. It is wired in
 * `PublicSpecController.findAll`, which returns the result of
 * `SpecTypeService.findAll()` — a Prisma query that filters to
 * `isActive: true` and includes the active options for each type.
 *
 * The zod schemas live next to the fetcher (rather than in `./types`) so
 * the spec domain stays a single, self-contained module. The backend
 * `SpecFieldType` enum is mirrored here as `SpecFieldTypeSchema`.
 */
import { z } from "zod";
import { fetcher } from "./client";

// ===== utilities ===== //
//
// `isoDateString` is intentionally redefined here instead of imported from
// `./types` so this module is self-contained. Keep it in lockstep with the
// helper in `./types` — both should describe the same ISO 8601 timestamp
// format returned by the backend (e.g. "2024-01-15T10:30:00.000Z").

/** ISO 8601 timestamp as returned by the backend (e.g. "2024-01-15T10:30:00.000Z"). */
const isoDateString = z.iso.datetime();
// ===== utilities ===== //
//
//
//
// ===== Spec field type ===== //
//
// Mirrors `backend/prisma/schema.prisma` → `enum SpecFieldType`:
//   DROPDOWN | TEXT | NUMBER
// Used to render the appropriate input control on the filter UI (e.g.
// a select for DROPDOWN, a free-text input for TEXT, a number input for
// NUMBER).
export const SpecFieldTypeSchema = z.enum(["DROPDOWN", "TEXT", "NUMBER"]);

export type SpecFieldType = z.infer<typeof SpecFieldTypeSchema>;
// ===== Spec field type ===== //
//
//
//
// ===== Spec option ===== //
//
// One selectable option within a spec type (e.g. for the `fuel` type,
// options might be `{ label: "بنزين", value: "petrol" }`).
//
// `typeId` is included because the backend returns the full Prisma row.
// `isActive`, `createdAt`, `updatedAt` follow the same Prisma defaults;
// they are modelled as required here because the backend's
// `findAll` query only returns active rows but always includes the
// timestamps.
export const SpecOptionSchema = z.object({
  id: z.string(),
  typeId: z.string(),
  label: z.string(),
  value: z.string(),
  order: z.number().int(),
  isActive: z.boolean(),
  createdAt: isoDateString,
  updatedAt: isoDateString,
});

export type SpecOption = z.infer<typeof SpecOptionSchema>;
// ===== Spec option ===== //
//
//
//
// ===== Spec type ===== //
//
// One spec definition (e.g. "الحالة" → key "status", DROPDOWN). The
// nested `options` array follows the same shape as `SpecOptionSchema`.
//
// `key` is the API-stable identifier (used in the `specs` query param
// of `/cars`); `name` is the human-readable Arabic label shown in the
// filter UI.
export const SpecTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  fieldType: SpecFieldTypeSchema,
  order: z.number().int(),
  isActive: z.boolean(),
  createdAt: isoDateString,
  updatedAt: isoDateString,
  options: z.array(SpecOptionSchema),
});

export type SpecType = z.infer<typeof SpecTypeSchema>;

export const SpecTypeListSchema = z.array(SpecTypeSchema);
// ===== Spec type ===== //
//
//
//
// ===== Fetch ===== //

/**
 * Fetch the public list of active spec types with their active options.
 *
 * Issues `GET /api/v1/car-specs` and validates the response against
 * `SpecTypeListSchema`. The backend already filters to `isActive: true`
 * for both types and options, and sorts by `order` ascending — no
 * client-side filtering is needed.
 */
export async function getSpecTypes(): Promise<SpecType[]> {
  return fetcher<SpecType[]>("/car-specs", { method: "GET" }, SpecTypeListSchema);
}