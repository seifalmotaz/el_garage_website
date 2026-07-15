import { z } from "zod";
import { fetcher } from "./client";
import { absolutizeUrl } from "./media";

const isoDateString = z.iso.datetime();

export const FeatureItemSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  name: z.string(),
  iconUrl: z.string(),
  order: z.number().int(),
  isActive: z.boolean(),
  createdAt: isoDateString.optional(),
  updatedAt: isoDateString.optional(),
});

export type FeatureItem = z.infer<typeof FeatureItemSchema>;

export const FeatureSectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().int(),
  isActive: z.boolean(),
  createdAt: isoDateString.optional(),
  updatedAt: isoDateString.optional(),
  items: z.array(FeatureItemSchema),
});

export type FeatureSection = z.infer<typeof FeatureSectionSchema>;

export const FeatureSectionListSchema = z.array(FeatureSectionSchema);

function absolutizeFeatureIcons(section: FeatureSection): FeatureSection {
  return {
    ...section,
    items: section.items.map((item) => ({
      ...item,
      iconUrl: absolutizeUrl(item.iconUrl) ?? item.iconUrl,
    })),
  };
}

export async function getFeatureSections(): Promise<FeatureSection[]> {
  const sections = await fetcher<FeatureSection[]>(
    "/car-features",
    { method: "GET" },
    FeatureSectionListSchema,
  );
  return sections.map(absolutizeFeatureIcons);
}