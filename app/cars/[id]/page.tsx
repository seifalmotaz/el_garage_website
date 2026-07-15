"use client";

import { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CarCard from "../../../components/CarCard";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { TriArrow } from "@/components/svg/Svgs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/common/Carousel";
import SimilarCars from "@/components/sections/SimilarCars";
import Spinner from "@/components/common/Spinner";
import Car360EntryButton from "@/components/car-360/Car360EntryButton";
import Car360Modal from "@/components/car-360/Car360Modal";
import { useCar } from "@/hooks/useCar";
import { useCars } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import { createNegotiation } from "@/lib/api/negotiations";
import { formatMileage, formatPrice, formatYear } from "@/lib/format";
import type { Car, CarDetail, InspectionReportResponse } from "@/lib/api/types";
import { absolutizeUrl } from "@/lib/api/media";
import { useActiveInspectionVersion } from "@/hooks/useActiveInspectionVersion";
import {
  isInspectionPass,
  type InspectionAnswerOption,
} from "@/lib/inspection-semantics";

/** One row inside a section accordion (pass or issue). */
type InspectionLine = {
  text: string;
  /** `true` → green ✓, `false` → orange ! */
  ok: boolean;
};

/** One accordion section in the sidebar inspection card. */
type InspectionSectionView = {
  key: string;
  title: string;
  iconSrc: string;
  goodCount: number;
  issueCount: number;
  lines: InspectionLine[];
};

type CarFeatureView = {
  id: string;
  name: string;
  iconUrl: string;
};

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
  features: CarFeatureView[];
  description: string;
  has360View: boolean;
  hasInspectionReport: boolean;
  carId: string;
  sellerPhone: string | null;
  /** Formatted inspection date for the card header, or null. */
  inspectionDateLabel: string | null;
  /** Grouped inspection sections from `inspectionReport.responses`. */
  inspectionSections: InspectionSectionView[];
  /** Absolute URL of the generated inspection PDF, or null if not yet generated. */
  inspectionPdfUrl: string | null;
};

/** Local placeholder path used when a car has no usable image URL. */
const CAR_PLACEHOLDER = "/assets/car_placeholder.png";

/** Look up a spec value by its spec key (e.g. `"transmission"`, `"fuel"`). */
function findSpecValue(
  specs: CarDetail["specifications"],
  key: string,
): string | null {
  const found = specs.find((s) => s.key === key);
  if (!found) return null;
  return found.label ?? found.value ?? null;
}

/** Pick a local icon path for an inspection section title. */
function sectionIconSrc(title: string, sectionIcon: string | null): string {
  const t = title.toLowerCase();
  if (sectionIcon) {
    // Backend may send codes like "car_body", "brakes" — map a few.
    const code = sectionIcon.toLowerCase();
    if (code.includes("engine") || code.includes("motor")) return "/icons/engine.svg";
    if (code.includes("brake") || code.includes("wheel") || code.includes("tire"))
      return "/icons/wheel.svg";
    if (code.includes("road")) return "/icons/road-test.svg";
    if (code.includes("electronic") || code.includes("obd") || code.includes("file"))
      return "/icons/file-check.svg";
    if (code.includes("repair") || code.includes("scratch") || code.includes("defect"))
      return "/icons/car-repair.svg";
    if (code.includes("body") || code.includes("car")) return "/icons/car.svg";
  }
  if (t.includes("محرك") || t.includes("ناقل")) return "/icons/engine.svg";
  if (t.includes("فرامل") || t.includes("إطار") || t.includes("اطار"))
    return "/icons/wheel.svg";
  if (t.includes("طريق") || t.includes("قيادة")) return "/icons/road-test.svg";
  if (t.includes("إلكترون") || t.includes("الكترون") || t.includes("كمبيوتر"))
    return "/icons/file-check.svg";
  if (t.includes("خدش") || t.includes("عيب") || t.includes("داخل"))
    return "/icons/car-repair.svg";
  if (t.includes("هيكل") || t.includes("خارج")) return "/icons/car.svg";
  return "/icons/car.svg";
}

/** Format completedAt as e.g. `(14 Jan, 2025)` to match the original mock header. */
function formatInspectionHeaderDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `(${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()})`;
}

/**
 * Group flat `inspectionReport.responses` into accordion sections for the
 * car-detail sidebar. Status uses dashboard-style option semantics
 * (`lib/inspection-semantics.ts`), not raw answerValue guessing.
 */
function mapInspectionSections(
  report: InspectionReportResponse | null | undefined,
  catalog?: Map<string, InspectionAnswerOption[]>,
): InspectionSectionView[] {
  if (!report?.responses?.length) return [];

  const groups = new Map<
    string,
    {
      title: string;
      icon: string | null;
      order: number;
      lines: InspectionLine[];
      goodCount: number;
      issueCount: number;
    }
  >();

  for (const response of report.responses) {
    const title = response.section?.trim() || "أخرى";
    if (!groups.has(title)) {
      groups.set(title, {
        title,
        icon: response.sectionIcon,
        order: response.sectionOrder ?? 999,
        lines: [],
        goodCount: 0,
        issueCount: 0,
      });
    }
    const group = groups.get(title)!;
    if (
      response.sectionOrder !== undefined &&
      response.sectionOrder < group.order
    ) {
      group.order = response.sectionOrder;
    }
    const ok = isInspectionPass({
      answerValue: response.answerValue,
      answerText: response.answerText,
      questionKey: response.questionKey,
      semanticType: response.semanticType,
      catalog,
    });
    const text =
      response.questionText?.trim() ||
      response.notes?.trim() ||
      response.answerText?.trim() ||
      response.answerValue;
    group.lines.push({ text, ok });
    if (ok) group.goodCount += 1;
    else group.issueCount += 1;
  }

  return Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .map((g, idx) => ({
      key: `sec-${idx}-${g.title}`,
      title: g.title === "_unsectioned" ? "أخرى" : g.title,
      iconSrc: sectionIconSrc(g.title, g.icon),
      goodCount: g.goodCount,
      issueCount: g.issueCount,
      lines: g.lines,
    }));
}

/**
 * Map a backend `CarDetail` to the local `CarType` view model.
 *
 * @param catalog Optional questionKey → answer options map from the
 *   public inspection version catalog (same source the dashboard uses
 *   to resolve semanticType).
 */
function mapCarToView(
  car: CarDetail,
  catalog?: Map<string, InspectionAnswerOption[]>,
): CarType {
  const fallbackImages = [CAR_PLACEHOLDER];
  const transmission = findSpecValue(car.specifications, "transmission");
  const fuel = findSpecValue(car.specifications, "fuel");
  const color = findSpecValue(car.specifications, "color");
  const hp = findSpecValue(car.specifications, "horsepower");
  const engineSize = findSpecValue(car.specifications, "engine");
  const tankCapacity = findSpecValue(car.specifications, "tank");
  return {
    brand: car.carBrand?.name ?? car.brand,
    model: car.carModel?.name ?? car.model,
    price: formatPrice(car.price),
    installment: "15,000", // No backend installment field yet — keep a non-zero default so the pill renders.
    year: formatYear(car.year),
    mileage: formatMileage(car.mileage),
    trim: car.trim ?? "",
    location: car.address,
    // Backend has no explicit condition flag — used cars with mileage > 0 are
    // treated as "مستعملة"; new/zero-mileage listings surface as "جديدة".
    condition: car.mileage > 0 ? "مستعملة" : "جديدة",
    transmission: transmission ?? "أوتوماتيك",
    fuelType: fuel ?? "بنزين",
    color: color ?? "أسود",
    hp: hp ?? "180",
    engineSize: engineSize ?? "1600 سي سي",
    tankCapacity: tankCapacity ?? "60 لتر",
    images: car.images.length > 0 ? car.images : fallbackImages,
    features: car.features.map((feature) => ({
      id: feature.id,
      name: feature.name,
      iconUrl: absolutizeUrl(feature.iconUrl) ?? "/car-feat.svg",
    })),
    description: car.description ?? "",
    has360View: car.has360View,
    hasInspectionReport: Boolean(car.inspectionReport),
    carId: car.id,
    sellerPhone: car.seller?.phone ?? null,
    inspectionDateLabel: formatInspectionHeaderDate(
      car.inspectionReport?.completedAt ?? null,
    ),
    inspectionSections: mapInspectionSections(car.inspectionReport, catalog),
    inspectionPdfUrl: absolutizeUrl(car.inspectionReport?.pdfUrl ?? null),
  };
}

/**
 * Map an API `Car` (list shape) to the props `CarCard` expects.
 *
 * `useCars` returns the same shape as the detail endpoint minus a few
 * detail-only fields — the props below are exactly what `CarCard`
 * declares in its `CarCardProps` interface.
 */
function mapCarForCard(car: Car) {
  return {
    id: car.id,
    image: car.images[0],
    brand: car.carBrand?.name ?? car.brand,
    model: car.carModel?.name ?? car.model,
    price: car.price,
    year: car.year,
    mileage: car.mileage,
    trim: car.trim,
    location: car.address,
    isFeatured: car.isFeatured,
  };
}

const Banner = ({ car }: { car: CarType }) => {
  return (
    <div className="relative w-full lg:h-[320px] h-[280px] overflow-hidden flex flex-col justify-end text-center pb-8 md:pb-0">
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
  onOpen360,
}: {
  car: CarType;
  activeImageIdx: number;
  onOpen360?: () => void;
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

        {/* 360° CTA — only when this car has a published 360 package */}
        {car.has360View && onOpen360 ? (
          <Car360EntryButton onClick={onOpen360} />
        ) : null}
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

const FeatureGrid = ({
  features,
  className,
}: {
  features: CarFeatureView[];
  className: string;
}) => (
  <div className={className}>
    {features.map((feature) => (
      <div
        key={feature.id}
        className="bg-gray-50 border border-gray-100 text-gray-600 py-3 px-3 rounded-lg flex flex-col justify-center items-center gap-2"
      >
        <span className="text-sm text-center leading-5">{feature.name}</span>
        <Image
          src={feature.iconUrl}
          alt=""
          width={30}
          height={30}
          className="size-[30px] object-contain"
        />
      </div>
    ))}
  </div>
);

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
            <FeatureGrid
              features={car.features}
              className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
            />
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

        <FeatureGrid
          features={car.features}
          className="grid grid-cols-3 gap-x-2 gap-y-3"
        />
      </div>
      <div className="p-3 rounded-2xl border border-[#F2F2F2] bg-white">
        <h3 className="text-primary-500 text-sm leading-[150%] mb-4">
          الوصف
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

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Fetch the car detail (current car) and the full catalog (for the
  // "similar cars" strip below). Both calls use SWR under the hood, so
  // the SWR provider's deduping + focus-revalidation applies here too.
  const { car: carDetail, isLoading, error, mutate } = useCar(id);
  const { cars: allCars } = useCars();
  // Same catalog the dashboard uses to map answerValue → GOOD/WARN/BAD
  const { catalog: inspectionCatalog } = useActiveInspectionVersion();

  // Map the API detail to the local view model. The mapping is memoised
  // so that identical `carDetail` references do not invalidate downstream
  // `useMemo`s (e.g. the recommended-cars slice below).
  const car = useMemo(
    () =>
      carDetail ? mapCarToView(carDetail, inspectionCatalog) : null,
    [carDetail, inspectionCatalog],
  );

  // States
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [show360Modal, setShow360Modal] = useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);

  const [offerPrice, setOfferPrice] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  // Sidebar accordion open state — keys are section keys from the API report.
  // First section starts open when data arrives (see effect-free init via
  // deriving defaults when state is empty).
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {},
  );

  const toggleAccordion = (name: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  /** First section open by default until user toggles. */
  const openStateFor = (key: string, index: number): boolean => {
    if (key in openAccordions) return Boolean(openAccordions[key]);
    return index === 0;
  };

  // Filter similar/recommended cars from the live catalog — exclude the
  // current car and cap at 3 so the strip matches the original design.
  const recommendedCars = useMemo(() => {
    return allCars
      .filter((c) => c.id !== id)
      .slice(0, 3)
      .map(mapCarForCard);
  }, [allCars, id]);

  // ===== Loading / error / not-found guards ===== //
  //
  // The original page fell back to a hard-coded mock for unknown IDs; now
  // we surface real API states with minimal, non-redesigned feedback.
  if (isLoading) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center py-24">
          <Spinner variant="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-red-500 font-medium">
            حدث خطأ أثناء تحميل تفاصيل السيارة
          </p>
          <button
            onClick={() => mutate()}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-gray-700 font-bold text-lg">
            السيارة غير موجودة
          </p>
          <p className="text-gray-500 text-sm">
            ربما تكون قد انتهت صلاحية الإعلان أو تم حذفه.
          </p>
          <Link
            href="/cars"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            تصفح السيارات
          </Link>
        </div>
      </div>
    );
  }

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
              <MainImagePreview
                car={car}
                activeImageIdx={activeImageIdx}
                onOpen360={
                  car.has360View ? () => setShow360Modal(true) : undefined
                }
              />

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
                  href={
                    car.sellerPhone
                      ? `https://wa.me/${car.sellerPhone.replace(/\D/g, "")}`
                      : "https://wa.me/201200000000"
                  }
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
                  href={car.sellerPhone ? `tel:${car.sellerPhone}` : "tel:19900"}
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

            {/* Sidebar Inspection Summary Card — driven by GET /cars/:id inspectionReport */}
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
                {car.inspectionDateLabel ? (
                  <span className="text-xs text-gray-500 font-medium font-monos">
                    {car.inspectionDateLabel}
                  </span>
                ) : null}
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

              {/* Inspected Accordions List — real API sections */}
              <div className="p-4 flex flex-col gap-3">
                {car.inspectionSections.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">
                    لا يتوفر تقرير فحص لهذه السيارة حالياً
                  </p>
                ) : (
                  car.inspectionSections.map((section, index) => {
                    const isOpen = openStateFor(section.key, index);
                    return (
                      <div
                        key={section.key}
                        className="border border-gray-100 rounded-xl overflow-hidden shadow-3xs"
                      >
                        <button
                          type="button"
                          onClick={() => toggleAccordion(section.key)}
                          className="w-full bg-gray-50/50 hover:bg-gray-50 px-4 py-3 flex items-center justify-between text-sm text-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              src={section.iconSrc}
                              alt=""
                              width={24}
                              height={24}
                              className="opacity-60"
                            />
                            <span>{section.title}</span>
                          </div>

                          <div className="flex gap-2 items-center">
                            <div className="flex gap-1.5">
                              {section.goodCount > 0 ? (
                                <span className="flex items-center justify-center bg-green-50 text-green-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100/50">
                                  {String(section.goodCount).padStart(2, "0")} ✓
                                </span>
                              ) : null}
                              {section.issueCount > 0 ? (
                                <span className="flex items-center justify-center bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100/50">
                                  {String(section.issueCount).padStart(2, "0")} !
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[10px] text-gray-400 font-monos">
                              <TriArrow open={isOpen} />
                            </span>
                          </div>
                        </button>
                        {isOpen ? (
                          <div className="p-3 bg-white border-t border-gray-50 flex flex-col gap-2.5 animate-slide-down">
                            {section.lines.map((line, lineIdx) => (
                              <div
                                key={`${section.key}-line-${lineIdx}`}
                                className="flex items-start text-xs text-gray-500 gap-2.5"
                              >
                                {line.ok ? (
                                  <span className="w-4.5 h-4.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="w-4.5 h-4.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold shrink-0 text-center font-monos">
                                    !
                                  </span>
                                )}
                                <p className="text-start flex-1">{line.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>

              {/* View full report link + Download PDF */}
              <div className="bg-gray-50/80 border-t border-gray-100 px-5 py-3.5 flex flex-col items-center gap-2">
                <Link
                  href={
                    car.hasInspectionReport
                      ? `/inspection-report?carId=${encodeURIComponent(car.carId)}`
                      : "/inspection-report"
                  }
                  className="text-xs text-primary-500 font-bold hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>عرض تقرير الفحص بالكامل</span>
                  <span>←</span>
                </Link>
                {car.inspectionPdfUrl ? (
                  <a
                    href={car.inspectionPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-xs text-gray-500 hover:text-primary-500 font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>تحميل التقرير كـ PDF</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>

        {/* Similar Cars Section */}
        <SimilarCars recommendedCars={recommendedCars} />
      </main>

      {/* Fullscreen 360° viewer — loads frames only when opened */}
      {car.has360View ? (
        <Car360Modal
          carId={car.carId}
          title={`${car.brand} ${car.model}`}
          open={show360Modal}
          onClose={() => setShow360Modal(false)}
        />
      ) : null}

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
                onClick={async () => {
                  setOfferError(null);
                  if (!offerPrice.trim()) {
                    setOfferError("برجاء إدخال عرض السعر المقترح أولاً.");
                    return;
                  }
                  // Strip thousands separators / currency noise — the
                  // backend expects a plain integer / decimal.
                  const sanitized = offerPrice
                    .replace(/[^\d.]/g, "")
                    .trim();
                  const parsed = Number(sanitized);
                  if (!sanitized || Number.isNaN(parsed) || parsed < 0) {
                    setOfferError("برجاء إدخال قيمة رقمية صحيحة.");
                    return;
                  }

                  // Unauthenticated → bounce to login with a returnUrl so
                  // the user lands back here after sign-in.
                  if (!isAuthenticated) {
                    const returnUrl = `/cars/${car.carId}`;
                    setShowOfferModal(false);
                    router.push(
                      `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`,
                    );
                    return;
                  }

                  setOfferSubmitting(true);
                  try {
                    await createNegotiation({
                      carId: car.carId,
                      initialOffer: parsed,
                    });
                    setShowOfferModal(false);
                    setOfferPrice("");
                    alert(
                      `تم إرسال عرضك بقيمة ${offerPrice} ج.م بنجاح! سنتواصل معك في غضون 24 ساعة.`,
                    );
                  } catch (err) {
                    const message =
                      err instanceof Error
                        ? err.message
                        : "تعذر إرسال العرض، حاول مرة أخرى.";
                    setOfferError(message);
                  } finally {
                    setOfferSubmitting(false);
                  }
                }}
                disabled={offerSubmitting}
                className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {offerSubmitting ? "جاري الإرسال..." : "إرسال العرض"}
              </button>
            </div>
            {offerError && (
              <p className="text-red-500 text-xs text-center -mt-2">
                {offerError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
