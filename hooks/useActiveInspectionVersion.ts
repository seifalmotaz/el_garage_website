/**
 * SWR hook for the public active inspection version catalog.
 * Cached globally so car detail + inspection report pages share one fetch.
 */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api/errors";
import { getActiveInspectionVersion } from "@/lib/api/inspection";
import {
  buildOptionCatalog,
  type InspectionAnswerOption,
} from "@/lib/inspection-semantics";

export function useActiveInspectionVersion(): {
  catalog: Map<string, InspectionAnswerOption[]>;
  isLoading: boolean;
  error: ApiError | null;
} {
  const { data, error, isLoading } = useSWR(
    "/inspection/version/active",
    () => getActiveInspectionVersion(),
    {
      // Catalog rarely changes — avoid refetch storms on focus
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  const catalog = useMemo(
    () => buildOptionCatalog(data?.sections ?? []),
    [data],
  );

  const normalizedError: ApiError | null = !error
    ? null
    : error instanceof ApiError
      ? error
      : new ApiError(
          0,
          error instanceof Error ? error.message : "Request failed",
        );

  return { catalog, isLoading, error: normalizedError };
}
