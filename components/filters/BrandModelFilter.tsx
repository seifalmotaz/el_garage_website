"use client";

import Image from "next/image";
import Checkbox from "@/components/form/Checkbox";
import ShowMoreToggle from "@/components/common/ShowMoreToggle";
import BrandLogo from "@/components/common/BrandLogo";
import { useBrandModels } from "@/hooks/useBrandModels";
import type { Brand } from "@/lib/api/brands";
import { cn } from "@/lib/utils";

const BrandModelsPanel = ({
  brandId,
  isAllSelected,
  selectedModels,
  onAllToggle,
  onModelToggle,
}: {
  brandId: string;
  isAllSelected: boolean;
  selectedModels: string[];
  onAllToggle: () => void;
  onModelToggle: (modelName: string) => void;
}) => {
  const { models, isLoading } = useBrandModels(brandId);

  if (isLoading) {
    return (
      <div className="px-3 pb-2">
        <span className="text-xs text-gray-400">جاري تحميل الموديلات...</span>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="px-3 pb-2">
        <span className="text-xs text-gray-400">لا توجد موديلات</span>
      </div>
    );
  }

  return (
    <div className="mx-2.5 mb-2 rounded-lg bg-white/70 px-2.5 py-2 flex flex-col gap-1.5">
      <Checkbox
        label="الكل"
        checked={isAllSelected}
        onChange={onAllToggle}
      />

      <div className="h-px bg-gray-100/80" />

      <div className="flex flex-col gap-1">
        {models.map((model) => (
          <Checkbox
            key={model.id}
            label={model.name}
            checked={!isAllSelected && selectedModels.includes(model.name)}
            onChange={() => onModelToggle(model.name)}
            className={cn(
              "transition-opacity",
              isAllSelected ? "opacity-40 pointer-events-none" : "",
            )}
          />
        ))}
      </div>
    </div>
  );
};

type BrandModelFilterProps = {
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  allBrandIds: string[];
  selectedModelsByBrand: Record<string, string[]>;
  expandedBrandIds: string[];
  onBrandAllToggle: (brandId: string) => void;
  onModelToggle: (brandId: string, modelName: string) => void;
  onBrandExpandToggle: (brandId: string) => void;
  visibleBrands: Brand[];
  showAllBrands: boolean;
  onShowAllToggle: () => void;
  hiddenBrandCount: number;
};

export default function BrandModelFilter({
  isLoading,
  search,
  onSearchChange,
  allBrandIds,
  selectedModelsByBrand,
  expandedBrandIds,
  onBrandAllToggle,
  onModelToggle,
  onBrandExpandToggle,
  visibleBrands,
  showAllBrands,
  onShowAllToggle,
  hiddenBrandCount,
}: BrandModelFilterProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative bg-white border border-gray-200 rounded-xl h-10 flex items-center px-3">
        <input
          type="text"
          placeholder="ابحث عن ماركة أو موديل"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-full text-right outline-none text-xs font-light text-gray-800 pr-7 bg-transparent"
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
        {isLoading ? (
          <span className="text-xs text-gray-400 text-center py-2">
            جاري تحميل الماركات...
          </span>
        ) : visibleBrands.length > 0 ? (
          visibleBrands.map((brand) => {
            const isExpanded = expandedBrandIds.includes(brand.id);
            const isAllSelected = allBrandIds.includes(brand.id);
            const brandModels = selectedModelsByBrand[brand.id] ?? [];
            const hasActiveSelection =
              isAllSelected || brandModels.length > 0;

            return (
              <div
                key={brand.id}
                className={cn(
                  "rounded-xl transition-colors",
                  isExpanded
                    ? "bg-primary-50/50"
                    : hasActiveSelection
                      ? "bg-primary-50/25"
                      : "bg-transparent",
                )}
              >
                <button
                  type="button"
                  onClick={() => onBrandExpandToggle(brand.id)}
                  aria-expanded={isExpanded}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2 py-2 text-right cursor-pointer select-none rounded-xl transition-colors",
                    !isExpanded && "hover:bg-gray-50/80",
                  )}
                >
                  <BrandLogo logo={brand.logo} name={brand.name} />
                  <span
                    className={cn(
                      "flex-1 text-sm truncate",
                      hasActiveSelection
                        ? "font-semibold text-primary-700"
                        : "font-medium text-gray-800",
                    )}
                  >
                    {brand.name}
                  </span>
                  {hasActiveSelection ? (
                    <span className="size-2 rounded-full bg-primary-500 shrink-0" />
                  ) : null}
                  <Image
                    src={
                      isExpanded
                        ? "/assets/arrow_up_faq.svg"
                        : "/assets/arrow_down_faq.svg"
                    }
                    alt=""
                    width={11}
                    height={11}
                    className="opacity-50 shrink-0"
                  />
                </button>

                {isExpanded ? (
                  <BrandModelsPanel
                    brandId={brand.id}
                    isAllSelected={isAllSelected}
                    selectedModels={brandModels}
                    onAllToggle={() => onBrandAllToggle(brand.id)}
                    onModelToggle={(modelName) =>
                      onModelToggle(brand.id, modelName)
                    }
                  />
                ) : null}
              </div>
            );
          })
        ) : (
          <span className="text-xs text-gray-400 text-center py-2">
            لا توجد ماركات مطابقة
          </span>
        )}
      </div>

      {search.trim() === "" ? (
        <ShowMoreToggle
          expanded={showAllBrands}
          onToggle={onShowAllToggle}
          hiddenCount={showAllBrands ? 0 : hiddenBrandCount}
        />
      ) : null}
    </div>
  );
}