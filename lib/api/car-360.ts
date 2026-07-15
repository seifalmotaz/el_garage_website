/**
 * Public 360° view API — mirrors `GET /cars/:id/360-frames`.
 *
 * The backend returns a manifest with tiered frame URLs (`low` / `high` /
 * `original`). Older uploads may only have a flat `original` list (or, in
 * legacy responses, a bare array). Callers should treat missing tiers as
 * empty and fall back gracefully.
 */
import { z } from "zod";
import { fetcher } from "./client";
import { absolutizeUrl } from "./media";

const FrameUrlsMapSchema = z.record(z.string(), z.array(z.string()));

/**
 * Accept either the tiered map (`{ low, high, original }`) or a legacy
 * flat array of URLs (treated as the `original` tier).
 */
const FrameUrlsSchema = z.union([
  FrameUrlsMapSchema,
  z.array(z.string()).transform((urls) => ({ original: urls })),
]);

export const Car360ManifestSchema = z.object({
  carId: z.string(),
  totalFrames: z.number().int().nonnegative(),
  frameUrls: FrameUrlsSchema,
});

export type Car360Manifest = z.infer<typeof Car360ManifestSchema>;

/** Normalised per-tier URL lists used by the viewer engine. */
export type Car360TierUrls = {
  low: string[];
  high: string[];
  original: string[];
};

/**
 * Rewrite every frame URL to an absolute origin so the browser can load
 * relative `/uploads/...` paths when the API returns them that way.
 */
function absolutizeManifest(manifest: Car360Manifest): Car360Manifest {
  const frameUrls: Record<string, string[]> = {};
  for (const [tier, urls] of Object.entries(manifest.frameUrls)) {
    frameUrls[tier] = urls.map((url) => absolutizeUrl(url) ?? url);
  }
  return { ...manifest, frameUrls };
}

/**
 * Collapse a raw manifest into the three tiers the viewer understands.
 * Missing tiers become empty arrays; the engine falls back low → high →
 * original as each becomes available.
 */
export function normalizeTier(manifest: Car360Manifest): Car360TierUrls {
  // After schema parse, frameUrls is always a string→string[] map
  // (legacy arrays are transformed to `{ original: [...] }`).
  const urls = manifest.frameUrls as Record<string, string[]>;
  return {
    low: urls.low ?? [],
    high: urls.high ?? [],
    // Flat v1 packages land under `original` only.
    original: urls.original ?? [],
  };
}

/**
 * Fetch the public 360 frames manifest for a car.
 *
 * Issues `GET /api/v1/cars/:id/360-frames`. Throws `ApiError` (404) when
 * the car has no 360 view uploaded.
 */
export async function getCar360Manifest(
  carId: string,
): Promise<Car360Manifest> {
  const raw = await fetcher<Car360Manifest>(
    `/cars/${encodeURIComponent(carId)}/360-frames`,
    { method: "GET", public: true },
    Car360ManifestSchema,
  );
  return absolutizeManifest(raw);
}
