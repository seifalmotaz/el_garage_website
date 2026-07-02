"use client";

import { useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const filterFields = [
    { label: "الحالة", placeholder: "جديد / مستعمل" },
    { label: "الماركة", placeholder: "حدد الماركة" },
    { label: "الموديل", placeholder: "حدد الموديل" },
    { label: "الإصدار", placeholder: "منذ سنة" },
    { label: "ناقل الحركة", placeholder: "أوتوماتيك / مانيوال" },
    { label: "الكيلومتر(كم)", placeholder: "منذ سنة" },
  ];

  return (
    <section className="relative w-full min-h-[820px] flex flex-col items-center justify-center pt-28 lg:pt-32 pb-16 px-4 overflow-hidden bg-white lg:bg-transparent">

      {/* Background Images and Gradients - Hidden on Mobile */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <Image
          src="/assets/hero_bg.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-primary-500/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-primary-800/20" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-[1336px] flex flex-col items-center gap-8 lg:gap-12 mt-4 lg:mt-12">

        {/* Headings */}
        <div className="text-center text-primary-800 lg:text-white flex flex-col gap-4 max-w-[900px]">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight lg:drop-shadow-md">
            بيع و اشتري سيارتك مع الجراج بأفضل سعر وأكثر ثقة
          </h1>
          <p className="text-sm md:text-xl text-gray-500 lg:text-white/90 font-medium leading-relaxed lg:drop-shadow-sm">
            أكثر من 1,200 سيارة مفحوصة ومعتمدة. ابحث، قارن، واشتري بثقة مع ضمان الفحص الاحترافي.
          </p>
        </div>

        {/* Mobile Standalone Image Card */}
        <div className="relative w-full max-w-[335px] aspect-[335/148] rounded-[24px] overflow-hidden lg:hidden shadow-sm">
          <Image
            src="/assets/hero_bg_decor2.png"
            alt="elGARAGE Handshake"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Filter Card Container */}
        <div className="w-full flex flex-col items-center gap-6">

          {/* Search Type Row (البحث حسب) */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 text-gray-900 lg:text-white bg-white lg:bg-transparent p-4 lg:p-0 rounded-[20px] shadow-sm lg:shadow-none border border-gray-100 lg:border-none w-full max-w-[335px] lg:max-w-none">
            <span className="text-sm font-bold lg:font-medium text-right w-full lg:w-auto">البحث حسب :</span>
            <div className="bg-[#FAFAFA] lg:backdrop-blur-md lg:bg-black/25 border border-gray-200/50 lg:border-white/10 rounded-2xl p-1 flex gap-2 w-full lg:w-[320px]">
              <button 
                onClick={() => setActiveTab("buy")}
                className={`flex-1 text-center py-2.5 lg:py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "buy"
                    ? "bg-white text-primary-500 shadow-sm font-bold"
                    : "text-gray-500 lg:text-gray-200 hover:text-gray-800 lg:hover:text-white"
                }`}
              >
                نوع السيارة
              </button>
              <button 
                onClick={() => setActiveTab("sell")}
                className={`flex-1 text-center py-2.5 lg:py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "sell"
                    ? "bg-white text-primary-500 shadow-sm font-bold"
                    : "text-gray-500 lg:text-gray-200 hover:text-gray-800 lg:hover:text-white"
                }`}
              >
                تفاصيل السيارة
              </button>
            </div>
          </div>

          {/* Filters Form */}
          <div className="w-full max-w-[335px] lg:max-w-none bg-white lg:backdrop-blur-lg lg:bg-black/40 border border-gray-100 lg:border-white/15 rounded-[24px] p-6 lg:p-8 flex flex-col gap-6 shadow-md lg:shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {filterFields.map((field, index) => (
                <div key={index} className="flex flex-col gap-2 text-right">
                  <label className="text-gray-900 lg:text-white text-xs font-semibold px-1">
                    {field.label}
                  </label>
                  <div className="relative bg-[#FAFAFA] lg:bg-black/30 border border-gray-200/60 lg:border-white/10 rounded-2xl h-[50px] flex items-center justify-between px-3 cursor-pointer group hover:border-gray-300 lg:hover:border-white/30 transition-colors">
                    <Image
                      src="/assets/chevron_down.svg"
                      alt="down"
                      width={12}
                      height={6}
                      className="opacity-70 group-hover:opacity-100 transition-opacity invert lg:invert-0"
                    />
                    <span className="text-gray-800 lg:text-gray-300 text-xs font-light">
                      {field.placeholder}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Button */}
            <div className="flex justify-center w-full">
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm h-12 w-full lg:max-w-[420px] rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span>عرض النتائج</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
