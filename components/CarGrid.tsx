"use client";

import { useEffect, useState } from "react";
import CarCard from "./CarCard";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import FilterToolbar from "./common/FilterToolbar";
import ShowMoreLink from "./common/ShowMoreLink";
import Spinner from "./common/Spinner";
import { useCars } from "@/hooks/useCars";
import type { Car } from "@/lib/api/types";

type CarGridProps = {
  id?: string;
  title: string;
  isFeaturedMode?: boolean;
};

/** Client-side cap on the number of cards rendered for either grid. */
const DISPLAY_LIMIT = 9;

export default function CarGrid({
  id,
  title,
  isFeaturedMode = false,
}: CarGridProps) {
  // Filter toolbar state — unchanged from the previous mock-data version.
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("high-to-low");
  const [selectedModel, setSelectedModel] = useState("all");
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  const { cars, isLoading, error, mutate } = useCars({
    isFeatured: isFeaturedMode,
  });

  /**
   * Derive the list rendered in the grid: filter by `searchTerm` and
   * `selectedModel`, sort by price, then cap at 9 cards.
   *
   * `carBrand?.name ?? car.brand` and `carModel?.name ?? car.model` resolve
   * the same Arabic display strings the backend stores in the relational
   * `carBrand` / `carModel` refs (preferred) or falls back to the legacy
   * text columns when those refs are missing.
   */
  const getFilteredCars = (): Car[] => {
    return cars
      .filter((car) => {
        const brandLabel = car.carBrand?.name ?? car.brand;
        const modelLabel = car.carModel?.name ?? car.model;
        const trimLabel = car.trim ?? "";

        const matchesSearch =
          brandLabel.includes(searchTerm) ||
          modelLabel.includes(searchTerm) ||
          trimLabel.includes(searchTerm);

        const matchesModel =
          selectedModel === "all" || brandLabel === selectedModel;

        return matchesSearch && matchesModel;
      })
      .sort((a, b) => {
        if (sortBy === "high-to-low") return b.price - a.price;
        return a.price - b.price;
      })
      .slice(0, DISPLAY_LIMIT);
  };

  useEffect(() => {
    setFilteredCars(getFilteredCars());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars, selectedModel, sortBy]);

  return (
    <section
      id={id}
      className="bg-gray-50 lg:py-13 py-8 flex flex-col items-center gap-8 w-full border-b border-gray-100"
    >
      <MaxWidthWrapper className="w-full flex flex-col gap-6">
        {/* Header Title with "Show More" Link */}
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
          <h2 className="text-primary-800 font-medium text-2xl md:text-3xl">
            {title}
          </h2>

          <ShowMoreLink
            href={isFeaturedMode ? "/cars/featured" : "/cars/best-seller"}
          />
        </div>

        <FilterToolbar
          selectedModel={selectedModel}
          setSelectedModel={(v) => setSelectedModel(v)}
          sortBy={sortBy}
          setSortBy={(v) => setSortBy(v)}
          searchTerm={searchTerm}
          setSearchTerm={(v) => setSearchTerm(v)}
          searchAction={() => setFilteredCars(getFilteredCars())}
        />

        {/* Cars Grid / Loading / Error / Empty */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-4">
            {filteredCars.map((car) => (
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
                isCertified={car.inspectionPhotos.length > 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 font-medium w-full">
            لا توجد سيارات مطابقة لخيارات البحث الحالية
          </div>
        )}
      </MaxWidthWrapper>
    </section>
  );
}