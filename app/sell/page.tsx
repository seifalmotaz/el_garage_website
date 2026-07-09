"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/common/Map"), {
  ssr: false,
});

import { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import CircularProgress from "@/components/common/CircularProgress";
import Select from "@/components/form/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { model_options } from "@/constants/car-filters";
import NumberInput from "@/components/form/NumberInput";
import ChassisInput from "@/components/form/ChassisInput";
import Textarea from "@/components/form/Textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/common/Carousel";
import { carSellStepsSchema, CarSellStepsSchemaType } from "@/shared/schemas";
import { fakePromise } from "@/lib/utils";
import Spinner from "@/components/common/Spinner";
import PageBanner from "@/components/common/PageBanner";

const CarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M18.483 11.3832C18.358 10.0082 17.9913 8.5415 15.3163 8.5415H4.683C2.008 8.5415 1.64966 10.0082 1.51633 11.3832L1.04966 16.4582C0.991331 17.0915 1.19966 17.7248 1.633 18.1998C2.07466 18.6832 2.69966 18.9582 3.36633 18.9582H4.933C6.283 18.9582 6.54133 18.1832 6.708 17.6748L6.87466 17.1748C7.06633 16.5998 7.11633 16.4582 7.86633 16.4582H12.133C12.883 16.4582 12.908 16.5415 13.1247 17.1748L13.2913 17.6748C13.458 18.1832 13.7163 18.9582 15.0663 18.9582H16.633C17.2913 18.9582 17.9247 18.6832 18.3663 18.1998C18.7997 17.7248 19.008 17.0915 18.9497 16.4582L18.483 11.3832Z"
      fill="#002EC1"
    />
    <path
      d="M17.5 6.04173H16.6667C16.6583 6.04173 16.6583 6.04173 16.65 6.04173L16.3333 4.5334C16.0333 3.07507 15.4083 1.7334 12.925 1.7334H10.625H9.375H7.075C4.59167 1.7334 3.96667 3.07507 3.66667 4.5334L3.35 6.04173C3.34167 6.04173 3.34167 6.04173 3.33333 6.04173H2.5C2.15833 6.04173 1.875 6.32507 1.875 6.66673C1.875 7.0084 2.15833 7.29173 2.5 7.29173H3.09167L2.74167 8.9584C3.19167 8.70007 3.81667 8.54173 4.68333 8.54173H15.3167C16.1833 8.54173 16.8083 8.70007 17.2583 8.9584L16.9083 7.29173H17.5C17.8417 7.29173 18.125 7.0084 18.125 6.66673C18.125 6.32507 17.8417 6.04173 17.5 6.04173Z"
      fill="#002EC1"
    />
    <path
      d="M7.5 13.125H5C4.65833 13.125 4.375 12.8417 4.375 12.5C4.375 12.1583 4.65833 11.875 5 11.875H7.5C7.84167 11.875 8.125 12.1583 8.125 12.5C8.125 12.8417 7.84167 13.125 7.5 13.125Z"
      fill="#002EC1"
    />
    <path
      d="M15 13.125H12.5C12.1583 13.125 11.875 12.8417 11.875 12.5C11.875 12.1583 12.1583 11.875 12.5 11.875H15C15.3417 11.875 15.625 12.1583 15.625 12.5C15.625 12.8417 15.3417 13.125 15 13.125Z"
      fill="#002EC1"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M17.1834 7.04183C16.3084 3.19183 12.9501 1.4585 10.0001 1.4585C10.0001 1.4585 10.0001 1.4585 9.99175 1.4585C7.05008 1.4585 3.68341 3.1835 2.80841 7.0335C1.83341 11.3335 4.46675 14.9752 6.85008 17.2668C7.73341 18.1168 8.86675 18.5418 10.0001 18.5418C11.1334 18.5418 12.2667 18.1168 13.1417 17.2668C15.5251 14.9752 18.1584 11.3418 17.1834 7.04183Z"
      fill="#002EC1"
    />
    <path
      d="M10 11.2168C11.4497 11.2168 12.625 10.0415 12.625 8.5918C12.625 7.14205 11.4497 5.9668 10 5.9668C8.55025 5.9668 7.375 7.14205 7.375 8.5918C7.375 10.0415 8.55025 11.2168 10 11.2168Z"
      fill="#002EC1"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.9582 2.9665V1.6665C13.9582 1.32484 13.6749 1.0415 13.3332 1.0415C12.9915 1.0415 12.7082 1.32484 12.7082 1.6665V2.9165H7.29153V1.6665C7.29153 1.32484 7.0082 1.0415 6.66653 1.0415C6.32487 1.0415 6.04153 1.32484 6.04153 1.6665V2.9665C3.79153 3.17484 2.69987 4.5165 2.5332 6.50817C2.51653 6.74984 2.71653 6.94983 2.94987 6.94983H17.0499C17.2915 6.94983 17.4915 6.7415 17.4665 6.50817C17.2999 4.5165 16.2082 3.17484 13.9582 2.9665Z"
      fill="#002EC1"
    />
    <path
      opacity="0.4"
      d="M16.6667 8.2002C17.125 8.2002 17.5 8.5752 17.5 9.03353V14.1669C17.5 16.6669 16.25 18.3335 13.3333 18.3335H6.66667C3.75 18.3335 2.5 16.6669 2.5 14.1669V9.03353C2.5 8.5752 2.875 8.2002 3.33333 8.2002H16.6667Z"
      fill="#002EC1"
    />
    <path
      d="M7.08333 12.5002C6.86667 12.5002 6.65 12.4085 6.49167 12.2585C6.34167 12.1002 6.25 11.8836 6.25 11.6669C6.25 11.4502 6.34167 11.2336 6.49167 11.0752C6.725 10.8419 7.09167 10.7669 7.4 10.9002C7.50833 10.9419 7.6 11.0002 7.675 11.0752C7.825 11.2336 7.91667 11.4502 7.91667 11.6669C7.91667 11.8836 7.825 12.1002 7.675 12.2585C7.51667 12.4085 7.3 12.5002 7.08333 12.5002Z"
      fill="#002EC1"
    />
    <path
      d="M9.99984 12.5002C9.78317 12.5002 9.5665 12.4085 9.40817 12.2585C9.25817 12.1002 9.1665 11.8836 9.1665 11.6669C9.1665 11.4502 9.25817 11.2336 9.40817 11.0752C9.48317 11.0002 9.57484 10.9419 9.68317 10.9002C9.9915 10.7669 10.3582 10.8419 10.5915 11.0752C10.7415 11.2336 10.8332 11.4502 10.8332 11.6669C10.8332 11.8836 10.7415 12.1002 10.5915 12.2585C10.5498 12.2919 10.5082 12.3252 10.4665 12.3585C10.4165 12.3919 10.3665 12.4169 10.3165 12.4336C10.2665 12.4586 10.2165 12.4752 10.1665 12.4836C10.1082 12.4919 10.0582 12.5002 9.99984 12.5002Z"
      fill="#002EC1"
    />
    <path
      d="M12.9168 12.5002C12.7002 12.5002 12.4835 12.4085 12.3252 12.2585C12.1752 12.1002 12.0835 11.8835 12.0835 11.6668C12.0835 11.4502 12.1752 11.2335 12.3252 11.0752C12.4085 11.0002 12.4918 10.9418 12.6002 10.9002C12.7502 10.8335 12.9168 10.8168 13.0835 10.8502C13.1335 10.8585 13.1835 10.8752 13.2335 10.9002C13.2835 10.9168 13.3335 10.9419 13.3835 10.9752C13.4252 11.0085 13.4668 11.0418 13.5085 11.0752C13.6585 11.2335 13.7502 11.4502 13.7502 11.6668C13.7502 11.8835 13.6585 12.1002 13.5085 12.2585C13.4668 12.2918 13.4252 12.3252 13.3835 12.3585C13.3335 12.3918 13.2835 12.4169 13.2335 12.4335C13.1835 12.4585 13.1335 12.4752 13.0835 12.4835C13.0252 12.4918 12.9668 12.5002 12.9168 12.5002Z"
      fill="#002EC1"
    />
    <path
      d="M7.08333 15.4167C6.975 15.4167 6.86667 15.3917 6.76667 15.35C6.65833 15.3084 6.575 15.25 6.49167 15.175C6.34167 15.0167 6.25 14.8 6.25 14.5833C6.25 14.3667 6.34167 14.15 6.49167 13.9917C6.575 13.9167 6.65833 13.8583 6.76667 13.8167C6.91667 13.75 7.08333 13.7333 7.25 13.7667C7.3 13.775 7.35 13.7917 7.4 13.8167C7.45 13.8333 7.5 13.8584 7.55 13.8917C7.59167 13.925 7.63333 13.9584 7.675 13.9917C7.825 14.15 7.91667 14.3667 7.91667 14.5833C7.91667 14.8 7.825 15.0167 7.675 15.175C7.63333 15.2083 7.59167 15.25 7.55 15.275C7.5 15.3083 7.45 15.3334 7.4 15.35C7.35 15.375 7.3 15.3917 7.25 15.4C7.19167 15.4084 7.14167 15.4167 7.08333 15.4167Z"
      fill="#002EC1"
    />
    <path
      d="M9.99984 15.4165C9.78317 15.4165 9.5665 15.3248 9.40817 15.1748C9.25817 15.0165 9.1665 14.7998 9.1665 14.5832C9.1665 14.3665 9.25817 14.1498 9.40817 13.9915C9.7165 13.6832 10.2832 13.6832 10.5915 13.9915C10.7415 14.1498 10.8332 14.3665 10.8332 14.5832C10.8332 14.7998 10.7415 15.0165 10.5915 15.1748C10.4332 15.3248 10.2165 15.4165 9.99984 15.4165Z"
      fill="#002EC1"
    />
    <path
      d="M12.9168 15.4165C12.7002 15.4165 12.4835 15.3248 12.3252 15.1748C12.1752 15.0165 12.0835 14.7998 12.0835 14.5832C12.0835 14.3665 12.1752 14.1498 12.3252 13.9915C12.6335 13.6832 13.2002 13.6832 13.5085 13.9915C13.6585 14.1498 13.7502 14.3665 13.7502 14.5832C13.7502 14.7998 13.6585 15.0165 13.5085 15.1748C13.3502 15.3248 13.1335 15.4165 12.9168 15.4165Z"
      fill="#002EC1"
    />
  </svg>
);

const ClipboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M13.5334 3.0415H6.4667C4.40837 3.0415 2.7417 4.7165 2.7417 6.7665V14.6082C2.7417 16.6582 4.4167 18.3332 6.4667 18.3332H13.525C15.5834 18.3332 17.25 16.6582 17.25 14.6082V6.7665C17.2584 4.70817 15.5834 3.0415 13.5334 3.0415Z"
      fill="#002EC1"
    />
    <path
      d="M11.9582 1.6665H8.04155C7.17489 1.6665 6.46655 2.3665 6.46655 3.23317V4.0165C6.46655 4.88317 7.16655 5.58317 8.03322 5.58317H11.9582C12.8249 5.58317 13.5249 4.88317 13.5249 4.0165V3.23317C13.5332 2.3665 12.8249 1.6665 11.9582 1.6665Z"
      fill="#002EC1"
    />
    <path
      d="M9.00842 14.1252C8.85008 14.1252 8.69175 14.0669 8.56675 13.9419L7.31675 12.6919C7.07508 12.4502 7.07508 12.0502 7.31675 11.8085C7.55841 11.5669 7.95842 11.5669 8.20008 11.8085L9.00842 12.6169L11.9001 9.7252C12.1417 9.48353 12.5417 9.48353 12.7834 9.7252C13.0251 9.96686 13.0251 10.3669 12.7834 10.6085L9.45008 13.9419C9.33342 14.0669 9.16675 14.1252 9.00842 14.1252Z"
      fill="#002EC1"
    />
  </svg>
);

const CompassIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.3247 15.8125C7.08108 17.9099 4.45927 18.9586 2.96174 17.941C2.60667 17.6997 2.30043 17.3935 2.05914 17.0384C1.04151 15.5409 2.09024 12.9191 4.18769 7.67546C4.63507 6.55701 4.85876 5.99778 5.24348 5.55906C5.34152 5.44727 5.44678 5.34201 5.55857 5.24397C5.99729 4.85925 6.55652 4.63555 7.67498 4.18817C12.9186 2.09073 15.5404 1.042 17.0379 2.05963C17.393 2.30091 17.6992 2.60716 17.9405 2.96222C18.9582 4.45976 17.9094 7.08157 15.812 12.3252C15.3646 13.4436 15.1409 14.0029 14.7562 14.4416C14.6582 14.5534 14.5529 14.6586 14.4411 14.7567C14.0024 15.1414 13.4431 15.3651 12.3247 15.8125Z"
      fill="#002EC1"
    />
    <path
      d="M10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875Z"
      fill="#002EC1"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const Step0 = ({ setStep }: { setStep: (step: number) => void }) => (
  <div className="flex flex-col gap-6 py-2">
    {/* Card Title & Step count */}
    <div className="text-right">
      <h3 className="font-bold text-base md:text-lg text-gray-900 inline-block">
        عملية بيع سيارتك
      </h3>
      <span className="text-sm font-semibold text-primary-500 mr-2">
        (3 خطوات)
      </span>
    </div>

    {/* Vertical steps column */}
    <div className="flex flex-col gap-4">
      {/* Row 1: Data Entry */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl gap-4 text-right group">
        {/* Right: Illustration icon (First in DOM -> Renders on the Right) */}
        <div className="w-[67px] h-[67px] relative shrink-0">
          <Image
            src="/assets/order_ride_rafiki.png"
            alt="إدخال البيانات"
            width={67}
            height={67}
            className="object-contain "
          />
        </div>
        {/* Left: Text details (Second in DOM -> Renders on the Left) */}
        <div className="flex-1">
          <h4 className="font-bold text-base text-gray-900 mb-1">
            1- إدخال البيانات
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
            يدخل المستخدم بياناته الاساسية ومعلومات السيارة بدقة وشفافيى لضمان
            أفضل تقييم
          </p>
        </div>
      </div>

      {/* Row 2: Appointment Coordination */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl gap-4 text-right group opacity-50">
        {/* Right: Illustration (First in DOM -> Renders on the Right) */}
        <div className="w-[67px] h-[67px] relative shrink-0">
          <Image
            src="/assets/city_driver_rafiki.png"
            alt="التنسيق والموعد"
            width={67}
            height={67}
            className="object-contain "
          />
        </div>
        {/* Left: Text details (Second in DOM -> Renders on the Left) */}
        <div className="flex-1">
          <h4 className="font-bold text-base text-gray-900 mb-1">
            2- التنسيق والموعد
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
            بتواصل فريقنا مع المستخدم لتأكيد التفاصيل وتحديد موعد مناسب للمعاينة
          </p>
        </div>
      </div>

      {/* Row 3: Inspection & Payment */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl gap-4 text-right group opacity-50">
        {/* Right: Illustration (First in DOM -> Renders on the Right) */}
        <div className="w-[67px] h-[67px] relative shrink-0">
          <Image
            src="/assets/car_finance_rafiki.png"
            alt="المعاينة والدفع"
            width={67}
            height={67}
            className="object-contain"
          />
        </div>
        {/* Left: Text details (Second in DOM -> Renders on the Left) */}
        <div className="flex-1">
          <h4 className="font-bold text-base text-gray-900 mb-1">
            3- المعاينة والدفع
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
            تتم المقابلة والمعاينة الواقعية للسيارة ثم تحصيل المبلغ المتفق عليه
          </p>
        </div>
      </div>
    </div>

    {/* Actions Row (Right-aligned matching Figma button) */}
    <div className="flex items-center justify-start mt-4">
      <button
        onClick={() => setStep(1)}
        className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-base px-10 py-3.5 rounded-2xl  transition-all cursor-pointer w-[162px]"
      >
        متابعة
      </button>
    </div>
  </div>
);

// Egyptian Cities & Brands Mock Data matching cars browse page
const brands = [
  { label: "تويوتا", value: "Toyota" },
  { label: "بي إم دبليو", value: "BMW" },
  { label: "مرسيدس بنز", value: "Mercedes" },
  { label: "بورش", value: "Porsche" },
  { label: "أودي", value: "Audi" },
  { label: "هيونداي", value: "Hyundai" },
  { label: "كيا", value: "Kia" },
  { label: "هوندا", value: "Honda" },
  { label: "لاند روفر", value: "Land Rover" },
  { label: "شيري", value: "Chery" },
  { label: "ميني كوبر", value: "Mini Cooper" },
];

// const brandModels: Record<string, string[]> = {
//   تويوتا: ["كورولا هايلاند", "ياريس", "لاند كروزر", "كامري"],
//   "بي إم دبليو": ["320i M Sport", "X5", "520i", "740i"],
//   "مرسيدس بنز": ["C200 AMG Line", "E300 AMG", "S500", "A200"],
//   بورش: ["كايين كابريو", "باناميرا", "911 كاريرا"],
//   أودي: ["A4 Highline", "Q8 Sportback", "A6"],
//   هيونداي: ["توسان Smart Plus", "إلنترا CN7", "أكسنت HCI"],
//   كيا: ["سبورتاج Topline", "سيراتو", "سورينتو"],
//   هوندا: ["سيفيك الرياضية", "أكورد e:HEV", "CR-V"],
//   "لاند روفر": ["رينج روفر فوج اس اي", "رينج روفر سبورت", "ديفندر"],
//   شيري: ["تيجو 8 برو", "تيجو 7", "أريزو 5"],
//   "ميني كوبر": ["S Countryman", "hatch 3 doors"],
// };

const years = Array.from({ length: 37 }, (_, i) => ({
  label: String(2026 - i),
  value: String(2026 - i),
}));

const timeSlots = [
  "06:00 PM",
  "08:00 PM",
  "09:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
];

// Helper to generate next 14 days
const generateInspectionDates = () => {
  const dates = [];
  const start = new Date();

  const arabicDays = [
    "الأحد",
    "الأثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  for (let i = 1; i <= 17; i++) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + i);

    const dayName = arabicDays[nextDate.getDay()];
    const dayNumber = nextDate.getDate();
    const monthName = arabicMonths[nextDate.getMonth()];

    dates.push({
      id: nextDate.toISOString().split("T")[0],
      label: `${dayName} - ${dayNumber} - ${monthName}`,
      value: nextDate.toISOString().split("T")[0],
      dayName,
      dayNumber,
      monthName,
      year: nextDate.getFullYear(),
      isWeekend: nextDate.getDay() === 5, // Disable Friday (الجمعة) as in Egypt weekends/inspectors rest
      rawDate: nextDate,
    });
  }
  return dates;
};

const ActionsRow = ({
  handleBack,
  handleNext,
  isLastStep = false,
  isPending,
}: {
  handleBack: () => void;
  handleNext: () => void;
  isLastStep?: boolean;
  isPending?: boolean;
}) => (
  <div className="flex items-center justify-start gap-4 mt-8 pt-6 md:ml-auto w-full md:w-auto">
    <button
      onClick={handleBack}
      className="flex-1 md:w-40 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-sm font-bold transition-colors text-center"
    >
      السابق
    </button>
    <button
      onClick={handleNext}
      type={isLastStep ? "submit" : "button"}
      className="flex-1 md:w-40 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-sm font-bold transition-colors  text-center"
    >
      {isPending ? <Spinner /> : isLastStep ? "تأكيد الطلب" : "التالي"}
    </button>
  </div>
);

export default function SellCarPage() {
  const [step, setStep] = useState(0); // 0: Intro, 1: Car Info, 2: Location, 3: Schedule, 4: Review, 5: Success

  // Map state Simulation
  const [isLocating, setIsLocating] = useState(false);

  // form validation
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<CarSellStepsSchemaType>({
    resolver: zodResolver(carSellStepsSchema),
  });

  const brandWatch = watch("step1.brand");
  const modelWatch = watch("step1.model");
  const yearWatch = watch("step1.year");

  const dateWatch = watch("step3.date");
  const appointmentWatch = watch("step3.appointment");

  const formData = getValues();

  const [isPending, startTransition] = useTransition();

  const datesList = generateInspectionDates();

  // Reset Model when Brand changes
  // useEffect(() => {
  //   setModel("");
  // }, [brand]);

  // == [ Submit Action ] == //
  const onSubmit = (data: CarSellStepsSchemaType) => {
    console.log(data);
    startTransition(async () => {
      await fakePromise();
      setStep((s) => s + 1);
    });
  };
  // == [ Submit Action ] == //
  const [address, setAddress] = useState("");
  // Simulate Geo Location Click
  const handleDetermineLocation = () => {
    setAddress(
      "جمهورية مصر العربية، محافظة القاهرة، مصر الجديدة، شارع الثورة، مبنى 108",
    );
  };

  // Step Navigations
  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger("step1");
    } else if (step === 2) {
      isValid = await trigger("step2");
    } else if (step === 3) {
      isValid = await trigger("step3");
    }

    if (isValid) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="relative flex flex-col min-h-screen  bg-white" dir="rtl">
      {/* Banner */}
      <PageBanner title="بيع السيارة" href="/cars" />

      {/* Main Content Area */}
      {step === 5 ? (
        /* SUCCESS PAGE - Centered Visual Flow Layout */
        <div className="bg-white rounded-2xl my-[112px] px-6 md:px-12 w-full max-w-[495px] flex flex-col items-center justify-center text-center mx-auto">
          {/* Success Confetti Circle Illustration */}
          <Image
            src={"/illustration-success.svg"}
            alt="success"
            width={154}
            height={128}
          />

          <h3 className="font-medium text-[20px] mt-[32px] md:text-[22px] text-gray-900 mb-2">
            تم استلام طلبك بنجاح!
          </h3>
          <p className="text-[16px] text-gray-500 font-semibold mb-2">
            شكراً لتسجيل سيارتك في منصة الجراج
          </p>
          <p className="text-[12px] text-gray-400 leading-relaxed mb-8 max-w-sm">
            سيتم التواصل معك فى خلال 24 ساعه لتاكيد الطلب
          </p>

          <Link
            href="/"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-base py-3.5 rounded-2xl  transition-all text-center"
          >
            العودة للرئيسية
          </Link>
        </div>
      ) : (
        /* WIZARD STEPS FORM */
        <main className="flex-1 w-full mx-auto px-6 md:px-12 pt-[52px] relative z-20 pb-24">
          {/* Outer Gray Layout Container */}
          <div className="sm:bg-[#f3f4f6] rounded-[32px] md:p-6 md:p-[52px]  flex flex-col gap-6">
            {/* Title at the Top-Right */}
            <div className="w-full text-right">
              <h2 className="font-bold text-xl md:text-2xl text-gray-900">
                1- خطوات إدخال البيانات
              </h2>
            </div>

            {/* Horizontal White Banner with Current Step Details */}
            <div className="bg-white flex gap-4 items-center rounded-2xl p-4  w-full">
              {/* Right Side: Circular Progress Ring (First in DOM -> Renders on the Right) */}
              <CircularProgress step={step + 1} size={45} />

              <div>
                <div className="flex gap-2 items-center">
                  {step === 0 ? (
                    <CarIcon />
                  ) : step === 1 ? (
                    <CarIcon />
                  ) : step === 2 ? (
                    <LocationIcon />
                  ) : step === 3 ? (
                    <CalendarIcon />
                  ) : (
                    <ClipboardIcon />
                  )}
                  <p className="font-semibold leading-[150%] max-sm:text-xs">
                    {step === 0
                      ? "تعرف على اول خطوة لبيع سياراتك"
                      : step === 1
                        ? "بيانات السيارة"
                        : step === 2
                          ? "الموقع"
                          : step === 3
                            ? "جدولة الفحص"
                            : "مراجعة الطلب"}
                  </p>
                </div>
                <p className="leading-[150%] text-gray-500 text-xs max-sm:text-[10px]">
                  {step === 0
                    ? "سجل بياناتك خطوة بخطوة"
                    : step === 1
                      ? "أدخل المعلومات الأساسية لسيارتك"
                      : step === 2
                        ? "حدد موقع السيارة للفحص"
                        : step === 3
                          ? "اختر الوقت المناسب لفحص السيارة"
                          : "تاكيد البيانات و اتمام الطلب"}
                </p>
              </div>
            </div>

            {/* Validation Alert Box */}
            {/* {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-4 rounded-xl text-right flex items-center gap-2 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                <span>{error}</span>
              </div>
            )} */}

            {/* Main White Card for Forms */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl border border-gray-100 md:p-6 p-4 flex flex-col gap-8 "
            >
              {/* STEP 0: INTRO SCREEN (Vertical List of Steps matching Figma layout) */}
              {step === 0 && <Step0 setStep={(v) => setStep(v)} />}

              {/* STEP 1: CAR DETAILS */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="text-right pb-2">
                    <h3 className="font-bold text-[16px] text-gray-900">
                      1 - بيانات السيارة
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand select */}
                    <Select
                      label="الماركة"
                      placeholder="اختر الماركة"
                      options={brands}
                      {...register("step1.brand")}
                      value={brandWatch}
                      error={errors.step1?.brand?.message}
                    />

                    {/* Model select */}
                    <Select
                      label="الموديل"
                      placeholder="اختر الموديل"
                      options={model_options}
                      {...register("step1.model")}
                      value={modelWatch}
                      error={errors.step1?.model?.message}
                    />

                    {/* Year select */}
                    <Select
                      label="سنة الصنع"
                      placeholder="اختر سنة الصنع"
                      options={years}
                      {...register("step1.year")}
                      value={yearWatch}
                      error={errors.step1?.year?.message}
                    />
                    {/* Mileage input */}
                    <NumberInput
                      label="الكيلومترات"
                      placeholder="مثال : 850000"
                      {...register("step1.mileage")}
                      error={errors.step1?.mileage?.message}
                    />

                    <div className="md:col-span-2">
                      {/* Chassis VIN (Egyptian 17 Chars) */}
                      <ChassisInput
                        label="رقم الشاسية"
                        {...register("step1.chassisNumber")}
                        error={errors.step1?.chassisNumber?.message}
                      />
                    </div>
                  </div>

                  <ActionsRow handleNext={handleNext} handleBack={handleBack} />
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div className="text-right border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-[16px] text-gray-900">
                      2 - الموقع
                    </h3>
                  </div>

                  {/* ----- Map Needs Fix ----- */}
                  <Map />
                  {/* ----- Map Needs Fix ----- */}

                  {/* Geolocation Button */}
                  <button
                    type="button"
                    onClick={handleDetermineLocation}
                    disabled={isLocating}
                    className="w-full h-12 bg-primary-50 hover:bg-primary-100 text-primary-500 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CompassIcon />
                    <span>تحدد موقعي الحالي تلقائياً</span>
                  </button>

                  {/* Address input */}
                  <Textarea
                    {...register("step2.address")}
                    placeholder="ادخل عنوانك"
                    error={errors.step2?.address?.message}
                    label="العنوان"
                    className="md:col-span-3 "
                    maxLength={150}
                  />

                  {/* Actions Row */}
                  <ActionsRow handleNext={handleNext} handleBack={handleBack} />
                </div>
              )}

              {/* STEP 3: SCHEDULE */}
              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <div className="text-right border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-[16px] text-gray-900">
                      جدولة الفحص
                    </h3>
                  </div>

                  {/* Month Selection with Chevron & Small Arrow Buttons */}
                  <div className="flex flex-col gap-4 text-right">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      {/* Right: Dropdown showing Month */}
                      <Select
                        placeholder="حدد التاريخ"
                        options={datesList.filter((d) => !d.isWeekend)}
                        {...register("step3.date")}
                        value={dateWatch}
                        className="sm:w-[200px] w-[140px] mr-auto"
                      />
                    </div>

                    {/* Date Scroll Cards Carousel */}
                    <div className="w-full">
                      <Carousel dir="rtl">
                        <CarouselNavigation
                          className="absolute top-0 right-0 -translate-y-17"
                          classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
                          alwaysShow
                        />
                        <CarouselContent>
                          {datesList.map((d) => {
                            return (
                              <CarouselItem key={d.id} className="w-fit pl-3">
                                {d.isWeekend ? (
                                  <div className="flex-none w-[62px] py-2 bg-gray-100 border border-gray-200/50 rounded-lg text-center flex flex-col gap-0.5 opacity-55 cursor-not-allowed select-none text-[#999]">
                                    <span className="text-[12px] font-medium">
                                      {d.dayName}
                                    </span>
                                    <span className="text-[18px] font-bold">
                                      {d.dayNumber}
                                    </span>
                                    <span className="text-[12px] font-medium">
                                      {d.monthName}
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setValue("step3.date", d.id, {
                                        shouldValidate: true,
                                      })
                                    }
                                    className={`flex-none w-[62px] py-2 rounded-lg text-center flex flex-col gap-0.5 transition-all cursor-pointer ${
                                      dateWatch === d.id
                                        ? "bg-primary-50 border border-primary-500 text-primary-500 font-bold"
                                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                                  >
                                    <span className="text-[12px] font-medium">
                                      {d.dayName}
                                    </span>
                                    <span className="text-[18px] font-bold">
                                      {d.dayNumber}
                                    </span>
                                    <span className="text-[12px] font-medium">
                                      {d.monthName}
                                    </span>
                                  </button>
                                )}
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="flex flex-col gap-3 text-right">
                    <h3 className="text-xs font-bold text-gray-800">
                      حدد الميعاد
                    </h3>

                    <div
                      className="flex flex-wrap items-center justify-end gap-3 w-full"
                      dir="ltr"
                    >
                      {timeSlots.map((time) => {
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setValue("step3.appointment", time, {
                                shouldValidate: true,
                              })
                            }
                            className={`w-[108px] h-11 rounded-lg text-center text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                              appointmentWatch === time
                                ? "bg-primary-50 border-primary-500 text-primary-500"
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-red-500">
                      {errors.step3?.date?.message}
                    </p>
                    <p className="text-red-500">
                      {errors.step3?.appointment?.message}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <ActionsRow handleNext={handleNext} handleBack={handleBack} />
                </div>
              )}

              {/* STEP 4: REVIEW REQUEST */}
              {step === 4 && (
                <div className="flex flex-col gap-6">
                  <div className="text-right border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-[16px] text-gray-900">
                      مراجعة الطلب
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Box 1: Car Details Recap */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3 text-right">
                      {/* Box Header */}
                      <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <CarIcon />
                          <span>بيانات السيارة</span>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
                        >
                          <EditIcon />
                          <span>تعديل</span>
                        </button>
                      </div>

                      {/* Box Items */}
                      <div className="flex flex-col gap-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">الماركة</span>
                          <span className="font-bold text-gray-900">
                            {formData.step1.brand}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">الموديل</span>
                          <span className="font-bold text-gray-900">
                            {formData.step1.model}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">السنة</span>
                          <span className="font-bold text-gray-900">
                            {formData.step1.year}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">الكيلو مترات</span>
                          <span className="font-bold text-gray-900">
                            {formData.step1.mileage} كم
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-50 pt-2.5">
                          <span className="font-mono font-bold text-gray-900 uppercase tracking-wide">
                            <span className="text-gray-500">رقم الشاسيه</span>
                            {formData.step1.chassisNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Box 2: Location Recap */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3 text-right">
                      {/* Box Header */}
                      <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <LocationIcon />
                          <span>الموقع</span>
                        </div>
                        <button
                          onClick={() => setStep(2)}
                          className="text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
                        >
                          <EditIcon />
                          <span>تعديل</span>
                        </button>
                      </div>

                      {/* Box Items */}
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-600 leading-relaxed">
                          {formData.step2.address}
                        </p>
                      </div>
                    </div>

                    {/* Box 3: Schedule Recap */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3 text-right">
                      {/* Box Header */}
                      <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <CalendarIcon />
                          <span>الموعد</span>
                        </div>
                        <button
                          onClick={() => setStep(3)}
                          className="text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
                        >
                          <EditIcon />
                          <span>تعديل</span>
                        </button>
                      </div>

                      {/* Box Items */}
                      <div className="flex flex-col gap-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">التاريخ</span>
                          <span className="font-bold text-gray-900">
                            {formData.step3.date}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">الوقت</span>
                          <span className="font-bold text-gray-900">
                            {formData.step3.appointment}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <ActionsRow
                    handleNext={handleNext}
                    handleBack={handleBack}
                    isLastStep={true}
                    isPending={isPending}
                  />
                </div>
              )}
            </form>
          </div>
        </main>
      )}
    </div>
  );
}
