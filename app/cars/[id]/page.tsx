"use client";

import { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import CarCard from "../../../components/CarCard";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { TriArrow } from "@/components/svg/Svgs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/common/Carousel";

type CarType = {
  brand: string;
  model: string;
  price: string;
  originalPrice?: string;
  discountText?: string;
  installment: string;
  year: string;
  mileage: string;
  trim: string;
  location: string;
  condition: string;
  transmission: string;
  fuelType: string;
  color: string;
  hp: string;
  engineSize: string;
  tankCapacity: string;
  images: string[];
  features: string[];
  description: string;
};

// Mock car database
const carsData: Record<string, CarType> = {
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
      "/assets/why_cars.png",
    ],
    features: [
      "فتحة سقف بانوراما",
      "شاشة تعمل باللمس",
      "حساسات ركن",
      "كاميرا 360",
      "مثبت سرعة ذكي",
      "فرش جلد فاخر",
    ],
    description:
      "بي إم دبليو X5 موديل 2023 فئة Highline بحالة المصنع بالكامل. صيانة دورية بالتوكيل، بدون رش أو دهانات تجميلية. تأتي بمحرك 3.0 لتر تيربو بقوة 335 حصان وتكييف هواء رباعي المناطق.",
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
      "/assets/car_placeholder.png",
    ],
    features: [
      "نظام دفع رباعي",
      "تعليق هوائي",
      "فتحة سقف بانوراما",
      "مقاعد مساج كهربائية",
      "أبواب شفط",
      "نظام صوتي ميريديان",
    ],
    description:
      "لاند روفر رينج روفر فوج اس اي بحالة ممتازة وصيانات توكيل منتظمة. السيارة فابريكا بالكامل وخالية من أي خدوش.",
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
    images: ["/assets/car_placeholder.png", "/assets/why_cars.png"],
    features: [
      "كت AMG رياضي",
      "إضاءة داخلية Ambient Light",
      "شاشة MBUX العملاقة",
      "شاحن لاسلكي",
      "سقف بانوراما",
    ],
    description:
      "مرسيدس بنز C200 AMG Line بحالة الزيرو تماماً، صيانة توكيل بالكامل، فابريكا بالكامل بدون أي ملاحظات.",
  },
};

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
  },
];

const Banner = ({ car }: { car: CarType }) => {
  return (
    <div className="relative w-full lg:h-[427px] h-[375px] overflow-hidden flex flex-col justify-end text-center pb-8 md:pb-0">
      {/* Background Image */}
      <Image
        src="/images/car-details/banner.png"
        alt="Car Details Page Banner"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark Gradient Overlay */}

      {/* Content */}
      <div
        className="relative z-20 flex flex-col gap-3 px-6 lg:pb-[112px] pb-[44px]"
        dir="rtl"
      >
        <h1 className="lg:text-3xl  md:text-[38px] text-lg text-white leading-tight tracking-wide">
          تفاصيل السيارة
        </h1>
        <div className="flex items-center justify-center sm:gap-2 gap-1 text-xs md:text-sm text-gray-300 font-medium">
          <Link
            href="/"
            className="hover:text-white transition-colors flex gap-2 items-center max-sm:text-xs"
          >
            <Image
              src="/icons/home-2.svg"
              alt="Car Details Page Banner"
              width={24}
              height={24}
            />
            الصفحة الرئيسية
          </Link>
          <span className="text-gray-500">/</span>
          <Link
            href="/cars"
            className="hover:text-white transition-colors max-sm:text-xs"
          >
            تصفح السيارات
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-primary-400">
            {car.brand} {car.model}
          </span>
        </div>
      </div>
    </div>
  );
};

const MainImagePreview = ({
  car,
  activeImageIdx,
}: {
  car: CarType;
  activeImageIdx: number;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="relative lg:aspect-[730/452] aspect-[335/260] w-full rounded-[24px] overflow-hidden bg-white border border-gray-200/60 group shadow-xs">
      <Image
        src={car.images[activeImageIdx] || "/assets/car_placeholder.png"}
        alt={`${car.brand} ${car.model}`}
        fill
        className="object-cover transition-all duration-300"
        priority
      />
      {/* Floating Action Buttons: Visually on the RIGHT */}
      <div className="absolute md:top-6 top-4 z-10 left-auto md:right-6 right-4 flex flex-col gap-3">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="md:size-11 size-8 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-colors shadow-sm cursor-pointer"
        >
          <Image
            src="/assets/favourite_heart.svg"
            alt="favorite"
            width={18}
            height={18}
            className={`w-5.5 h-5.5 transition-all ${isLiked ? "brightness-125 saturate-150 scale-110" : "opacity-80"}`}
          />
        </button>
        <button className="md:size-11 size-8 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-colors shadow-sm cursor-pointer">
          <Image
            src="/icons/share.svg"
            alt="share"
            width={18}
            height={18}
            className="w-5 h-5 opacity-80"
          />
        </button>
      </div>
      {/* Floating Condition Badge: Visually on the LEFT */}
      <div
        className="absolute md:top-11 top-4 bg-yellow-100/90 backdrop-blur-xs text-yellow-600 text-sm p-2 pl-4 rounded-tr-lg rounded-br-lg shadow-xs border border-yellow-200/40"
        style={{ left: "0px", right: "auto" }}
      >
        {car.condition}
      </div>
      {/* Bottom Gallery Utilities Overlay */}
      <div
        className="absolute md:bottom-6 bottom-2 md:left-6 left-4 md:right-6 right-4 flex items-center justify-between pointer-events-none z-10"
        dir="rtl"
      >
        {/* Images Count Indicator: Visually on the RIGHT (DOM 1st child) */}
        <div className="pointer-events-auto bg-black/45 backdrop-blur-md text-white font-medium text-sm md:px-6 md:py-4 py-2 px-3 rounded-full flex items-center gap-3 shadow-sm border border-white/10">
          <span className="text-lg">{car.images.length}</span>
          <div className="relative md:size-6 size-4.5">
            <Image src="/icons/image.svg" alt="images" fill />
          </div>
        </div>

        {/* Play Video CTA Button: Visually on the LEFT (DOM 2nd child) */}
        <button className="pointer-events-auto bg-primary-50 hover:bg-primary-100 text-primary-500 font-semibold text-sm md:px-8 md:py-3.5 py-2 px-3 rounded-full flex items-center gap-2 transition-colors shadow-md cursor-pointer">
          <div className="relative md:size-8 size-4.5">
            <Image src="/icons/blue-play.svg" alt="images" fill />
          </div>
          <span className="text-primary-500 md:text-lg leading-7 md:font-medium">
            تشغيل
          </span>
        </button>
      </div>
    </div>
  );
};

const ThumbnailsStrip = ({
  car,
  activeImageIdx,
  setActiveImageIdx,
}: {
  car: CarType;
  activeImageIdx: number;
  setActiveImageIdx: (idx: number) => void;
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-nowrap items-center gap-2 overflow-x-auto w-full select-none ">
      {car.images.map((imgUrl: string, idx: number) => {
        const isActive = idx === activeImageIdx;
        const isLastVisible = idx === 6 && car.images.length > 7;
        return (
          <button
            key={idx}
            onClick={() => setActiveImageIdx(idx)}
            className={`relative sm:w-[89px] sm:h-[73px] size-[60px] rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              isActive
                ? "border-primary-500 scale-95 shadow-sm"
                : "border-gray-100 hover:border-gray-300"
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
  );
};

const BrandAndTitle = ({ car }: { car: CarType }) => {
  return (
    <div className="flex flex-col  gap-3 lg:text-start text-end max-lg:order-2">
      <div className="flex items-center  gap-4 w-[500px]">
        <h1 className="font-bold sm:text-2xl md:text-3xl text-[16px] text-gray-900 leading-normal md:leading-tight">
          {car.brand} {car.model} {car.year}
        </h1>
        <span className="bg-yellow-50  max-sm:hidden text-yellow-600 text-xs px-3 py-1 rounded-md border border-yellow-200/50 max-sm:order-1">
          {car.condition}
        </span>
      </div>
      {/* Specs Grid */}
      <div className="flex flex-wrap gap-3 w-full">
        <div className="flex items-center gap-1 justify-start text-sm text-gray-500">
          <Image
            src="/icons/gas-station.svg"
            alt="fuel Type"
            width={20}
            height={20}
          />
          {car.fuelType}
        </div>
        <div className="flex items-center gap-1 justify-start text-sm text-gray-500">
          <Image
            src="/icons/calendar.svg"
            alt="calendar"
            width={20}
            height={20}
          />
          {car.year}
        </div>
        <div className="flex items-center gap-1 justify-start text-sm text-gray-500">
          <Image
            src="/icons/spedometer-middle.svg"
            alt="spedometer-middle"
            width={20}
            height={20}
          />
          {car.mileage}
        </div>

        <div className="flex items-center gap-1 justify-start text-sm text-gray-500">
          <Image src="/icons/car.svg" alt="trim" width={20} height={20} />
          {car.trim}
        </div>

        <div className="flex items-center gap-1 justify-start text-sm text-gray-500">
          <Image
            src="/icons/transmission-square.svg"
            alt="car"
            width={20}
            height={20}
          />
          {car.transmission}
        </div>

        <div className="flex items-center gap-1 justify-start text-sm text-gray-500">
          <Image src="/icons/location.svg" alt="car" width={20} height={20} />
          {car.location}
        </div>
      </div>
    </div>
  );
};

const PricingArea = ({ car }: { car: CarType }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col gap-2 items-start md:items-end text-start shrink-0">
        <div className="flex items-baseline gap-1.5 justify-end md:justify-end  max-sm:flex-row-reverse w-full">
          {car.discountText && (
            <span className="sm:text-sm text-xs text-gray-400 line-throughtext-xs px-2.5 py-0.5 line-through rounded-full">
              {car.discountText}
            </span>
          )}
          <div>
            <span className="lg:text-3xl text-[18px] font-extrabold font-monos text-primary-500">
              {car.price}
            </span>
            <span className="text-sm font-semibold text-primary-400">ج.م</span>
          </div>
        </div>

        <div className="bg-green-50/70 border border-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm mt-1">
          قسط شهري يبدأ من {car.installment} ج.م
        </div>
      </div>

      <span className="bg-yellow-50 sm:hidden text-yellow-600 text-xs sm:px-3 px-2 py-1 rounded-md border border-yellow-200/50 max-sm:order-1">
        {car.condition}
      </span>
    </div>
  );
};

const TabsComponentCard = ({ car }: { car: CarType }) => {
  const [activeTab, setActiveTab] = useState<
    "specs" | "features" | "description"
  >("specs");
  return (
    <>
      <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden w-full shadow-2xs max-sm:hidden">
        {/* Tab Navigation header */}
        <div className="border-b border-gray-100 flex items-center justify-start bg-gray-50/50 px-4 md:px-6 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 md:px-6 py-3.5 md:py-4.5 font-medium text-base border-b-2 transition-all cursor-pointer ${
              activeTab === "specs"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            مواصفات السيارة
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`px-4 md:px-6 py-3.5 md:py-4.5 font-medium text-base border-b-2 transition-all cursor-pointer ${
              activeTab === "features"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            المميزات
          </button>
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 md:px-6 py-3.5 md:py-4.5 font-medium text-base border-b-2 transition-all cursor-pointer ${
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
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">الوقود</span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.fuelType}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">اللون</span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.color || "أسود"}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">الحالة</span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.condition}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">الموديل</span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.year}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">
                  ناقل الحركة
                </span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.transmission}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">
                  الكيلومترات
                </span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.mileage}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">سعة الخزان</span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.tankCapacity || "70 لتر"}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">قوة HP</span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.hp || "180"}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-1.5">
                <span className="text-sm leading-4 text-black">سعة المحرك</span>
                <span className="text-sm text-gray-500 leading-4">
                  {car.engineSize || "1600 سي سي"}
                </span>
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

      <div className="sm:hidden">
        <div className="self-stretch inline-flex justify-end items-center mb-2">
          <div className="text-right justify-start text-primary-500 font-normal">
            مواصفات السيارة
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">الوقود</span>
            <span className="text-xs text-gray-500 leading-4">
              {car.fuelType}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">الوقود</span>
            <span className="text-xs text-gray-500 leading-4">
              {car.color || "أسود"}
            </span>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">اللون</span>
            <span className="text-xs text-gray-500 leading-4">
              {car.condition}
            </span>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">الموديل</span>
            <span className="text-xs text-gray-500 leading-4">{car.year}</span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">
              ناقل الحركة
            </span>
            <span className="text-xs text-gray-500 leading-4">
              {car.transmission}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">
              الكيلومترات
            </span>
            <span className="text-xs text-gray-500 leading-4">
              {car.mileage}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">سعة الخزان</span>
            <span className="text-xs text-gray-500 leading-4">
              {car.tankCapacity || "70 لتر"}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">قوة HP</span>
            <span className="text-xs text-gray-500 leading-4">
              {car.hp || "180"}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-sm px-2 py-1.5 flex flex-col gap-1">
            <span className="text-[10px] leading-4 text-black">سعة المحرك</span>
            <span className="text-xs text-gray-500 leading-4">
              {car.engineSize || "1600 سي سي"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const TabsComponentCardInMobile = ({ car }: { car: CarType }) => {
  return (
    <div className="space-y-4 sm:hidden">
      <div className="p-3 rounded-2xl space-y-4 border border-[#F2F2F2] bg-white">
        <div className="flex justify-between">
          <h3 className="text-primary-500 text-sm leading-[150%]">
            مميزات السيارة
          </h3>
          <Link href={"#"} className="text-gray-500 text-sm leading-[150%]">
            عرض جميع المميزات
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-3">
          {car.features.map((feature: string, idx: number) => (
            <div
              key={idx}
              className="bg-gray-50 text-gray-600 py-2 px-3 rounded-md flex flex-col justify-center items-center gap-1"
            >
              <span className="text-sm text-center">{feature}</span>

              <Image src={"/car-feat.svg"} alt="feat" width={30} height={30} />
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 rounded-2xl border border-[#F2F2F2] bg-white">
        <h3 className="text-primary-500 text-sm leading-[150%] mb-4">
          مميزات السيارة
        </h3>
        <div>
          <p className="text-gray-800 text-sm leading-[190%]">
            {car.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const CertificationFooterBanner = () => {
  return (
    <div className="bg-gradient-to-r from-[#002ec1] to-[#00165b] text-white px-4 py-2 flex items-center justify-between shadow-inner rounded-b-2xl h-11">
      {/* Certified Label on Right in RTL */}
      <div className="flex items-center gap-1.5">
        <div className="relative w-4 h-4">
          <Image
            src="/assets/certified_shield.svg"
            alt="certified"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xs font-medium">معتمدة من جراج</span>
      </div>

      {/* Arrow on Left in RTL */}
      <div className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
        <Image
          src="/assets/arrow_left_white.svg"
          alt="view details"
          width={16}
          height={16}
          className="w-4 h-4 rotate-45"
        />
      </div>
    </div>
  );
};

const getCarData = (id: string) => {
  if (carsData[id]) return carsData[id];

  // Dynamic lookup fallback
  const carFromList = initialCars.find((c) => c.id === id);

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
      images: ["/assets/car_placeholder.png", "/assets/why_cars.png"],
      features: ["شاشة تعمل باللمس", "حساسات ركن", "مثبت سرعة", "كاميرا خلفية"],
      description: `${carFromList.brand} ${carFromList.model} موديل ${carFromList.year} بحالة ممتازة وخاضعة لفحص الجراج الاحترافي.`,
    };
  }

  // Default to BMW X5
  return carsData["bmw-x5"];
};

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const car = useMemo(() => getCarData(id), [id]);

  // States
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [showOfferModal, setShowOfferModal] = useState(false);

  const [offerPrice, setOfferPrice] = useState("");

  // Sidebar Accordion states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      body: true,
      engine: false,
      electronic: false,
      brakes: false,
      road: false,
      defects: false,
    },
  );

  const toggleAccordion = (name: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Filter similar/recommended cars
  const recommendedCars = useMemo(() => {
    return initialCars.filter((c) => c.id !== id).slice(0, 3);
  }, [id]);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      {/* Page Title Hero Banner */}
      <Banner car={car} />

      {/* Main Container */}
      <main className="py-12 flex flex-col items-center">
        <MaxWidthWrapper
          className="w-full xl:grid xl:grid-cols-12 xl:gap-8 max-xl:space-y-6 2xl:px-[182px]!"
          // dir="rtl"
        >
          {/* Right Column in RTL: Main Car Panel */}
          <div className="flex-1 w-full flex flex-col gap-6 xl:col-span-9">
            {/* Gallery Wrapper */}
            <div className="flex flex-col gap-4 w-full">
              {/* Main Image Preview */}
              <MainImagePreview car={car} activeImageIdx={activeImageIdx} />

              {/* Thumbnails strip */}
              <ThumbnailsStrip
                car={car}
                activeImageIdx={activeImageIdx}
                setActiveImageIdx={(v) => setActiveImageIdx(v)}
              />
            </div>

            <div>
              {/* Title & Pricing Card */}
              <div className="bg-white border border-gray-100 rounded-t-[20px] p-4 flex flex-col gap-6 w-full shadow-2xs">
                <div className="flex flex-col lg:flex-row md:items-start justify-between gap-6 pb-6  border-gray-100 overflow-hidden">
                  {/* Brand & Title */}
                  <BrandAndTitle car={car} />

                  {/* Pricing Area */}
                  <PricingArea car={car} />
                </div>
                {/* Tabs Component Card */}
                <TabsComponentCard car={car} />
              </div>

              {/* Certification Footer Banner */}
              <CertificationFooterBanner />
            </div>

            <TabsComponentCardInMobile car={car} />
          </div>

          {/* Left Column in RTL: Sidebar */}
          <div className="w-full 2xl:w-[322px] shrink-0 flex flex-col gap-6 xl:col-span-3">
            {/* Sidebar Actions Card */}
            <div className="rounded-[20px] flex flex-col gap-4 w-full">
              {/* Send Offer Button */}
              <button
                onClick={() => setShowOfferModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white text-sm w-full py-3.5 rounded-2xl flex items-center justify-center shadow-md cursor-pointer transition-colors"
              >
                ارسال عرض سعر
              </button>

              {/* Call & Whatsapp action rows */}
              <div className="flex items-center gap-3 w-full">
                <a
                  href="https://wa.me/201200000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold text-sm h-[48px] rounded-2xl flex items-center justify-center gap-2 flex-1 transition-colors"
                >
                  <Image
                    src="/assets/whatsapp.svg"
                    alt="whatsapp"
                    width={20}
                    height={20}
                  />
                  <span>واتساب</span>
                </a>

                <a
                  href="tel:19900"
                  className="bg-primary-50 border border-[#D2E0F9] text-primary-600 font-bold text-sm h-[48px] rounded-2xl flex items-center justify-center gap-2 flex-1 transition-colors"
                >
                  <Image
                    src="/assets/call.svg"
                    alt="call"
                    width={20}
                    height={20}
                  />
                  <span>مكالمة</span>
                </a>
              </div>
            </div>

            {/* Sidebar Inspection Summary Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden w-full shadow-2xs">
              {/* Accordion header */}
              <div className="bg-primary-50/80 border-b border-gray-100 px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/verify.svg"
                    alt="verify"
                    width={20}
                    height={20}
                  />
                  <span className="font-bold text-base text-gray-900">
                    تقرير الفحص
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium font-monos">
                  (14 Jan, 2025)
                </span>
              </div>

              {/* Legends */}
              <div className="px-10 py-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-400 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-[10px] font-bold text-center">
                    ✓
                  </span>
                  <span className="text-green-500">فحص ناجح</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-[10px] font-bold text-center">
                    !
                  </span>
                  <span className="text-orange-500">عيب او خلل</span>
                </div>
              </div>

              {/* Inspected Accordions List */}
              <div className="p-4 flex flex-col gap-3">
                {/* 1. Body structure accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("body")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/car.svg"
                        alt="body"
                        width={24}
                        height={24}
                        className="opacity-60"
                      />
                      <span>هيكل السيارة</span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">
                          02 ✓
                        </span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">
                          01 !
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-monos">
                        <TriArrow open={openAccordions.body} />
                      </span>
                    </div>
                  </button>
                  {openAccordions.body && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          جميع ألواح السيارة متناسقة ومطلية
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          المرايا الجانبية والخلفية خالية من الخدوش
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-monos">
                          !
                        </span>
                        <p className="text-start flex-1">
                          خدش بسيط في الباب الخلفي
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Engine and Transmission accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("engine")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/engine.svg"
                        alt="engine"
                        width={24}
                        height={24}
                        className="opacity-60"
                      />
                      <span>المحرك وناقل الحركة</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">
                          04 ✓
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-monos">
                        <TriArrow open={openAccordions.engine} />
                      </span>
                    </div>
                  </button>
                  {openAccordions.engine && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          أداء وسحب المحرك ممتاز وفي الحدود الطبيعية
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          ناقل الحركة يعمل بسلاسة ونعومة
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          لا توجد آثار تسريب زيوت أو سوائل تبريد
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          شمعات الاحتراق والوصلات الكهربائية سليمة
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Electronic check accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("electronic")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/file-check.svg"
                        alt="electronic"
                        width={24}
                        height={24}
                        className="opacity-60"
                      />
                      <span>الفحص الإلكتروني</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">
                          02 ✓
                        </span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">
                          01 !
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        <TriArrow open={openAccordions.electronic} />
                      </span>
                    </div>
                  </button>
                  {openAccordions.electronic && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          فحص كمبيوتر الأعطال (OBD) - خالي من المشاكل
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          سلامة البطارية ونظام شحن الدينامو
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-monos">
                          !
                        </span>
                        <p className="text-start flex-1">
                          تحديث برمجي مطلوب لوحدة الشاشة الترفيهية
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Brakes & Tires accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("brakes")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/wheel.svg"
                        alt="brakes"
                        width={24}
                        height={24}
                        className="opacity-60"
                      />
                      <span>الإطارات والفرامل</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">
                          02 ✓
                        </span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">
                          01 !
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-monos">
                        <TriArrow open={openAccordions.brakes} />
                      </span>
                    </div>
                  </button>
                  {openAccordions.brakes && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          سمك تيل الفرامل الخلفي بنسبة 70%
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          نقشة وحالة الإطارات الأربعة بحالة جيدة
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-monos">
                          !
                        </span>
                        <p className="text-start flex-1">
                          تيل الفرامل الأمامي يحتاج لتغيير بعد 5,000 كم
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Road test accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("road")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/road-test.svg"
                        alt="road test"
                        width={24}
                        height={24}
                        className="opacity-60"
                      />
                      <span>اختبار الطريق</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">
                          02 ✓
                        </span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">
                          01 !
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-monos">
                        <TriArrow open={openAccordions.road} />
                      </span>
                    </div>
                  </button>
                  {openAccordions.road && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          توجيه وثبات السيارة على السرعات ممتاز
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          استجابة الفرامل الفورية أثناء الطوارئ
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-monos">
                          !
                        </span>
                        <p className="text-start flex-1">
                          صوت خفيف من المساعد الأمامي عند المنحنيات القوية
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Scratches and defects accordion */}
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs">
                  <button
                    onClick={() => toggleAccordion("defects")}
                    className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/car-repair.svg"
                        alt="defects"
                        width={18}
                        height={18}
                        className="w-4.5 h-4.5 opacity-60"
                      />
                      <span>الخدوش والعيوب</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1.5">
                        <span className="flex items-center justify-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">
                          02 ✓
                        </span>
                        <span className="flex items-center justify-center bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">
                          01 !
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-monos">
                        <TriArrow open={openAccordions.defects} />
                      </span>
                    </div>
                  </button>
                  {openAccordions.defects && (
                    <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          الزجاج الأمامي والخلفي أصلي وخالي من الشروخ
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                          ✓
                        </span>
                        <p className="text-start flex-1">
                          الفرش الداخلي للسيارة بحالة الوكالة
                        </p>
                      </div>
                      <div className="flex items-start text-xs text-gray-500 gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-monos">
                          !
                        </span>
                        <p className="text-start flex-1">
                          خدش سطحية خفيفة في الجانب الأيسر للصدام الخلفي
                        </p>
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
        </MaxWidthWrapper>

        {/* Similar Cars Section */}
        <MaxWidthWrapper className="w-full mx-auto mt-16 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
            <h3 className="text-gray-900 font-bold text-xl md:text-2xl">
              سيارات مشابهة
            </h3>
            <Link href="/cars">
              <div className="text-right justify-center text-[#666] text-sm font-normal leading-4">
                عرض المزيد
              </div>
            </Link>
          </div>
          {/* Mobile swipeable horizontal container, hidden on medium and above */}
          <Carousel dir="rtl" className="sm:hidden">
            <CarouselContent className="">
              {recommendedCars.map((similarCar) => (
                <CarouselItem
                  key={similarCar.id}
                  className="basis-1/1 relative pl-3 last:pl-0 overflow-hidden  transition-all rounded-2xl duration-300 h-[370px] select-none group"
                >
                  <div key={similarCar.id} className="pointer-events-none">
                    <CarCard key={similarCar.id} {...similarCar} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Desktop grid layout, hidden on mobile */}
          <div className="max-sm:hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {recommendedCars.map((similarCar) => (
              <CarCard key={similarCar.id} {...similarCar} />
            ))}
          </div>
        </MaxWidthWrapper>
      </main>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full flex flex-col gap-5 text-start border border-gray-100 shadow-xl"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#002853]">
                ارسال عرض سعر
              </h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-gray-600 font-monos text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              ادخل عرض السعر الذي ترغب بتقديمه لشراء هذه السيارة ({car.brand}{" "}
              {car.model}). سيقوم ممثل من الجراج بمراجعة طلبك والتواصل معك في
              أقرب وقت.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700 text-xs font-semibold">
                عرض السعر المقترح
              </label>
              <div className="relative border border-gray-200 focus-within:border-primary-500 rounded-2xl flex items-center gap-2 px-4 h-12 bg-gray-50">
                <span className="text-gray-400 text-sm font-semibold">ج.م</span>
                <input
                  type="text"
                  placeholder="مثال: 600,000"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full h-full bg-transparent text-start outline-none text-sm font-semibold text-gray-800 font-monos"
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
                  alert(
                    `تم إرسال عرضك بقيمة ${offerPrice} ج.م بنجاح! سنتواصل معك في غضون 24 ساعة.`,
                  );
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
