/**
 * Public testimonials (customer opinions) API.
 *
 *   - `getTestimonials` → `GET /api/v1/testimonials`
 *
 * Returns an array of active testimonials ordered by `order` ascending.
 */
import { z } from "zod";
import { fetcher } from "./client";
import { absolutizeUrl } from "./media";

const flexibleDateTime = z.union([
  z.string().datetime({ offset: true }),
  z.string().min(1),
]);

export const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  carInfo: z.string().nullable(),
  comment: z.string(),
  avatar: z.string().nullable(),
  bgImage: z.string().nullable(),
  rating: z.number().int().nullable(),
  order: z.number().int(),
  isActive: z.boolean(),
  createdAt: flexibleDateTime,
  updatedAt: flexibleDateTime,
});

export type Testimonial = z.infer<typeof TestimonialSchema>;

const TestimonialsListSchema = z.array(TestimonialSchema);

function absolutizeTestimonial(item: Testimonial): Testimonial {
  return {
    ...item,
    avatar: absolutizeUrl(item.avatar),
    bgImage: absolutizeUrl(item.bgImage),
  };
}

/**
 * Fetch active public testimonials.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetcher<Testimonial[]>(
    "/testimonials",
    { method: "GET", public: true },
    TestimonialsListSchema,
  );
  return data.map(absolutizeTestimonial);
}
