"use client";

import { useState } from "react";
import Image from "next/image";
import { buyFAQs, sellFAQs } from "@/constants/faq";
import MaxWidthWrapper from "./common/MaxWidthWrapper";
import Button from "./common/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FAQ() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = activeTab === "buy" ? buyFAQs : sellFAQs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-white lg:py-13 py-8  gap-12 w-full border-b border-gray-100"
    >
      <MaxWidthWrapper className="flex flex-col md:flex-row gap-4 items-start justify-between">
        {/* Right Column: Title and Tabs (renders on the right under RTL) */}
        <div className="w-full md:w-[370px] flex flex-col gap-6 text-right shrink-0">
          <h2 className="text-[#1A1A1A] font-bold text-3xl md:text-[32px]">
            الأسئلة الشائعة
          </h2>

          {/* Tab filters inside layout */}
          <div className="bg-white border border-[#F2F2F2] p-2 rounded-2xl flex flex-row md:flex-col gap-3 w-full select-none">
            <button
              onClick={() => {
                setActiveTab("buy");
                setOpenIndex(0);
              }}
              className={cn(
                "text-start px-8 font-medium rounded-md py-[13.5px]",
                activeTab === "buy" ? "bg-primary-50 text-primary-500" : "",
              )}
            >
              الخاصة بالشراء
            </button>

            <button
              onClick={() => {
                setActiveTab("sell");
                setOpenIndex(0);
              }}
              className={cn(
                "text-start px-8 font-medium rounded-md py-[13.5px]",
                activeTab === "sell" ? "bg-primary-50 text-primary-500" : "",
              )}
            >
              الخاصة بالبيع
            </button>
          </div>
        </div>

        {/* Left Column: Expandable Accordions (renders on the left under RTL) */}
        <div className="flex-1 flex flex-col gap-6 w-full text-right xl:pl-[126px]">
          <div className="bg-white border border-[#F2F2F2] p-4 rounded-2xl flex flex-col gap-6">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`transition-all duration-200 ${
                    isOpen
                      ? "bg-transparent"
                      : "bg-[#FAFAFA] border border-[#F2F2F2] rounded-[12px]"
                  }`}
                >
                  {/* Header (Question) */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`w-full flex items-center justify-between gap-4 text-right cursor-pointer select-none transition-all duration-200 ${
                      isOpen ? "py-3 px-4" : "py-3.5 px-4"
                    }`}
                  >
                    <span
                      className={`text-base transition-colors duration-200 ${
                        isOpen
                          ? "font-semibold text-[#1A1A1A]"
                          : "font-normal text-[#737373]"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div className="shrink-0 relative w-[18px] h-[18px] flex items-center justify-center">
                      <Image
                        src={
                          isOpen
                            ? "/assets/arrow_up_faq.svg"
                            : "/assets/arrow_down_faq.svg"
                        }
                        alt="toggle"
                        width={18}
                        height={18}
                        className={`w-[18px] h-[18px] transition-all duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Body (Answer) */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-sm text-[#6B7280] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Call to action for unsupported questions */}
          <div className="flex flex-col gap-4 items-start justify-center mt-8 w-full">
            <p className="text-primary-500 text-base font-semibold">
              اذا لم تجد سؤالك ؟
            </p>
            <Link href="/contact" className="w-full">
              <button className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-base h-12 w-full max-w-[338px] rounded-2xl transition-colors flex items-center justify-center">
                تواصل معنا
              </button>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
