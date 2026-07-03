"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DownloadApp from "../../components/DownloadApp";

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

const CarIcon = ({ className = "w-5 h-5" }) => (
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
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 17h10M19 17h1a1 1 0 001-1v-3.5a1 1 0 00-1-1h-1.5l-2.23-4.46A1 1 0 0015.38 6H8.62a1 1 0 00-.89.54L5.5 11H4a1 1 0 00-1 1v4a1 1 0 001 1h1"
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
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
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

// Egyptian Cities & Brands Mock Data matching cars browse page
const brands = [
  { ar: "تويوتا", en: "Toyota" },
  { ar: "بي إم دبليو", en: "BMW" },
  { ar: "مرسيدس بنز", en: "Mercedes" },
  { ar: "بورش", en: "Porsche" },
  { ar: "أودي", en: "Audi" },
  { ar: "هيونداي", en: "Hyundai" },
  { ar: "كيا", en: "Kia" },
  { ar: "هوندا", en: "Honda" },
  { ar: "لاند روفر", en: "Land Rover" },
  { ar: "شيري", en: "Chery" },
  { ar: "ميني كوبر", en: "Mini Cooper" },
];

const brandModels: Record<string, string[]> = {
  تويوتا: ["كورولا هايلاند", "ياريس", "لاند كروزر", "كامري"],
  "بي إم دبليو": ["320i M Sport", "X5", "520i", "740i"],
  "مرسيدس بنز": ["C200 AMG Line", "E300 AMG", "S500", "A200"],
  بورش: ["كايين كابريو", "باناميرا", "911 كاريرا"],
  أودي: ["A4 Highline", "Q8 Sportback", "A6"],
  هيونداي: ["توسان Smart Plus", "إلنترا CN7", "أكسنت HCI"],
  كيا: ["سبورتاج Topline", "سيراتو", "سورينتو"],
  هوندا: ["سيفيك الرياضية", "أكورد e:HEV", "CR-V"],
  "لاند روفر": ["رينج روفر فوج اس اي", "رينج روفر سبورت", "ديفندر"],
  شيري: ["تيجو 8 برو", "تيجو 7", "أريزو 5"],
  "ميني كوبر": ["S Countryman", "hatch 3 doors"],
};

const years = Array.from({ length: 37 }, (_, i) => String(2026 - i));

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

  for (let i = 1; i <= 14; i++) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + i);

    dates.push({
      id: nextDate.toISOString().split("T")[0],
      dayName: arabicDays[nextDate.getDay()],
      dayNumber: nextDate.getDate(),
      monthName: arabicMonths[nextDate.getMonth()],
      year: nextDate.getFullYear(),
      isWeekend: nextDate.getDay() === 5, // Disable Friday (الجمعة) as in Egypt weekends/inspectors rest
      rawDate: nextDate,
    });
  }
  return dates;
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
    setError(null);

    if (step === 1) {
      if (!brand || !model || !year || !mileage) {
        setError("برجاء إدخال كافة البيانات الأساسية للسيارة.");
        return;
      }
      const fullVinLength = vin.reduce((acc, curr) => acc + curr.length, 0);
      if (fullVinLength < 17) {
        setError("برجاء كتابة رقم الشاسيه كاملاً (17 حرف/رقم).");
        return;
      }
    }

    if (step === 2) {
      if (!address || address.trim().length < 10) {
        setError("برجاء إدخال عنوان تفصيلي صحيح لضمان وصول مندوب الفحص.");
        return;
      }
    }

    if (step === 3) {
      if (!selectedDate || !selectedTimeSlot) {
        setError("برجاء اختيار التاريخ وميعاد الفحص المناسبين لك.");
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Submit form
      setStep(5);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentSelectedDateObj = datesList.find((d) => d.id === selectedDate);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#F9FAFB]" dir="rtl">
      {/* Absolute Navbar Overlay */}
      {/* <Header activeHref="/sell" variant="dark" /> */}

      {/* Hero Header Area with Image and Deep Gradients matching Figma */}
      <section className="relative w-full h-[320px] md:h-[427px] flex items-center justify-center overflow-hidden z-0">
        {/* Background Image */}
        <Image
          src="/assets/hero_bg.png"
          alt="elGARAGE background"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient Overlays matching Figma values */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002853]/95 to-[#002ec1]/80 mix-blend-multiply z-10" />
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundImage:
              "linear-gradient(1.40863deg, rgba(0, 16, 69, 0.95) 9.2144%, rgba(0, 22, 91, 0.447) 67.797%, rgba(0, 0, 0, 0) 96.227%)",
          }}
        />

        {/* Banner Details */}
        <div className="relative z-20 w-full max-w-[1336px] mx-auto px-6 md:px-12 flex flex-col items-center justify-end h-full pb-20 md:pb-24 text-center">
          <h1 className="font-bold text-3xl md:text-[40px] text-white mb-3">
            بيع سيارة
          </h1>
          <nav className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-300 font-medium">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <HomeIcon />
              <span>الصفحة الرئيسية</span>
            </Link>
            <span>/</span>
            <span className="text-white">بيع سيارة</span>
          </nav>
        </div>
      </section>

      {/* Main Content Area */}
      {step === 5 ? (
        /* SUCCESS PAGE - Centered Visual Flow Layout */
        <main className="flex-1 w-full max-w-[1336px] mx-auto px-6 md:px-12 relative z-20 mt-[-80px] md:mt-[-100px] pb-24 flex flex-col items-center justify-center">
          <div className="bg-white border border-gray-100/80 rounded-2xl py-12 px-6 md:px-12 w-full max-w-[495px] flex flex-col items-center justify-center text-center shadow-xl">
            {/* Success Confetti Circle Illustration */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              {/* Confetti lines */}
              <div className="absolute inset-0 bg-[#eef8f4] rounded-full scale-75 z-0" />
              <div className="absolute inset-0 rounded-full border border-emerald-100 scale-95 z-0 animate-pulse" />
              {/* Confetti vectors */}
              <svg
                className="absolute w-full h-full text-emerald-500/20"
                viewBox="0 0 100 100"
              >
                <circle cx="15" cy="40" r="3" fill="currentColor" />
                <circle cx="85" cy="30" r="3" fill="currentColor" />
                <circle cx="75" cy="80" r="4" fill="currentColor" />
                <path
                  d="M 20 70 L 30 75"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 80 60 L 90 55"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {/* Checkmark in circle */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h3 className="font-bold text-[20px] md:text-[22px] text-gray-900 mb-2">
              تم استلام طلبك بنجاح!
            </h3>
            <p className="text-[16px] text-gray-500 font-semibold mb-1">
              شكراً لتسجيل سيارتك في منصة الجراج
            </p>
            <p className="text-[12px] text-gray-400 leading-relaxed mb-8 max-w-sm">
              سيتم التواصل معك فى خلال 24 ساعه لتاكيد الطلب
            </p>

            <Link
              href="/"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-base py-3.5 rounded-2xl shadow-md transition-all text-center"
            >
              العودة للرئيسية
            </Link>
          </div>
        </main>
      ) : (
        /* WIZARD STEPS FORM */
        <main className="flex-1 w-full max-w-[1336px] mx-auto px-6 md:px-12 relative z-20 mt-[-80px] md:mt-[-100px] pb-24">
          {/* Outer Gray Layout Container */}
          <div className="bg-[#f3f4f6] rounded-[32px] p-6 md:p-[52px] shadow-md flex flex-col gap-6">
            {/* Title at the Top-Right */}
            <div className="w-full text-right">
              <h2 className="font-bold text-xl md:text-2xl text-gray-900">
                1- خطوات إدخال البيانات
              </h2>
            </div>

            {/* Horizontal White Banner with Current Step Details */}
            <div className="bg-white border border-gray-150 rounded-2xl p-4 flex items-center justify-between shadow-xs w-full">
              {/* Right Side: Circular Progress Ring (First in DOM -> Renders on the Right) */}
              <div className="flex items-center justify-center shrink-0">
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-[2px] border-primary-50"></span>
                  <span className="absolute inset-0 rounded-full border-[2.5px] border-primary-500 border-t-transparent animate-spin duration-1000 hidden"></span>
                  <div className="w-10 h-10 rounded-full border-[1.5px] border-primary-500 flex items-center justify-center text-sm font-bold text-primary-500">
                    {step === 0 && "1/5"}
                    {step === 1 && "2/5"}
                    {step === 2 && "3/5"}
                    {step === 3 && "4/5"}
                    {step === 4 && "5/5"}
                  </div>
                </div>
              </div>

              {/* Left Side: Step Title, Subtitle, and Icon (Second in DOM -> Renders on the Left) */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h3 className="text-sm md:text-base font-bold text-gray-900">
                    {step === 0 && "تعرف على اول خطوة لبيع سياراتك"}
                    {step === 1 && "بيانات السيارة"}
                    {step === 2 && "الموقع"}
                    {step === 3 && "جدولة الفحص"}
                    {step === 4 && "مراجعة الطلب"}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    {step === 0 && "سجل بياناتك خطوة بخطوة"}
                    {step === 1 && "أدخل المعلومات الأساسية لسيارتك"}
                    {step === 2 && "حدد موقع السيارة للفحص"}
                    {step === 3 && "اختر الوقت المناسب لفحص السيارة"}
                    {step === 4 && "تأكيد البيانات وإتمام الطلب"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                  {step === 0 && <CarIcon />}
                  {step === 1 && <CarIcon />}
                  {step === 2 && <LocationIcon />}
                  {step === 3 && <CalendarIcon />}
                  {step === 4 && <ClipboardIcon />}
                </div>
              </div>
            </div>

            {/* Validation Alert Box */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-4 rounded-xl text-right flex items-center gap-2 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Main White Card for Forms */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col gap-8 shadow-sm">
              {/* STEP 0: INTRO SCREEN (Vertical List of Steps matching Figma layout) */}
              {step === 0 && (
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
                    <div className="flex flex-col sm:flex-row items-center justify-between border border-gray-100 hover:border-primary-100 bg-[#FAFBFD] p-5 rounded-2xl gap-4 text-right transition-all duration-200 hover:shadow-xs group">
                      {/* Right: Illustration icon (First in DOM -> Renders on the Right) */}
                      <div className="w-[67px] h-[67px] relative shrink-0">
                        <Image
                          src="/assets/order_ride_rafiki.png"
                          alt="إدخال البيانات"
                          width={67}
                          height={67}
                          className="object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                      {/* Left: Text details (Second in DOM -> Renders on the Left) */}
                      <div className="flex-1">
                        <h4 className="font-bold text-base text-gray-900 mb-1">
                          1- إدخال البيانات
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
                          يدخل المستخدم بياناته الاساسية ومعلومات السيارة بدقة
                          وشفافيى لضمان أفضل تقييم
                        </p>
                      </div>
                    </div>

                    {/* Row 2: Appointment Coordination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border border-gray-100 hover:border-primary-100 bg-[#FAFBFD] p-5 rounded-2xl gap-4 text-right transition-all duration-200 hover:shadow-xs group">
                      {/* Right: Illustration (First in DOM -> Renders on the Right) */}
                      <div className="w-[67px] h-[67px] relative shrink-0">
                        <Image
                          src="/assets/city_driver_rafiki.png"
                          alt="التنسيق والموعد"
                          width={67}
                          height={67}
                          className="object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                      {/* Left: Text details (Second in DOM -> Renders on the Left) */}
                      <div className="flex-1">
                        <h4 className="font-bold text-base text-gray-900 mb-1">
                          2- التنسيق والموعد
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
                          بتواصل فريقنا مع المستخدم لتأكيد التفاصيل وتحديد موعد
                          مناسب للمعاينة
                        </p>
                      </div>
                    </div>

                    {/* Row 3: Inspection & Payment */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border border-gray-100 hover:border-primary-100 bg-[#FAFBFD] p-5 rounded-2xl gap-4 text-right transition-all duration-200 hover:shadow-xs group">
                      {/* Right: Illustration (First in DOM -> Renders on the Right) */}
                      <div className="w-[67px] h-[67px] relative shrink-0">
                        <Image
                          src="/assets/car_finance_rafiki.png"
                          alt="المعاينة والدفع"
                          width={67}
                          height={67}
                          className="object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                      {/* Left: Text details (Second in DOM -> Renders on the Left) */}
                      <div className="flex-1">
                        <h4 className="font-bold text-base text-gray-900 mb-1">
                          3- المعاينة والدفع
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
                          تتم المقابلة والمعاينة الواقعية للسيارة ثم تحصيل
                          المبلغ المتفق عليه
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row (Right-aligned matching Figma button) */}
                  <div className="flex items-center justify-start mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-base px-10 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
                    >
                      متابعة
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1: CAR DETAILS */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="text-right border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-[16px] text-gray-900">
                      1-بيانات السيارة
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Brand select */}
                    <div className="flex flex-col gap-2 text-right relative">
                      <label className="text-sm font-semibold text-gray-800">
                        الماركة
                      </label>
                      <div className="relative">
                        <select
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="w-full h-[50px] pr-4 pl-10 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-primary-500 text-gray-800 appearance-none"
                        >
                          <option value="">اختر الماركة</option>
                          {brands.map((b) => (
                            <option key={b.en} value={b.ar}>
                              {b.ar}
                            </option>
                          ))}
                        </select>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>

                    {/* Model select */}
                    <div className="flex flex-col gap-2 text-right relative">
                      <label className="text-sm font-semibold text-gray-800">
                        الموديل
                      </label>
                      <div className="relative">
                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          disabled={!brand}
                          className="w-full h-[50px] pr-4 pl-10 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-400 text-gray-800 appearance-none"
                        >
                          <option value="">اختر الموديل</option>
                          {brand &&
                            brandModels[brand]?.map((mod) => (
                              <option key={mod} value={mod}>
                                {mod}
                              </option>
                            ))}
                        </select>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>

                    {/* Year select */}
                    <div className="flex flex-col gap-2 text-right relative">
                      <label className="text-sm font-semibold text-gray-800">
                        سنة الصنع
                      </label>
                      <div className="relative">
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full h-[50px] pr-4 pl-10 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-primary-500 text-gray-800 appearance-none"
                        >
                          <option value="">اختر سنة الصنع</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mileage input */}
                  <div className="flex flex-col gap-2 text-right max-w-md relative">
                    <label className="text-sm font-semibold text-gray-800">
                      الكيلومترات
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="مثال : 850000"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        className="w-full h-[50px] pr-4 pl-12 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-primary-500 text-gray-800"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center text-gray-400 scale-75 select-none pointer-events-none">
                        ▲ ▼
                      </span>
                    </div>
                  </div>

                  {/* Chassis VIN (Egyptian 17 Chars) */}
                  <div className="flex flex-col gap-3 text-right border-t border-gray-100 pt-6">
                    <label className="text-sm font-semibold text-gray-800">
                      رقم الشاسيه
                    </label>

                    <div
                      className="flex items-center gap-3 max-w-lg mt-1"
                      dir="ltr"
                    >
                      {vin.map((val, idx) => (
                        <input
                          key={idx}
                          ref={vinRefs[idx]}
                          type="text"
                          placeholder={idx === 3 ? "WWWWW" : "WWWW"}
                          maxLength={idx === 3 ? 5 : 4}
                          value={val}
                          onChange={(e) => handleVinChange(idx, e.target.value)}
                          onKeyDown={(e) => handleVinKeyDown(idx, e)}
                          className="flex-1 h-[50px] text-center border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-primary-500 text-gray-800 uppercase tracking-wide bg-white"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions Row (Aligned left: [التالي] [السابق]) */}
                  <div className="flex items-center justify-start gap-4 mt-8 border-t border-gray-100 pt-6 md:mr-auto w-full md:w-auto">
                    <button
                      onClick={handleNext}
                      className="flex-1 md:w-40 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-sm font-bold transition-colors shadow-sm text-center"
                    >
                      التالي
                    </button>
                    <button
                      onClick={handleBack}
                      className="flex-1 md:w-40 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-sm font-bold transition-colors text-center"
                    >
                      السابق
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div className="text-right border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-[16px] text-gray-900">
                      2-الموقع
                    </h3>
                  </div>

                  {/* Interactive Map Layout matching Figma screenshots */}
                  <div className="relative w-full h-[236px] rounded-2xl overflow-hidden bg-[#e0ecfc] border border-blue-150 flex items-center justify-center select-none shadow-xs">
                    {/* Simulating figma style maps with real outline assets or CSS grids */}
                    <div className="absolute inset-0 bg-[#e8f1fc] [background-image:linear-gradient(rgba(255,255,255,0.85)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.85)_1px,_transparent_1px)] [background-size:40px_40px]"></div>
                    <div className="absolute top-12 left-10 w-[300px] h-[3px] bg-white rotate-12 blur-[0.5px]"></div>
                    <div className="absolute top-24 right-20 w-[400px] h-[3px] bg-white -rotate-6 blur-[0.5px]"></div>
                    <div className="absolute top-4 bottom-4 left-1/3 w-[4px] bg-white blur-[0.5px]"></div>

                    {/* Simulated Location Dot / Pin Marker */}
                    <div className="absolute top-1/2 left-[30%] -translate-y-1/2 flex items-center justify-center">
                      <span className="absolute w-12 h-12 bg-primary-500/25 rounded-full animate-ping"></span>
                      <span className="absolute w-8 h-8 bg-primary-500/40 rounded-full"></span>
                      <span className="relative z-10 w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-md"></span>
                    </div>

                    <div className="absolute bottom-4 right-4 z-20">
                      <span className="bg-white/95 px-3 py-1 text-xs font-bold text-gray-600 rounded-lg shadow-sm border border-gray-100">
                        المنصورة، مصر
                      </span>
                    </div>
                  </div>

                  {/* Geolocation Button */}
                  <button
                    type="button"
                    onClick={handleDetermineLocation}
                    disabled={isLocating}
                    className="w-full h-12 bg-primary-50 hover:bg-primary-100 text-primary-500 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 border border-primary-100/50"
                  >
                    <CompassIcon />
                    <span>تحدد موقعي الحالي تلقائياً</span>
                  </button>

                  {/* Address input */}
                  <div className="flex flex-col gap-2 text-right">
                    <label className="text-sm font-semibold text-gray-800">
                      العنوان
                    </label>
                    <textarea
                      rows={3}
                      placeholder="ادخل عنوانك"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-primary-500 text-gray-800 leading-relaxed shadow-xs"
                    />
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-start gap-4 mt-8 border-t border-gray-100 pt-6 md:mr-auto w-full md:w-auto">
                    <button
                      onClick={handleNext}
                      className="flex-1 md:w-40 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-sm font-bold transition-colors shadow-sm text-center"
                    >
                      التالي
                    </button>
                    <button
                      onClick={handleBack}
                      className="flex-1 md:w-40 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-sm font-bold transition-colors text-center"
                    >
                      السابق
                    </button>
                  </div>
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
                      {/* Left: Left/Right navigators */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-center text-primary-500 font-bold transition-colors"
                        >
                          &lt;
                        </button>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-center text-primary-500 font-bold transition-colors"
                        >
                          &gt;
                        </button>
                      </div>

                      {/* Right: Dropdown showing Month */}
                      <div className="flex items-center gap-2">
                        <div className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-gray-800 shadow-xs cursor-pointer select-none">
                          <ChevronDownIcon />
                          <span>أبريل 2025</span>
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          حدد التاريخ
                        </span>
                      </div>
                    </div>

                    {/* Date Scroll Cards Carousel */}
                    <div className="w-full overflow-x-auto flex gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                      {datesList.map((d) => {
                        const isSelected = selectedDate === d.id;
                        if (d.isWeekend) {
                          return (
                            <div
                              key={d.id}
                              className="flex-none w-[62px] py-2 bg-gray-100 border border-gray-200/50 rounded-lg text-center flex flex-col gap-0.5 opacity-55 cursor-not-allowed select-none text-[#999]"
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
                            </div>
                          );
                        }

                        return (
                          <button
                            key={d.id}
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
                        );
                      })}
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
                  <div className="flex items-center justify-start gap-4 mt-8 border-t border-gray-100 pt-6 md:mr-auto w-full md:w-auto">
                    <button
                      onClick={handleNext}
                      className="flex-1 md:w-40 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-sm font-bold transition-colors shadow-sm text-center"
                    >
                      التالي
                    </button>
                    <button
                      onClick={handleBack}
                      className="flex-1 md:w-40 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-sm font-bold transition-colors text-center"
                    >
                      السابق
                    </button>
                  </div>
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
                        <button
                          onClick={() => setStep(1)}
                          className="text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
                        >
                          <EditIcon />
                          <span>تعديل</span>
                        </button>
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <span>بيانات السيارة</span>
                          <CarIcon className="w-5 h-5 text-primary-500" />
                        </div>
                      </div>

                      {/* Box Items */}
                      <div className="flex flex-col gap-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">
                            {brand}
                          </span>
                          <span className="text-gray-500">الماركة</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">
                            {model}
                          </span>
                          <span className="text-gray-500">الموديل</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">
                            {year}
                          </span>
                          <span className="text-gray-500">السنة</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">
                            {mileage} كم
                          </span>
                          <span className="text-gray-500">الكيلو مترات</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-50 pt-2.5">
                          <span className="font-mono font-bold text-gray-900 uppercase tracking-wide">
                            {vin.join(" - ")}
                          </span>
                          <span className="text-gray-500">رقم الشاسيه</span>
                        </div>
                      </div>
                    </div>

                    {/* Box 2: Location Recap */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3 text-right">
                      {/* Box Header */}
                      <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                        <button
                          onClick={() => setStep(2)}
                          className="text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
                        >
                          <EditIcon />
                          <span>تعديل</span>
                        </button>
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <span>الموقع</span>
                          <LocationIcon className="w-5 h-5 text-primary-500" />
                        </div>
                      </div>

                      {/* Box Items */}
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-600 leading-relaxed">
                          {address}
                        </p>
                      </div>
                    </div>

                    {/* Box 3: Schedule Recap */}
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white flex flex-col gap-3 text-right">
                      {/* Box Header */}
                      <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                        <button
                          onClick={() => setStep(3)}
                          className="text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
                        >
                          <EditIcon />
                          <span>تعديل</span>
                        </button>
                        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                          <span>الموعد</span>
                          <CalendarIcon className="w-5 h-5 text-primary-500" />
                        </div>
                      </div>

                      {/* Box Items */}
                      <div className="flex flex-col gap-2.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">
                            {currentSelectedDateObj
                              ? `${currentSelectedDateObj.dayName} ${currentSelectedDateObj.dayNumber}/${currentSelectedDateObj.monthName}/${currentSelectedDateObj.year}`
                              : selectedDate}
                          </span>
                          <span className="text-gray-500">التاريخ</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">
                            {selectedTimeSlot}
                          </span>
                          <span className="text-gray-500">الوقت</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-start gap-4 mt-8 border-t border-gray-100 pt-6 md:mr-auto w-full md:w-auto">
                    <button
                      onClick={handleNext}
                      className="flex-1 md:w-40 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-sm font-bold transition-colors shadow-sm text-center"
                    >
                      تأكيد الطلب
                    </button>
                    <button
                      onClick={handleBack}
                      className="flex-1 md:w-40 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-sm font-bold transition-colors text-center"
                    >
                      السابق
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* QR Code / App Download Section */}
      <DownloadApp />
    </div>
  );
}
