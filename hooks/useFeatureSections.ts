"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import {
  getFeatureSections,
  type FeatureSection,
} from "@/lib/api/features";

export type UseFeatureSectionsResult = {
  sections: FeatureSection[];
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => void;
};

export function useFeatureSections(): UseFeatureSectionsResult {
  const { data, error, isLoading, mutate } = useSWR<FeatureSection[]>(
    "/car-features",
    () => getFeatureSections(),
  );

  const normalizedError: ApiError | null = !error
    ? null
    : error instanceof ApiError
      ? error
      : new ApiError(
          0,
          error instanceof Error ? error.message : "Request failed",
        );

  const sections = useMemo<FeatureSection[]>(() => data ?? [], [data]);

  return {
    sections,
    isLoading,
    error: normalizedError,
    mutate: () => {
      void mutate();
    },
  };
}