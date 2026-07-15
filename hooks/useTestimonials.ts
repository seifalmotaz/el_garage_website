/**
 * SWR hook for public testimonials (customer opinions).
 */
"use client";

import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import {
  getTestimonials,
  type Testimonial,
} from "@/lib/api/testimonials";

export type UseTestimonialsResult = {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => void;
};

export function useTestimonials(): UseTestimonialsResult {
  const { data, error, isLoading, mutate } = useSWR<Testimonial[]>(
    ["/testimonials"],
    () => getTestimonials(),
  );

  const normalizedError: ApiError | null = !error
    ? null
    : error instanceof ApiError
      ? error
      : new ApiError(
          0,
          error instanceof Error ? error.message : "Request failed",
        );

  return {
    testimonials: data ?? [],
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}
