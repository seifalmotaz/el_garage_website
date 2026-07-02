"use client";

import React, { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DownloadApp from "../../components/DownloadApp";
import CarCard from "../../components/CarCard";

// Mock car database
const carsData: Record<string, any> = {
  "bmw-x5": {
    brand: "بي إم دبليو",
    model: "X5",
    price: "620,000",
    originalPrice: "660,000",
    discountText: "خصم 40 ألف ج.م",
    installment: "12,444",
    year: "2023",
    mileage: "45,000 كم",
    trim: "Highline",
    location: "الاسكندرية",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    color: "أسود",
    hp: "335",
    engineSize: "3000 سي سي",
    tankCapacity: "80 لتر",
    images: [
      "/assets/why_cars.png",
      "/assets/car_placeholder.png",
      "/assets/why_cars.png",
      "/assets/car_placeholder.png",
      "/assets/why_cars.png",
      "/assets/car_placeholder.png",
      "/assets/why_cars.png"
    ],
    features: ["فتحة سقف بانوراما", "شاشة تعمل باللمس", "حساسات ركن", "كاميرا 360", "مثبت سرعة ذكي", "فرش جلد فاخر"],
    description: "بي إم دبليو X5 موديل 2023 فئة Highline بحالة المصنع بالكامل. صيانة دورية بالتوكيل، بدون رش أو دهانات تجميلية. تأتي بمحرك 3.0 لتر تيربو بقوة 335 حصان وتكييف هواء رباعي المناطق."
  },
  "range-rover": {
    brand: "لاند روفر",
    model: "رينج روفر فوج اس اي",
    price: "6,200,000",
    originalPrice: "6,240,000",
    discountText: "خصم 40 ألف ج.م",
    installment: "124,444",
    year: "2020",
    mileage: "45,000 كم",
    trim: "Highline",
    location: "الاسكندرية",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    color: "رمادي",
    hp: "400",
    engineSize: "3000 سي سي",
    tankCapacity: "90 لتر",
    images: [
      "/assets/car_placeholder.png",
      "/assets/why_cars.png",
      "/assets/car_placeholder.png"
    ],
    features: ["نظام دفع رباعي", "تعليق هوائي", "فتحة سقف بانوراما", "مقاعد مساج كهربائية", "أبواب شفط", "نظام صوتي ميريديان"],
    description: "لاند روفر رينج روفر فوج اس اي بحالة ممتازة وصيانات توكيل منتظمة. السيارة فابريكا بالكامل وخالية من أي خدوش."
  },
  "mercedes-c200": {
    brand: "مرسيدس بنز",
    model: "C200 AMG Line",
    price: "3,850,000",
    installment: "78,500",
    year: "2022",
    mileage: "28,000 كم",
    trim: "AMG",
    location: "القاهرة",
    condition: "مستعملة",
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    color: "أبيض",
    hp: "204",
    engineSize: "1500 سي سي",
    tankCapacity: "66 لتر",
    images: [
      "/assets/car_placeholder.png",
      "/assets/why_cars.png"
    ],
    features: ["كت AMG رياضي", "إضاءة داخلية Ambient Light", "شاشة MBUX العملاقة", "شاحن لاسلكي", "سقف بانوراما"],
    description: "مرسيدس بنز C200 AMG Line بحالة الزيرو تماماً، صيانة توكيل بالكامل، فابريكا بالكامل بدون أي ملاحظات."
  }
};

const initialCars = [
  { id: "range-rover", brand: "لاند روفر", model: "رينج روفر فوج اس اي", price: "6,200,000", installment: "124,444", year: "2020", mileage: "45,000 كم", trim: "Highline", location: "الاسكندرية", isFeatured: true, isCertified: true },
  { id: "mercedes-c200", brand: "مرسيدس بنز", model: "C200 AMG Line", price: "3,850,000", installment: "78,500", year: "2022", mileage: "28,000 كم", trim: "AMG", location: "القاهرة", isFeatured: true, isCertified: true },
  { id: "toyota-corolla", brand: "تويوتا", model: "كورولا هايلاند", price: "1,250,000", installment: "24,000", year: "2021", mileage: "62,000 كم", trim: "Luxury", location: "الجيزة", isFeatured: false, isCertified: true },
  { id: "bmw-320i", brand: "بي إم دبليو", model: "320i M Sport", price: "3,100,000", installment: "62,000", year: "2020", mileage: "54,000 كم", trim: "M Sport", location: "القاهرة", isFeatured: true, isCertified: true }
];

const getCarData = (id: string) => {
  if (carsData[id]) return carsData[id];
  
  // Dynamic lookup fallback
  const carFromList = initialCars.find(c => c.id === id);
  if (carFromList) {
    return {
      brand: carFromList.brand,
      model: carFromList.model,
      price: carFromList.price,
      installment: carFromList.installment || "15,000",
      year: carFromList.year,
      mileage: carFromList.mileage,
      trim: carFromList.trim,
      location: carFromList.location,
      condition: "مستعملة",
      transmission: "أوتوماتيك",
      fuelType: "بنزين",
      color: "أسود",
      hp: "180",
      engineSize: "1600 سي سي",
      tankCapacity: "60 لتر",
      images: [
        "/assets/car_placeholder.png",
        "/assets/why_cars.png"
      ],
      features: ["شاشة تعمل باللمس", "حساسات ركن", "مثبت سرعة", "كاميرا خلفية"],
      description: `${carFromList.brand} ${carFromList.model} موديل ${carFromList.year} بحالة ممتازة وخاضعة لفحص الجراج الاحترافي.`
    };
  }
  
  // Default to BMW X5
  return carsData["bmw-x5"];
};

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const car = useMemo(() => getCarData(id), [id]);

  // States
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "features" | "description">("specs");
  const [isLiked, setIsLiked] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");

  // Sidebar Accordion states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    body: true,
    engine: false,
    electronic: false,
    brakes: false,
    road: false,
    defects: false
  });

  const toggleAccordion = (name: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Filter similar/recommended cars
  const recommendedCars = useMemo(() => {
    return initialCars.filter(c => c.id !== id).slice(0, 3);
  }, [id]);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      {/* Absolute Navbar Overlay */}
      <Header activeHref="/cars" variant="dark" />

      {/* Page Title Hero Banner */}
      <div className="relative w-full h-[240px] md:h-[320px] overflow-hidden flex flex-col justify-end md:justify-center items-center text-center pb-8 md:pb-0">
        {/* Background Image */}
        <Image
          src="/assets/login_hero.jpg"
          alt="Car Details Page Banner"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/65 z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col gap-3 px-6" dir="rtl">
          <h1 className="text-3xl md:text-[38px] font-extrabold text-white leading-tight font-sans tracking-wide">
            تفاصيل السيارة
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium font-sans">
            <Link href="/" className="hover:text-white transition-colors">الصفحة الرئيسية</Link>
            <span className="text-gray-500">/</span>
            <Link href="/cars" className="hover:text-white transition-colors">تصفح السيارات</Link>
            <span className="text-gray-500">/</span>
            <span className="text-primary-400 font-bold">{car.brand} {car.model}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 py-12 flex flex-col items-center">
        <div 
          className="w-full max-w-[1336px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-8 items-start"
          dir="rtl"
        >
          {/* Right Column in RTL: Main Car Panel */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Gallery Wrapper */}
            <div className="flex flex-col gap-4 w-full">
              {/* Main Image Preview */}
              <div className="relative aspect-[730/452] w-full rounded-[24px] overflow-hidden bg-white border border-gray-200/60 group shadow-xs">
                <Image
                  src={car.images[activeImageIdx] || "/assets/car_placeholder.png"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover transition-all duration-300"
                  priority
                />

                {/* Floating Action Buttons: Visually on the RIGHT */}
                <div 
                  className="absolute top-4 z-10 flex flex-col gap-3"
                  style={{ right: "16px", left: "auto" }}
                >
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="w-11 h-11 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-colors shadow-sm cursor-pointer"
                  >
                    <Image
                      src="/assets/favourite_heart.svg"
                      alt="favorite"
                      width={22}
                      height={22}
                      className={`w-5.5 h-5.5 transition-all ${isLiked ? "brightness-125 saturate-150 scale-110" : "opacity-80"}`}
                    />
                  </button>
                  <button className="w-11 h-11 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-colors shadow-sm cursor-pointer">
                    <Image
                      src="/assets/arrow_left_white.svg"
                      alt="share"
                      width={20}
                      height={20}
                      className="w-5 h-5 opacity-80"
                    />
                  </button>
                </div>

                {/* Floating Condition Badge: Visually on the LEFT */}
                <div 
                  className="absolute top-4 bg-yellow-100/90 backdrop-blur-xs text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full shadow-xs border border-yellow-200/40"
                  style={{ left: "16px", right: "auto" }}
                >
                  {car.condition}
                </div>

                {/* Bottom Gallery Utilities Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10" dir="rtl">
                  {/* Images Count Indicator: Visually on the RIGHT (DOM 1st child) */}
                  <div className="pointer-events-auto bg-black/45 backdrop-blur-md text-white font-medium text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-white/10">
                    <span className="font-mono">{car.images.length}</span>
                    <Image
                      src="/assets/search_normal.svg"
                      alt="images"
                      width={18}
                      height={18}
                      className="w-4.5 h-4.5 invert"
                    />
                  </div>

                  {/* Play Video CTA Button: Visually on the LEFT (DOM 2nd child) */}
                  <button className="pointer-events-auto bg-primary-50 hover:bg-primary-100 text-primary-500 font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-md cursor-pointer">
                    <span>تشغيل</span>
                    <Image
                      src="/assets/play_video.svg"
                      alt="play"
                      width={16}
                      height={16}
                      className="w-4.5 h-4.5"
                    />
                  </button>
                </div>
              </div>

              {/* Thumbnails strip */}
              <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3 overflow-x-auto w-full select-none scrollbar-none">
                {car.images.map((imgUrl: string, idx: number) => {
                  const isActive = idx === activeImageIdx;
                  const isLastVisible = idx === 6 && car.images.length > 7;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-[89px] h-[73px] rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isActive ? "border-primary-500 scale-95 shadow-sm" : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`thumbnail ${idx}`}
                        fill
                        className="object-cover"
                      />
                      {isLastVisible && (
                        <div className="absolute inset-0 bg-primary-500/80 backdrop-blur-xs flex items-center justify-center text-white font-bold text-lg">
                          +{car.images.length - 6}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Pricing Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 md:p-8 flex flex-col gap-6 w-full shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-gray-100">
                {/* Brand & Title */}
                <div className="flex flex-col gap-3 text-start">
                  <div className="flex items-center gap-3">
                    <span className="bg-yellow-50 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-md border border-yellow-200/50">
                      {car.condition}
                    </span>
                    <h1 className="font-bold text-2xl md:text-3xl text-gray-900 leading-normal md:leading-tight">
                      {car.brand} {car.model} {car.year}
                    </h1>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{car.trim}</p>
                </div>

                {/* Pricing Area */}
                <div className="flex flex-col gap-2 items-start md:items-end text-start shrink-0">
                  <div className="flex items-baseline gap-1.5 justify-start md:justify-end w-full">
                    <span className="text-sm font-semibold text-primary-400">ج.م</span>
                    <span className="text-3xl font-extrabold font-mono text-primary-500">{car.price}</span>
                    {car.discountText && (
                      <span className="text-xs text-gray-400 line-through font-semibold ms-2 self-center">
                        {car.originalPrice || car.price}
                      </span>
                    )}
                  </div>
                  {car.discountText && (
                    <span className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {car.discountText}
                    </span>
                  )}
                  <div className="bg-green-50/70 border border-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mt-1">
                    قسط شهري يبدأ من {car.installment} ج.م
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 text-start w-full">
                <div className="flex items-center gap-2 md:gap-3 justify-start bg-gray-50/50 p-2.5 md:p-3 rounded-xl border border-gray-100/50">
                  <Image src="/assets/car_specs_icon.svg" alt="trim" width={20} height={20} className="w-4.5 h-4.5 md:w-5 md:h-5 opacity-70 shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-gray-400">الفئة</span>
                    <span className="text-xs font-semibold text-gray-700 truncate">{car.trim}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 justify-start bg-gray-50/50 p-2.5 md:p-3 rounded-xl border border-gray-100/50">
                  <Image src="/assets/spedometer_specs.svg" alt="mileage" width={20} height={20} className="w-4.5 h-4.5 md:w-5 md:h-5 opacity-70 shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-gray-400">المسافة المقطوعة</span>
                    <span className="text-xs font-semibold text-gray-700 truncate font-mono">{car.mileage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 justify-start bg-gray-50/50 p-2.5 md:p-3 rounded-xl border border-gray-100/50">
                  <Image src="/assets/calendar_specs.svg" alt="year" width={20} height={20} className="w-4.5 h-4.5 md:w-5 md:h-5 opacity-70 shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-gray-400">سنة الموديل</span>
                    <span className="text-xs font-semibold text-gray-700 truncate font-mono">{car.year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 justify-start bg-gray-50/50 p-2.5 md:p-3 rounded-xl border border-gray-100/50">
                  <Image src="/assets/services_device_3.svg" alt="fuel" width={20} height={20} className="w-4.5 h-4.5 md:w-5 md:h-5 opacity-70 shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-gray-400">نوع الوقود</span>
                    <span className="text-xs font-semibold text-gray-700 truncate">{car.fuelType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 justify-start bg-gray-50/50 p-2.5 md:p-3 rounded-xl border border-gray-100/50">
                  <Image src="/assets/location_specs.svg" alt="location" width={20} height={20} className="w-4.5 h-4.5 md:w-5 md:h-5 opacity-70 shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-gray-400">المحافظة</span>
                    <span className="text-xs font-semibold text-gray-700 truncate">{car.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 justify-start bg-gray-50/50 p-2.5 md:p-3 rounded-xl border border-gray-100/50">
                  <Image src="/assets/services_car_1.svg" alt="transmission" width={20} height={20} className="w-4.5 h-4.5 md:w-5 md:h-5 opacity-70 shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-gray-400">ناقل الحركة</span>
                    <span className="text-xs font-semibold text-gray-700 truncate">{car.transmission}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Component Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden w-full shadow-2xs">
              {/* Tab Navigation header */}
              <div className="border-b border-gray-100 flex items-center justify-start bg-gray-50/50 px-4 md:px-6 overflow-x-auto scrollbar-none whitespace-nowrap">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-4 md:px-6 py-3.5 md:py-4.5 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === "specs" 
                      ? "border-primary-500 text-primary-500" 
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  مواصفات السيارة
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`px-4 md:px-6 py-3.5 md:py-4.5 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === "features" 
                      ? "border-primary-500 text-primary-500" 
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  المميزات
                </button>
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 md:px-6 py-3.5 md:py-4.5 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === "description" 
                      ? "border-primary-500 text-primary-500" 
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  الوصف
                </button>
              </div>

              {/* Tab Content body */}
              <div className="p-6 md:p-8 text-start">
                {activeTab === "specs" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">الوقود</span>
                      <span className="text-sm font-semibold text-gray-800">{car.fuelType}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">اللون</span>
                      <span className="text-sm font-semibold text-gray-800">{car.color || "أسود"}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">الحالة</span>
                      <span className="text-sm font-semibold text-gray-800">{car.condition}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">الموديل</span>
                      <span className="text-sm font-semibold text-gray-800 font-mono">{car.year}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">ناقل الحركة</span>
                      <span className="text-sm font-semibold text-gray-800">{car.transmission}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">الكيلومترات</span>
                      <span className="text-sm font-semibold text-gray-800 font-mono">{car.mileage}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">سعة الخزان</span>
                      <span className="text-sm font-semibold text-gray-800 font-mono">{car.tankCapacity || "70 لتر"}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">قوة HP</span>
                      <span className="text-sm font-semibold text-gray-800 font-mono">{car.hp || "180"}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1">
                      <span className="text-[11px] text-gray-400">سعة المحرك</span>
                      <span className="text-sm font-semibold text-gray-800 font-mono">{car.engineSize || "1600 سي سي"}</span>
                    </div>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="flex flex-wrap gap-2.5">
                    {car.features.map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-primary-50/60 border border-primary-100/50 text-primary-600 text-xs font-semibold px-4.5 py-2.5 rounded-xl flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {activeTab === "description" && (
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                )}
              </div>
            </div>

            {/* Certification Footer Banner */}
            <div className="bg-gradient-to-r from-primary-500 to-[#00165b] text-white rounded-2xl py-4 px-6 flex items-center justify-between shadow-md">
              <Link 
                href="/inspection-report"
                className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Image
                    src="/assets/arrow_left_white.svg"
                    alt="view"
                    width={14}
                    height={14}
                    className="w-3.5 h-3.5 rotate-45"
                  />
                </div>
                <span className="text-xs md:text-sm font-semibold">معلومات عن الفحص</span>
              </Link>

              <div className="flex items-center gap-2.5">
                <span className="text-xs md:text-sm font-bold">معتمدة من جراج</span>
                <div className="relative w-5 h-5">
                  <Image
                    src="/assets/certified_shield.svg"
                    alt="certified"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Left Column in RTL: Sidebar */}
          <div className="w-full lg:w-[322px] shrink-0 flex flex-col gap-6">
            
            {/* Sidebar Actions Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-5 flex flex-col gap-4 w-full shadow-2xs">
              {/* Send Offer Button */}
              <button
                onClick={() => setShowOfferModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm w-full py-3.5 rounded-2xl flex items-center justify-center shadow-md cursor-pointer transition-colors"
              >
                ارسال عرض سعر
              </button>

              {/* Call & Whatsapp action rows */}
              <div className="flex items-center gap-3 w-full">
                <a
                  href="tel:19900"
                  className="bg-primary-50 hover:bg-primary-100 border border-primary-100 text-primary-600 font-bold text-sm h-[48px] rounded-2xl flex items-center justify-center gap-2 flex-1 transition-colors"
                >
                  <span>مكالمة</span>
                  <Image
                    src="/assets/call_icon_figma.svg"
                    alt="call"
                    width={18}
                    height={18}
                    className="w-4.5 h-4.5"
                  />
                </a>

                <a
                  href="https://wa.me/201200000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold text-sm h-[48px] rounded-2xl flex items-center justify-center gap-2 flex-1 transition-colors"
                >
                  <span>واتساب</span>
                  <Image
                    src="/assets/whatsapp_logo.svg"
                    alt="whatsapp"
                    width={18}
                    height={18}
                    className="w-4.5 h-4.5"
                  />
                </a>
              </div>
            </div>

            {/* Sidebar Inspection Summary Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden w-full shadow-2xs">
              {/* Accordion header */}
              <div className="bg-primary-50/80 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/certified_shield.svg"
                    alt="verify"
                    width={18}
                    height={18}
                    className="w-4.5 h-4.5"
                  />
                  <span className="font-bold text-base text-gray-900">تقرير الفحص</span>
                </div>
                <span className="text-xs text-gray-500 font-medium font-mono">(14 Jan, 2025)</span>
              </div>

              {/* Legends */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-400 select-none">
                <div className="flex items-center gap-1.5">
                  <span>عيب او خلل</span>
                  <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold text-center">!</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>فحص ناجح</span>
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold text-center">✓</span>
                </div>
              </div>

              {/* Inspected Accordions List */}
              <div className="p-4 flex flex-col gap-3">
                
                {/* 1. Body structure accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("body")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/assets/car_specs_icon.svg" alt="body" width={18} height={18} className="w-4.5 h-4.5 opacity-60" />
                      <span>هيكل السيارة</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">02 ✓</span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">01 !</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{openAccordions.body ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {openAccordions.body && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">جميع ألواح السيارة متناسقة ومطلية</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">المرايا الجانبية والخلفية خالية من الخدوش</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-mono">!</span>
                        <p className="text-start flex-1">خدش بسيط في الباب الخلفي</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Engine and Transmission accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("engine")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/assets/services_car_1.svg" alt="engine" width={18} height={18} className="w-4.5 h-4.5 opacity-60" />
                      <span>المحرك وناقل الحركة</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">04 ✓</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{openAccordions.engine ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {openAccordions.engine && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">أداء وسحب المحرك ممتاز وفي الحدود الطبيعية</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">ناقل الحركة يعمل بسلاسة ونعومة</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">لا توجد آثار تسريب زيوت أو سوائل تبريد</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">شمعات الاحتراق والوصلات الكهربائية سليمة</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Electronic check accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("electronic")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/assets/services_phone_2.svg" alt="electronic" width={18} height={18} className="w-4.5 h-4.5 opacity-60" />
                      <span>الفحص الإلكتروني</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">02 ✓</span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">01 !</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{openAccordions.electronic ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {openAccordions.electronic && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">فحص كمبيوتر الأعطال (OBD) - خالي من المشاكل</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">سلامة البطارية ونظام شحن الدينامو</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-mono">!</span>
                        <p className="text-start flex-1">تحديث برمجي مطلوب لوحدة الشاشة الترفيهية</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Brakes & Tires accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("brakes")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/assets/spedometer_specs.svg" alt="brakes" width={18} height={18} className="w-4.5 h-4.5 opacity-60" />
                      <span>الإطارات والفرامل</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">02 ✓</span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">01 !</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{openAccordions.brakes ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {openAccordions.brakes && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">سمك تيل الفرامل الخلفي بنسبة 70%</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">نقشة وحالة الإطارات الأربعة بحالة جيدة</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-mono">!</span>
                        <p className="text-start flex-1">تيل الفرامل الأمامي يحتاج لتغيير بعد 5,000 كم</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Road test accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("road")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/assets/services_car_2.svg" alt="road test" width={18} height={18} className="w-4.5 h-4.5 opacity-60" />
                      <span>اختبار الطريق</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">02 ✓</span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">01 !</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{openAccordions.road ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {openAccordions.road && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">توجيه وثبات السيارة على السرعات ممتاز</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">استجابة الفرامل الفورية أثناء الطوارئ</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-mono">!</span>
                        <p className="text-start flex-1">صوت خفيف من المساعد الأمامي عند المنحنيات القوية</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Scratches and defects accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("defects")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image src="/assets/services_trash_3.svg" alt="defects" width={18} height={18} className="w-4.5 h-4.5 opacity-60" />
                      <span>الخدوش والعيوب</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">02 ✓</span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">01 !</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{openAccordions.defects ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {openAccordions.defects && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">الزجاج الأمامي والخلفي أصلي وخالي من الشروخ</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">✓</span>
                        <p className="text-start flex-1">الفرش الداخلي للسيارة بحالة الوكالة</p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-mono">!</span>
                        <p className="text-start flex-1">خدش سطحية خفيفة في الجانب الأيسر للصدام الخلفي</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* View full report link */}
              <div className="bg-gray-50/80 border-t border-gray-100 px-5 py-3.5 text-center">
                <Link
                  href="/inspection-report"
                  className="text-xs text-primary-500 font-bold hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>عرض تقرير الفحص بالكامل</span>
                  <span>←</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Similar Cars Section */}
        <div className="w-full max-w-[1336px] mx-auto px-6 md:px-12 mt-16 flex flex-col gap-6" dir="rtl">
          <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
            <h3 className="text-gray-900 font-bold text-xl md:text-2xl">
              سيارات مشابهة
            </h3>
            <Link href="/cars" className="text-primary-500 font-bold text-xs hover:underline flex items-center gap-1">
              <span>عرض المزيد</span>
              <span>←</span>
            </Link>
          </div>

          {/* Mobile swipeable horizontal container, hidden on medium and above */}
          <div className="flex md:hidden w-full overflow-x-auto pb-4 gap-4 scrollbar-none snap-x snap-mandatory" dir="rtl">
            {recommendedCars.map((similarCar) => (
              <div key={similarCar.id} className="w-[280px] shrink-0 snap-start">
                <CarCard
                  id={similarCar.id}
                  brand={similarCar.brand}
                  model={similarCar.model}
                  price={similarCar.price}
                  installment={similarCar.installment}
                  year={similarCar.year}
                  mileage={similarCar.mileage}
                  trim={similarCar.trim}
                  location={similarCar.location}
                  isFeatured={similarCar.isFeatured}
                  isCertified={similarCar.isCertified}
                />
              </div>
            ))}
          </div>

          {/* Desktop grid layout, hidden on mobile */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {recommendedCars.map((similarCar) => (
              <CarCard
                key={similarCar.id}
                id={similarCar.id}
                brand={similarCar.brand}
                model={similarCar.model}
                price={similarCar.price}
                installment={similarCar.installment}
                year={similarCar.year}
                mileage={similarCar.mileage}
                trim={similarCar.trim}
                location={similarCar.location}
                isFeatured={similarCar.isFeatured}
                isCertified={similarCar.isCertified}
              />
            ))}
          </div>
        </div>

        {/* Mobile Download App Banner CTA */}
        <div className="w-full mt-12">
          <DownloadApp />
        </div>
      </main>

      {/* Footer component */}
      <Footer />

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full flex flex-col gap-5 text-start border border-gray-100 shadow-xl"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#002853]">ارسال عرض سعر</h3>
              <button 
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-gray-600 font-mono text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              ادخل عرض السعر الذي ترغب بتقديمه لشراء هذه السيارة ({car.brand} {car.model}). سيقوم ممثل من الجراج بمراجعة طلبك والتواصل معك في أقرب وقت.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 text-xs font-semibold">عرض السعر المقترح</label>
              <div className="relative border border-gray-200 focus-within:border-primary-500 rounded-2xl flex items-center gap-2 px-4 h-12 bg-gray-50">
                <span className="text-gray-400 text-sm font-semibold">ج.م</span>
                <input
                  type="text"
                  placeholder="مثال: 600,000"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full h-full bg-transparent text-start outline-none text-sm font-semibold text-gray-800 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setShowOfferModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!offerPrice.trim()) {
                    alert("برجاء إدخال عرض السعر المقترح أولاً.");
                    return;
                  }
                  setShowOfferModal(false);
                  alert(`تم إرسال عرضك بقيمة ${offerPrice} ج.م بنجاح! سنتواصل معك في غضون 24 ساعة.`);
                  setOfferPrice("");
                }}
                className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold cursor-pointer shadow-md"
              >
                إرسال العرض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
