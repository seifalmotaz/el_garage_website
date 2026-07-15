"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import Dropdown from "./common/Dropdown";
import { cn } from "@/lib/utils";
import { useBrands } from "@/hooks/useBrands";
import { useBrandModels } from "@/hooks/useBrandModels";
import {
  buildCarsHref,
  buildYearOptions,
  MILEAGE_PRESETS,
  PRICE_PRESETS,
  type ParsedCarFilters,
} from "@/lib/car-filters";

const ALL_BRANDS = "all";

const CarCardType = ({
  variant = "blurry",
  setCarType,
  carType,
  name,
  logo,
  currentCarType,
}: {
  variant?: "white" | "blurry";
  setCarType: (v: string) => void;
  carType: string;
  name: string;
  logo?: string | null;
  currentCarType: string;
}) => {
  const isSelected = currentCarType === carType;
  return (
    <button
      type="button"
      onClick={() => setCarType(carType)}
      className={cn(
        "rounded-2xl flex items-center justify-center gap-1 aspect-square w-[106px]",
        variant === "blurry"
          ? isSelected
            ? "bg-[#E9F0FC]"
            : "bg-black/30 backdrop-blur-lg"
          : isSelected
            ? "border border-primary-500 bg-[#E9F0FC80]"
            : "border border-[#1313131A]",
      )}
    >
      <div className="flex flex-col gap-1 items-center px-2">
        <div className="w-[38px] h-[38px] flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span
              className={cn(
                "text-lg font-bold",
                variant === "blurry" && !isSelected
                  ? "text-white"
                  : "text-primary-500",
              )}
            >
              {name.charAt(0)}
            </span>
          )}
        </div>
        <h3
          className={cn(
            "text-sm line-clamp-1",
            variant === "blurry"
              ? isSelected
                ? "text-black"
                : "text-white"
              : isSelected
                ? "text-primary-500"
                : "text-black",
          )}
        >
          {name}
        </h3>
      </div>
    </button>
  );
};

type HeroFilters = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  maxPrice: string;
};

const EMPTY_FILTERS: HeroFilters = {
  brand: "",
  model: "",
  year: "",
  mileage: "",
  maxPrice: "",
};

export default function Hero() {
  const router = useRouter();
  const { brands, isLoading: brandsLoading } = useBrands();

  const [searchByTab, setSearchByTab] = useState<"type" | "details">("details");
  const [filters, setFilters] = useState<HeroFilters>(EMPTY_FILTERS);
  const [selectedBrandId, setSelectedBrandId] = useState(ALL_BRANDS);

  const { models, isLoading: modelsLoading } = useBrandModels(
    filters.brand || null,
  );

  const yearOptions = useMemo(() => buildYearOptions(), []);

  const brandOptions = useMemo(
    () => brands.map((b) => ({ label: b.name, value: b.id })),
    [brands],
  );

  const modelOptions = useMemo(
    () => models.map((m) => ({ label: m.name, value: m.name })),
    [models],
  );

  const heroFields = useMemo(
    () => [
      {
        key: "brand" as const,
        label: "الماركة",
        placeholder: brandsLoading ? "جاري التحميل..." : "حدد الماركة",
        options: brandOptions,
      },
      {
        key: "model" as const,
        label: "الموديل",
        placeholder:
          !filters.brand
            ? "حدد الماركة أولاً"
            : modelsLoading
              ? "جاري التحميل..."
              : "حدد الموديل",
        options: modelOptions,
        disabled: !filters.brand,
      },
      {
        key: "year" as const,
        label: "الإصدار",
        placeholder: "منذ سنة",
        options: yearOptions,
      },
      {
        key: "mileage" as const,
        label: "الكيلومتر(كم)",
        placeholder: "حدد المسافة",
        options: MILEAGE_PRESETS.map((p) => ({
          label: p.label,
          value: p.value,
        })),
      },
      {
        key: "maxPrice" as const,
        label: "السعر",
        placeholder: "حدد السعر",
        options: PRICE_PRESETS.map((p) => ({
          label: p.label,
          value: p.value,
        })),
      },
    ],
    [brandOptions, modelOptions, brandsLoading, modelsLoading, filters.brand, yearOptions],
  );

  const handleFilterChange = (key: keyof HeroFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "brand" ? { model: "" } : {}),
    }));
  };

  const buildFiltersFromHero = (): ParsedCarFilters => {
    const parsed: ParsedCarFilters = {
      specs: {},
      features: [],
    };

    if (searchByTab === "type") {
      if (selectedBrandId !== ALL_BRANDS) {
        parsed.brand = selectedBrandId;
      }
      return parsed;
    }

    if (filters.brand) parsed.brand = filters.brand;
    if (filters.model) parsed.model = filters.model;

    if (filters.year) {
      const year = Number(filters.year);
      if (Number.isFinite(year)) {
        parsed.minYear = year;
        parsed.maxYear = year;
      }
    }

    if (filters.mileage) {
      const preset = MILEAGE_PRESETS.find((p) => p.value === filters.mileage);
      if (preset) {
        if ("minMileage" in preset && preset.minMileage !== undefined) {
          parsed.minMileage = preset.minMileage;
        }
        if ("maxMileage" in preset && preset.maxMileage !== undefined) {
          parsed.maxMileage = preset.maxMileage;
        }
      }
    }

    if (filters.maxPrice) {
      const preset = PRICE_PRESETS.find((p) => p.value === filters.maxPrice);
      if (preset) parsed.maxPrice = preset.maxPrice;
    }

    return parsed;
  };

  const showResultsHandler = () => {
    router.push(buildCarsHref(buildFiltersFromHero()));
  };

  return (
    <section className="relative w-full min-h-[820px] flex flex-col items-center justify-center pt-28 lg:pt-32 pb-16 overflow-hidden bg-white lg:bg-transparent">
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Image
          src="/images/home/hero.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <MaxWidthWrapper>
        <div className="relative z-10 w-full flex flex-col items-center gap-8 lg:gap-12 ">
          <div className="text-center text-primary-500 lg:text-white flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold lg:drop-shadow-md leading-[150%]">
              بيع و اشتري سيارتك مع الجراج بأفضل سعر وأكثر ثقة
            </h1>
            <p className="text-sm md:text-[18px] text-gray-500 lg:text-white/90 leading-[150%] font-medium lg:drop-shadow-sm">
              أكثر من 1,200 سيارة مفحوصة ومعتمدة. ابحث، قارن، واشتري بثقة مع
              ضمان الفحص الاحترافي.
            </p>
          </div>

          <div className="relative w-full md:aspect-[335/148] aspect-video rounded-[24px] overflow-hidden lg:hidden shadow-sm">
            <Image
              src="/assets/hero_bg_decor2.png"
              alt="elGARAGE Handshake"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 text-gray-900 lg:text-white bg-white lg:bg-transparent p-4 lg:p-0 rounded-[20px] shadow-sm lg:shadow-none border border-gray-100 lg:border-none">
              <span className="text-sm font-bold lg:font-medium text-right w-full lg:w-auto">
                البحث حسب :
              </span>
              <div className="bg-[#0000001A] lg:backdrop-blur-md lg:bg-black/25 border border-gray-200/50 lg:border-white/10 rounded-2xl p-1 flex gap-2 w-full lg:w-[320px]">
                <button
                  type="button"
                  onClick={() => setSearchByTab("details")}
                  className={`flex-1 text-center rounded-2xl w-[192.5px] h-[40px] py-2.5 lg:py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    searchByTab === "details"
                      ? "bg-white text-primary-500 shadow-sm font-bold"
                      : "text-gray-500 lg:text-gray-200 hover:text-gray-800 lg:hover:text-white"
                  }`}
                >
                  تفاصيل السيارة
                </button>
                <button
                  type="button"
                  onClick={() => setSearchByTab("type")}
                  className={`flex-1 text-center rounded-2xl w-[192.5px] h-[40px] py-2.5 lg:py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    searchByTab === "type"
                      ? "bg-white text-primary-500 shadow-sm font-bold"
                      : "text-gray-500 lg:text-gray-200 hover:text-gray-800 lg:hover:text-white"
                  }`}
                >
                  نوع السيارة
                </button>
              </div>
            </div>

            <div className="relative z-20 w-full overflow-visible bg-white lg:backdrop-blur-lg lg:bg-black/20 max-lg:border max-lg:border-gray-100 rounded-[24px] p-4 lg:py-8 lg:px-6 flex flex-col gap-6 shadow-md lg:shadow-2xl">
              {searchByTab === "details" ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 max-lg:hidden overflow-visible">
                    {heroFields.map((field) => (
                      <Dropdown
                        key={field.key}
                        label={field.label}
                        placeholder={field.placeholder}
                        option={filters[field.key]}
                        options={field.disabled ? [] : field.options}
                        setOption={(val) => handleFilterChange(field.key, val)}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:hidden overflow-visible">
                    {heroFields.map((field) => (
                      <Dropdown
                        key={field.key}
                        label={field.label}
                        placeholder={field.placeholder}
                        option={filters[field.key]}
                        options={field.disabled ? [] : field.options}
                        setOption={(val) => handleFilterChange(field.key, val)}
                        variant="gray"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-3 flex-wrap max-lg:hidden">
                    {brandsLoading ? (
                      <span className="text-sm text-gray-500">جاري تحميل الماركات...</span>
                    ) : (
                      <>
                      <CarCardType
                        name="الكل"
                        carType={ALL_BRANDS}
                        currentCarType={selectedBrandId}
                        setCarType={(v) => setSelectedBrandId(v)}
                      />
                      {brands.map((brand) => (
                        <CarCardType
                          key={brand.id}
                          logo={brand.logo}
                          name={brand.name}
                          carType={brand.id}
                          currentCarType={selectedBrandId}
                          setCarType={(v) => setSelectedBrandId(v)}
                        />
                      ))}
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 flex-wrap lg:hidden">
                    {brandsLoading ? (
                      <span className="text-sm text-gray-500">جاري تحميل الماركات...</span>
                    ) : (
                      <>
                      <CarCardType
                        name="الكل"
                        variant="white"
                        carType={ALL_BRANDS}
                        currentCarType={selectedBrandId}
                        setCarType={(v) => setSelectedBrandId(v)}
                      />
                      {brands.map((brand) => (
                        <CarCardType
                          key={brand.id}
                          logo={brand.logo}
                          name={brand.name}
                          variant="white"
                          carType={brand.id}
                          currentCarType={selectedBrandId}
                          setCarType={(v) => setSelectedBrandId(v)}
                        />
                      ))}
                      </>
                    )}
                  </div>
                </>
              )}

              <div className="relative z-0 flex max-lg:justify-center w-full">
                <button
                  type="button"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm h-12 w-full lg:max-w-[420px] rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  onClick={showResultsHandler}
                >
                  <span>عرض النتائج</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}