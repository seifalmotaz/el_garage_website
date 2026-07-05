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
import { Controller, useForm } from "react-hook-form";
import {
  carSellFirstStepSchema,
  CarSellFirstStepSchemaType,
} from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { model_options } from "@/constants/car-filters";
import NumberInput from "@/components/form/NumberInput";
import ChassisInput from "@/components/form/ChassisInput";
import Textarea from "@/components/form/Textarea";
// import Map from "@/components/common/Map";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/common/Carousel";
import Dropdown from "@/components/common/Dropdown";

// Custom Inline SVG Icons matching the Figma nodes
const HomeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

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

const LocationIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 3V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ClipboardIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
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

const ChevronDownIcon = () => (
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
      d="M19 9l-7 7-7-7"
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
}: {
  handleBack: () => void;
  handleNext: () => void;
  isLastStep?: boolean;
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
      className="flex-1 md:w-40 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-sm font-bold transition-colors  text-center"
    >
      {isLastStep ? "تأكيد الطلب" : "التالي"}
    </button>
  </div>
);

const Banner = () => {
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
          بيع السيارة
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
            بيع السيارة
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function SellCarPage() {
  const [step, setStep] = useState(0); // 0: Intro, 1: Car Info, 2: Location, 3: Schedule, 4: Review, 5: Success
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [vin, setVin] = useState(["", "", "", ""]); // 4 inputs representing 4-4-4-5 chars
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Map state Simulation
  const [isLocating, setIsLocating] = useState(false);
  const [locationPulse, setLocationPulse] = useState(false);

  //
  const [firstStepFormData, setFirstStepFormData] = useState({
    brand: "",
    model: "",
    year: "",
    kilometer: "",
    Chassisnumber: "",
  });

  const handlefirstStepFormChange = (key: string, value: string) => {
    setFirstStepFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // form validation
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CarSellFirstStepSchemaType>({
    resolver: zodResolver(carSellFirstStepSchema),
  });

  const brandWatch = watch("brand");
  const modelWatch = watch("model");
  const yearWatch = watch("year");

  const [isPending, startTransition] = useTransition();

  // Refs for VIN input auto-tabbing
  const vinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const datesList = generateInspectionDates();

  // Reset Model when Brand changes
  useEffect(() => {
    setModel("");
  }, [brand]);

  // VIN auto-focusing & character limits
  const handleVinChange = (index: number, val: string) => {
    const maxChars = index === 3 ? 5 : 4;
    const cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, "");

    const newVin = [...vin];
    newVin[index] = cleanVal.slice(0, maxChars);
    setVin(newVin);

    // Auto-focus next field
    if (cleanVal.length >= maxChars && index < 3) {
      vinRefs[index + 1].current?.focus();
    }
  };

  const handleVinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Backspace empty field focuses previous field
    if (e.key === "Backspace" && vin[index] === "" && index > 0) {
      vinRefs[index - 1].current?.focus();
    }
  };

  // Simulate Geo Location Click
  const handleDetermineLocation = () => {
    setIsLocating(true);
    setLocationPulse(false);
    setTimeout(() => {
      setIsLocating(false);
      setAddress(
        "جمهورية مصر العربية، محافظة القاهرة، مصر الجديدة، شارع الثورة، مبنى 108",
      );
      setLocationPulse(true);
    }, 1000);
  };

  // Step Navigations
  const handleNext = () => {
    setStep(step + 1);
    // setError(null);
    // if (step === 1) {
    //   if (!brand || !model || !year || !mileage) {
    //     setError("برجاء إدخال كافة البيانات الأساسية للسيارة.");
    //     return;
    //   }
    //   const fullVinLength = vin.reduce((acc, curr) => acc + curr.length, 0);
    //   if (fullVinLength < 17) {
    //     setError("برجاء كتابة رقم الشاسيه كاملاً (17 حرف/رقم).");
    //     return;
    //   }
    // }
    // if (step === 2) {
    //   if (!address || address.trim().length < 10) {
    //     setError("برجاء إدخال عنوان تفصيلي صحيح لضمان وصول مندوب الفحص.");
    //     return;
    //   }
    // }
    // if (step === 3) {
    //   if (!selectedDate || !selectedTimeSlot) {
    //     setError("برجاء اختيار التاريخ وميعاد الفحص المناسبين لك.");
    //     return;
    //   }
    // }
    // if (step < 4) {
    //   setStep(step + 1);
    // } else if (step === 4) {
    //   // Submit form
    //   setStep(5);
    // }
  };

  const handleBack = () => {
    // setError(null);
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentSelectedDateObj = datesList.find((d) => d.id === selectedDate);

  return (
    <div className="relative flex flex-col min-h-screen  bg-white" dir="rtl">
      {/* Banner */}
      <Banner />

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
                    <CarIcon />
                  ) : step === 3 ? (
                    <CarIcon />
                  ) : (
                    <CarIcon />
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
            <div className="bg-white rounded-2xl border border-gray-100 md:p-6 p-4 flex flex-col gap-8 ">
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
                      {...register("brand")}
                      value={brandWatch}
                      error={errors.brand?.message}
                    />

                    {/* Model select */}
                    <Select
                      label="الموديل"
                      placeholder="اختر الموديل"
                      options={model_options}
                      {...register("model")}
                      value={modelWatch}
                      error={errors.model?.message}
                    />

                    {/* Year select */}
                    <Select
                      label="سنة الصنع"
                      placeholder="اختر سنة الصنع"
                      options={years}
                      {...register("year")}
                      value={yearWatch}
                      error={errors.year?.message}
                    />
                    {/* Mileage input */}
                    <NumberInput
                      label="الكيلومترات"
                      placeholder="مثال : 850000"
                      {...register("mileage")}
                      error={errors.mileage?.message}
                    />

                    <div className="md:col-span-2">
                      {/* Chassis VIN (Egyptian 17 Chars) */}
                      <ChassisInput
                        label="رقم الشاسية"
                        {...register("chassisNumber")}
                        error={errors.chassisNumber?.message}
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

                  {/* Interactive Map Layout matching Figma screenshots */}
                  {/* <div className="relative w-full h-[236px] rounded-2xl overflow-hidden bg-[#e0ecfc] flex items-center justify-center select-none ">
                    <div className="absolute inset-0 bg-[#e8f1fc] [background-image:linear-gradient(rgba(255,255,255,0.85)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.85)_1px,_transparent_1px)] [background-size:40px_40px]"></div>
                    <div className="absolute top-12 left-10 w-[300px] h-[3px] bg-white rotate-12 blur-[0.5px]"></div>
                    <div className="absolute top-24 right-20 w-[400px] h-[3px] bg-white -rotate-6 blur-[0.5px]"></div>
                    <div className="absolute top-4 bottom-4 left-1/3 w-[4px] bg-white blur-[0.5px]"></div>

                    <div className="absolute top-1/2 left-[30%] -translate-y-1/2 flex items-center justify-center">
                      <span className="absolute w-12 h-12 bg-primary-500/25 rounded-full animate-ping"></span>
                      <span className="absolute w-8 h-8 bg-primary-500/40 rounded-full"></span>
                      <span className="relative z-10 w-4 h-4 bg-primary-500 rounded-full border-2 border-white "></span>
                    </div>

                    <div className="absolute bottom-4 right-4 z-20">
                      <span className="bg-white/95 px-3 py-1 text-xs font-bold text-gray-600 rounded-lg  border border-gray-100">
                        المنصورة، مصر
                      </span>
                    </div>
                  </div> */}
                  <Map />

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
                    // {...register("address")}
                    placeholder="ادخل عنوانك"
                    // error={errors.address?.message}
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
                      <Dropdown
                        option={selectedDate}
                        placeholder="حدد التاريخ"
                        options={datesList}
                        setOption={(val) => setSelectedDate(val)}
                        variant="white"
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
                            const isSelected = selectedDate === d.id;

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
                                    onClick={() => setSelectedDate(d.id)}
                                    className={`flex-none w-[62px] py-2 rounded-lg text-center flex flex-col gap-0.5 transition-all cursor-pointer ${
                                      isSelected
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
                        const isSelected = selectedTimeSlot === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTimeSlot(time)}
                            className={`w-[108px] h-11 rounded-lg text-center text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                              isSelected
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
                            {brand}brand
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">الموديل</span>
                          <span className="font-bold text-gray-900">
                            {model}model
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">السنة</span>
                          <span className="font-bold text-gray-900">
                            {year}year
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">الكيلو مترات</span>
                          <span className="font-bold text-gray-900">
                            {mileage} كم
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-50 pt-2.5">
                          <span className="font-mono font-bold text-gray-900 uppercase tracking-wide">
                            <span className="text-gray-500">رقم الشاسيه</span>
                            {vin.join(" - ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Box 2: Location Recap */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3 text-right">
                      {/* Box Header */}
                      <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <LocationIcon className="w-5 h-5 text-primary-500" />
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
                          {address}address
                        </p>
                      </div>
                    </div>

                    {/* Box 3: Schedule Recap */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3 text-right">
                      {/* Box Header */}
                      <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <CalendarIcon className="w-5 h-5 text-primary-500" />
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
                            {currentSelectedDateObj
                              ? `${currentSelectedDateObj.dayName} ${currentSelectedDateObj.dayNumber}/${currentSelectedDateObj.monthName}/${currentSelectedDateObj.year}`
                              : selectedDate}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">الوقت</span>
                          <span className="font-bold text-gray-900">
                            {selectedTimeSlot}
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
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
