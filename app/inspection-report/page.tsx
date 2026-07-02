"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Mock Data representing a realistic, fully compiled report for a car
const MOCK_CAR = {
  brand: "بي إم دبليو",
  model: "سلسلة 3 - 320i",
  year: 2021,
  mileage: 48500,
  price: 1850000,
  images: [
    "/assets/why_cars.png",
    "/assets/car_placeholder.png"
  ],
};

const MOCK_SECTIONS = [
  {
    id: "details",
    title: "تفاصيل السيارة",
    icon: "🚗",
    questions: [],
    photos: []
  },
  {
    id: "exterior",
    title: "الهيكل الخارجي",
    icon: "🛡️",
    photos: [
      { url: "/assets/why_cars.png", description: "الجانب الأيمن للمركبة سليم بالكامل" },
      { url: "/assets/car_placeholder.png", description: "خدش بسيط ممتص الصدمات الخلفي" }
    ],
    sectionNote: "الهيكل الخارجي سليم بشكل عام مع وجود خدوش سطحية بسيطة تم توثيقها بالصور.",
    questions: [
      { id: "ext_1", label: "طلاء الهيكل الخارجي", desc: "فحص جودة الطلاء ووجود رش تجميلي", status: "GOOD", notes: "الطلاء أصلي بالكامل بدون أي رش تجميلي." },
      { id: "ext_2", label: "الصدام الأمامي والخلفي", desc: "فحص الصدمات والخدوش والتثبيت", status: "WARN", notes: "وجود خدش سطحي بطول 5 سم في الجزء الأيسر للصدام الخلفي." },
      { id: "ext_3", label: "الزجاج والشبابيك", desc: "فحص زجاج الأمامي والخلفي والجانبي من التشققات", status: "GOOD", notes: "الزجاج أصلي وخالٍ من أي شروخ." },
      { id: "ext_4", label: "الأبواب وفتحة السقف", desc: "سلامة الفتح والغلق وموانع التسريب", status: "GOOD", notes: "فتحة السقف تعمل بسلاسة وموانع المياه سليمة." }
    ]
  },
  {
    id: "brakes",
    title: "نظام الفرامل",
    icon: "🛑",
    photos: [], // Missing photos to trigger placeholder skeleton silhouette!
    sectionNote: "تيل الفرامل الأمامي تالف ويجب تغييره فوراً لسلامة القيادة.",
    questions: [
      { id: "brk_1", label: "أقراص الفرامل (الطنابير)", desc: "قياس تآكل الأقراص وجودة السطح", status: "GOOD", notes: "الأقراص سليمة ولا تحتاج لتغيير حالياً." },
      { id: "brk_2", label: "قماش وتيل الفرامل الأمامي", desc: "سماكة تيل الفرامل الأمامي وفعالية الكبح", status: "BAD", notes: "سماكة التيل أقل من 2 ملم. تالف ويحتاج تغيير فوري." },
      { id: "brk_3", label: "قماش وتيل الفرامل الخلفي", desc: "سماكة تيل الفرامل الخلفي والفرامل اليدوية", status: "GOOD", notes: "حالة التيل الخلفي جيدة بنسبة 60%." },
      { id: "brk_4", label: "سائل الفرامل ووصلات الخراطيم", desc: "فحص مستوى زيت الفرامل والتهريب", status: "GOOD", notes: "لا يوجد تهريب في الخراطيم ونسبة الرطوبة بالزيت مقبولة." }
    ]
  },
  {
    id: "engine",
    title: "المحرك ونظام الحركة",
    icon: "⚙️",
    photos: [
      { url: "/assets/car_placeholder.png", description: "فحص غرفة المحرك بالكامل" }
    ],
    sectionNote: "المحرك يعمل بكفاءة ممتازة، لا توجد أصوات غريبة أو تهريب سوائل أساسية.",
    questions: [
      { id: "eng_1", label: "أداء وسحب المحرك", desc: "كفاءة الاحتراق والسرعة المحددة", status: "GOOD", notes: "أداء المحرك متوازن ويفوق 94% من كفاءة المصنع." },
      { id: "eng_2", label: "ناقل الحركة (الفتيس)", desc: "سلاسة النقل ونظام التبريد", status: "GOOD", notes: "التعشيقات والنقلات ناعمة بالكامل في مختلف السرعات." },
      { id: "eng_3", label: "تهريب الزيوت والسوائل", desc: "تسريب زيت المحرك، الجير، المبرد", status: "GOOD", notes: "لا توجد أي علامات لتسريب الزيوت أو نقص سوائل المبرد." },
      { id: "eng_4", label: "شمعات الاحتراق (البوجيهات)", desc: "حالة البوجيهات والأسلاك الكهربائية", status: "WARN", notes: "شمعات الاحتراق قاربت على انتهاء عمرها الافتراضي، ينصح بتغييرها بالصيانة القادمة." }
    ]
  },
  {
    id: "interior",
    title: "المقصورة الداخلية",
    icon: "🛋️",
    photos: [], // Missing photos to trigger placeholder!
    sectionNote: "المقصورة الداخلية نظيفة ومعقمة، شاشة العرض واللوحة الرئيسية تعمل بالكامل.",
    questions: [
      { id: "int_1", label: "نظام التكييف والتدفئة", desc: "قوة التبريد وتوزيع الهواء بالفوهات", status: "GOOD", notes: "التبريد ممتاز ومستوى غاز الفريون طبيعي." },
      { id: "int_2", label: "شاشات العرض والعدادات", desc: "فحص شاشات الوسائط الترفيهية ولوحة العدادات", status: "GOOD", notes: "الشاشات تعمل باللمس بدون بكسلات تالفة أو تأخر استجابة." },
      { id: "int_3", label: "كسوة المقاعد والأزرار", desc: "حالة مقاعد الجلد أو القماش، أزرار التحكم", status: "GOOD", notes: "المقاعد الجلدية نظيفة جداً وخالية من أي قطوع." },
      { id: "int_4", label: "أحزمة الأمان والوسائد الهوائية", desc: "سلامة الأحزمة ولمبة تحذير الإيرباج", status: "GOOD", notes: "نظام الأمان مفعل ولا توجد لمبة تحذير إيرباج مضاءة." }
    ]
  }
];

export default function InspectionReport() {
  const [filter, setFilter] = useState<"ALL" | "GOOD" | "WARN" | "BAD">("ALL");
  const [activeSection, setActiveSection] = useState("details");
  const [isHeaderShrunk, setIsHeaderShrunk] = useState(false);

  // References for scroll navigation
  const sectionRefs = {
    details: useRef<HTMLDivElement>(null),
    exterior: useRef<HTMLDivElement>(null),
    brakes: useRef<HTMLDivElement>(null),
    engine: useRef<HTMLDivElement>(null),
    interior: useRef<HTMLDivElement>(null),
  };

  // Scroll listener to highlight active tab and shrink header
  useEffect(() => {
    const handleScroll = () => {
      // Shrink header when scrolled down
      if (window.scrollY > 120) {
        setIsHeaderShrunk(true);
      } else {
        setIsHeaderShrunk(false);
      }

      // Check which section is in view
      const scrollPosition = window.scrollY + 200;
      for (const [sectionId, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop;
          const offsetHeight = ref.current.offsetHeight;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute counts
  const allQuestions = MOCK_SECTIONS.flatMap(s => s.questions);
  const totalQuestions = allQuestions.length;
  const goodCount = allQuestions.filter(q => q.status === "GOOD").length;
  const warnCount = allQuestions.filter(q => q.status === "WARN").length;
  const badCount = allQuestions.filter(q => q.status === "BAD").length;
  const passedRate = Math.round((goodCount / totalQuestions) * 100);

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 140, // offset for sticky navigation
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  // Filter questions based on selected status
  const filterQuestion = (status: string) => {
    if (filter === "ALL") return true;
    return status === filter;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      
      {/* 1. Header Banner & Sticky Nav Overlay */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 shadow-sm ${
          isHeaderShrunk ? "py-2" : "py-4 md:py-6"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-3">
          {/* Logo & Main Summary Section */}
          <div className="flex items-center justify-between">
            {/* Right: Bilingual Brand Name & Logo */}
            <Link href="#" className="flex items-center gap-2 md:gap-3">
              <div className="relative w-6 h-6 md:w-8 md:h-8">
                <Image
                  src="/assets/logo_shield.svg"
                  alt="elGARAGE Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-[80px] h-[11px] md:w-[117px] md:h-[16px]">
                <Image
                  src="/assets/logo_text.svg"
                  alt="elGARAGE"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-gray-300 text-sm md:text-lg">|</span>
              <span className="font-bold text-sm md:text-lg text-primary-500">الجراج</span>
            </Link>

            {/* Left: Overall Ring Progress and Badges */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Score counts (hidden on super small mobile screens, but styled micro-friendly) */}
              <div className="flex items-center gap-1.5 md:gap-3 text-xs md:text-sm">
                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg font-bold border border-green-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  جيد: {goodCount}
                </span>
                <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg font-bold border border-amber-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  تنبيه: {warnCount}
                </span>
                <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-lg font-bold border border-red-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  تالف: {badCount}
                </span>
              </div>

              {/* Circle Donut Chart */}
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy={18} 
                      r={15} 
                      fill="none" 
                      stroke="#002ec1" 
                      strokeWidth="3" 
                      strokeDasharray="94.2" 
                      strokeDashoffset={94.2 - (94.2 * passedRate) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="absolute text-[10px] md:text-xs font-black text-primary-500">{passedRate}%</span>
                </div>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[10px] text-gray-500 font-semibold">معدل الاجتياز</span>
                  <span className="text-xs font-bold text-gray-800">{goodCount} / {totalQuestions} بنود</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Persistent Horizontal Scrollable Navigation */}
          <div className="w-full overflow-x-auto scrollbar-none border-t border-gray-100 pt-2 flex items-center gap-2">
            {[
              { id: "details", label: "تفاصيل السيارة", icon: "🚗" },
              { id: "exterior", label: "الهيكل الخارجي", icon: "🛡️" },
              { id: "brakes", label: "نظام الفرامل", icon: "🛑" },
              { id: "engine", label: "المحرك والحركة", icon: "⚙️" },
              { id: "interior", label: "المقصورة الداخلية", icon: "🛋️" }
            ].map((tab) => {
              const active = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active 
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/20" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-[1200px] mx-auto px-4 mt-36 md:mt-44 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Content Flow */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Section: Vehicle Info */}
          <section id="details" ref={sectionRefs.details} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Title Header */}
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h1 className="text-2xl font-black text-primary-500 leading-tight">تقرير الفحص الفني المعتمد</h1>
              <p className="text-gray-500 text-sm mt-1">رقم التقرير: <span className="font-mono text-gray-800">#EGR-2026-9901</span> · تاريخ الفحص: <span className="font-bold text-gray-800">20 يونيو 2026</span></p>
            </div>

            {/* Redesigned Vehicle Details Block (2-column key-value) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo placeholder or real car photo */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <Image
                  src={MOCK_CAR.images[0]}
                  alt="BMW Car"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Key Value Details */}
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{MOCK_CAR.brand} - {MOCK_CAR.model}</h3>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-gray-100 pt-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-semibold mb-0.5">سنة الموديل</span>
                    <span className="text-sm font-bold text-gray-800">{MOCK_CAR.year}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-semibold mb-0.5">المسافة المقطوعة</span>
                    <span className="text-sm font-bold text-gray-800">{MOCK_CAR.mileage.toLocaleString()} كم</span>
                  </div>
                  <div className="flex flex-col border-t border-gray-100/50 pt-2">
                    <span className="text-xs text-gray-500 font-semibold mb-0.5">السعر التقديري</span>
                    <span className="text-sm font-bold text-primary-500">{MOCK_CAR.price.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex flex-col border-t border-gray-100/50 pt-2">
                    <span className="text-xs text-gray-500 font-semibold mb-0.5">المفتش الفني</span>
                    <span className="text-sm font-bold text-gray-800">المهندس ممدوح سليمان</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Filters Bar for items */}
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
            <span className="text-xs md:text-sm font-bold text-gray-700">تصفية بنود الفحص:</span>
            <div className="flex items-center gap-1 md:gap-2">
              {[
                { id: "ALL", label: "الكل", count: totalQuestions, activeClass: "bg-gray-800 text-white" },
                { id: "GOOD", label: "سليم", count: goodCount, activeClass: "bg-green-500 text-white" },
                { id: "WARN", label: "تنبيه", count: warnCount, activeClass: "bg-amber-500 text-white" },
                { id: "BAD", label: "تالف", count: badCount, activeClass: "bg-red-500 text-white" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  className={`text-[10px] md:text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    filter === btn.id 
                      ? btn.activeClass 
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {btn.label} ({btn.count})
                </button>
              ))}
            </div>
          </div>

          {/* Render Sections */}
          {MOCK_SECTIONS.filter(s => s.questions.length > 0).map((section) => {
            const visibleQuestions = section.questions.filter(q => filterQuestion(q.status));
            
            return (
              <section 
                key={section.id} 
                id={section.id}
                ref={sectionRefs[section.id as keyof typeof sectionRefs]}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{section.icon}</span>
                    <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {section.questions.filter(q => q.status === "GOOD").length} من {section.questions.length} بنود سليمة
                  </span>
                </div>

                {/* Section Note */}
                {section.sectionNote && (
                  <p className="text-xs text-gray-500 bg-gray-50/70 p-3 rounded-lg border-r-2 border-primary-400 mb-4 leading-relaxed">
                    {section.sectionNote}
                  </p>
                )}

                {/* Section Photos or Silhouettes */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-gray-500 block mb-2">الصور المرفقة للقسم:</span>
                  {section.photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {section.photos.map((p, idx) => (
                        <div key={idx} className="flex flex-col gap-1.5">
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                            <Image src={p.url} alt={p.description} fill className="object-cover" />
                          </div>
                          <span className="text-[10px] text-gray-500 text-center leading-tight">{p.description}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Beautiful dashed SVG skeleton silhouette for missing photos */
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50">
                      <div className="w-16 h-10 relative flex items-center justify-center opacity-40">
                        <svg className="w-full h-full text-gray-400" viewBox="0 0 24 12" fill="none" stroke="currentColor">
                          <path d="M3 8.5C3 8.5 3 6.5 4.5 6C6 5.5 8 3 11 3C14 3 17.5 5.5 19 6C20.5 6.5 21 8.5 21 8.5H3Z" strokeWidth="1" />
                          <circle cx="6.5" cy="8.5" r="1.5" strokeWidth="1" />
                          <circle cx="17.5" cy="8.5" r="1.5" strokeWidth="1" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-600">صور القسم الافتراضية</span>
                        <span className="text-[10px] text-gray-400">لم يتم رصد أعطال أو أضرار تستدعي التصوير في هذا القسم.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items/Questions Grid Layout */}
                {visibleQuestions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleQuestions.map((q) => {
                      const isGood = q.status === "GOOD";
                      const isWarn = q.status === "WARN";
                      const isBad = q.status === "BAD";

                      return (
                        <div 
                          key={q.id}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all hover:shadow-md ${
                            isGood ? "bg-green-50/20 border-green-100 hover:border-green-200" :
                            isWarn ? "bg-amber-50/20 border-amber-100 hover:border-amber-200" :
                            "bg-red-50/20 border-red-100 hover:border-red-200"
                          }`}
                          style={{ minHeight: "48px" }} // Comfortable mobile tap target equivalence
                        >
                          {/* SVG Status Icon */}
                          <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            isGood ? "bg-green-100 text-green-700" :
                            isWarn ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {isGood && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {isWarn && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                            {isBad && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>

                          {/* Text Block */}
                          <div className="flex-1 flex flex-col">
                            <span className="text-xs md:text-sm font-bold text-gray-800">{q.label}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 leading-snug">{q.desc}</span>
                            <span className={`text-[10px] md:text-xs font-semibold mt-1.5 text-right ${
                              isGood ? "text-green-700" :
                              isWarn ? "text-amber-700" :
                              "text-red-700"
                            }`}>
                              {q.notes}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">لا توجد بنود تطابق التصفية المحددة.</p>
                )}
              </section>
            );
          })}

        </div>

        {/* Right Column: Sticky Sidebar with Summary & Service Recommendations */}
        <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-[160px] h-fit">
          
          {/* Inspector's Note block */}
          <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100 text-right shadow-sm">
            <h3 className="text-sm font-bold text-primary-900 mb-2 flex items-center gap-1.5 justify-end">
              <span>✍️</span>
              ملاحظة المفتش الفني
            </h3>
            <p className="text-xs text-primary-800 leading-relaxed">
              المركبة في حالة عامة جيدة جداً ومطابقة لشروط الاستخدام الطبيعي. نوصي فقط بتغيير تيل الفرامل الأمامي بشكل عاجل، ومراقبة البوجيهات عند بلوغ الـ 50,000 كم.
            </p>
          </div>

          {/* Recommended next service card */}
          <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100 text-right shadow-sm">
            <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-1.5 justify-end">
              <span>🔧</span>
              توصية الصيانة القادمة
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed mb-4">
              تغيير تيل الفرامل الأمامي + صيانة البوجيهات الموصى بها.
            </p>
            <Link 
              href="https://wa.me/19900" 
              target="_blank"
              className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>حجز موعد صيانة سريع</span>
              <span>⚡</span>
            </Link>
          </div>

          {/* Download App/Share report */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 text-right shadow-sm">
            <h4 className="text-xs font-bold text-gray-800 mb-3">حفظ ومشاركة هذا التقرير</h4>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => window.print()}
                className="w-full h-9 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
              >
                تحميل التقرير كـ PDF 📥
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("تم نسخ رابط التقرير لمشاركته!");
                }}
                className="w-full h-9 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-all cursor-pointer"
              >
                نسخ رابط المشاركة 🔗
              </button>
            </div>
          </div>

        </div>

      </main>
      
    </div>
  );
}
