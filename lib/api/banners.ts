/**
 * Public banners API.
 *
 *   - `getBanners` → `GET /api/v1/banners?position=&limit=`
 *
 * Position map: 1 = app home, 2 = website marketing, 3 = featured/secondary.
 */
import { z } from "zod";
import { fetcher } from "./client";
import { absolutizeUrl } from "./media";

export const BANNER_POSITION = {
  APP: 1,
  WEB: 2,
  FEATURED: 3,
} as const;

/** Accept full ISO datetimes or date-only strings from the API. */
const flexibleDateTime = z
  .union([z.string().datetime({ offset: true }), z.string().min(1)])
  .nullable()
  .optional();

export const BannerSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  image: z.string().nullable(),
  link: z.string().nullable(),
  position: z.number().int(),
  startDate: flexibleDateTime,
  endDate: flexibleDateTime,
  status: z.string(),
  order: z.number().int(),
  createdAt: z.union([
    z.string().datetime({ offset: true }),
    z.string().min(1),
  ]),
  updatedAt: z.union([
    z.string().datetime({ offset: true }),
    z.string().min(1),
  ]),
});

export type Banner = z.infer<typeof BannerSchema>;

const BannersListSchema = z.array(BannerSchema);

export type GetBannersParams = {
  position: number;
  /** How many banners to show after ordering (levels). */
  limit?: number;
};

function absolutizeBanner(banner: Banner): Banner {
  return {
    ...banner,
    image: absolutizeUrl(banner.image),
  };
}

export async function getBanners(
  params: GetBannersParams,
): Promise<Banner[]> {
  const search = new URLSearchParams();
  search.set("position", String(params.position));
  if (params.limit != null) search.set("limit", String(params.limit));

  const data = await fetcher<Banner[]>(
    `/banners?${search.toString()}`,
    { method: "GET", public: true },
    BannersListSchema,
  );
  return data.map(absolutizeBanner);
}
