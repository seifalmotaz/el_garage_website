import type { GetCarsParams } from "@/lib/api/cars";
import type { SpecType } from "@/lib/api/specs";

/** Spec keys surfaced on the home hero (none — hero uses core car fields only). */
export const HERO_SPEC_KEYS = new Set<string>();

/** Spec keys handled as dedicated sidebar controls instead of dynamic spec chips. */
export const SIDEBAR_DEDICATED_SPEC_KEYS = new Set(["transmission", "fuel"]);

export type ParsedCarFilters = {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  maxPrice?: number;
  search?: string;
  specs: Record<string, string>;
  features: string[];
};

export const MILEAGE_PRESETS = [
  { label: "أقل من 50,000 كم", value: "0-50000", minMileage: 0, maxMileage: 50000 },
  {
    label: "50,000 - 100,000 كم",
    value: "50000-100000",
    minMileage: 50000,
    maxMileage: 100000,
  },
  {
    label: "100,000 - 150,000 كم",
    value: "100000-150000",
    minMileage: 100000,
    maxMileage: 150000,
  },
  { label: "أكثر من 150,000 كم", value: "150000+", minMileage: 150000 },
] as const;

export const PRICE_PRESETS = [
  { label: "حتى 500,000 ج.م", value: "500000", maxPrice: 500000 },
  { label: "حتى 1,000,000 ج.م", value: "1000000", maxPrice: 1000000 },
  { label: "حتى 2,000,000 ج.م", value: "2000000", maxPrice: 2000000 },
] as const;

const CURRENT_YEAR = new Date().getFullYear();

export function buildYearOptions(count = 20) {
  return Array.from({ length: count }, (_, i) => {
    const year = String(CURRENT_YEAR - i);
    return { label: year, value: year };
  });
}

type SearchParamsLike = {
  get: (name: string) => string | null;
  entries: () => IterableIterator<[string, string]>;
};

export function parseCarFilters(params: SearchParamsLike): ParsedCarFilters {
  const specs: Record<string, string> = {};
  const features: string[] = [];

  for (const [key, value] of params.entries()) {
    if (!value) continue;
    if (key.startsWith("spec_")) {
      specs[key.slice(5)] = value;
      continue;
    }
    if (key === "features") {
      features.push(
        ...value
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      );
    }
  }

  const parseNum = (key: string) => {
    const raw = params.get(key);
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    brand: params.get("brand") ?? undefined,
    model: params.get("model") ?? undefined,
    minYear: parseNum("minYear"),
    maxYear: parseNum("maxYear"),
    minMileage: parseNum("minMileage"),
    maxMileage: parseNum("maxMileage"),
    maxPrice: parseNum("maxPrice"),
    search: params.get("search") ?? undefined,
    specs,
    features,
  };
}

export function buildCarsQueryString(filters: ParsedCarFilters): string {
  const params = new URLSearchParams();

  if (filters.brand) params.set("brand", filters.brand);
  if (filters.model) params.set("model", filters.model);
  if (filters.minYear !== undefined) params.set("minYear", String(filters.minYear));
  if (filters.maxYear !== undefined) params.set("maxYear", String(filters.maxYear));
  if (filters.minMileage !== undefined) {
    params.set("minMileage", String(filters.minMileage));
  }
  if (filters.maxMileage !== undefined) {
    params.set("maxMileage", String(filters.maxMileage));
  }
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.search) params.set("search", filters.search);

  for (const [key, value] of Object.entries(filters.specs)) {
    if (value) params.set(`spec_${key}`, value);
  }

  if (filters.features.length > 0) {
    params.set("features", filters.features.join(","));
  }

  return params.toString();
}

export function buildCarsHref(filters: ParsedCarFilters): string {
  const query = buildCarsQueryString(filters);
  return query ? `/cars?${query}` : "/cars";
}

export function toApiParams(filters: ParsedCarFilters): GetCarsParams {
  const specs = { ...filters.specs };

  const api: GetCarsParams = {
    brand: filters.brand,
    model: filters.model,
    minYear: filters.minYear,
    maxYear: filters.maxYear,
    minMileage: filters.minMileage,
    maxMileage: filters.maxMileage,
    maxPrice: filters.maxPrice,
    search: filters.search,
    specs: Object.keys(specs).length > 0 ? specs : undefined,
  };

  return api;
}

export function matchesFeatures(
  carFeatureIds: string[],
  selectedFeatureIds: string[],
): boolean {
  if (selectedFeatureIds.length === 0) return true;
  return selectedFeatureIds.every((id) => carFeatureIds.includes(id));
}

export function sidebarSpecTypes(specTypes: SpecType[]): SpecType[] {
  return specTypes.filter(
    (spec) =>
      spec.fieldType === "DROPDOWN" &&
      spec.options.length > 0 &&
      !SIDEBAR_DEDICATED_SPEC_KEYS.has(spec.key),
  );
}

export function dedicatedSpecOptions(
  specTypes: SpecType[],
  key: string,
): { label: string; value: string }[] {
  const spec = specTypes.find((s) => s.key === key);
  if (!spec) return [];
  return spec.options.map((opt) => ({ label: opt.label, value: opt.value }));
}