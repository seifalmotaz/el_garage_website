"use client";

import { useState } from "react";
import Image from "next/image";
import CarCard from "./CarCard";

type CarGridProps = {
  id?: string;
  title: string;
  isFeaturedMode?: boolean;
};

export default function CarGrid({ id, title, isFeaturedMode = false }: CarGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("high-to-low");
  const [selectedModel, setSelectedModel] = useState("all");

  // Mock car data
  const initialCars = [
    {
      id: "range-rover",
      brand: "لاند روفر",
      model: "رينج روفر فوج اس اي",
      price: "6,200,000",
      installment: "124,444",
      year: "2020",
      mileage: "45,000 كم",
      trim: "Highline",
      location: "الاسكندرية",
      isFeatured: true,
      isCertified: true,
      discountText: "خصم 40 ألف ج.م",
      image: "/assets/car_placeholder.png"
    },
    {
      id: "mercedes-c200",
      brand: "مرسيدس بنز",
      model: "C200 AMG Line",
      price: "3,850,000",
      installment: "78,500",
      year: "2022",
      mileage: "28,000 كم",
      trim: "AMG",
      location: "القاهرة",
      isFeatured: true,
      isCertified: true,
      image: "/assets/car_placeholder.png"
    },
    {
      id: "toyota-corolla",
      brand: "تويوتا",
      model: "كورولا هايلاند",
      price: "1,250,000",
      installment: "24,000",
      year: "2021",
      mileage: "62,000 كم",
      trim: "Luxury",
      location: "الجيزة",
      isFeatured: false,
      isCertified: true,
      discountText: "خصم 15 ألف ج.م",
      image: "/assets/car_placeholder.png"
    },
    {
      id: "bmw-320i",
      brand: "بي إم دبليو",
      model: "320i M Sport",
      price: "3,100,000",
      installment: "62,000",
      year: "2020",
      mileage: "54,000 كم",
      trim: "M Sport",
      location: "القاهرة",
      isFeatured: true,
      isCertified: true,
      image: "/assets/car_placeholder.png"
    },
    {
      id: "hyundai-tucson",
      brand: "هيونداي",
      model: "توسان Smart Plus",
      price: "1,750,000",
      installment: "35,000",
      year: "2022",
      mileage: "38,000 كم",
      trim: "Smart",
      location: "الاسكندرية",
      isFeatured: false,
      isCertified: true,
      image: "/assets/car_placeholder.png"
    },
    {
      id: "kia-sportage",
      brand: "كيا",
      model: "سبورتاج Topline",
      price: "1,980,000",
      installment: "39,000",
      year: "2021",
      mileage: "49,000 كم",
      trim: "Topline",
      location: "المنصورة",
      isFeatured: false,
      isCertified: true,
      discountText: "خصم 10 آلاف ج.م",
      image: "/assets/car_placeholder.png"
    },
    {
      id: "chery-tiggo",
      brand: "شيري",
      model: "تيجو 8 برو",
      price: "1,450,000",
      installment: "28,500",
      year: "2023",
      mileage: "15,000 كم",
      trim: "Flagship",
      location: "القاهرة",
      isFeatured: true,
      isCertified: true,
      image: "/assets/car_placeholder.png"
    },
    {
      id: "mini-cooper",
      brand: "ميني كوبر",
      model: "S Countryman",
      price: "2,400,000",
      installment: "48,000",
      year: "2019",
      mileage: "71,000 كم",
      trim: "S",
      location: "الجيزة",
      isFeatured: false,
      isCertified: true,
      image: "/assets/car_placeholder.png"
    },
    {
      id: "bmw-x5",
      brand: "بي إم دبليو",
      model: "X5",
      price: "620,000",
      installment: "12,444",
      year: "2023",
      mileage: "45,000 كم",
      trim: "Highline",
      location: "الاسكندرية",
      isFeatured: true,
      isCertified: true,
      discountText: "خصم 40 ألف ج.م",
      image: "/assets/why_cars.png"
    }
  ];

  // Filter cars based on search, model, and feature mode
  const filteredCars = initialCars
    .filter(car => {
      if (isFeaturedMode && !car.isFeatured) return false;
      
      const matchesSearch = 
        car.brand.includes(searchTerm) || 
        car.model.includes(searchTerm) || 
        car.trim.includes(searchTerm);
        
      const matchesModel = selectedModel === "all" || car.brand === selectedModel;
      
      return matchesSearch && matchesModel;
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/,/g, ""));
      const priceB = parseFloat(b.price.replace(/,/g, ""));
      if (sortBy === "high-to-low") return priceB - priceA;
      return priceA - priceB;
    });

  return (
    <section id={id} className="bg-gray-50 py-16 px-6 md:px-12 flex flex-col items-center gap-8 w-full border-b border-gray-100">
      <div className="w-full max-w-[1336px] flex flex-col gap-6">
        
        {/* Header Title with "Show More" Link */}
        <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
          <h2 className="text-primary-800 font-bold text-2xl md:text-3xl">
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

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          
          {/* Right side filters: Model & Sorting */}
          <div className="flex flex-row items-center gap-3 w-full md:w-auto md:flex-initial">
            {/* Model Dropdown */}
            <div className="flex flex-col gap-1.5 text-right w-[40%] md:w-[220px]">
              <label className="text-gray-900 text-xs font-semibold px-1">
                الموديل
              </label>
              <div className="relative bg-white border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3 cursor-pointer group">
                <Image
                  src="/assets/arrow_down_gray.svg"
                  alt="down"
                  width={12}
                  height={6}
                />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                >
                  <option value="all">كل الموديلات</option>
                  <option value="لاند روفر">لاند روفر</option>
                  <option value="مرسيدس بنز">مرسيدس بنز</option>
                  <option value="تويوتا">تويوتا</option>
                  <option value="بي إم دبليو">بي إم دبليو</option>
                  <option value="هيونداي">هيونداي</option>
                  <option value="كيا">كيا</option>
                  <option value="شيري">شيري</option>
                  <option value="ميني كوبر">ميني كوبر</option>
                </select>
                <span className="text-gray-800 text-xs font-medium truncate">
                  {selectedModel === "all" ? "كل الموديلات" : selectedModel}
                </span>
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex flex-col gap-1.5 text-right w-[60%] md:w-[220px]">
              <label className="text-gray-900 text-xs font-semibold px-1">
                ترتيب حسب
              </label>
              <div className="relative bg-white border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3 cursor-pointer group">
                <Image
                  src="/assets/arrow_down_gray.svg"
                  alt="down"
                  width={12}
                  height={6}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                >
                  <option value="high-to-low">السعر - من الاعلى الي الاقل</option>
                  <option value="low-to-high">السعر - من الاقل الي الاعلى</option>
                </select>
                <span className="text-gray-800 text-xs font-medium truncate">
                  {sortBy === "high-to-low" ? "السعر - من الاعلى الي الاقل" : "السعر - من الاقل الي الاعلى"}
                </span>
              </div>
            </div>
          </div>

          {/* Left side: Search input */}
          <div className="flex flex-col gap-1.5 text-right w-full md:max-w-[450px]">
            <label className="text-gray-900 text-xs font-semibold px-1">
              البحث
            </label>
            <div className="flex gap-2 w-full">
              <div className="relative flex-1 bg-white border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3">
                <input
                  type="text"
                  placeholder="بتدور على ايه !"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-full text-right outline-none text-xs font-light text-gray-800 pl-8"
                />
                <Image
                  src="/assets/search_normal.svg"
                  alt="search"
                  width={16}
                  height={16}
                  className="absolute left-3 opacity-50"
                />
              </div>
              <button className="bg-white border border-primary-500 hover:bg-primary-50 text-primary-500 font-semibold text-xs px-6 rounded-xl transition-colors shrink-0">
                بحث
              </button>
            </div>
          </div>

        </div>

        {/* Cars Grid layout */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mt-4">
            {filteredCars.map((car, idx) => (
              <CarCard
                key={idx}
                id={car.id}
                brand={car.brand}
                model={car.model}
                price={car.price}
                installment={car.installment}
                year={car.year}
                mileage={car.mileage}
                trim={car.trim}
                location={car.location}
                isFeatured={car.isFeatured}
                isCertified={car.isCertified}
                discountText={car.discountText}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 font-medium w-full">
            لا توجد سيارات مطابقة لخيارات البحث الحالية
          </div>
        )}

      </div>
    </section>
  );
}
