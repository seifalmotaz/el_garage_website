"use client";

import { useState } from "react";
import Image from "next/image";
import CarCard from "./CarCard";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import { initialCars } from "@/mock-data/cars";
import FilterToolbar from "./common/FilterToolbar";

type CarGridProps = {
  id?: string;
  title: string;
  isFeaturedMode?: boolean;
};

export default function CarGrid({
  id,
  title,
  isFeaturedMode = false,
}: CarGridProps) {
  // filte toolbar states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("high-to-low");
  const [selectedModel, setSelectedModel] = useState("all");
  const [filteredCars, setFilteredCars] = useState(initialCars);

  return (
    <section
      id={id}
      className="bg-gray-50 py-16 flex flex-col items-center gap-8 w-full border-b border-gray-100"
    >
      <MaxWidthWrapper className="w-full flex flex-col gap-6">
        {/* Header Title with "Show More" Link */}
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
          <h2 className="text-primary-800 font-medium text-2xl md:text-3xl">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-gray-500 hover:text-primary-500 cursor-pointer transition-colors group">
            <span className="text-sm font-semibold">عرض المزيد</span>
            <Image
              src="/assets/arrow_left_gray.svg"
              alt="show more"
              width={16}
              height={16}
              className="w-4.5 h-4.5 group-hover:translate-x-[-4px] transition-transform"
            />
          </div>
        </div>

        <FilterToolbar
          selectedModel={selectedModel}
          setSelectedModel={(v) => setSelectedModel(v)}
          sortBy={sortBy}
          setSortBy={(v) => setSortBy(v)}
          searchTerm={searchTerm}
          setSearchTerm={(v) => setSearchTerm(v)}
          setFilteredCars={(v) => setFilteredCars(v)}
          isFeaturedMode={isFeaturedMode}
        />

        {/* Cars Grid layout */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-4">
            {filteredCars.map((car, idx) => (
              <CarCard key={idx} {...car} />
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
