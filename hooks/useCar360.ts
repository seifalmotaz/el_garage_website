/**
 * SWR hook for the public car 360° frames manifest.
 *
 * Fetch is gated by `enabled` so the heavy frame list is only requested
 * when the user opens the viewer (not on every car-detail page view).
 */
"use client";

import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import {
  getCar360Manifest,
  type Car360Manifest,
} from "@/lib/api/car-360";

export type UseCar360Result = {
  manifest: Car360Manifest | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => void;
};

/**
 * @param carId   Car UUID, or `null` to skip.
 * @param enabled When `false`, the request is not issued (SWR key is null).
 */
export function useCar360(
  carId: string | null,
  enabled = true,
): UseCar360Result {
  const { data, error, isLoading, mutate } = useSWR<Car360Manifest>(
    carId && enabled ? ["/car-360", carId] : null,
    ([, id]) => getCar360Manifest(id as string),
    {
      // Manifest is static per upload — no need to revalidate on focus.
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
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
    manifest: data ?? null,
    isLoading: Boolean(carId && enabled && isLoading),
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}
