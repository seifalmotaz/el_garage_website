"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./common/MaxWidthWrapper";

export default function Services() {
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");

  const sellSteps = [
    {
      title: "إدخال البيانات",
      description:
        "يدخل المستخدم بياناته الأساسية ومعلومات السيارة بدقة وشفافية لضمان أفضل تقييم.",
      illustration: (
        <div className="relative w-40 h-40 overflow-hidden select-none">
          <div className="absolute inset-[0_-12.45%_20.01%_-2.99%]">
            <Image
              src="/assets/services_bg_3.svg"
              alt="bg"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[80.79%_0.5%_13.98%_9.97%]">
            <Image
              src="/assets/services_shadow_3.svg"
              alt="shadow"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[11.51%_3.79%_16.4%_56.13%]">
            <Image
              src="/assets/services_device_3.svg"
              alt="device"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[35.64%_34.04%_16.4%_18.69%]">
            <Image
              src="/assets/services_character_2.svg"
              alt="character"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[50.46%_66.06%_34.94%_21.35%]">
            <Image
              src="/assets/services_backpack_3.svg"
              alt="backpack"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[69.72%_78.65%_16.39%_12.71%]">
            <Image
              src="/assets/services_trash_3.svg"
              alt="trash"
              fill
              className="object-contain"
            />
          </div>
        </div>
      ),
    },
    {
      title: "التنسيق و الموعد",
      description:
        "يتواصل فريقنا مع المستخدم لتأكيد التفاصيل وتحديد موعد مناسب للمعاينة.",
      illustration: (
        <div className="relative w-40 h-40 overflow-hidden select-none">
          <div className="absolute inset-[2.04%_-7.72%_17.97%_-7.72%]">
            <Image
              src="/assets/services_bg_2.svg"
              alt="bg"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[82.83%_5.24%_11.94%_5.23%]">
            <Image
              src="/assets/services_shadow_2.svg"
              alt="shadow"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[15.8%_9.31%_14.55%_55.62%]">
            <Image
              src="/assets/services_phone_2.svg"
              alt="phone"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[47.45%_15.95%_14.55%_10.01%]">
            <Image
              src="/assets/services_car_2.svg"
              alt="car"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[22.85%_22.78%_61.88%_65.39%]">
            <Image
              src="/assets/services_pin_2.svg"
              alt="pin"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[33.83%_28.1%_13.48%_54%]">
            <Image
              src="/assets/services_character_3.svg"
              alt="character"
              fill
              className="object-contain"
            />
          </div>
        </div>
      ),
    },
    {
      title: "المعاينة و الدفع",
      description:
        "تتم المقابلة والمعاينة الواقعية للسيارة ثم تحصيل المبلغ المتفق عليه.",
      illustration: (
        <div className="relative w-40 h-40 overflow-hidden select-none">
          <div className="absolute inset-[11%_-4.15%_13.73%_-4.48%]">
            <Image
              src="/assets/services_bg_1.svg"
              alt="bg"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[86.9%_8.04%_8.18%_7.71%]">
            <Image
              src="/assets/services_shadow_1.svg"
              alt="shadow"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[49.37%_10.05%_10.52%_71.51%]">
            <Image
              src="/assets/services_character_1.svg"
              alt="character"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[22.81%_22.66%_31.27%_41.09%]">
            <Image
              src="/assets/services_clipboard_1.svg"
              alt="clipboard"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[53.09%_27.59%_42.96%_62.19%]">
            <Image
              src="/assets/services_stamp_1.svg"
              alt="stamp"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[37.4%_51.28%_41.89%_29.01%]">
            <Image
              src="/assets/services_keys_1.svg"
              alt="keys"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[59.4%_28.56%_10.09%_11.43%]">
            <Image
              src="/assets/services_car_1.svg"
              alt="car"
              fill
              className="object-contain"
            />
          </div>
        </div>
      ),
    },
  ];

  const buySteps = [
    {
      title: "تصفح السيارات",
      description:
        "تصفح مجموعة واسعة من السيارات المفحوصة بدقة مع صور وتقارير فحص كاملة.",
      illustration: (
        <div className="relative w-40 h-40 overflow-hidden select-none">
          <div className="absolute inset-[0_-12.45%_20.01%_-2.99%]">
            <Image
              src="/assets/services_bg_3.svg"
              alt="bg"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[80.79%_0.5%_13.98%_9.97%]">
            <Image
              src="/assets/services_shadow_3.svg"
              alt="shadow"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[11.51%_3.79%_16.4%_56.13%]">
            <Image
              src="/assets/services_device_3.svg"
              alt="device"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[35.64%_34.04%_16.4%_18.69%]">
            <Image
              src="/assets/services_character_2.svg"
              alt="character"
              fill
              className="object-contain"
            />
          </div>
        </div>
      ),
    },
    {
      title: "الفحص والمعاينة",
      description:
        "حدد موعداً لمعاينة السيارة على الطبيعة وتأكد من حالتها بنفسك بمساعدة خبرائنا.",
      illustration: (
        <div className="relative w-40 h-40 overflow-hidden select-none">
          <div className="absolute inset-[2.04%_-7.72%_17.97%_-7.72%]">
            <Image
              src="/assets/services_bg_2.svg"
              alt="bg"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[82.83%_5.24%_11.94%_5.23%]">
            <Image
              src="/assets/services_shadow_2.svg"
              alt="shadow"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[15.8%_9.31%_14.55%_55.62%]">
            <Image
              src="/assets/services_phone_2.svg"
              alt="phone"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[22.85%_22.78%_61.88%_65.39%]">
            <Image
              src="/assets/services_pin_2.svg"
              alt="pin"
              fill
              className="object-contain"
            />
          </div>
        </div>
      ),
    },
    {
      title: "استلام السيارة",
      description:
        "استلم سيارتك وسدد القيمة مع ضمان جودة موثق يصل لـ90 يوماً من الجراج.",
      illustration: (
        <div className="relative w-40 h-40 overflow-hidden select-none">
          <div className="absolute inset-[11%_-4.15%_13.73%_-4.48%]">
            <Image
              src="/assets/services_bg_1.svg"
              alt="bg"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[86.9%_8.04%_8.18%_7.71%]">
            <Image
              src="/assets/services_shadow_1.svg"
              alt="shadow"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[37.4%_51.28%_41.89%_29.01%]">
            <Image
              src="/assets/services_keys_1.svg"
              alt="keys"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-[59.4%_28.56%_10.09%_11.43%]">
            <Image
              src="/assets/services_car_1.svg"
              alt="car"
              fill
              className="object-contain"
            />
          </div>
        </div>
      ),
    },
  ];

  const activeSteps = activeTab === "sell" ? sellSteps : buySteps;

  return (
    <section>
      <MaxWidthWrapper className="relative w-full lg:py-13 py-8 flex flex-col items-center gap-12 text-white overflow-hidden">
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/services_bg.png"
            alt="Services Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#002ec1]/80 to-[#0c295a]/90" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center gap-10">
          {/* Toggle Tab */}
          <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-2xl p-1 flex gap-2 w-full max-w-[338px] select-none">
            <button
              onClick={() => setActiveTab("sell")}
              className={`flex-1 text-center py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "sell"
                  ? "bg-white text-[#002ec1] shadow-md"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              بيع سيارة
            </button>
            <button
              onClick={() => setActiveTab("buy")}
              className={`flex-1 text-center py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "buy"
                  ? "bg-white text-[#002ec1] shadow-md"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              شراء سيارة
            </button>
          </div>

          {/* Headings */}
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold">
              {activeTab === "sell" ? "كيف تبيع سيارتك؟" : "كيف تشتري سيارتك؟"}
            </h2>
            <p className="text-white/70 text-base md:text-lg">
              {activeTab === "sell"
                ? "3 خطوات بسيطة وسيارتك تُباع باحترافية"
                : "3 خطوات بسيطة لتشتري سيارتك بأمان وسهولة"}
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
            {activeSteps.map((step, idx) => (
              <div
                key={idx}
                className="backdrop-blur-[20px] md:last:col-span-2 lg:last:col-span-1 bg-black/20 rounded-[24px] px-[52px] py-[24px] flex flex-col items-center text-center gap-2 hover:border-white/20 transition-all duration-200 group shadow-lg"
              >
                {/* Step Illustration */}
                <div className="transform group-hover:scale-105 transition-transform duration-200 mb-2">
                  {step.illustration}
                </div>

                {/* Step Info */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-2xl text-white">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-[1.9] max-w-[280px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="lg:mt-4">
            <Link
              href={activeTab === "sell" ? "/sell" : "/cars"}
              className="inline-block"
            >
              <button
                className="border border-white hover:bg-white hover:text-[#002ec1] text-white font-semibold text-sm h-12 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-[12px] shadow-lg select-none cursor-pointer group"
                dir="ltr"
              >
                {/* Arrow on Left */}
                <Image
                  src="/assets/arrow_left_white.svg"
                  alt="arrow"
                  width={24}
                  height={24}
                  className="w-6 h-6 rotate-45 transition-all duration-200 group-hover:invert"
                />

                {/* Text & Tag */}
                <div className="flex items-center gap-[4px]">
                  <span className="font-semibold text-sm">
                    {activeTab === "sell"
                      ? "بيع سيارتك الآن"
                      : "ابدأ الشراء الآن"}
                  </span>
                  <Image
                    src="/assets/tag_icon.svg"
                    alt="tag"
                    width={24}
                    height={24}
                    className="w-6 h-6 transition-all duration-200 group-hover:invert"
                  />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
