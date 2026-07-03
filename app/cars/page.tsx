"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import DownloadApp from "../../components/DownloadApp";
import CarCard from "../../components/CarCard";

const AdBannerCard = () => (
  <div className="relative rounded-2xl overflow-hidden w-full h-[157px] select-none shadow-xs shrink-0 border border-gray-100/10">
    {/* Background Image */}
    <Image
      src="/assets/ad_banner.png"
      alt="Need a car?"
      fill
      className="object-cover object-center"
    />
    {/* Dark Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/85 z-10" />

    {/* Content Container (RTL) */}
    <div
      className="absolute inset-0 z-20 flex flex-col justify-between p-4 text-white text-right"
      dir="rtl"
    >
      {/* Top row: Logo */}
      <div className="flex items-center justify-start gap-1.5 opacity-95">
        <div className="relative w-5 h-5">
          <Image
            src="/assets/logo_shield.svg"
            alt="Logo Shield"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-[70px] h-[10px]">
          <Image
            src="/assets/logo_text.svg"
            alt="elGARAGE"
            fill
            className="object-contain"
          />
        </div>
      </div>

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
  </div>
);

// Mock car data extended to allow robust filtering
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "هجين",
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
  },
  {
    id: "porsche-cayenne",
    brand: "بورش",
    model: "كايين كابريو",
    price: "7,500,000",
    installment: "150,000",
    year: "2021",
    mileage: "35,000 كم",
    trim: "Turbo",
    location: "القاهرة",
    isFeatured: true,
    isCertified: true,
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
  },
  {
    id: "audi-a4",
    brand: "أودي",
    model: "A4 Highline",
    price: "2,100,000",
    installment: "42,000",
    year: "2020",
    mileage: "50,000 كم",
    trim: "Luxury",
    location: "القاهرة",
    isFeatured: false,
    isCertified: true,
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
  },
  {
    id: "honda-civic",
    brand: "هوندا",
    model: "سيفيك الرياضية",
    price: "1,350,000",
    installment: "27,000",
    year: "2021",
    mileage: "40,000 كم",
    trim: "Sport",
    location: "الاسكندرية",
    isFeatured: false,
    isCertified: true,
    image: "/assets/car_placeholder.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
  },
  {
    id: "honda-accord",
    brand: "هوندا",
    model: "أكورد e:HEV",
    price: "2,950,000",
    installment: "59,000",
    year: "2023",
    mileage: "8,000 كم",
    trim: "Advanced",
    location: "القاهرة",
    isFeatured: true,
    isCertified: true,
    image: "/assets/car_placeholder.png",
    condition: "جديد",
    transmission: "أوتوماتيك",
    fuelType: "هجين",
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
    image: "/assets/why_cars.png",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
  },
];

const brands = [
  { ar: "بي إم دبليو", en: "BMW" },
  { ar: "مرسيدس بنز", en: "Mercedes" },
  { ar: "تويوتا", en: "Toyota" },
  { ar: "بورش", en: "Porsche" },
  { ar: "أودي", en: "Audi" },
  { ar: "هيونداي", en: "Hyundai" },
  { ar: "كيا", en: "Kia" },
  { ar: "هوندا", en: "Honda" },
  { ar: "لاند روفر", en: "Land Rover" },
  { ar: "شيري", en: "Chery" },
  { ar: "ميني كوبر", en: "Mini Cooper" },
];

export default function CarsBrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("high-to-low");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxMileage, setMaxMileage] = useState(150000);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    [],
  );
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState("");

  const carsPerPage = 6;

  // Derive unique models list dynamically
  const models = useMemo(() => {
    const allModels = initialCars.map((car) => car.model);
    return Array.from(new Set(allModels)).sort();
  }, []);

  // Derive similar cars (featured cars for carousel)
  const similarCars = useMemo(() => {
    return initialCars.filter((car) => car.isFeatured).slice(0, 4);
  }, []);

  // Filter and sort the cars list dynamically based on active filter state
  const filteredCars = useMemo(() => {
    return initialCars
      .filter((car) => {
        // Search input (brand, model, or trim)
        if (searchTerm.trim() !== "") {
          const query = searchTerm.toLowerCase();
          const match =
            car.brand.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            car.trim.toLowerCase().includes(query);
          if (!match) return false;
        }

        // Brand checkboxes
        if (selectedBrands.length > 0 && !selectedBrands.includes(car.brand)) {
          return false;
        }

        // Model select (mobile dropdown)
        if (selectedModel !== "" && car.model !== selectedModel) {
          return false;
        }

        // Price range min
        const priceNum = parseFloat(car.price.replace(/,/g, ""));
        if (minPrice !== "" && priceNum < parseFloat(minPrice)) {
          return false;
        }

        // Price range max
        if (maxPrice !== "" && priceNum > parseFloat(maxPrice)) {
          return false;
        }

        // Mileage range
        const mileageNum = parseInt(car.mileage.replace(/[^0-9]/g, "")) || 0;
        if (mileageNum > maxMileage) {
          return false;
        }

        // Condition checkboxes
        if (
          selectedConditions.length > 0 &&
          !selectedConditions.includes(car.condition)
        ) {
          return false;
        }

        // Transmission checkboxes
        if (
          selectedTransmissions.length > 0 &&
          !selectedTransmissions.includes(car.transmission)
        ) {
          return false;
        }

        // Fuel type toggles
        if (
          selectedFuelTypes.length > 0 &&
          !selectedFuelTypes.includes(car.fuelType)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/,/g, ""));
        const priceB = parseFloat(b.price.replace(/,/g, ""));
        const yearA = parseInt(a.year);
        const yearB = parseInt(b.year);

        if (sortBy === "high-to-low") return priceB - priceA;
        if (sortBy === "low-to-high") return priceA - priceB;
        if (sortBy === "newest") return yearB - yearA;
        if (sortBy === "oldest") return yearA - yearB;
        return 0;
      });
  }, [
    searchTerm,
    selectedBrands,
    minPrice,
    maxPrice,
    maxMileage,
    selectedConditions,
    selectedTransmissions,
    selectedFuelTypes,
    sortBy,
    selectedModel,
  ]);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredCars.length / carsPerPage) || 1;
  const activePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedCars = useMemo(() => {
    const start = (activePage - 1) * carsPerPage;
    return filteredCars.slice(start, start + carsPerPage);
  }, [filteredCars, activePage, carsPerPage]);

  const handleBrandToggle = (brandAr: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandAr)
        ? prev.filter((b) => b !== brandAr)
        : [...prev, brandAr],
    );
    setCurrentPage(1);
  };

  const handleConditionToggle = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond],
    );
    setCurrentPage(1);
  };

  const handleTransmissionToggle = (trans: string) => {
    setSelectedTransmissions((prev) =>
      prev.includes(trans) ? prev.filter((t) => t !== trans) : [...prev, trans],
    );
    setCurrentPage(1);
  };

  const handleFuelToggle = (fuel: string) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel],
    );
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(tempSearchTerm);
    setCurrentPage(1);
  };

  const handleResetAll = () => {
    setSearchTerm("");
    setTempSearchTerm("");
    setSelectedBrands([]);
    setBrandSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMaxMileage(150000);
    setSelectedConditions([]);
    setSelectedTransmissions([]);
    setSelectedFuelTypes([]);
    setSortBy("high-to-low");
    setSelectedModel("");
    setCurrentPage(1);
  };

  // Filter brand list dynamically by brand search query
  const filteredBrandsList = useMemo(() => {
    return brands.filter(
      (b) =>
        b.ar.includes(brandSearch) ||
        b.en.toLowerCase().includes(brandSearch.toLowerCase()),
    );
  }, [brandSearch]);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50/50">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[264px] md:h-[427px] flex flex-col items-center justify-center overflow-hidden select-none">
        {/* Background Image from Figma */}
        <Image
          src="/assets/hero_bg.png"
          alt=""
          fill
          className="object-cover pointer-events-none"
          priority
        />

        {/* Exact Dark Blue Gradients Overlay from Figma */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002853] to-[#002ec1] opacity-30 mix-blend-multiply pointer-events-none z-10" />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "linear-gradient(1.40863deg, rgba(0, 16, 69, 0.95) 9.2144%, rgba(0, 22, 91, 0.447) 67.797%, rgba(0, 0, 0, 0) 96.227%)",
          }}
        />

        {/* Text and Breadcrumbs Content */}
        <div className="relative z-20 flex flex-col items-center gap-2 mt-[64px] md:mt-16 text-center">
          <h1 className="text-3xl md:text-[40px] font-bold font-sans text-white tracking-wide">
            تصفح السيارات
          </h1>
          <div className="flex items-center gap-2 text-[14px] md:text-[16px] text-white/70">
            {/* Home Icon Container */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 5.69l5 4.5v7.81c0 .55-.45 1-1 1h-2v-5H10v5H8c-.55 0-1-.45-1-1v-7.81l5-4.5M12 3L2 12h3v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8h3L12 3z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <Link href="/" className="hover:text-white transition-colors">
              الصفحة الرئيسية
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">تصفح السيارات</span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1336px] mx-auto px-6 md:px-12 py-10 flex flex-col gap-6 font-sans">
        {/* Mobile Page Title */}
        <h2 className="lg:hidden text-right text-[#1A1A1A] font-bold text-2xl mb-1">
          تصفح السيارات
        </h2>

        {/* Mobile Filters Toggle Button */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden w-full bg-white border border-[#F2F2F2] h-[50px] px-4 rounded-[16px] flex items-center justify-start gap-2.5 text-sm font-bold text-gray-900 shadow-xs transition-colors cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-900"
          >
            <path
              d="M19 22V11M19 7V2M12 22V17M12 13V2M5 22V14M5 10V2M3 14H7M10 13H14M17 7H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>الفلترة</span>
        </button>

        {/* Two-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full relative">
          {/* Right Column: Filters Sidebar (Renders first in DOM for RTL float order) */}
          <aside
            className={`
              fixed inset-0 z-50 lg:z-0 lg:static bg-black/40 lg:bg-transparent transition-opacity duration-300
              ${showMobileFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}
            `}
            onClick={() => setShowMobileFilters(false)}
          >
            <div
              className={`
                fixed top-0 right-0 bottom-0 z-50 w-[312px] bg-white p-6 overflow-y-auto transition-transform duration-300 ease-in-out flex flex-col gap-6
                lg:static lg:w-[312px] lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border lg:border-gray-100 lg:bg-white lg:translate-x-0
                ${showMobileFilters ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button / Title */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-bold text-lg text-gray-900">الفلترة</span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Brand Filter */}
              <div className="flex flex-col gap-3">
                <label className="text-gray-900 text-sm font-semibold text-right">
                  الماركة
                </label>
                <div className="relative bg-gray-50 border border-gray-200 rounded-xl h-10 flex items-center justify-between px-3">
                  <input
                    type="text"
                    placeholder="بحث"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full h-full text-right outline-none text-xs font-light text-gray-800 pl-8 bg-transparent"
                  />
                  <Image
                    src="/assets/search_normal.svg"
                    alt="search"
                    width={14}
                    height={14}
                    className="absolute left-3 opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {filteredBrandsList.length > 0 ? (
                    filteredBrandsList.map((brand) => {
                      const isChecked = selectedBrands.includes(brand.ar);
                      return (
                        <label
                          key={brand.ar}
                          className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 cursor-pointer select-none py-0.5"
                        >
                          <span className="font-semibold text-gray-800 text-right w-full">
                            {brand.ar}
                          </span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleBrandToggle(brand.ar)}
                            className="w-4.5 h-4.5 rounded border-gray-300 accent-primary-500 focus:ring-primary-500 cursor-pointer shrink-0 ml-1.5"
                          />
                        </label>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-400 text-center py-2">
                      لا توجد ماركات مطابقة
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Price Range Filter */}
              <div className="flex flex-col gap-3">
                <label className="text-gray-900 text-sm font-semibold text-right">
                  نطاق السعر
                </label>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="إلى"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-11 text-center bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 font-mono"
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="من"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full h-11 text-center bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Mileage Filter */}
              <div className="flex flex-col gap-3">
                <label className="text-gray-900 text-sm font-semibold text-right">
                  الكيلومترات
                </label>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={maxMileage}
                  onChange={(e) => {
                    setMaxMileage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-primary-500 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div
                  className="flex items-center justify-between text-xs text-gray-500"
                  dir="rtl"
                >
                  <span>0 كم</span>
                  <span className="font-semibold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full font-mono">
                    حتى {maxMileage.toLocaleString()} كم
                  </span>
                  <span>150,000 كم</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Condition Filter */}
              <div className="flex flex-col gap-3">
                <label className="text-gray-900 text-sm font-semibold text-right">
                  الحالة
                </label>
                <div className="flex flex-col gap-2">
                  {["جديد", "مستعملة"].map((cond) => {
                    const isChecked = selectedConditions.includes(cond);
                    return (
                      <label
                        key={cond}
                        className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 cursor-pointer select-none py-0.5"
                      >
                        <span className="font-semibold text-gray-800 text-right w-full">
                          {cond}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleConditionToggle(cond)}
                          className="w-4.5 h-4.5 rounded border-gray-300 accent-primary-500 focus:ring-primary-500 cursor-pointer shrink-0 ml-1.5"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Transmission Filter */}
              <div className="flex flex-col gap-3">
                <label className="text-gray-900 text-sm font-semibold text-right">
                  ناقل الحركة
                </label>
                <div className="flex flex-col gap-2">
                  {["أوتوماتيك", "مانيوال"].map((trans) => {
                    const isChecked = selectedTransmissions.includes(trans);
                    return (
                      <label
                        key={trans}
                        className="flex items-center justify-between text-sm text-gray-700 hover:text-gray-900 cursor-pointer select-none py-0.5"
                      >
                        <span className="font-semibold text-gray-800 text-right w-full">
                          {trans}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTransmissionToggle(trans)}
                          className="w-4.5 h-4.5 rounded border-gray-300 accent-primary-500 focus:ring-primary-500 cursor-pointer shrink-0 ml-1.5"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Fuel Type Filter */}
              <div className="flex flex-col gap-3">
                <label className="text-gray-900 text-sm font-semibold text-right">
                  نوع الوقود
                </label>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {["بنزين", "ديزل", "كهرباء", "هجين"].map((fuel) => {
                    const isActive = selectedFuelTypes.includes(fuel);
                    return (
                      <button
                        key={fuel}
                        type="button"
                        onClick={() => handleFuelToggle(fuel)}
                        className={`h-10 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center
                          ${
                            isActive
                              ? "bg-primary-500 border-primary-500 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        {fuel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-gray-100 mt-2" />

              {/* Reset Filters */}
              <button
                type="button"
                onClick={handleResetAll}
                className="w-full bg-red-50 hover:bg-red-100/70 text-red-600 hover:text-red-700 font-bold text-sm py-3 rounded-2xl transition-colors cursor-pointer border border-red-100"
              >
                اعادة تعيين الكل
              </button>
            </div>
          </aside>

          {/* Left Column: Search Bar & Grid & Pagination */}
          <div className="flex-1 flex flex-col gap-6 w-full lg:max-w-[calc(100%-344px)]">
            {/* Mobile Search Toolbar */}
            <form
              onSubmit={handleSearchSubmit}
              className="md:hidden flex flex-col gap-4.5 w-full bg-white p-5 rounded-2xl border border-[#F2F2F2]"
            >
              {/* Row 1: Model dropdown & Sorting dropdown side-by-side */}
              <div className="flex items-center gap-3 w-full">
                {/* Sorting options (Left side in RTL) */}
                <div className="flex-1 flex flex-col gap-1.5 text-right w-[50%]">
                  <label className="text-gray-900 text-xs font-semibold px-1">
                    ترتيب حسب
                  </label>
                  <div className="relative bg-gray-50 border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3 cursor-pointer group">
                    <Image
                      src="/assets/arrow_down_gray.svg"
                      alt="down"
                      width={12}
                      height={6}
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    >
                      <option value="high-to-low">
                        السعر - من الاعلى الي الاقل
                      </option>
                      <option value="low-to-high">
                        السعر - من الاقل الي الاعلى
                      </option>
                      <option value="newest">الموديل - الأحدث أولاً</option>
                      <option value="oldest">الموديل - الأقدم أولاً</option>
                    </select>
                    <span className="text-gray-800 text-xs font-medium truncate w-[calc(100%-16px)]">
                      {sortBy === "high-to-low" && "السعر - من الاعلى"}
                      {sortBy === "low-to-high" && "السعر - من الاقل"}
                      {sortBy === "newest" && "الموديل - الأحدث"}
                      {sortBy === "oldest" && "الموديل - الأقدم"}
                    </span>
                  </div>
                </div>

                {/* Model options (Right side in RTL) */}
                <div className="flex-1 flex flex-col gap-1.5 text-right w-[50%]">
                  <label className="text-gray-900 text-xs font-semibold px-1">
                    الموديل
                  </label>
                  <div className="relative bg-gray-50 border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3 cursor-pointer group">
                    <Image
                      src="/assets/arrow_down_gray.svg"
                      alt="down"
                      width={12}
                      height={6}
                    />
                    <select
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    >
                      <option value="">حدد الموديل</option>
                      {models.map((mod) => (
                        <option key={mod} value={mod}>
                          {mod}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-800 text-xs font-medium truncate w-[calc(100%-16px)]">
                      {selectedModel === "" ? "حدد الموديل" : selectedModel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Search input & search button */}
              <div className="flex flex-col gap-1.5 text-right w-full">
                <label className="text-gray-900 text-xs font-semibold px-1">
                  البحث
                </label>
                <div className="flex gap-2.5 w-full">
                  <div className="relative flex-grow bg-gray-50 border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3">
                    <input
                      type="text"
                      placeholder="بتدور على ايه !"
                      value={tempSearchTerm}
                      onChange={(e) => setTempSearchTerm(e.target.value)}
                      className="w-full h-full text-right outline-none text-xs font-light text-gray-800 pl-8 bg-transparent"
                    />
                    <Image
                      src="/assets/search_normal.svg"
                      alt="search"
                      width={16}
                      height={16}
                      className="absolute left-3 opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs px-6 rounded-xl transition-colors shrink-0 cursor-pointer h-[44px]"
                  >
                    بحث
                  </button>
                </div>
              </div>
            </form>

            {/* Desktop Search toolbar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-4 w-full bg-white p-5 rounded-2xl shadow-xs border border-gray-100"
            >
              {/* Search input (Right side in RTL) */}
              <div className="flex flex-col gap-1.5 text-right w-full md:flex-grow">
                <label className="text-gray-900 text-xs font-semibold px-1">
                  البحث
                </label>
                <div className="flex gap-2 w-full">
                  <div className="relative flex-grow bg-gray-50 border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3">
                    <input
                      type="text"
                      placeholder="بتدور على ايه !"
                      value={tempSearchTerm}
                      onChange={(e) => setTempSearchTerm(e.target.value)}
                      className="w-full h-full text-right outline-none text-xs font-light text-gray-800 pl-8 bg-transparent"
                    />
                    <Image
                      src="/assets/search_normal.svg"
                      alt="search"
                      width={16}
                      height={16}
                      className="absolute left-3 opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs px-6 rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    بحث
                  </button>
                </div>
              </div>

              {/* Sorting options (Left side in RTL) */}
              <div className="flex flex-col gap-1.5 text-right w-full md:w-[220px]">
                <label className="text-gray-900 text-xs font-semibold px-1">
                  ترتيب حسب
                </label>
                <div className="relative bg-gray-50 border border-gray-200 rounded-xl h-[44px] flex items-center justify-between px-3 cursor-pointer group">
                  <Image
                    src="/assets/arrow_down_gray.svg"
                    alt="down"
                    width={12}
                    height={6}
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  >
                    <option value="high-to-low">
                      السعر - من الاعلى الي الاقل
                    </option>
                    <option value="low-to-high">
                      السعر - من الاقل الي الاعلى
                    </option>
                    <option value="newest">الموديل - الأحدث أولاً</option>
                    <option value="oldest">الموديل - الأقدم أولاً</option>
                  </select>
                  <span className="text-gray-800 text-xs font-medium truncate">
                    {sortBy === "high-to-low" && "السعر - من الاعلى الي الاقل"}
                    {sortBy === "low-to-high" && "السعر - من الاقل الي الاعلى"}
                    {sortBy === "newest" && "الموديل - الأحدث أولاً"}
                    {sortBy === "oldest" && "الموديل - الأقدم أولاً"}
                  </span>
                </div>
              </div>
            </form>

            {/* Cars Grid */}
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                {/* Mobile Ad Banner */}
                <div className="sm:hidden block">
                  <AdBannerCard />
                </div>
                {paginatedCars.map((car, idx) => (
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
                    image={car.image}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 text-center">
                <Image
                  src="/assets/search_normal.svg"
                  alt="no results"
                  width={48}
                  height={48}
                  className="opacity-20"
                />
                <h3 className="text-lg font-bold text-gray-800">
                  لا توجد نتائج مطابقة
                </h3>
                <p className="text-sm text-gray-400 max-w-[320px]">
                  جرب تغيير فلاتر البحث أو إعادة تعيين الكل لرؤية جميع السيارات
                  المتاحة
                </p>
                <button
                  onClick={handleResetAll}
                  className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold py-2.5 px-6 rounded-xl mt-2 transition-colors cursor-pointer"
                >
                  إعادة تعيين الكل
                </button>
              </div>
            )}

            {/* Interactive Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 select-none">
                {/* Arrow Left (Next page in RTL / Left direction) */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={activePage === totalPages}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Image
                    src="/assets/arrow_left_gray.svg"
                    alt="next"
                    width={18}
                    height={18}
                  />
                </button>

                {/* Page numbers (LTR ordered for correct rendering layout) */}
                <div className="flex items-center gap-1.5" dir="ltr">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const isActive = page === activePage;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl font-medium text-sm transition-colors cursor-pointer flex items-center justify-center
                          ${
                            isActive
                              ? "bg-primary-500 border border-primary-500 text-white shadow-sm"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-500"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}
                </div>

                {/* Arrow Right (Prev page in RTL / Right direction) */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={activePage === 1}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Image
                    src="/assets/arrow_left_gray.svg"
                    alt="prev"
                    width={18}
                    height={18}
                    className="rotate-180"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile-Only Similar Cars Section */}
      <div className="w-full bg-white py-8 border-t border-[#F2F2F2] flex flex-col gap-6 lg:hidden">
        <div
          className="flex items-center justify-between px-6 select-none"
          dir="rtl"
        >
          <h3 className="text-gray-900 font-bold text-[18px]">سيارات مشابهة</h3>
          <Link
            href="/cars"
            className="text-primary-500 font-bold text-xs hover:underline"
          >
            عرض المزيد
          </Link>
        </div>
        <div
          className="w-full overflow-x-auto pb-4 px-6 flex gap-4 scrollbar-none"
          dir="rtl"
        >
          {similarCars.map((car, idx) => (
            <div key={idx} className="w-[280px] shrink-0">
              <CarCard
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
                image={car.image}
              />
            </div>
          ))}
        </div>
      </div>

      <DownloadApp />
    </div>
  );
}
