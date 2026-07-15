"use client";

import { Suspense, useState, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import CarCard from "../../components/CarCard";
import FilterToolbar from "@/components/common/FilterToolbar";
import FilterAccordion from "@/components/common/FilterAccordion";
import ShowMoreToggle from "@/components/common/ShowMoreToggle";
import ActiveFilterChips, {
  type FilterChip,
} from "@/components/filters/ActiveFilterChips";
import BrandModelFilter from "@/components/filters/BrandModelFilter";
import RangeInput from "@/components/form/RangeInput";
import Checkbox from "@/components/form/Checkbox";
import Button from "@/components/common/Button";
import Logo from "@/components/common/Logo";
import SimilarCars from "@/components/sections/SimilarCars";
import Spinner from "../common/Spinner";
import { cn } from "@/lib/utils";
import PageBanner from "../common/PageBanner";
import Pagination from "../common/Pagination";
import NotFoundFeedback from "../common/NotFoundFeedback";
import MaxWidthWrapper from "../common/MaxWidthWrapper";
import { useCars } from "@/hooks/useCars";
import { useBrands } from "@/hooks/useBrands";
import { useBrandModels } from "@/hooks/useBrandModels";
import { useSpecTypes } from "@/hooks/useSpecTypes";
import { useFeatureSections } from "@/hooks/useFeatureSections";
import type { Car, CarSpecification } from "@/lib/api/types";
import {
  dedicatedSpecOptions,
  matchesFeatures,
  parseCarFilters,
  SIDEBAR_DEDICATED_SPEC_KEYS,
  sidebarSpecTypes,
  toApiParams,
} from "@/lib/car-filters";

const BRAND_VISIBLE_COUNT = 6;
const FEATURE_VISIBLE_COUNT = 4;

export type CarsFilterTitleType = "browseCars" | "bestSeller" | "featuredCars";

const getArabicPageTitle = (pageTitle: CarsFilterTitleType) => {
  return pageTitle === "browseCars"
    ? "تصفح السيارات"
    : pageTitle === "bestSeller"
      ? "الأكثر مبيعاً"
      : "السيارات المميزة";
};

// Aliases for transmission / fuel filter options. Backend `key` is
// case-insensitive and `value`/`label` may come back in either Arabic or
// English; mapping both sides keeps the filter from emptying the grid
// when only one spelling is in the spec payload.
const SPEC_OPTION_ALIASES: Record<string, string[]> = {
  "أوتوماتيك": ["أوتوماتيك", "اتوماتيك", "automatic", "auto"],
  "مانيوال": ["مانيوال", "manual", "يدوي"],
  "بنزين": ["بنزين", "petrol", "gasoline"],
  "ديزل": ["ديزل", "diesel"],
  "كهرباء": ["كهرباء", "electric", "ev"],
  "هجين": ["هجين", "hybrid"],
};

// Map a UI option to the spec `key` prefix we expect. Used to prefer specs
// whose key actually describes the filter category before falling back to
// a generic name/label match.
const SPEC_OPTION_KEY_PREFIX: Record<string, string> = {
  "أوتوماتيك": "transmission",
  "مانيوال": "transmission",
  "بنزين": "fuel",
  "ديزل": "fuel",
  "كهرباء": "fuel",
  "هجين": "fuel",
};

const aliasesFor = (option: string): string[] =>
  SPEC_OPTION_ALIASES[option] ?? [option];

const keyPrefixFor = (option: string): string | undefined =>
  SPEC_OPTION_KEY_PREFIX[option];

const specMatchesOption = (spec: CarSpecification, option: string): boolean => {
  const needles = aliasesFor(option).map((a) => a.toLowerCase());
  const haystacks = [spec.value, spec.label, spec.name]
    .filter((v): v is string => Boolean(v))
    .map((v) => v.toLowerCase());
  return needles.some((needle) =>
    haystacks.some((hay) => hay.includes(needle)),
  );
};

// Best-effort matcher: prefer specs whose `key` aligns with the filter
// category, but fall back to the legacy name/label/value match when no
// keyed specs are present so the grid doesn't empty out.
const carMatchesOptionGroup = (
  car: Car,
  options: string[],
): boolean => {
  if (options.length === 0) return true;
  const prefixes = options
    .map(keyPrefixFor)
    .filter((p): p is string => Boolean(p));
  const keyed = prefixes.length
    ? car.specifications.filter((s) =>
        prefixes.some((p) => s.key?.toLowerCase().includes(p)),
      )
    : [];
  const pool = keyed.length > 0 ? keyed : car.specifications;
  return pool.some((spec) => options.some((opt) => specMatchesOption(spec, opt)));
};

const CheckIcon = () => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.19336 5.69263L5.69336 10.1926L14.7093 1.19263"
      stroke="white"
      strokeWidth="2.38516"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AdBannerCard = ({ pageTitle }: { pageTitle: CarsFilterTitleType }) => (
  <div
    className={cn(
      "relative rounded-2xl overflow-hidden w-full select-none shadow-xs shrink-0 border border-gray-100/10",
      pageTitle === "bestSeller" ? "lg:h-[157px] h-[250px]" : "h-[157px]",
    )}
  >
    {/* Background Image */}
    <Image
      src={
        pageTitle === "browseCars" || pageTitle === "featuredCars"
          ? "/assets/ad_banner.png"
          : "/assets/best-seller-ad-banner.png"
      }
      alt={"Need a car?"}
      fill
      className="object-cover object-center"
    />
    {/* Dark Gradient Overlay */}
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50 z-10" />

    {/* Content Container (RTL) */}
    {pageTitle === "browseCars" || pageTitle === "featuredCars" ? (
      <div
        className="absolute inset-0 z-20 flex max-sm:flex-col sm:items-end justify-between p-4 text-white text-right"
        dir="rtl"
      >
        {/* Top row: Logo */}
        <Logo />

        {/* Bottom row: Text & Steps */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg text-white">محتاج عربية ؟</h3>

          {/* Steps Grid */}
          <div className="flex items-center justify-start gap-8 text-[11px] text-gray-200 font-medium">
            {/* Column 1 (Steps 1 & 3 - right side in RTL flow) */}
            <div className="flex flex-col gap-1 items-start">
              <span>1- سجل بياناتك</span>
              <span>3- عاين</span>
            </div>
            {/* Column 2 (Steps 2 & 4 - left side in RTL flow) */}
            <div className="flex flex-col gap-1 items-start">
              <span>2- نسق موعد</span>
              <span>4- ادفع و مبروك عليك</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="absolute inset-0 z-20 flex max-sm:flex-col items-center gap-8 lg:p-8 p-4 text-white text-right"
        dir="rtl"
      >
        <div>
          <Logo />
          <h2 className="font-bold text-[24px]">اشتري و انت مطمن</h2>
        </div>
        <div className="flex gap-6">
          <div className="space-y-2 font-white">
            <div className="flex items-center gap-3">
              <CheckIcon />
              <Image
                src={"/icons/safety.svg"}
                width={27}
                height={24}
                alt="امان تام"
              />
              <span className="lg:text-[15px] text-xs leading-[150%] font-medium">
                امان تام
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon />
              <Image
                src={"/icons/technicians.svg"}
                width={27}
                height={24}
                alt="فنيين معتمدين"
              />
              <span className="lg:text-[15px] text-xs leading-[150%] font-medium">
                فنيين معتمدين
              </span>
            </div>
          </div>
          <div className="space-y-2 font-white">
            <div className="flex items-center gap-3">
              <CheckIcon />
              <Image
                src={"/icons/inspect.svg"}
                width={27}
                height={24}
                alt="فحص شامل"
              />
              <span className="lg:text-[15px] text-xs leading-[150%] font-medium">
                فحص شامل
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckIcon />
              <Image
                src={"/icons/report.svg"}
                width={27}
                height={24}
                alt="تقرير فوري"
              />
              <span className="lg:text-[15px] text-xs leading-[150%] font-medium">
                تقرير فوري
              </span>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.697574 3.16555H8.74562C8.89562 3.69208 9.22289 4.15687 9.67697 4.48823C10.131 4.81959 10.6867 4.99911 11.2582 4.99911C11.8298 4.99911 12.3854 4.81959 12.8395 4.48823C13.2936 4.15687 13.6208 3.69208 13.7708 3.16555H15.3024C15.394 3.16555 15.4847 3.14833 15.5694 3.11486C15.654 3.08139 15.7309 3.03233 15.7957 2.97049C15.8605 2.90864 15.9118 2.83523 15.9469 2.75442C15.982 2.67362 16 2.58702 16 2.49956C16 2.4121 15.982 2.32549 15.9469 2.24469C15.9118 2.16389 15.8605 2.09047 15.7957 2.02863C15.7309 1.96678 15.654 1.91772 15.5694 1.88425C15.4847 1.85079 15.394 1.83356 15.3024 1.83356H13.7651C13.6151 1.30703 13.2878 0.842243 12.8337 0.510884C12.3796 0.179524 11.824 0 11.2525 0C10.6809 0 10.1253 0.179524 9.67121 0.510884C9.21713 0.842243 8.88985 1.30703 8.73985 1.83356H0.697574C0.605967 1.83356 0.515257 1.85079 0.430624 1.88425C0.34599 1.91772 0.26909 1.96678 0.204315 2.02863C0.139539 2.09047 0.0881561 2.16389 0.0530997 2.24469C0.0180433 2.32549 0 2.4121 0 2.49956C0 2.58702 0.0180433 2.67362 0.0530997 2.75442C0.0881561 2.83523 0.139539 2.90864 0.204315 2.97049C0.26909 3.03233 0.34599 3.08139 0.430624 3.11486C0.515257 3.14833 0.605967 3.16555 0.697574 3.16555ZM11.2669 1.33268C11.5084 1.33414 11.7441 1.4039 11.9442 1.53316C12.1442 1.66241 12.2997 1.84537 12.3909 2.05893C12.4821 2.27248 12.505 2.50706 12.4567 2.73302C12.4083 2.95898 12.2909 3.1662 12.1193 3.32851C11.9477 3.49082 11.7296 3.60094 11.4924 3.64496C11.2553 3.68897 11.0099 3.66492 10.787 3.57583C10.5642 3.48673 10.3741 3.3366 10.2406 3.14439C10.1071 2.95218 10.0362 2.72651 10.037 2.49589C10.0377 2.34241 10.0702 2.19058 10.1324 2.04906C10.1946 1.90754 10.2854 1.77911 10.3996 1.6711C10.5138 1.56308 10.6492 1.4776 10.798 1.41954C10.9468 1.36147 11.1061 1.33196 11.2669 1.33268Z"
      fill="#0C295A"
    />
    <path
      d="M15.3024 7.33413H7.25246C7.10314 6.80726 6.77624 6.34201 6.32226 6.01028C5.86828 5.67854 5.3125 5.49878 4.74081 5.49878C4.16912 5.49878 3.61334 5.67854 3.15937 6.01028C2.70539 6.34201 2.37848 6.80726 2.22916 7.33413H0.697574C0.512566 7.33413 0.335135 7.4043 0.204315 7.5292C0.0734943 7.65409 0 7.82349 0 8.00013C0 8.17676 0.0734943 8.34616 0.204315 8.47106C0.335135 8.59596 0.512566 8.66613 0.697574 8.66613H2.23493C2.38425 9.19299 2.71115 9.65824 3.16513 9.98998C3.61911 10.3217 4.17489 10.5015 4.74658 10.5015C5.31827 10.5015 5.87404 10.3217 6.32802 9.98998C6.782 9.65824 7.10891 9.19299 7.25823 8.66613H15.3024C15.4874 8.66613 15.6649 8.59596 15.7957 8.47106C15.9265 8.34616 16 8.17676 16 8.00013C16 7.82349 15.9265 7.65409 15.7957 7.5292C15.6649 7.4043 15.4874 7.33413 15.3024 7.33413ZM4.73313 9.167C4.49173 9.16555 4.25619 9.09588 4.05622 8.96679C3.85624 8.83769 3.70079 8.65495 3.60946 8.44161C3.51813 8.22827 3.49502 7.99388 3.54305 7.76802C3.59107 7.54215 3.70807 7.33492 3.8793 7.17246C4.05053 7.01001 4.26832 6.8996 4.50519 6.85517C4.74206 6.81074 4.98741 6.83427 5.21028 6.9228C5.43316 7.01133 5.62359 7.16089 5.75755 7.35262C5.89151 7.54435 5.963 7.76966 5.96301 8.00013C5.96276 8.15391 5.93072 8.30614 5.86873 8.44808C5.80674 8.59002 5.71601 8.71889 5.60176 8.82729C5.4875 8.93569 5.35196 9.0215 5.2029 9.0798C5.05384 9.13809 4.8942 9.16772 4.73313 9.167Z"
      fill="#0C295A"
    />
    <path
      d="M15.3024 12.8344H13.7651C13.6151 12.3079 13.2878 11.8431 12.8337 11.5117C12.3796 11.1804 11.824 11.0009 11.2525 11.0009C10.6809 11.0009 10.1253 11.1804 9.67121 11.5117C9.21713 11.8431 8.88985 12.3079 8.73985 12.8344H0.697574C0.512566 12.8344 0.335135 12.9046 0.204315 13.0295C0.0734943 13.1544 0 13.3238 0 13.5004C0 13.677 0.0734943 13.8464 0.204315 13.9713C0.335135 14.0962 0.512566 14.1664 0.697574 14.1664H8.74562C8.89562 14.6929 9.22289 15.1577 9.67697 15.4891C10.131 15.8204 10.6867 16 11.2582 16C11.8298 16 12.3854 15.8204 12.8395 15.4891C13.2936 15.1577 13.6208 14.6929 13.7708 14.1664H15.3024C15.4874 14.1664 15.6649 14.0962 15.7957 13.9713C15.9265 13.8464 16 13.677 16 13.5004C16 13.3238 15.9265 13.1544 15.7957 13.0295C15.6649 12.9046 15.4874 12.8344 15.3024 12.8344ZM11.2669 14.6691C11.0247 14.6706 10.7876 14.6033 10.5856 14.4759C10.3835 14.3485 10.2257 14.1667 10.1321 13.9535C10.0384 13.7403 10.0132 13.5053 10.0597 13.2785C10.1061 13.0516 10.2221 12.843 10.3929 12.6791C10.5637 12.5153 10.7817 12.4035 11.0191 12.3581C11.2565 12.3127 11.5027 12.3357 11.7264 12.424C11.9502 12.5124 12.1414 12.6623 12.2758 12.8545C12.4102 13.0468 12.4818 13.2729 12.4814 13.5041C12.4794 13.8114 12.3509 14.1056 12.1237 14.3232C11.8965 14.5408 11.5887 14.6644 11.2669 14.6673V14.6691Z"
      fill="#0C295A"
    />
  </svg>
);

const Banner = ({ pageTitle }: { pageTitle: CarsFilterTitleType }) => {
  return (
    <PageBanner
      href={
        pageTitle === "browseCars"
          ? "/cars"
          : pageTitle === "bestSeller"
            ? "/cars/best-seller"
            : "/cars/featured"
      }
      title={
        pageTitle === "browseCars"
          ? getArabicPageTitle(pageTitle)
          : `تصفح السيارات/${getArabicPageTitle(pageTitle)}`
      }
    />
  );
};

const CarsFilterInner = ({ pageTitle }: { pageTitle: CarsFilterTitleType }) => {
  const min_mileage = 0;
  const max_mileage = 150000;

  // Bug 3 (hero search): seed both `searchTerm` and `appliedSearch` from
  // the `?search=` query so a deep link or hero-banner redirect hits the
  // API on the very first request.
  const searchParams = useSearchParams();
  const initialFilters = parseCarFilters(searchParams);
  const initialSearch = initialFilters.search ?? "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("high-to-low");
  const [allBrandIds, setAllBrandIds] = useState<string[]>(
    initialFilters.brand && !initialFilters.model ? [initialFilters.brand] : [],
  );
  const [brandSearch, setBrandSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice !== undefined ? String(initialFilters.maxPrice) : "",
  );
  const [minYear, setMinYear] = useState(
    initialFilters.minYear !== undefined ? String(initialFilters.minYear) : "",
  );
  const [maxYear, setMaxYear] = useState(
    initialFilters.maxYear !== undefined ? String(initialFilters.maxYear) : "",
  );
  const [minMileage, setMinMileage] = useState(
    initialFilters.minMileage ?? min_mileage,
  );
  const [maxMileage, setMaxMileage] = useState(
    initialFilters.maxMileage ?? max_mileage,
  );
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>(
    initialFilters.specs,
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialFilters.features,
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedModelsByBrand, setSelectedModelsByBrand] = useState<
    Record<string, string[]>
  >({});
  const [expandedBrandIds, setExpandedBrandIds] = useState<string[]>(
    initialFilters.brand ? [initialFilters.brand] : [],
  );
  const [featureSearch, setFeatureSearch] = useState("");
  const [expandedFeatureSections, setExpandedFeatureSections] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState(initialFilters.model ?? "all");

  const { brands: allBrands, isLoading: brandsLoading } = useBrands();
  const { specTypes } = useSpecTypes();
  const { sections: featureSections } = useFeatureSections();
  const activeBrandIds = useMemo(() => {
    const ids = new Set([
      ...allBrandIds,
      ...Object.keys(selectedModelsByBrand).filter(
        (id) => (selectedModelsByBrand[id]?.length ?? 0) > 0,
      ),
    ]);
    return [...ids];
  }, [allBrandIds, selectedModelsByBrand]);

  const singleBrandId =
    activeBrandIds.length === 1 ? activeBrandIds[0] : null;
  const { models: brandModels } = useBrandModels(singleBrandId);

  const transmissionOptions = useMemo(
    () => dedicatedSpecOptions(specTypes, "transmission"),
    [specTypes],
  );
  const fuelOptions = useMemo(
    () => dedicatedSpecOptions(specTypes, "fuel"),
    [specTypes],
  );
  const dynamicSpecTypes = useMemo(
    () => sidebarSpecTypes(specTypes),
    [specTypes],
  );

  // Map pageTitle to the isFeatured API param. `featuredCars` lists only
  // featured, `bestSeller` lists only non-featured, `browseCars` lists
  // everything (param omitted).
  const isFeaturedParam =
    pageTitle === "featuredCars"
      ? true
      : pageTitle === "bestSeller"
        ? false
        : undefined;

  const apiFilters = useMemo(
    () =>
      toApiParams({
        brand: singleBrandId ?? undefined,
        model: selectedModel !== "all" ? selectedModel : undefined,
        minYear: minYear !== "" ? Number(minYear) : undefined,
        maxYear: maxYear !== "" ? Number(maxYear) : undefined,
        minMileage: minMileage !== min_mileage ? minMileage : undefined,
        maxMileage: maxMileage !== max_mileage ? maxMileage : undefined,
        maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
        search: appliedSearch !== "" ? appliedSearch : undefined,
        specs: selectedSpecs,
        features: selectedFeatures,
      }),
    [
      singleBrandId,
      selectedModel,
      minYear,
      maxYear,
      minMileage,
      maxMileage,
      min_mileage,
      max_mileage,
      maxPrice,
      appliedSearch,
      selectedSpecs,
      selectedFeatures,
    ],
  );

  const { cars, isLoading, error, mutate } = useCars({
    ...apiFilters,
    minPrice: minPrice !== "" ? Number(minPrice) : undefined,
    isFeatured: isFeaturedParam,
  });

  // Bug 5 (similar strip): fetch the featured strip independently so it
  // doesn't depend on the main grid's current filters / pageTitle.
  const { cars: similarCarsData } = useCars({ isFeatured: true });
  const similarCars = useMemo(
    () => similarCarsData.slice(0, 4),
    [similarCarsData],
  );

  const carsPerPage = 6;

  const models = useMemo(() => {
    if (brandModels.length > 0) {
      return brandModels.map((m) => m.name).sort();
    }
    const allModels = cars.map((car) => car.carModel?.name ?? car.model);
    return Array.from(new Set(allModels)).filter(Boolean).sort();
  }, [brandModels, cars]);

  const selectedTransmissionValues = useMemo(
    () =>
      selectedSpecs.transmission
        ? [selectedSpecs.transmission]
        : [],
    [selectedSpecs.transmission],
  );

  const selectedFuelValues = useMemo(
    () => (selectedSpecs.fuel ? [selectedSpecs.fuel] : []),
    [selectedSpecs.fuel],
  );

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const brandId = car.carBrand?.id;
        const modelLabel = car.carModel?.name ?? car.model;

        const hasBrandModelFilter =
          allBrandIds.length > 0 ||
          Object.values(selectedModelsByBrand).some((models) => models.length > 0);

        if (hasBrandModelFilter) {
          if (!brandId) return false;

          const matchesAllBrand = allBrandIds.includes(brandId);
          const specificModels = selectedModelsByBrand[brandId];
          const matchesSpecificModel =
            specificModels &&
            specificModels.length > 0 &&
            specificModels.includes(modelLabel);

          if (!matchesAllBrand && !matchesSpecificModel) {
            return false;
          }
        }

        if (
          selectedModel !== "" &&
          selectedModel !== "all" &&
          modelLabel !== selectedModel
        ) {
          return false;
        }

        if (
          selectedTransmissionValues.length > 0 &&
          !car.specifications.some(
            (spec) =>
              spec.key === "transmission" &&
              spec.value !== null &&
              selectedTransmissionValues.includes(spec.value),
          )
        ) {
          return false;
        }

        if (
          selectedFuelValues.length > 0 &&
          !car.specifications.some(
            (spec) =>
              spec.key === "fuel" &&
              spec.value !== null &&
              selectedFuelValues.includes(spec.value),
          )
        ) {
          return false;
        }

        for (const [specKey, specValue] of Object.entries(selectedSpecs)) {
          if (SIDEBAR_DEDICATED_SPEC_KEYS.has(specKey)) continue;
          if (
            !car.specifications.some(
              (spec) =>
                spec.key === specKey &&
                spec.value !== null &&
                spec.value === specValue,
            )
          ) {
            return false;
          }
        }

        if (
          !matchesFeatures(
            car.features.map((f) => f.id),
            selectedFeatures,
          )
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "high-to-low") return b.price - a.price;
        if (sortBy === "low-to-high") return a.price - b.price;
        if (sortBy === "newest") return b.year - a.year;
        if (sortBy === "oldest") return a.year - b.year;
        return 0;
      });
  }, [
    cars,
    allBrandIds,
    selectedModelsByBrand,
    selectedModel,
    selectedTransmissionValues,
    selectedFuelValues,
    selectedSpecs,
    selectedFeatures,
    sortBy,
  ]);

  const searchAction = () => {
    setAppliedSearch(searchTerm.trim());
    setCurrentPage(1);
  };

  const toolbarModelOptions = useMemo(
    () => models.map((model) => ({ label: model, value: model })),
    [models],
  );

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredCars.length / carsPerPage) || 1;
  const activePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedCars = useMemo(() => {
    const start = (activePage - 1) * carsPerPage;
    return filteredCars.slice(start, start + carsPerPage);
  }, [filteredCars, activePage, carsPerPage]);

  const clearBrandFilter = (brandId: string) => {
    setAllBrandIds((prev) => prev.filter((id) => id !== brandId));
    setSelectedModelsByBrand((prev) => {
      const { [brandId]: _, ...rest } = prev;
      return rest;
    });
    setCurrentPage(1);
  };

  const handleBrandAllToggle = (brandId: string) => {
    setAllBrandIds((prev) => {
      if (prev.includes(brandId)) {
        return prev.filter((id) => id !== brandId);
      }
      setSelectedModelsByBrand((models) => {
        const { [brandId]: _, ...rest } = models;
        return rest;
      });
      return [...prev, brandId];
    });
    setSelectedModel("all");
    setCurrentPage(1);
  };

  const handleModelToggle = (brandId: string, modelName: string) => {
    setAllBrandIds((prev) => prev.filter((id) => id !== brandId));
    setSelectedModelsByBrand((prev) => {
      const current = prev[brandId] ?? [];
      const next = current.includes(modelName)
        ? current.filter((name) => name !== modelName)
        : [...current, modelName];
      if (next.length === 0) {
        const { [brandId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [brandId]: next };
    });
    setSelectedModel("all");
    setCurrentPage(1);
  };

  const handleBrandExpandToggle = (brandId: string) => {
    setExpandedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleDedicatedSpecToggle = (key: string, value: string) => {
    setSelectedSpecs((prev) => {
      const next = { ...prev };
      if (next[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleDynamicSpecSelect = (key: string, value: string) => {
    setSelectedSpecs((prev) => {
      const next = { ...prev };
      if (next[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId],
    );
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAction();
  };

  const handleResetAll = () => {
    setSearchTerm("");
    setAppliedSearch("");
    setAllBrandIds([]);
    setBrandSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setMinMileage(min_mileage);
    setMaxMileage(max_mileage);
    setSelectedSpecs({});
    setSelectedFeatures([]);
    setSortBy("high-to-low");
    setSelectedModel("all");
    setSelectedModelsByBrand({});
    setExpandedBrandIds([]);
    setShowAllBrands(false);
    setCurrentPage(1);
  };

  const filteredBrandsList = useMemo(() => {
    return allBrands.filter(
      (b) =>
        b.name.includes(brandSearch) ||
        (b.nameEn &&
          b.nameEn.toLowerCase().includes(brandSearch.toLowerCase())),
    );
  }, [allBrands, brandSearch]);

  const visibleBrandsList = useMemo(() => {
    if (showAllBrands || brandSearch.trim() !== "") {
      return filteredBrandsList;
    }
    const initial = filteredBrandsList.slice(0, BRAND_VISIBLE_COUNT);
    const selectedHidden = filteredBrandsList.filter(
      (brand) =>
        (allBrandIds.includes(brand.id) ||
          (selectedModelsByBrand[brand.id]?.length ?? 0) > 0) &&
        !initial.some((item) => item.id === brand.id),
    );
    return [...initial, ...selectedHidden];
  }, [filteredBrandsList, showAllBrands, brandSearch, allBrandIds, selectedModelsByBrand]);

  const hiddenBrandCount = Math.max(
    0,
    filteredBrandsList.length - BRAND_VISIBLE_COUNT,
  );

  const brandModelActiveCount = useMemo(() => {
    const modelCount = Object.values(selectedModelsByBrand).reduce(
      (sum, names) => sum + names.length,
      0,
    );
    return allBrandIds.length + modelCount;
  }, [allBrandIds, selectedModelsByBrand]);

  const featureNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const section of featureSections) {
      for (const item of section.items) {
        map.set(item.id, item.name);
      }
    }
    return map;
  }, [featureSections]);

  const filteredFeatureSections = useMemo(() => {
    const query = featureSearch.trim().toLowerCase();
    if (!query) return featureSections;

    return featureSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.name.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [featureSections, featureSearch]);

  const activeFilterChips = useMemo((): FilterChip[] => {
    const chips: FilterChip[] = [];

    for (const brandId of allBrandIds) {
      const brand = allBrands.find((b) => b.id === brandId);
      if (!brand) continue;
      chips.push({
        id: `brand-all-${brandId}`,
        label: `${brand.name} · الكل`,
        onRemove: () => clearBrandFilter(brandId),
      });
    }

    for (const [brandId, modelNames] of Object.entries(selectedModelsByBrand)) {
      if (allBrandIds.includes(brandId)) continue;
      const brand = allBrands.find((b) => b.id === brandId);
      for (const modelName of modelNames) {
        chips.push({
          id: `model-${brandId}-${modelName}`,
          label: brand ? `${brand.name} · ${modelName}` : modelName,
          onRemove: () => handleModelToggle(brandId, modelName),
        });
      }
    }

    if (selectedModel !== "all" && selectedModel !== "") {
      chips.push({
        id: "model-toolbar",
        label: `الموديل: ${selectedModel}`,
        onRemove: () => {
          setSelectedModel("all");
          setCurrentPage(1);
        },
      });
    }

    if (minPrice !== "" || maxPrice !== "") {
      const parts: string[] = [];
      if (minPrice !== "") parts.push(`من ${minPrice}`);
      if (maxPrice !== "") parts.push(`إلى ${maxPrice}`);
      chips.push({
        id: "price",
        label: `السعر: ${parts.join(" ")}`,
        onRemove: () => {
          setMinPrice("");
          setMaxPrice("");
          setCurrentPage(1);
        },
      });
    }

    if (minYear !== "" || maxYear !== "") {
      const parts: string[] = [];
      if (minYear !== "") parts.push(`من ${minYear}`);
      if (maxYear !== "") parts.push(`إلى ${maxYear}`);
      chips.push({
        id: "year",
        label: `السنة: ${parts.join(" ")}`,
        onRemove: () => {
          setMinYear("");
          setMaxYear("");
          setCurrentPage(1);
        },
      });
    }

    if (minMileage !== min_mileage || maxMileage !== max_mileage) {
      chips.push({
        id: "mileage",
        label: `الكيلومترات: ${minMileage.toLocaleString()} - ${maxMileage.toLocaleString()}`,
        onRemove: () => {
          setMinMileage(min_mileage);
          setMaxMileage(max_mileage);
          setCurrentPage(1);
        },
      });
    }

    if (selectedSpecs.transmission) {
      const label =
        transmissionOptions.find((o) => o.value === selectedSpecs.transmission)
          ?.label ?? selectedSpecs.transmission;
      chips.push({
        id: "transmission",
        label: `ناقل الحركة: ${label}`,
        onRemove: () => handleDedicatedSpecToggle("transmission", selectedSpecs.transmission!),
      });
    }

    if (selectedSpecs.fuel) {
      const label =
        fuelOptions.find((o) => o.value === selectedSpecs.fuel)?.label ??
        selectedSpecs.fuel;
      chips.push({
        id: "fuel",
        label: `الوقود: ${label}`,
        onRemove: () => handleDedicatedSpecToggle("fuel", selectedSpecs.fuel!),
      });
    }

    for (const specType of dynamicSpecTypes) {
      const value = selectedSpecs[specType.key];
      if (!value) continue;
      const label =
        specType.options.find((o) => o.value === value)?.label ?? value;
      chips.push({
        id: `spec-${specType.key}`,
        label: `${specType.name}: ${label}`,
        onRemove: () => handleDynamicSpecSelect(specType.key, value),
      });
    }

    for (const featureId of selectedFeatures) {
      chips.push({
        id: `feature-${featureId}`,
        label: featureNameById.get(featureId) ?? "ميزة",
        onRemove: () => handleFeatureToggle(featureId),
      });
    }

    if (appliedSearch !== "") {
      chips.push({
        id: "search",
        label: `بحث: ${appliedSearch}`,
        onRemove: () => {
          setSearchTerm("");
          setAppliedSearch("");
          setCurrentPage(1);
        },
      });
    }

    return chips;
  }, [
    allBrandIds,
    allBrands,
    selectedModelsByBrand,
    selectedModel,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minMileage,
    maxMileage,
    min_mileage,
    max_mileage,
    selectedSpecs,
    transmissionOptions,
    fuelOptions,
    dynamicSpecTypes,
    selectedFeatures,
    featureNameById,
    appliedSearch,
  ]);

  const toggleFeatureSectionExpanded = (sectionId: string) => {
    setExpandedFeatureSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      {/* Hero Banner Section */}
      <Banner pageTitle={pageTitle} />

      <MaxWidthWrapper className="flex-1 w-full mx-auto lg:py-13 py-8 flex flex-col gap-6">
        <h1 className="text-right text-primary-800 font-semibold leading-[150%] text-lg mb-1 lg:hidden">
          {getArabicPageTitle(pageTitle)}
        </h1>

        {/* Mobile Filters Toggle Button */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden w-full bg-white border border-[#F2F2F2] h-[50px] px-4 rounded-[16px] flex items-center justify-start gap-2.5 text-lg font-medium text-gray-800 transition-colors cursor-pointer"
        >
          <FilterIcon />
          <span>الفلترة</span>
          {activeFilterChips.length > 0 ? (
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center mr-auto">
              {activeFilterChips.length}
            </span>
          ) : null}
        </button>

        {/* Two-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full relative">
          {/* Right Column: Filters Sidebar (Renders first in DOM for RTL float order) */}
          <aside
            className={`
              fixed inset-0 z-50 lg:z-0 lg:static lg:bg-transparent transition-opacity duration-300 overscroll-contain 
              ${showMobileFilters ? "opacity-100 pointer-events-auto bg-black/20" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}
            `}
            onClick={() => setShowMobileFilters(false)}
          >
            <div
              className={`
                fixed top-0 right-0 bottom-0 z-50 w-[312px] p-6 overflow-y-auto transition-transform duration-300 ease-in-out flex flex-col gap-4
                lg:static lg:overflow-visible lg:w-[312px] lg:p-6 lg:rounded-2xl lg:border lg:border-gray-200 lg:bg-gray-50 bg-white lg:translate-x-0
                ${showMobileFilters ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg text-gray-900">
                    الفلترة
                  </span>
                  {activeFilterChips.length > 0 ? (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterChips.length}
                    </span>
                  ) : null}
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {activeFilterChips.length > 0 ? (
                <ActiveFilterChips
                  chips={activeFilterChips}
                  onClearAll={handleResetAll}
                  className="lg:hidden"
                />
              ) : null}

              <FilterAccordion
                title="الماركة والموديل"
                defaultOpen
                activeCount={brandModelActiveCount}
              >
                <BrandModelFilter
                  isLoading={brandsLoading}
                  search={brandSearch}
                  onSearchChange={setBrandSearch}
                  allBrandIds={allBrandIds}
                  selectedModelsByBrand={selectedModelsByBrand}
                  expandedBrandIds={expandedBrandIds}
                  onBrandAllToggle={handleBrandAllToggle}
                  onModelToggle={handleModelToggle}
                  onBrandExpandToggle={handleBrandExpandToggle}
                  visibleBrands={visibleBrandsList}
                  showAllBrands={showAllBrands}
                  onShowAllToggle={() => setShowAllBrands((v) => !v)}
                  hiddenBrandCount={hiddenBrandCount}
                />
              </FilterAccordion>

              <FilterAccordion
                title="نطاق السعر"
                activeCount={minPrice !== "" || maxPrice !== "" ? 1 : 0}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="من"
                      min={0}
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-11 text-center bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 font-mono"
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="إلى"
                      min={0}
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-11 text-center bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 font-mono"
                    />
                  </div>
                </div>
              </FilterAccordion>

              <FilterAccordion
                title="سنة الإصدار"
                activeCount={minYear !== "" || maxYear !== "" ? 1 : 0}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="من"
                      min={1980}
                      value={minYear}
                      onChange={(e) => {
                        setMinYear(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-11 text-center bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 font-mono"
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="إلى"
                      min={1980}
                      value={maxYear}
                      onChange={(e) => {
                        setMaxYear(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-11 text-center bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 font-mono"
                    />
                  </div>
                </div>
              </FilterAccordion>

              <FilterAccordion
                title="الكيلومترات"
                activeCount={
                  minMileage !== min_mileage || maxMileage !== max_mileage
                    ? 1
                    : 0
                }
              >
                <RangeInput
                  min={min_mileage}
                  max={max_mileage}
                  from={minMileage}
                  setFrom={setMinMileage}
                  to={maxMileage}
                  setTo={setMaxMileage}
                />
              </FilterAccordion>

              {transmissionOptions.length > 0 ? (
                <FilterAccordion
                  title="ناقل الحركة"
                  activeCount={selectedSpecs.transmission ? 1 : 0}
                >
                  <div className="flex flex-col gap-2">
                    {transmissionOptions.map((trans) => (
                      <Checkbox
                        key={trans.value}
                        label={trans.label}
                        checked={selectedSpecs.transmission === trans.value}
                        onChange={() =>
                          handleDedicatedSpecToggle("transmission", trans.value)
                        }
                      />
                    ))}
                  </div>
                </FilterAccordion>
              ) : null}

              {fuelOptions.length > 0 ? (
                <FilterAccordion
                  title="نوع الوقود"
                  activeCount={selectedSpecs.fuel ? 1 : 0}
                >
                  <div className="flex flex-wrap gap-2">
                    {fuelOptions.map((fuel) => {
                      const isActive = selectedSpecs.fuel === fuel.value;
                      return (
                        <button
                          key={fuel.value}
                          type="button"
                          onClick={() =>
                            handleDedicatedSpecToggle("fuel", fuel.value)
                          }
                          className={`h-10 rounded-xl text-xs px-[16px] py-[10.5px] font-semibold border transition-all cursor-pointer flex items-center justify-center
                          ${
                            isActive
                              ? "bg-primary-500 border-primary-500 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {fuel.label}
                        </button>
                      );
                    })}
                  </div>
                </FilterAccordion>
              ) : null}

              {dynamicSpecTypes.map((specType) => (
                <FilterAccordion
                  key={specType.id}
                  title={specType.name}
                  activeCount={selectedSpecs[specType.key] ? 1 : 0}
                >
                  <div className="flex flex-wrap gap-2">
                    {specType.options.map((option) => {
                      const isActive =
                        selectedSpecs[specType.key] === option.value;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            handleDynamicSpecSelect(specType.key, option.value)
                          }
                          className={`h-10 rounded-xl text-xs px-[16px] py-[10.5px] font-semibold border transition-all cursor-pointer flex items-center justify-center
                          ${
                            isActive
                              ? "bg-primary-500 border-primary-500 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </FilterAccordion>
              ))}

              {filteredFeatureSections.some((s) => s.items.length > 0) ? (
                <FilterAccordion
                  title="المميزات والخيارات"
                  activeCount={selectedFeatures.length}
                >
                  <div className="relative bg-white border border-gray-200 rounded-xl h-10 flex items-center justify-between px-3">
                    <input
                      type="text"
                      placeholder="ابحث في المميزات..."
                      value={featureSearch}
                      onChange={(e) => setFeatureSearch(e.target.value)}
                      className="w-full h-full text-right outline-none text-xs font-light text-gray-800 pr-6 bg-transparent"
                    />
                    <Image
                      src="/assets/search_normal.svg"
                      alt="search"
                      width={14}
                      height={14}
                      className="absolute right-3 opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    {filteredFeatureSections.map((section) => {
                      if (section.items.length === 0) return null;

                      const sectionActiveCount = section.items.filter((item) =>
                        selectedFeatures.includes(item.id),
                      ).length;
                      const isSectionExpanded =
                        expandedFeatureSections[section.id] ?? false;
                      const collapsedItems = section.items.slice(
                        0,
                        FEATURE_VISIBLE_COUNT,
                      );
                      const selectedHiddenItems = section.items
                        .slice(FEATURE_VISIBLE_COUNT)
                        .filter((item) => selectedFeatures.includes(item.id));
                      const visibleItems = isSectionExpanded
                        ? section.items
                        : [
                            ...collapsedItems,
                            ...selectedHiddenItems.filter(
                              (item) =>
                                !collapsedItems.some(
                                  (visible) => visible.id === item.id,
                                ),
                            ),
                          ];
                      const hiddenFeatureCount = Math.max(
                        0,
                        section.items.length - FEATURE_VISIBLE_COUNT,
                      );

                      return (
                        <FilterAccordion
                          key={section.id}
                          title={section.name}
                          variant="nested"
                          activeCount={sectionActiveCount}
                        >
                          <div className="flex flex-col gap-2">
                            {visibleItems.map((item) => (
                              <Checkbox
                                key={item.id}
                                label={item.name}
                                checked={selectedFeatures.includes(item.id)}
                                onChange={() => handleFeatureToggle(item.id)}
                              />
                            ))}
                          </div>
                          <ShowMoreToggle
                            expanded={isSectionExpanded}
                            onToggle={() =>
                              toggleFeatureSectionExpanded(section.id)
                            }
                            hiddenCount={
                              isSectionExpanded ? 0 : hiddenFeatureCount
                            }
                          />
                        </FilterAccordion>
                      );
                    })}
                  </div>
                </FilterAccordion>
              ) : null}

              <div className="pt-2 shrink-0">
                <Button
                  variant="primaryDark"
                  onClick={handleResetAll}
                  className="h-[45px]"
                >
                  اعادة تعيين الكل
                </Button>
              </div>
            </div>
          </aside>

          {/* Left Column: Search Bar & Grid & Pagination */}
          <div className="flex-1 flex flex-col gap-6 w-full lg:max-w-[calc(100%-344px)]">
            <h1 className="text-right text-primary-800 font-medium leading-[150%] text-2xl mb-1 max-lg:hidden">
              {getArabicPageTitle(pageTitle)}
            </h1>

            {/*  Search toolbar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full"
            >
              <FilterToolbar
                selectedModel={selectedModel}
                setSelectedModel={(v) => {
                  setSelectedModel(v);
                  setSelectedModelsByBrand({});
                  setCurrentPage(1);
                }}
                sortBy={sortBy}
                setSortBy={(v) => {
                  setSortBy(v);
                  setCurrentPage(1);
                }}
                searchTerm={searchTerm}
                setSearchTerm={(v) => setSearchTerm(v)}
                searchAction={searchAction}
                modelOptions={toolbarModelOptions}
                isLeftCol={true}
                isPending={isLoading}
              />
            </form>

            {activeFilterChips.length > 0 ? (
              <ActiveFilterChips
                chips={activeFilterChips}
                onClearAll={handleResetAll}
                className="max-lg:hidden"
              />
            ) : null}

            {/* Ad Banner */}
            <AdBannerCard pageTitle={pageTitle} />

            {/* Cars Grid */}
            {error ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                <p className="text-red-500 font-medium">
                  حدث خطأ أثناء تحميل السيارات
                </p>
                <button
                  onClick={() => mutate()}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  حاول مرة أخرى
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Spinner variant="primary" />
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                {paginatedCars.map((car) => (
                  <CarCard
                    key={car.id}
                    id={car.id}
                    image={car.images[0]}
                    brand={car.carBrand?.name ?? car.brand}
                    model={car.carModel?.name ?? car.model}
                    price={car.price}
                    year={car.year}
                    mileage={car.mileage}
                    trim={car.trim}
                    location={car.address}
                    isFeatured={car.isFeatured}
                  />
                ))}
              </div>
            ) : (
              <NotFoundFeedback resetHandler={handleResetAll} />
            )}

            {/* Interactive Pagination */}
            <Pagination
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              activePage={activePage}
            />
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="sm:hidden">
        <SimilarCars recommendedCars={similarCars} />
      </div>
    </div>
  );
};

// `useSearchParams` requires a Suspense boundary during prerendering in
// Next.js 16, otherwise the production build fails with a missing-
// suspense-with-csr-bailout error. We wrap the inner component here so
// the parent page can stay untouched.
const CarsFilter = ({ pageTitle }: { pageTitle: CarsFilterTitleType }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spinner variant="primary" />
      </div>
    }
  >
    <CarsFilterInner pageTitle={pageTitle} />
  </Suspense>
);

export default CarsFilter;
