/**
 * SWR hook for public banners by position.
 */
"use client";

import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import {
  getBanners,
  type Banner,
  type GetBannersParams,
} from "@/lib/api/banners";

export type UseBannersResult = {
  banners: Banner[];
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => void;
};

export function useBanners(params: GetBannersParams): UseBannersResult {
  const { data, error, isLoading, mutate } = useSWR<Banner[]>(
    ["/banners", params],
    () => getBanners(params),
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
    banners: data ?? [],
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}
