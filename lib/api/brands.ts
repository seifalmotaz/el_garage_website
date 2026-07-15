/**
 * Thin wrappers around the public `/car-brands` endpoints exposed by the
 * backend.
 *
 * Each function delegates to the typed `fetcher` in `./client` and pins the
 * response shape with a zod schema so the front-end gets runtime validation
 * and a single inferred TypeScript type per response.
 *
 *   - `getBrands`       → `GET /api/v1/car-brands`           (public list)
 *   - `getBrandModels`  → `GET /api/v1/car-brands/:id/models` (public list)
 *
 * The backend returns `logo` (when present) as a path that may be relative
 * to the API origin (e.g. `/uploads/brand-logos/foo.png`). We rewrite those
 * to absolute URLs via `absolutizeUrl` from `./media` so consumers can drop
 * the result straight into `<img src>` without knowing the API origin.
 *
 * Schemas and inferred types live here (rather than `./types`) because
 * brand / model shapes are only used by this module — keeping them co-
 * located avoids polluting the shared `types.ts` with one-off DTOs.
 */
import { z } from "zod";
import { fetcher } from "./client";
import { absolutizeUrl } from "./media";

/**
 * Public brand shape returned by `GET /car-brands`.
 *
 * The backend serialises the Prisma `order` column as `order`; the front-end
 * contract exposes it as `sortOrder`. A `z.preprocess` step renames the
 * incoming key before validation so callers see a stable `sortOrder` field
 * regardless of how the backend spells it. `sortOrder` is optional because
 * legacy / soft-deleted rows may omit it.
 */
const BrandInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string().nullable(),
  logo: z.string().nullable(),
  sortOrder: z.number().int().optional(),
});

export const BrandSchema = z.preprocess((raw) => {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const r = raw as Record<string, unknown>;
    if (r.sortOrder === undefined && "order" in r) {
      return { ...r, sortOrder: r.order };
    }
  }
  return raw;
}, BrandInputSchema);

export type Brand = z.infer<typeof BrandInputSchema>;

/** Public model shape returned by `GET /car-brands/:id/models`. */
export const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string().nullable(),
});

export type Model = z.infer<typeof ModelSchema>;

/**
 * Rewrite the brand's `logo` (when present) to an absolute URL the browser
 * can load. Delegates to `absolutizeUrl` from `./media` so the rule lives
 * in one place; returns `null` for missing logos so callers can skip
 * rendering rather than emit a broken `<img src>`.
 */
function absolutizeBrandLogo(brand: Brand): Brand {
  return {
    ...brand,
    logo: absolutizeUrl(brand.logo),
  };
}

/**
 * Fetch the public list of active car brands.
 *
 * Issues `GET /api/v1/car-brands`, validates each entry against
 * `BrandSchema`, and absolutises `logo` so the consumer does not need to
 * know the API origin. The backend response includes nested `models` per
 * brand; the schema drops them — callers that need a brand's models
 * should call `getBrandModels(brandId)` separately.
 */
export async function getBrands(): Promise<Brand[]> {
  const brands = await fetcher<Brand[]>(
    "/car-brands",
    { method: "GET" },
    z.array(BrandSchema),
  );
  return brands.map(absolutizeBrandLogo);
}

/**
 * Fetch the public list of models for a given brand.
 *
 * Issues `GET /api/v1/car-brands/:id/models` and validates each entry
 * against `ModelSchema`. The brand id is URL-encoded to keep reserved
 * characters safe even though the backend expects a UUID today.
 */
export async function getBrandModels(brandId: string): Promise<Model[]> {
  return fetcher<Model[]>(
    `/car-brands/${encodeURIComponent(brandId)}/models`,
    { method: "GET" },
    z.array(ModelSchema),
  );
}