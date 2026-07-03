"use client";

import { useState } from "react";
import Image from "next/image";

export default function FAQ() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const buyFAQs = [
    {
      q: "كيف يمكنني إنشاء حساب جديد؟",
      a: "يمكنك إنشاء حساب جديد بكل سهولة من خلال الضغط على زر تسجيل الدخول أعلى الصفحة، وإدخال رقم هاتفك أو استخدام حساب جوجل الخاص بك لإتمام عملية التسجيل في ثوانٍ معدودة.",
    },
    {
      q: "كيف أضمن جودة السيارة قبل الشراء؟",
      a: "جميع السيارات المعروضة في الجراج تخضع لفحص شامل يتجاوز 250 نقطة دقيقة بواسطة خبراء معتمدين، ونوفر تقارير فحص كاملة وموثقة تظهر حالة المحرك، الهيكل، الطلاء، والأنظمة الكهربائية.",
    },
    {
      q: "هل يمكنني تجربة قيادة السيارة قبل الشراء؟",
      a: "نعم، بالتنسيق مع فريق خدمة العملاء، يمكنك حجز موعد لتجربة قيادة السيارة على الطبيعة والتأكد من توافقها مع توقعاتك قبل دفع أي مبالغ مالية.",
    },
    {
      q: "ما هي طرق الدفع المتاحة لدى منصة الجراج؟",
      a: "نوفر خيارات دفع متعددة وموثوقة تشمل الدفع النقدي، التحويل البنكي المباشر، بالإضافة إلى حلول تقسيط مرنة بالتعاون مع كبرى شركات التمويل والخدمات الاستهلاكية.",
    },
  ];

  const sellFAQs = [
    {
      q: "كيف يمكنني بيع سيارتي على الجراج؟",
      a: "كل ما عليك هو الضغط على زر 'بيع سيارتك'، وإدخال تفاصيل سيارتك الأساسية مثل الماركة والموديل وسنة الصنع والممشى، وسيتواصل فريقنا معك لتنسيق موعد الفحص وتحديد السعر العادل لها.",
    },
    {
      q: "ما هي الأوراق المطلوبة لبيع السيارة؟",
      a: "المستندات المطلوبة تشمل رخصة السيارة سارية، بطاقة الرقم القومي لمالك السيارة، وأي عقود مسجلة أو توكيلات سارية تثبت الملكية الكاملة للسيارة.",
    },
    {
      q: "هل هناك رسوم لعرض سيارتي على المنصة؟",
      a: "عرض السيارة على منصة الجراج مجاني تماماً، ونوفر خدمات فحص وتصوير احترافية مجانية لمساعدتك على بيع سيارتك بأسرع وقت وبأعلى سعر عادل في السوق.",
    },
  ];

  const faqs = activeTab === "buy" ? buyFAQs : sellFAQs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white py-16 px-6 md:px-12 flex flex-col md:flex-row items-start justify-between gap-12 w-full max-w-[1336px] mx-auto border-b border-gray-100">

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
            className={`flex-1 md:w-full h-12 px-4 rounded-lg text-center md:text-right text-sm font-semibold md:font-medium transition-all duration-200 cursor-pointer ${activeTab === "buy"
                ? "bg-primary-50 text-primary-500 font-bold"
                : "text-[#1A1A1A] hover:bg-gray-50/50"
              }`}
          >
            الخاصة بالشراء
          </button>
          <button
            onClick={() => {
              setActiveTab("sell");
              setOpenIndex(0);
            }}
            className={`flex-1 md:w-full h-12 px-4 rounded-lg text-center md:text-right text-sm font-semibold md:font-medium transition-all duration-200 cursor-pointer ${activeTab === "sell"
                ? "bg-primary-50 text-primary-500 font-bold"
                : "text-[#1A1A1A] hover:bg-gray-50/50"
              }`}
          >
            الخاصة بالبيع
          </button>
        </div>
      </div>

      {/* Left Column: Expandable Accordions (renders on the left under RTL) */}
      <div className="flex-1 flex flex-col gap-6 w-full text-right">

        <div className="bg-white border border-[#F2F2F2] p-4 md:p-6 rounded-2xl flex flex-col gap-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`transition-all duration-200 ${isOpen
                    ? "bg-transparent"
                    : "bg-[#FAFAFA] border border-[#F2F2F2] rounded-[12px]"
                  }`}
              >
                {/* Header (Question) */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between gap-4 text-right cursor-pointer select-none transition-all duration-200 ${isOpen ? "py-3 px-4" : "py-3.5 px-4"
                    }`}
                >
                  <span className={`text-base transition-colors duration-200 ${isOpen ? "font-semibold text-[#1A1A1A]" : "font-normal text-[#737373]"
                    }`}>
                    {faq.q}
                  </span>
                  <div className="shrink-0 relative w-[18px] h-[18px] flex items-center justify-center">
                    <Image
                      src={isOpen ? "/assets/arrow_up_faq.svg" : "/assets/arrow_down_faq.svg"}
                      alt="toggle"
                      width={18}
                      height={18}
                      className={`w-[18px] h-[18px] transition-all duration-200 ${isOpen ? "rotate-180" : ""
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
          <button className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-base h-12 w-full max-w-[338px] rounded-2xl transition-colors flex items-center justify-center">
            تواصل معنا
          </button>
        </div>

      </div>

    </section>
  );
}
